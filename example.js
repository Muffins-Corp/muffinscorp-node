// Example usage code for the MyAI client library

const { MuffinsCorp } = require("./src/api-client");

// Initialize the client
const myai = new MuffinsCorp({
  apiKey: "dac196a6039e99d4d0f8a0da8a915becd9a7e97cb4d2afbe268676a4fcb58fb3",
});

// Example function to demonstrate getting models
async function getAvailableModels() {
  try {
    const models = await myai.models.list();
    console.log("Available models:");
    console.log(models);
  } catch (error) {
    console.error("Failed to fetch models:", error.message);
  }
}

// Example function to demonstrate chat completion
async function createChatCompletion() {
  try {
    const response = await myai.chat.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" },
      ],
      model: "chat-model-small",
      stream: false, // Set to false for non-streaming response
    });

    console.log("Chat completion response:");
    console.log(response);
  } catch (error) {
    console.error("Failed to create chat completion:", error.message);
  }
}

// Example function to demonstrate streaming chat completion
async function createStreamingChatCompletion() {
  try {
    const stream = await myai.chat.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Write a short poem about programming." },
      ],
      model: "chat-model-small",
      stream: true,
    });

    console.log("Streaming response started:");

    let fullResponse = "";

    stream.on("data", (chunk) => {
      try {
        const chunkStr = chunk.toString();

        // Process each line separately (in case multiple chunks arrive together)
        chunkStr.split("\n").forEach((line) => {
          line = line.trim();
          if (!line) return;

          // Debug: show raw chunk
          console.log("[RAW CHUNK]", line);

          if (line.startsWith('0:"')) {
            // Extract text content
            const text = line.substring(3, line.length - 1); // Remove 0:" and "
            process.stdout.write(text); // Print text as it arrives
            fullResponse += text;
          } else if (
            line.startsWith("f:") ||
            line.startsWith("e:") ||
            line.startsWith("d:")
          ) {
            // Parse JSON data
            const jsonStr = line.substring(2);
            const data = JSON.parse(jsonStr);
            console.log("\n[METADATA]", data);
          }
        });
      } catch (err) {
        console.error("\nError processing chunk:", err);
      }
    });

    stream.on("end", () => {
      console.log("\n\nStream completed");
      console.log("Full response received:");
      console.log(fullResponse);
    });

    stream.on("error", (err) => {
      console.error("\nStream error:", err);
    });
  } catch (error) {
    console.error("Failed to create streaming chat completion:", error.message);
  }
}

// Example function to demonstrate getting credit balance
async function getCredits() {
  try {
    const balance = await myai.credits.getBalance();
    console.log("Current credit balance:");
    console.log(balance);
  } catch (error) {
    console.error("Failed to fetch credit balance:", error.message);
  }
}

// Example function to demonstrate listing subscription plans
async function getSubscriptionPlans() {
  try {
    const plans = await myai.subscriptions.list();
    console.log("Available subscription plans:");
    console.log(plans);
  } catch (error) {
    console.error("Failed to fetch subscription plans:", error.message);
  }
}

// Run the example functions
async function runExamples() {
  console.log("==== MyAI API Client Examples ====\n");

  console.log("1. Fetching available models...");
  await getAvailableModels();
  console.log("\n");

  console.log("2. Creating a chat completion...");
  await createChatCompletion();
  console.log("\n");

  console.log("3. Creating a streaming chat completion...");
  await createStreamingChatCompletion();
  console.log("\n");

  console.log("4. Checking credit balance...");
  await getCredits();
  console.log("\n");

  console.log("5. Getting subscription plans...");
  await getSubscriptionPlans();
}

// Execute the examples
runExamples().catch((err) => {
  console.error("Error running examples:", err);
});
