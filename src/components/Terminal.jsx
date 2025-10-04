import React, { useState } from "react";

const commands = {
  help: "Available commands: about, projects, contact, clear",
  about: "Hi, I'm Adejare (A9Pro) — a full-stack dev and crypto trader.",
  projects: "Check my GitHub for open-source & web projects.",
  contact: "Email: adejaretalabi101@gmail.com",
};

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  const handleCommand = (e) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();
    if (command === "clear") {
      setHistory([]);
    } else {
      const output = commands[command] || "Unknown command. Type 'help'";
      setHistory([...history, { command, output }]);
    }
    setInput("");
  };

  return (
    <div className="bg-black border-t border-green-600 p-6 min-h-[40vh] text-left">
      {history.map((item, index) => (
        <div key={index}>
          <p className="text-green-400">$ {item.command}</p>
          <p className="text-green-300">{item.output}</p>
        </div>
      ))}
      <form onSubmit={handleCommand}>
        <span className="text-green-400">$ </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-black outline-none text-green-300"
          autoFocus
        />
      </form>
    </div>
  );
}
