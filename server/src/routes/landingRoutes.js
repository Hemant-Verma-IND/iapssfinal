import { Router } from "express";
import { NEWS_API_KEY } from "../config/env.js";
import { CuratedPodcast } from "../models/CuratedPodcast.js";
import { CuratedNews } from "../models/CuratedNews.js";
import { CuratedContest } from "../models/CuratedContest.js";


const router = Router();

// ------------------ Simple in-memory caches ------------------
const NEWS_TTL = 10 * 60 * 1000; // 10 minutes
const CONTEST_TTL = 10 * 60 * 1000;

let newsCache = { ts: 0, country: "", items: [] };
let contestCache = { ts: 0, items: [] };

// ------------------ Helpers ------------------

const COUNTRY_NAMES = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
};

function normalizeCountryCode(raw) {
  if (!raw) return "IN"; // default: India
  return String(raw).trim().toUpperCase();
}

function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}

// ------------------ External fetch helpers ------------------

// 1) Coding / tech news
async function fetchCodingNews(countryCode) {
  const now = Date.now();
  const curated = await CuratedNews.find({ active: true })
  .sort({ order: 1, createdAt: -1 })
  .lean();

    if (curated.length > 0) {
    newsCache = { ts: now, country: countryCode, items: curated };
    return curated;
    }

  if (
    newsCache.country === countryCode &&
    now - newsCache.ts < NEWS_TTL &&
    newsCache.items.length > 0
  ) {
    return newsCache.items;
  }

  // If no API key, return some static sample items
  if (!NEWS_API_KEY) {
    const fallback = [
      {
        title: "ICPC regional contests announce new online practice sets",
        url: "https://icpc.global/",
        source: "ICPC",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Top tips to ace competitive programming interviews",
        url: "https://leetcode.com/discuss/",
        source: "LeetCode Discuss",
        publishedAt: new Date().toISOString(),
      },
    ];
    newsCache = { ts: now, country: countryCode, items: fallback };
    return fallback;
  }

  try {
    // NewsAPI example: technology + programming related headlines
    const url =
      "https://newsapi.org/v2/top-headlines?" +
      new URLSearchParams({
        apiKey: NEWS_API_KEY,
        country: countryCode.toLowerCase(),
        category: "technology",
        pageSize: "8",
        q: "programming OR coding OR \"competitive programming\" OR ICPC",
      }).toString();

    const res = await fetch(url);
    if (!res.ok) throw new Error("News API error " + res.status);
    const data = await res.json();

    const mapped =
      data.articles?.map((a) => ({
        title: a.title,
        url: a.url,
        source: a.source?.name || "Unknown",
        publishedAt: a.publishedAt,
      })) || [];

    newsCache = { ts: now, country: countryCode, items: mapped };
    return mapped;
  } catch (err) {
    console.error("fetchCodingNews error:", err);
    // fallback static if external fails
    return newsCache.items.length > 0
      ? newsCache.items
      : [
          {
            title: "Unable to load live news. Showing static sample.",
            url: "https://newsapi.org/",
            source: "IAPSS",
            publishedAt: new Date().toISOString(),
          },
        ];
  }
}

// 2) Contest details (competitive programming)
async function fetchContests() {
  const now = Date.now();
  const curated = await CuratedContest.find({ active: true })
  .sort({ order: 1, startTime: 1 })
  .lean();

    if (curated.length > 0) {
    contestCache = { ts: now, items: curated };
    return curated;
    }

  if (now - contestCache.ts < CONTEST_TTL && contestCache.items.length > 0) {
    return contestCache.items;
  }

  try {
    // Public CP contest API (kontests.net)
    const url = "https://kontests.net/api/v1/all";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Contest API error " + res.status);
    const data = await res.json();

    // Filter for relevant sites
    const relevantSites = new Set([
      "CodeForces",
      "CodeForces::Gym",
      "AtCoder",
      "CodeChef",
      "LeetCode",
      "HackerRank",
      "HackerEarth",
      "Kick Start",
      "TopCoder",
      "CS Academy",
    ]);

    const mapped = data
      .filter((c) => relevantSites.has(c.site))
      .map((c) => ({
        name: c.name,
        site: c.site,
        startTime: c.start_time,
        endTime: c.end_time,
        duration: c.duration,
        url: c.url,
        status: c.status, // BEFORE, CODING, FINISHED
      }))
      .slice(0, 15); // limit

    contestCache = { ts: now, items: mapped };
    return mapped;
  } catch (err) {
    console.error("fetchContests error:", err);
    return contestCache.items.length > 0
      ? contestCache.items
      : [
          {
            name: "Sample ICPC-style contest",
            site: "IAPSS",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            duration: "10800",
            url: "https://icpc.global/",
            status: "BEFORE",
          },
        ];
  }
}

// 3) Podcasts (static curated list for now)
async function getPodcastList() {
  const curated = await CuratedPodcast.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  if (curated.length > 0) return curated;

  // fallback static
  return [
    {
      title: "CP Weekly – Competitive Programming Podcast",
      platform: "Spotify",
      url: "https://open.spotify.com/",
    },
    {
      title: "The Programming Contest Podcast",
      platform: "Generic",
      url: "https://icpc.global/",
    },
    {
      title: "Software Engineering Daily",
      platform: "Spotify / Apple",
      url: "https://softwareengineeringdaily.com/",
    },
    {
      title: "Lex Fridman (CS/AI episodes)",
      platform: "YouTube / Podcasts",
      url: "https://www.youtube.com/@lexfridman",
    },
  ];
}


// ------------------ Main landing route ------------------

/**
 * GET /api/landing/summary
 * Query: ?country=IN (optional; default IN)
 *
 * Returns:
 *  - brand: { name: "IAPSS" }
 *  - country: { code, name }
 *  - news: [...]
 *  - contests: [...]
 *  - podcasts: [...]
 */
router.get("/summary", async (req, res) => {
  const countryCode = normalizeCountryCode(req.query.country);
  const countryName = getCountryName(countryCode);

  const [news, contests] = await Promise.all([
    fetchCodingNews(countryCode),
    fetchContests(),
  ]);

  const podcasts = getPodcastList();

  res.json({
    success: true,
    code: "LANDING_SUMMARY",
    data: {
      brand: {
        name: "IAPSS",
      },
      country: {
        code: countryCode,
        name: countryName,
      },
      news,
      contests,
      podcasts,
    },
  });
});

export default router;
