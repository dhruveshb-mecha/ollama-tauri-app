"use client";
import { useState, useEffect, useRef } from "react";
import Input from "./input";
import { AiIcon, UserIcon } from "./icons";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (message !== "") {
      setMessages([...messages, { role: "user", content: message }]); // Update the messages

      fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tinyllama",
          stream: false,
          messages: [{ role: "user", content: message }],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "ai", content: data.message.content },
          ]); // Add the new response to the array
          setMessage(""); // Clear the input field
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <main className="flex flex-col items-center justify-between w-full h-screen bg-white">
      <div className="mb-auto overflow-auto w-full">
        <div className="m-2">
          {messages.map((message, index) => (
            <div
              key={index}
              class="flex gap-3 my-4 text-gray-600 text-sm flex-1"
            >
              <span class="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                {message.role === "user" ? <UserIcon /> : <AiIcon />}
              </span>
              <p class="leading-relaxed" ref={messagesEndRef}>
                <span class="block font-bold text-gray-700">
                  {message.role === "user" ? "You" : "AI"}{" "}
                </span>
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto w-full m-2 p-2">
        <Input message={message} setMessage={setMessage} onSend={handleSend} />
      </div>
    </main>
  );
}
