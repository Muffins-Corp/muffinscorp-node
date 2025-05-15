// muffinsai.js - Client library for MuffinsCorp API
const axios = require("axios");
const {
  AuthenticationError,
  CreditError,
  parseStreamChunk,
  formatMessages,
  generateUUID,
} = require("./utils");

class MuffinsCorp {
  constructor(config = {}) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || "https://chat.muffinscorp.com/api/public"; // Default base URL
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    });

    // Initialize resource classes
    this.chat = new Chat(this);
    this.models = new Models(this);
    this.subscriptions = new Subscriptions(this);
    this.credits = new Credits(this);
  }
}

// Chat completions resource
class Chat {
  constructor(client) {
    this.client = client;
  }

  /**
   * Creates a chat completion
   * @param {Object} params
   * @param {Array} params.messages - Array of message objects
   * @param {string} [params.model="chat-model-small"] - Model ID to use
   * @param {boolean} [params.stream=true] - Whether to stream the response
   * @returns {Promise} - Chat completion response
   */
  async create(params) {
    const { messages, model = "chat-model-small", stream = true } = params;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages must be a non-empty array");
    }

    try {
      // Format messages according to API expectations
      const formattedMessages = formatMessages(messages);

      const response = await this.client.client.post(
        "/chat",
        {
          messages: formattedMessages,
          model,
          stream,
        },
        {
          responseType: stream ? "stream" : "json", // Important for streaming
        }
      );

      // If streaming is enabled, handle accordingly
      if (stream) {
        return this._handleStream(response);
      }

      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Handles streaming responses
   * @private
   */
  /**
   * Handles streaming responses
   * @private
   */
  _handleStream(response) {
    // Axios with streaming requires responseType: 'stream'
    const stream = response.data;

    // Create a transform stream to parse each chunk
    const { Transform } = require("stream");
    const transformedStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          // Convert Buffer to string and split by newlines
          const chunkStr = chunk.toString();
          const lines = chunkStr
            .split("\n")
            .filter((line) => line.trim() !== "");

          for (const line of lines) {
            // Parse each line as JSON if it starts with data:
            if (line.startsWith("data:")) {
              const dataStr = line.substring(5).trim();
              if (dataStr === "[DONE]") {
                this.push(null); // End the stream
                return;
              }

              try {
                const parsedChunk = JSON.parse(dataStr);
                this.push(parsedChunk);
              } catch (e) {
                console.error("Error parsing JSON chunk:", e);
              }
            }
          }
          callback();
        } catch (error) {
          callback(error);
        }
      },
    });

    // Pipe the original stream through our transform stream
    stream.pipe(transformedStream);

    return transformedStream;
  }

  /**
   * Standardized error handling
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { data, status } = error.response;

      // Handle specific error types based on status code and error codes
      if (status === 401 || status === 403) {
        throw new AuthenticationError(
          data.error || "Authentication failed",
          status,
          data.code || "AUTHENTICATION_ERROR"
        );
      }

      if (status === 402) {
        throw new CreditError(
          data.error || "Insufficient credits",
          status,
          data.code || "INSUFFICIENT_CREDITS",
          data.creditsRemaining || 0
        );
      }

      // Generic error for other cases
      throw new Error(
        `API Error (${status}): ${
          data.error || data.message || "Unknown error"
        }`
      );
    }

    // Network errors, timeouts, etc.
    throw error;
  }
}

// Models resource
class Models {
  constructor(client) {
    this.client = client;
  }

  /**
   * List available models
   * @returns {Promise} - Array of model objects
   */
  async list() {
    try {
      const response = await this.client.client.get("/ai-model");
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Standardized error handling
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { data, status } = error.response;

      // Handle specific error types based on status code and error codes
      if (status === 401 || status === 403) {
        throw new AuthenticationError(
          data.error || "Authentication failed",
          status,
          data.code || "AUTHENTICATION_ERROR"
        );
      }

      if (status === 402) {
        throw new CreditError(
          data.error || "Insufficient credits",
          status,
          data.code || "INSUFFICIENT_CREDITS",
          data.creditsRemaining || 0
        );
      }

      // Generic error for other cases
      throw new Error(
        `API Error (${status}): ${
          data.error || data.message || "Unknown error"
        }`
      );
    }

    // Network errors, timeouts, etc.
    throw error;
  }
}

// Subscriptions resource
class Subscriptions {
  constructor(client) {
    this.client = client;
  }

  /**
   * List available subscription plans
   * @returns {Promise} - Array of plan objects
   */
  async list() {
    try {
      const response = await this.client.client.get("/subscription");
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Standardized error handling
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { data } = error.response;
      throw new Error(
        `${data.error || "API Error"}: ${
          data.message || data.error || error.message
        }`
      );
    }
    throw error;
  }
}

// Credits resource
class Credits {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get current credit balance
   * @returns {Promise} - Balance information
   */
  async getBalance() {
    try {
      const response = await this.client.client.get("/user/balance");
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Standardized error handling
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { data } = error.response;
      throw new Error(
        `${data.error || "API Error"}: ${
          data.message || data.error || error.message
        }`
      );
    }
    throw error;
  }
}

module.exports = { MuffinsCorp };
