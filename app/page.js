"use client";
import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import http from "http";

import { AiIcon, UserIcon, RecordIcon, SpeechButton, Spinner } from "./icons";
import OpenAI from "openai";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useLongPress } from "@uidotdev/usehooks";

export default function Home() {
  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
    dangerouslyAllowBrowser: true,
  });
  //console api key
  console.log(process.env["OPENAI_API_KEY"]);

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
      console.log("Pressing");
      SpeechRecognition.startListening();
    },
    {
      onStart: (event) => {
        console.log("Press started");
      },
      onFinish: (event) => {
        console.log("Message: ", transcript);
        setMessage(transcript);
        SpeechRecognition.stopListening();
      // Send the transcript as a message only if isSending is false
        if (!isSending) {
          handleSend(transcript);
        }
      },
      onCancel: (event) => {
        console.log("Press cancelled");
        SpeechRecognition.stopListening(); // Stop listening if the press is cancelled
      },
      threshold: 500,
    }
  );

  const handleSend = async (message) => {
    if (isSending) return; // If an API call is already in progress, don't start a new one

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    };

    if (message !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message },
      ]); // Update the messages
      try {
        setIsSending(true); // Set the flag to true to indicate that an API call is in progress
        const chatCompletion = await openai.chat.completions.create(payload);
        console.log(chatCompletion);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: chatCompletion.choices[0].message.content },
        ]); // Add the new response to the array
        setMessage(""); // Clear the input field
        handlePlay(chatCompletion.choices[0].message.content); // Convert the AI's response to speech
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSending(false); // Reset the flag after the API call is finished
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
