import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: any): void {
    // Run error handling outside Angular zone to prevent change detection loops
    this.zone.runOutsideAngular(() => {
      this.logError(error);
    });
  }

  private logError(error: any): void {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Log to console in development
    if (!environment.production) {
      console.group(`🚨 Global Error - ${timestamp}`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // In production, you might want to send errors to a logging service
    if (environment.production) {
      this.sendErrorToLoggingService(errorInfo);
    }
  }

  private sendErrorToLoggingService(errorInfo: any): void {
    // This would typically send to a service like Sentry, LogRocket, etc.
    // For now, we'll just log to console with less detail
    console.error('Production Error:', {
      timestamp: errorInfo.timestamp,
      message: errorInfo.message,
      url: errorInfo.url,
    });
  }
}
