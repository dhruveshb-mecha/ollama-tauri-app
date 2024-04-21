"use client";
import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

import { AiIcon, UserIcon, RecordIcon, SpeechButton, Spinner } from "./icons";
import OpenAI from "openai";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useLongPress } from "@uidotdev/usehooks";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // this function is speech from text
  const handlePlay = (message) => {
    // Check if responsiveVoice is loaded
    console.log("Playing");
    console.log("Message: ", message);
    if (responsiveVoice) {
      console.log("ResponsiveVoice loaded");
      responsiveVoice.speak(message, "UK English Male");
    } else {
      console.error("ResponsiveVoice not loaded");
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const attrs = useLongPress(
    (event) => {
      console.log("Long press initiated");
      SpeechRecognition.startListening();
      console.log("Speech recognition started");
    },
    {
      onStart: (event) => {
        console.log("Long press started");
      },
      onFinish: (event) => {
        console.log("Long press finished");
        console.log("Transcript: ", transcript);
        setMessage(transcript);
        SpeechRecognition.stopListening();
        console.log("Speech recognition stopped");
        // Send the transcript as a message only if isSending is false
        if (!isSending) {
          console.log("Sending message: ", transcript);
          handleSend(transcript);
        }
      },
      onCancel: (event) => {
        console.log("Long press cancelled");
        SpeechRecognition.stopListening(); // Stop listening if the press is cancelled
        console.log("Speech recognition stopped due to cancellation");
      },
      threshold: 1000,
    }
  );

  const handleSend = async (message) => {
    if (isSending) {
      console.log("Previous API call still in progress, skipping this message");
      return; // If an API call is already in progress, don't start a new one
    }

    // return if the message is empty
    if (message === "") {
      console.log("Message is empty, skipping the API call");
      return;
    }

    const payload = {
      prompt: message,
    };

    if (message !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message },
      ]); // Update the messages
      console.log("Message added to the chat");
      try {
        setIsSending(true); // Set the flag to true to indicate that an API call is in progress
        console.log("API call started");
        const response = await fetch(
          "https://mecha-cf-llm.dhruveshb.workers.dev",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // allow CROSS origin
              "Access-Control-Allow-Origin": "*",
              "mode": "no-cors",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        console.log("API Response =>", data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: data.response },
        ]); // Add the new response to the array
        console.log("AI response added to the chat");
        setMessage(""); // Clear the input field
        console.log("Input field cleared");
        handlePlay(data.response); // Convert the AI's response to speech
        console.log("AI response converted to speech");
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setIsSending(false); // Reset the flag after the API call is finished
        console.log("API call finished");
      }
    }
  };

  return (
    <>
      <Script
        src="https://code.responsivevoice.org/responsivevoice.js?key=OziCFq86"
        strategy="beforeInteractive"
        onLoad={() =>
          console.log(
            `script loaded correctly, responsivevoice  been populated`
          )
        }
      />

      <main className="flex flex-col items-center justify-between w-full h-screen bg-white">
        <div className="mb-auto overflow-auto w-full">
          <div className="m-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3 my-4 text-gray-600 text-sm flex-1"
              >
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  {message.role === "user" ? <UserIcon /> : <AiIcon />}
                </span>
                <p className="leading-relaxed" ref={messagesEndRef}>
                  <span className="block font-bold text-gray-700">
                    {message.role === "user" ? "You" : "AI"}{" "}
                  </span>
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto w-full flex justify-around items-center flex-row gap-3 m-2 p-2">
          <RecordIcon {...attrs} listening={listening ? "true" : "false"} />

          <span className="relative flex  h-8 w-8">
            <span
              className={`${
                listening ? "animate-ping" : ""
              } absolute inline-flex h-full w-full justify-center items-center rounded-full bg-sky-400 opacity-75`}
            ></span>
            <span className="relative inline-flex rounded-full justify-center items-center h-8 w-8 bg-sky-500"></span>
          </span>
          <SpeechButton />
        </div>
      </main>
    </>
  );
}
