export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  name: Environment;
  authServer: {
    baseUrl: string;
    timeout: number;
  };
  resourceServer: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    debug: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  features: {
    enableAnalytics: boolean;
    enableQrCodes: boolean;
    enableBulkOperations: boolean;
    maxUrlsPerUser: number;
    maxFileUploadSize: number;
  };
  security: {
    csrfProtection: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}

export const environments: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    authServer: {
      baseUrl: 'http://localhost:8080',
      timeout: 10000
    },
    resourceServer: {
      baseUrl: 'http://localhost:8081',
      timeout: 10000
    },
    app: {
      name: 'Hyperlinks Portal (Dev)',
      version: '1.0.0-dev',
      debug: true,
      logLevel: 'debug'
    },
    features: {
      enableAnalytics: true,
      enableQrCodes: true,
      enableBulkOperations: true,
      maxUrlsPerUser: 1000,
      maxFileUploadSize: 10485760 // 10MB
    },
    security: {
      csrfProtection: true,
      sessionTimeout: 3600000, // 1 hour
      maxLoginAttempts: 5
    }
  },

  staging: {
    name: 'staging',
    authServer: {
      baseUrl: 'https://auth-staging.yourdomain.com',
      timeout: 15000
    },
    resourceServer: {
      baseUrl: 'https://api-staging.yourdomain.com',
      timeout: 15000
    },
    app: {
      name: 'Hyperlinks Portal (Staging)',
      version: '1.0.0-staging',
      debug: false,
      logLevel: 'info'
    },
    features: {
      enableAnalytics: true,
      enableQrCodes: true,
      enableBulkOperations: true,
      maxUrlsPerUser: 5000,
      maxFileUploadSize: 10485760
    },
    security: {
      csrfProtection: true,
      sessionTimeout: 1800000, // 30 minutes
      maxLoginAttempts: 3
    }
  },

  production: {
    name: 'production',
    authServer: {
      baseUrl: 'https://auth.yourdomain.com',
      timeout: 20000
    },
    resourceServer: {
      baseUrl: 'https://api.yourdomain.com',
      timeout: 20000
    },
    app: {
      name: 'Hyperlinks Portal',
      version: '1.0.0',
      debug: false,
      logLevel: 'error'
    },
    features: {
      enableAnalytics: true,
      enableQrCodes: true,
      enableBulkOperations: false, // Disabled in production initially
      maxUrlsPerUser: 10000,
      maxFileUploadSize: 5242880 // 5MB in production
    },
    security: {
      csrfProtection: true,
      sessionTimeout: 900000, // 15 minutes
      maxLoginAttempts: 3
    }
  }
};