import { useState, createContext } from "react";
import run from "../gemini.js";

export const dataContext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [isAIResponse, setIsAIResponse] = useState(false);
  const [prompt, setPrompt] = useState("listening...");

  // for speech synthesis -
  function speak(text) {
    window.speechSynthesis.cancel();
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1.15;
    text_speak.pitch = 1.2;
    text_speak.lang = "en";

    // When speech actually starts playing:
    text_speak.onstart = () => {
      setSpeaking(true);
      setIsAIResponse(true);
    };

    // When speech actually finishes:
    text_speak.onend = () => {
      setSpeaking(false);
      setIsAIResponse(false);
      setPrompt("listening...");
    };

    // Guard against errors resetting state:
    text_speak.onerror = () => {
      setSpeaking(false);
      setIsAIResponse(false);
      setPrompt("listening...");
    };

    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(prompt) {
    let text = await run(prompt);
    setPrompt(text);
    speak(text);
    setIsAIResponse(true);
  }
  // For speech recognition -
  let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = new speechRecognition();

  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex;
    let transcript = e.results[currentIndex][0].transcript;
    if (e.results[currentIndex].isFinal) {
      setPrompt(transcript);
      commandRecognition(transcript);
    }
  };

  function commandRecognition(command) {
    const text = command.toLowerCase().trim();

    //Open Website Command
    if (text.includes("open")) {
      const openIndex = text.indexOf("open");
      let rawSite = text.slice(openIndex + 4).trim();

      // 1. Dictionary for non-standard or multi-word URLs
      const customSites = {
        "google ai studio": "https://aistudio.google.com",
        "ai studio": "https://aistudio.google.com",
        "google drive": "https://drive.google.com",
        whatsapp: "https://web.whatsapp.com",
      };

      let targetUrl = "";
      let displayName = rawSite;

      // Check if the spoken phrase directly matches one of our custom destinations
      if (customSites[rawSite]) {
        targetUrl = customSites[rawSite];
        displayName = rawSite;
      } else {
        // 2. Strip extensions, trailing words, and symbols for standard websites
        const siteName = rawSite
          .replace(/\s*dot\s*com/gi, "")
          .replace(/\.com/gi, "")
          .replace(/\.(in|org|net|io|co)/gi, "")
          .split(" ")[0] // Take first word for standard sites (e.g. "youtube please" -> "youtube")
          .replace(/[^a-zA-Z0-9]/g, "")
          .trim();

        if (siteName) {
          displayName = siteName;
          targetUrl = `https://www.${siteName}.com`;
        }
      }

      // 3. Open if a valid URL was determined
      if (targetUrl) {
        speak(`Opening ${displayName}`);
        setPrompt(`Opening ${displayName}...`);
        window.open(targetUrl, "_blank");
        return;
      }
    }

    // Fallback to Gemini AI
    aiResponse(command);
  }

  let value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    isAIResponse,
  };

  return (
    <div>
      <dataContext.Provider value={value}>{children}</dataContext.Provider>
    </div>
  );
}

export default UserContext;
