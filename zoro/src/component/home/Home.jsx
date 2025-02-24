import React, { useState } from "react";
import ai from "../../assets/ai.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const speechSynthesisInstance = window.speechSynthesis;

  // Function to handle sending the command
  const sendCommand = async () => {
    if (speechSynthesisInstance.speaking) {
      speechSynthesisInstance.cancel(); // Stop current speech
    }

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: userInput }),
      });

      const data = await res.json();
      setResponse(data.response);

      // Text-to-speech
      const utterance = new SpeechSynthesisUtterance(data.response);
      speechSynthesisInstance.speak(utterance);
    } catch (error) {
      console.error("Error sending command:", error);
      setResponse("An error occurred while processing your request.");
    }
  };

  // Function to handle voice input
  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      sendCommand(); // Automatically send the spoken command
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  return (
    <div className="header section__padding" id="home">
      <div className="header-content">
        <h1>ZORO</h1>
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type or speak your command..."
        />

        <div>
          <button onClick={sendCommand}>Submit</button>
          <button onClick={startListening}>Speak</button>
        </div>

        <p id="response">{response}</p>
      </div>

      <div className="header-image">
        <img src={ai} alt="ai" />
      </div>
    </div>
  );
};

export default Home;
