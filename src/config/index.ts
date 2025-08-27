import type { Environment, EnvironmentConfig } from './environments';
import { environments } from './environments';

class ConfigManager {
  private currentEnvironment: Environment;
  private config: EnvironmentConfig;

  constructor() {
    this.currentEnvironment = this.detectEnvironment();
    this.config = environments[this.currentEnvironment];
  }

  private detectEnvironment(): Environment {
    // Check Vite environment variable first
    if (import.meta.env.VITE_ENVIRONMENT) {
      const env = import.meta.env.VITE_ENVIRONMENT as Environment;
      if (environments[env]) {
        return env;
      }
    }

    // Check NODE_ENV
    const nodeEnv = import.meta.env.NODE_ENV;
    if (nodeEnv === 'production') {
      return 'production';
    }
    if (nodeEnv === 'staging') {
      return 'staging';
    }

    // Default to development
    return 'development';
  }

  public get environment(): Environment {
    return this.currentEnvironment;
  }

  public get authServer() {
    return {
      ...this.config.authServer,
      // Override with environment variables if available
      baseUrl: import.meta.env.VITE_AUTH_SERVER_URL || this.config.authServer.baseUrl,
      timeout: Number(import.meta.env.VITE_AUTH_SERVER_TIMEOUT) || this.config.authServer.timeout
    };
  }

  public get resourceServer() {
    return {
      ...this.config.resourceServer,
      // Override with environment variables if available
      baseUrl: import.meta.env.VITE_RESOURCE_SERVER_URL || this.config.resourceServer.baseUrl,
      timeout: Number(import.meta.env.VITE_RESOURCE_SERVER_TIMEOUT) || this.config.resourceServer.timeout
    };
  }

  public get app() {
    return {
      ...this.config.app,
      // Override version from package.json if available
      version: import.meta.env.VITE_APP_VERSION || this.config.app.version,
      debug: import.meta.env.VITE_DEBUG === 'true' || this.config.app.debug
    };
  }

  public get features() {
    const envFeatures = {
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      enableQrCodes: import.meta.env.VITE_ENABLE_QR_CODES === 'true',
      enableBulkOperations: import.meta.env.VITE_ENABLE_BULK_OPERATIONS === 'true',
      maxUrlsPerUser: Number(import.meta.env.VITE_MAX_URLS_PER_USER),
      maxFileUploadSize: Number(import.meta.env.VITE_MAX_FILE_UPLOAD_SIZE)
    };

    return {
      enableAnalytics: envFeatures.enableAnalytics !== undefined ? envFeatures.enableAnalytics : this.config.features.enableAnalytics,
      enableQrCodes: envFeatures.enableQrCodes !== undefined ? envFeatures.enableQrCodes : this.config.features.enableQrCodes,
      enableBulkOperations: envFeatures.enableBulkOperations !== undefined ? envFeatures.enableBulkOperations : this.config.features.enableBulkOperations,
      maxUrlsPerUser: envFeatures.maxUrlsPerUser || this.config.features.maxUrlsPerUser,
      maxFileUploadSize: envFeatures.maxFileUploadSize || this.config.features.maxFileUploadSize
    };
  }

  public get security() {
    return {
      ...this.config.security,
      sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT) || this.config.security.sessionTimeout,
      maxLoginAttempts: Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || this.config.security.maxLoginAttempts
    };
  }

  public isDevelopment(): boolean {
    return this.currentEnvironment === 'development';
  }

  public isProduction(): boolean {
    return this.currentEnvironment === 'production';
  }

  public isStaging(): boolean {
    return this.currentEnvironment === 'staging';
  }

  public getFullConfig(): EnvironmentConfig {
    return {
      name: this.currentEnvironment,
      authServer: this.authServer,
      resourceServer: this.resourceServer,
      app: this.app,
      features: this.features,
      security: this.security
    };
  }
}

// Export singleton instance
export const config = new ConfigManager();

// Export types for use in other modules
export type { Environment, EnvironmentConfig } from './environments';