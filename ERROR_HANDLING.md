# Error Handling and Logging Implementation

This document describes the comprehensive error handling and logging system implemented for the portfolio website.

## Frontend Error Handling

### Global Error Handler

The `GlobalErrorHandlerService` catches all unhandled errors in the Angular application:

- **Location**: `frontend/src/app/services/global-error-handler.service.ts`
- **Features**:
  - Catches all unhandled Angular errors
  - Logs detailed error information in development
  - Provides production-safe error logging
  - Prevents change detection loops by running outside Angular zone

### HTTP Error Interceptor

The `errorInterceptor` handles all HTTP errors consistently:

- **Location**: `frontend/src/app/interceptors/error.interceptor.ts`
- **Features**:
  - Intercepts all HTTP errors
  - Provides detailed logging in development
  - Transforms errors to consistent format
  - Handles network errors vs server errors
  - Maps status codes to user-friendly messages

### Logging Service

The `LoggingService` provides structured logging throughout the application:

- **Location**: `frontend/src/app/services/logging.service.ts`
- **Features**:
  - Multiple log levels (debug, info, warn, error)
  - In-memory log storage (last 100 entries)
  - Environment-aware console logging
  - Log export functionality for debugging
  - Structured log entries with metadata

### Usage Examples

```typescript
// In components
constructor(private loggingService: LoggingService) {}

// Log different levels
this.loggingService.info('User action completed', { action: 'submit-form' });
this.loggingService.error('API call failed', { endpoint: '/api/contact', error });

// Get recent logs for debugging
const recentLogs = this.loggingService.getRecentLogs(20);
```

## Backend Error Handling

### Enhanced Error Logging

The Flask backend now includes comprehensive error logging:

- **Location**: `backend/app.py`
- **Features**:
  - Detailed error context (IP, path, method, timestamp)
  - Stack traces for debugging
  - Consistent error response format
  - Rate limit violation logging

### Error Response Format

All API errors follow this consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": "Additional details (development only)"
  }
}
```

### Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `BAD_REQUEST`: Invalid request format
- `METHOD_NOT_ALLOWED`: HTTP method not allowed

### Contact Form Logging

Special logging for contact form submissions:

- **Location**: `backend/routes/contact.py`
- **Features**:
  - Logs successful submissions (without message content)
  - Enhanced rate limit logging
  - Email failure logging
  - Privacy-conscious logging (excludes sensitive data)

### Log Format

```
2024-10-24 12:34:56 - app_name - ERROR - [filename:line] - Error message with context
```

## Configuration

### Frontend Configuration

Error handling is configured in `frontend/src/app/app.config.ts`:

```typescript
providers: [
  // Global error handler
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandlerService,
  },
  // HTTP interceptor
  provideHttpClient(withInterceptors([errorInterceptor])),
]
```

### Backend Configuration

Logging is configured in `backend/app.py`:

```python
# Enhanced logging format
logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
```

## Development vs Production

### Development Mode

- Detailed console logging
- Full error context in responses
- Stack traces included
- All log levels displayed

### Production Mode

- Minimal console logging (warnings and errors only)
- Generic error messages to users
- No stack traces in responses
- Structured logging for monitoring

## Monitoring and Debugging

### Frontend Debugging

```typescript
// Get recent logs
const logs = loggingService.getRecentLogs(50);

// Export logs for analysis
const logData = loggingService.exportLogs();

// Clear logs
loggingService.clearLogs();
```

### Backend Monitoring

- All errors logged with full context
- Rate limit violations tracked
- Contact form submissions monitored
- Health check endpoint available at `/health`

## Error Types Handled

### Frontend

1. **Network Errors**: Connection issues, timeouts
2. **HTTP Errors**: 4xx and 5xx status codes
3. **Validation Errors**: Form validation failures
4. **Runtime Errors**: JavaScript exceptions
5. **Rate Limit Errors**: API rate limiting

### Backend

1. **Validation Errors**: Input validation failures
2. **Database Errors**: Connection and query issues
3. **Email Errors**: SendGrid/SMTP failures
4. **Rate Limit Violations**: Excessive requests
5. **Unhandled Exceptions**: Unexpected errors

## Best Practices

1. **Never log sensitive data** (passwords, full messages, etc.)
2. **Use appropriate log levels** (debug for development, error for issues)
3. **Include context** (user ID, request ID, timestamp)
4. **Handle errors gracefully** (show user-friendly messages)
5. **Monitor error rates** (set up alerts for high error rates)

## Future Enhancements

1. **External Logging Service**: Integration with Sentry, LogRocket, etc.
2. **Error Analytics**: Track error patterns and frequencies
3. **User Feedback**: Allow users to report errors
4. **Automated Alerts**: Notify developers of critical errors
5. **Error Recovery**: Automatic retry mechanisms