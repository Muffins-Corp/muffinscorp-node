# MyAI JavaScript Client Library

A Node.js client library for interacting with the MyAI API, designed with a similar structure to the OpenAI Node.js library.

## Installation

```bash
npm install myai
```

## Usage

```javascript
const { MyAI } = require("myai");

// Initialize with your API key
const myai = new MyAI({
  apiKey: "your-api-key",
  // Optional: specify a custom base URL
  // baseURL: 'https://custom-api-endpoint.com'
});

// Example: Get available models
async function getModels() {
  const models = await myai.models.list();
  console.log(models);
}

// Example: Chat completion
async function createChatCompletion() {
  const completion = await myai.chat.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, world!" },
    ],
    model: "chat-model-small",
    stream: false, // Set to true for streaming responses
  });

  console.log(completion);
}

// Example: Get credit balance
async function getCredits() {
  const balance = await myai.credits.getBalance();
  console.log(balance);
}

// Example: List subscription plans
async function getSubscriptionPlans() {
  const plans = await myai.subscriptions.list();
  console.log(plans);
}
```

## API Reference

### Configuration

When initializing the `MyAI` class, you can provide the following options:

- `apiKey` (required): Your MyAI API key
- `baseURL` (optional): Custom API endpoint URL

### Chat

#### `myai.chat.create(options)`

Creates a chat completion.

Parameters:

- `messages` (required): Array of message objects with `role` and `content`
- `model` (optional): Model ID to use (defaults to "chat-model-small")
- `stream` (optional): Whether to stream the response (defaults to true)

Returns a Promise resolving to the completion response.

### Models

#### `myai.models.list()`

Lists all available models.

Returns a Promise resolving to an array of model objects.

### Subscriptions

#### `myai.subscriptions.list()`

Lists all available subscription plans.

Returns a Promise resolving to an array of plan objects.

### Credits

#### `myai.credits.getBalance()`

Gets the current credit balance for your account.

Returns a Promise resolving to a balance object.

## Error Handling

The library will throw standardized errors with appropriate messages when API requests fail. You can catch these errors using standard try/catch blocks.

```javascript
try {
  await myai.chat.create({
    messages: [{ role: "user", content: "Hello" }],
  });
} catch (error) {
  console.error("API request failed:", error.message);
}
```

## Streaming Responses

When using `stream: true` with chat completions, you'll receive a response that can be processed as a stream.

```javascript
const stream = await myai.chat.create({
  messages: [{ role: "user", content: "Tell me a story" }],
  stream: true,
});

// Handle stream processing based on your implementation
```
