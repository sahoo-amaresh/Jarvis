const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import { GoogleGenerativeAI } from "@google/generative-ai";

// 2. Initialize the client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 1. Get the exact live Indian Standard Time (IST) from the user's browser
const now = new Date();
const istTime = now.toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "full",
  timeStyle: "medium",
});

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  systemInstruction: `You are JARVIS., an advanced AI assistant created by Amresh. Never say you were made by Google. Address the user politely, maintain a witty and loyal demeanor, and keep voice answers clear, natural, and concise without markdown asterisks.When asked about date and time then say it accordingly the current live date and time in India (IST) is: ${istTime}. Always use this timestamp when answering time or date queries.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 80,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default run;
