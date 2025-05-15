// utils.js - Utility functions for the MyAI client library

/**
 * Custom error class for authentication errors
 */
class AuthenticationError extends Error {
  constructor(message, statusCode = 401, errorCode = 'AUTHENTICATION_ERROR') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/**
 * Custom error class for credit-related errors
 */
class CreditError extends Error {
  constructor(message, statusCode = 402, errorCode = 'CREDIT_ERROR', creditsRemaining = 0) {
    super(message);
    this.name = 'CreditError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.creditsRemaining = creditsRemaining;
  }
}

/**
 * Parse stream data according to the specific format used by your API
 * This is a placeholder - you'll need to adjust based on your actual stream format
 * @param {Buffer|string} chunk - Raw chunk from stream
 * @returns {Object} - Parsed data object
 */
function parseStreamChunk(chunk) {
  try {
    // This assumes chunks are sent as JSON objects with a data field
    // Adjust according to your API's actual stream format
    const data = JSON.parse(chunk.toString());
    return data;
  } catch (error) {
    // If not JSON, return the raw chunk
    return { text: chunk.toString() };
  }
}

/**
 * Formats messages in the expected structure for the API
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Formatted message array
 */
function formatMessages(messages) {
  return messages.map(msg => {
    // Ensure each message has the required role and content properties
    if (!msg.role || !msg.content) {
      throw new Error('Each message must have a role and content');
    }
    
    // Ensure role is one of the expected values
    const allowedRoles = ['system', 'user', 'assistant'];
    if (!allowedRoles.includes(msg.role)) {
      throw new Error(`Invalid message role: ${msg.role}. Must be one of: ${allowedRoles.join(', ')}`);
    }
    
    return {
      role: msg.role,
      content: msg.content
    };
  });
}

/**
 * Generates a UUID v4
 * @returns {string} - A random UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  AuthenticationError,
  CreditError,
  parseStreamChunk,
  formatMessages,
  generateUUID
};
