import { useContext } from "react";
import { CiMicrophoneOn } from "react-icons/ci";
import speakGif from "./assets/speak.gif";
import aiVoice from "./assets/aiVoice.gif";
import { dataContext } from "./context/UserContext.jsx";
import "./App.css";
import Navbar from "./component/Navbar.jsx";

function App() {
  let { recognition, speaking, setSpeaking, prompt, isAIResponse } =
    useContext(dataContext);
  return (
    <>
      <Navbar />
      <div className="main">
        <span id="jarvis-text">
          Hello, I am Jarvis, How can I help you today?
        </span>
        {!speaking ? (
          <button
            onClick={() => {
              setSpeaking(true);
              recognition.start();
            }}
          >
            Click here <CiMicrophoneOn />
          </button>
        ) : (
          <div className="response-div">
            {isAIResponse ? (
              <img src={aiVoice} alt="AI Voice" id="aiVoice" />
            ) : (
              <img src={speakGif} alt="Listening" id="speakGif" />
            )}
            <p>{prompt}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
