import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      proxy: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (user) {
          // 2. If user exists but has no googleId, link it now
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 3. Create new user
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id, // 
          provider: "google",
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'], 
      allEmails: true,
      proxy: true,
      userAgent: "iapss-app", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub specific email handling (GitHub might verify emails privately)
        const emails = profile.emails || [];
        const primaryEmail = emails.find((e) => e.primary) || emails[0];
        const email = primaryEmail ? primaryEmail.value : null;

        if (!email) {
          // If user has set email to private on GitHub, we might not get it easily.
          // For MVP, you might return an error or handle gracefully.
          return done(null, false, { message: 'No public email found on GitHub account' });
        }

        // 1. Check if user exists
        let user = await User.findOne({ email: email });

        if (user) {
          // Link GitHub ID if not already linked
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 2. Create new user
        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: email,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// --- SERIALIZATION (REQUIRED) ---
// This tells Passport how to save the user ID to the session/req.user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// This finds the user in the DB when a request comes in
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
