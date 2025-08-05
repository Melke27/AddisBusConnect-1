import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { storage } from './storage';
import { generateToken, hashPassword } from './auth';
import { User } from '@shared/schema';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await storage.user.findUnique({
        where: { email: profile.emails?.[0].value }
      });

      // If user doesn't exist, create a new one
      if (!user) {
        const username = profile.displayName.toLowerCase().replace(/\s+/g, '_');
        user = await storage.user.create({
          data: {
            email: profile.emails?.[0].value || '',
            name: profile.displayName,
            username,
            password: await hashPassword(crypto.randomBytes(16).toString('hex')), // Random password
            role: 'USER',
            emailVerified: true,
            avatar: profile.photos?.[0].value
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email']
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      // Get the primary email from GitHub
      const email = profile.emails?.[0].value;
      if (!email) {
        return done(new Error('No email found from GitHub'), undefined);
      }

      // Check if user exists
      let user = await storage.user.findUnique({
        where: { email }
      });

      // If user doesn't exist, create a new one
      if (!user) {
        const username = profile.username || profile.displayName.toLowerCase().replace(/\s+/g, '_');
        user = await storage.user.create({
          data: {
            email,
            name: profile.displayName || profile.username,
            username,
            password: await hashPassword(crypto.randomBytes(16).toString('hex')), // Random password
            role: 'USER',
            emailVerified: true,
            avatar: profile.photos?.[0]?.value
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
