const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const githubUsername = profile.username;

        // Find user by email OR create fallback (depending on your flow)
        let user = await User.findOne({ github_username: githubUsername });

        if (!user) {
          // If user exists from normal signup, update it
          user = await User.findOne({ email: profile.emails?.[0]?.value });

          if (user) {
            user.github_username = githubUsername;
            user.github_access_token = accessToken;
            user.github_verified = true;
            user.github_verified_at = new Date();
            await user.save();
          }
        } else {
          // Update token if already exists
          user.github_access_token = accessToken;
          user.github_verified = true;
          user.github_verified_at = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Optional (not required if using JWT only)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;