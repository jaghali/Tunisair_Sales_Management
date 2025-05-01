import React, { createContext, useState } from "react";
import runChat from "./Config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);       // full history
  const [loading, setLoading] = useState(false);
  const clearMessages = () => {
    setMessages([]);
    setInput("");
  };
  
  const onSent = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    // 1) add user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    // 2) call Gemini
    try {
      const response = await runChat(prompt);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Context.Provider
  value={{ input, setInput, messages, loading, onSent, clearMessages }}
>
  {children}
</Context.Provider>

  );
};

export default ContextProvider;
