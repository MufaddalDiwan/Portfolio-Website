import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const timestamp = new Date().toISOString();

      // Log HTTP errors in development
      if (!environment.production) {
        console.group(`🌐 HTTP Error - ${timestamp}`);
        console.error('Request:', {
          method: req.method,
          url: req.url,
          headers: req.headers.keys().reduce((acc, key) => {
            acc[key] = req.headers.get(key);
            return acc;
          }, {} as any),
        });
        console.error('Error Response:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
        });
        console.groupEnd();
      }

      // Transform error to consistent format
      let transformedError: Error;

      if (error.error instanceof ErrorEvent) {
        // Client-side/network error
        transformedError = new Error(`Network error: ${error.error.message}`);
      } else {
        // Server-side error
        const apiError = error.error as ApiError;

        if (apiError?.error?.message) {
          // Use API error message if available
          transformedError = new Error(apiError.error.message);
        } else {
          // Fallback to generic messages based on status code
          switch (error.status) {
            case 400:
              transformedError = new Error('Invalid request data');
              break;
            case 401:
              transformedError = new Error('Unauthorized access');
              break;
            case 403:
              transformedError = new Error('Access forbidden');
              break;
            case 404:
              transformedError = new Error('Content not found');
              break;
            case 429:
              transformedError = new Error('Too many requests. Please try again later.');
              break;
            case 500:
              transformedError = new Error('Server error. Please try again later.');
              break;
            case 503:
              transformedError = new Error('Service temporarily unavailable');
              break;
            default:
              transformedError = new Error(`Server error (${error.status})`);
          }
        }
      }

      // Add additional error properties for debugging
      (transformedError as any).originalError = error;
      (transformedError as any).timestamp = timestamp;
      (transformedError as any).status = error.status;

      return throwError(() => transformedError);
    })
  );
};
