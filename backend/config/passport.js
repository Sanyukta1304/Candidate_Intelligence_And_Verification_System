const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const Candidate = require('../models/Candidate');
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

        // ✅ FIRST: Try to find user by GitHub ID
        let user = await User.findOne({ githubId });

        if (!user) {
          // ✅ SECOND: Try to link GitHub to EXISTING user by email
          if (email && !email.endsWith('@github.local')) {
            user = await User.findOne({ email });
            
            if (user) {
              // ✅ Link GitHub to EXISTING user
              user.githubId = githubId;
              user.github_access_token = accessToken;
              user.github_verified = true;
              user.github_verified_at = new Date();
              user.githubProfile = {
                name: profile.displayName,
                avatar_url: profile.photos?.[0]?.value,
                bio: profile._json?.bio,
              };
              await user.save();

              // ✅ ALSO UPDATE CANDIDATE PROFILE IF EXISTS
              const candidate = await Candidate.findOne({ user_id: user._id });
              if (candidate) {
                candidate.github_verified = true;
                candidate.github_verified_at = new Date();
                await candidate.save();
              }
              
              return done(null, user);
            }
          }

          // ❌ NO EXISTING USER FOUND - REJECT
          // GitHub OAuth should ONLY link to existing users, NOT create new ones
          console.warn(`GitHub OAuth: No existing user found for GitHub ID ${githubId}. Email: ${email || 'not provided'}`);
          return done(new Error('No existing user found. Please register first before linking GitHub.'), null);
        } else {
          // ✅ Update GitHub profile if user already exists by GitHub ID
          user.github_access_token = accessToken;
          user.github_verified = true;
          user.github_verified_at = new Date();
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