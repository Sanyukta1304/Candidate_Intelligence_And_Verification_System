const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * GitHub OAuth 2.0 Strategy Configuration
 * Handles GitHub authentication and user creation/update
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const githubId = profile.id;
        const email = profile.emails?.[0]?.value;
        const username = profile.username || `github_${githubId}`;

        // Try to find user by GitHub ID
        let user = await User.findOne({ githubId });

        if (!user) {
          // Check if user exists with this email (from previous signup)
          if (email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            // Create new user
            user = await User.create({
              username: username,
              email: email || `${username}@github.local`,
              githubId: githubId,
              githubProfile: {
                name: profile.displayName,
                avatar_url: profile.photos?.[0]?.value,
                bio: profile._json?.bio,
              },
              role: 'user', // Default role
              isActive: true,
            });
          } else {
            // Update existing user with GitHub info
            user.githubId = githubId;
            user.githubProfile = {
              name: profile.displayName,
              avatar_url: profile.photos?.[0]?.value,
              bio: profile._json?.bio,
            };
            await user.save();
          }
        } else {
          // Update GitHub profile if user already exists
          user.githubProfile = {
            name: profile.displayName,
            avatar_url: profile.photos?.[0]?.value,
            bio: profile._json?.bio,
          };
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error('GitHub Strategy Error:', err);
        return done(err, null);
      }
    }
  )
);

/**
 * Serialize user for session
 * Stores user ID in session
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserialize user from session
 * Retrieves user by ID from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;