import { ToolRegistry } from "../src/agent/tool-registry";
import { registerNostrTools } from "../src/tools/nostr";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Create a local .env file for testing if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Nostr Configuration
# Your Nostr private key (hex format without 0x prefix)
# If left as 'your_private_key_here', a random key will be generated
NOSTR_PRIVATE_KEY=your_private_key_here

# Comma-separated list of relay URLs to publish to
RELAYS=wss://relay.damus.io,wss://relay.snort.social,wss://nos.lol

# The interval for posting random vibes (if used in a scheduled job)
POST_INTERVAL=3600000`;

  fs.writeFileSync(envPath, envContent);
  console.log(`Created test .env file at ${envPath}`);
}

// Load environment variables from the test directory
dotenv.config({ path: envPath });

async function testNostr() {
  console.log("🧪 Testing Nostr Tools");

  // Create tool registry
  const toolRegistry = new ToolRegistry();

  // Register Nostr tools
  registerNostrTools(toolRegistry);

  try {
    // 1. Test publishing a profile
    console.log("\n📝 Testing Nostr Profile Creation...");
    const profileResult = await toolRegistry.executeTool("publish_nostr_profile", {
      name: "Dr. Bitcoin",
      about: "I am a doctor of bitcoin, here to help with all your Bitcoin needs!",
      picture: "https://i.imgur.com/K3KJ3w4h.jpg",
      nip05: "drbitcoin@example.com",
      website: "https://example.com",
      lud16: "drbitcoin@getalby.com"
    });

    console.log("Profile Result:", profileResult);

    // 2. Test publishing a note
    console.log("\n📝 Testing Nostr Note Publication...");
    const noteResult = await toolRegistry.executeTool("publish_nostr_note", {
      content: "Hello Nostr world! This is Dr. Bitcoin testing the Nostr integration."
    });

    console.log("Note Result:", noteResult);

    // 3. Test publishing a random vibe
    console.log("\n📝 Testing Random Vibe Publication...");
    const vibeResult = await toolRegistry.executeTool("publish_random_vibe", {});

    console.log("Vibe Result:", vibeResult);

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("❌ Error testing Nostr tools:", error);
  }

  // Add a small delay before exiting to allow any pending operations to complete
  setTimeout(() => {
    console.log("👋 Test completed. Exiting...");
    process.exit(0);
  }, 2000);
}

// Run the tests
testNostr().catch(console.error);