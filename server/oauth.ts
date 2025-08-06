import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import crypto from 'crypto';
import { storage } from './storage';
import { generateToken, hashPassword } from './auth';
import { User } from '@shared/schema';

// Helper function to convert user to Passport user type
function toPassportUser(user: any) {
  return {
    id: user._id?.toString() || user.id,
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0],
    role: user.role || 'passenger',
    avatar: user.profileImageUrl
  };
}

// Only configure OAuth if environment variables are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email provided by the OAuth provider'), undefined);
      }

      let user = await storage.getUserByEmail(email);

      // If user doesn't exist, create a new one
      if (!user) {
        const username = profile.displayName.toLowerCase().replace(/\s+/g, '_');
        const newUser = {
          email,
          firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
          lastName: profile.name?.familyName || profile.displayName.split(' ').slice(1).join(' ') || 'User',
          password: await hashPassword(crypto.randomBytes(16).toString('hex')), // Random password
          preferredLanguage: 'en' as const,
          role: 'passenger' as const,
          profileImageUrl: profile.photos?.[0]?.value,
          // Optional fields with default values
          passwordResetToken: undefined,
          passwordResetExpires: undefined
        };
        
        user = await storage.upsertUser(newUser);
      }

      return done(null, toPassportUser(user));
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
  ));
}

// Only configure GitHub OAuth if environment variables are available
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email']
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      // Get the primary email from GitHub
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found from GitHub'), undefined);
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);

      // If user doesn't exist, create a new one
      if (!user) {
        const username = profile.username || profile.displayName.toLowerCase().replace(/\s+/g, '_');
        const newUser = {
          email,
          firstName: profile.displayName?.split(' ')[0] || profile.username,
          lastName: profile.displayName?.split(' ').slice(1).join(' ') || 'User',
          password: await hashPassword(crypto.randomBytes(16).toString('hex')), // Random password
          preferredLanguage: 'en' as const,
          role: 'passenger' as const,
          profileImageUrl: profile.photos?.[0]?.value,
          // Optional fields with default values
          passwordResetToken: undefined,
          passwordResetExpires: undefined
        };
        
        user = await storage.upsertUser(newUser);
      }

      return done(null, toPassportUser(user));
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
  ));
}

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user._id || user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    if (user) {
      done(null, toPassportUser(user));
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
