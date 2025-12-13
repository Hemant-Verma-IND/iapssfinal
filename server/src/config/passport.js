import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            provider: "google",
          });
        }

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
      allEmails: true 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub specific email handling (GitHub might verify emails privately)
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

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

export default passport;
