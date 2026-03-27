// Logger Utility
// Centralized logging with levels and formatting

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Set current log level based on environment
const CURRENT_LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

// Enable/disable specific log types
const LOG_CONFIG = {
  enableConsole: true,
  enableNetworkLogs: __DEV__,
  enablePerformanceLogs: __DEV__,
  enableDebugLogs: __DEV__,
};

class LoggerClass {
  /**
   * Format log message with timestamp and metadata
   */
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataString = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataString}`;
  }

  /**
   * Log debug messages
   */
  debug(message, data) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG && LOG_CONFIG.enableDebugLogs) {
      const formatted = this.formatMessage('DEBUG', message, data);
    }
  }

  /**
   * Log info messages
   */
  info(message, data) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      const formatted = this.formatMessage('INFO', message, data);
      console.info(formatted);
    }
  }

  /**
   * Log warning messages
   */
  warn(message, data) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      const formatted = this.formatMessage('WARN', message, data);
      console.warn(formatted);
    }
  }

  /**
   * Log error messages
   */
  error(message, error, data) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const errorData = {
        ...data,
        error: error?.message || error,
        stack: error?.stack,
      };
      const formatted = this.formatMessage('ERROR', message, errorData);
      console.error(formatted);
    }
  }

  /**
   * Log network requests
   */
  network(type, details) {
    if (LOG_CONFIG.enableNetworkLogs) {
      const icon = type === 'request' ? '📤' : '📥';
    }
  }

  /**
   * Log performance metrics
   */
  performance(label, duration) {
    if (LOG_CONFIG.enablePerformanceLogs) {
    }
  }

  /**
   * Create a performance timer
   */
  startTimer(label) {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.performance(label, duration);
      return duration;
    };
  }

  /**
   * Log API errors with structured format
   */
  apiError(endpoint, error, requestData) {
    this.error(`API Error: ${endpoint}`, error, {
      endpoint,
      requestData,
      statusCode: error.statusCode,
      isNetworkError: error.isNetworkError,
      isTimeout: error.isTimeout,
    });
  }

  /**
   * Group related logs
   */
  group(label, callback) {
    if (LOG_CONFIG.enableConsole) {
      console.group(label);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    }
  }

  /**
   * Log table data
   */
  table(data) {
    if (LOG_CONFIG.enableConsole && __DEV__) {
      console.table(data);
    }
  }
}

// Export singleton instance
export const Logger = new LoggerClass();

// Export log levels for external configuration
export {LOG_LEVELS, LOG_CONFIG};

