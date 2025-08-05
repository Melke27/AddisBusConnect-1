import { User } from '@shared/schema';

declare global {
  namespace Express {
    // Extend the User type to include the OAuth profile
    interface User {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      JWT_SECRET: string;
      MONGODB_URI: string;
      CLIENT_URL?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      SESSION_SECRET: string;
    }
  }
}

// Extend the OAuth profile types
declare module 'passport' {
  interface Profile {
    id: string;
    displayName: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
    emails?: Array<{
      value: string;
      verified?: boolean;
    }>;
    photos?: Array<{
      value: string;
    }>;
    provider: string;
    username?: string;
  }
}
