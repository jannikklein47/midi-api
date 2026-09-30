const easymidi = require("easymidi");

// Target URL for HTTP requests
const TARGET_URL = "http://192.168.0.228:3000/pc";

// Create a Virtual MIDI Input port
// DAW outputs will send data TO this port
const inputName = "Node MIDI Receiver";
const input = new easymidi.Input(inputName, true); // 'true' designates virtual port

console.log(`[Virtual MIDI] Port created: "${inputName}"`);
console.log("Listening for MIDI Program Changes...");

// Listen to Program Change events
input.on("program", async (msg) => {
  const payload = {
    event: "program_change",
    number: msg.number, // Program/Preset number (0-127)
    channel: msg.channel, // MIDI channel (0-15)
    timestamp: Date.now(),
  };

  console.log(
    `[Program Change] Channel: ${msg.channel}, Program: ${msg.number}`,
  );

  try {
    const response = await fetch(TARGET_URL + `?n=${msg.number}`, {
      method: "GET",
    });

    console.log(`[HTTP Response] Status: ${response.status}`);
  } catch (error) {
    console.error(`[HTTP Error] Failed to send request: ${error.message}`);
  }
});

// Clean shut down on Ctrl+C
process.on("SIGINT", () => {
  console.log("\nClosing MIDI input port...");
  input.close();
  process.exit();
});
