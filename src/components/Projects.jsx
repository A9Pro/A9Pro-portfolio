import React from "react";

export default function Projects() {
  const projects = [
    {
      name: "Crypto Sniper Bot",
      desc: "A high-frequency trading bot for MT5 & Binance.",
      link: "https://github.com/A9Pro/crypto-sniper-bot",
    },
    {
      name: "Lagos Racer Game",
      desc: "An open-world racing game inspired by Lagos street life.",
      link: "https://github.com/A9Pro/lagos-racer",
    },
    {
      name: "Pixelfables4U",
      desc: "An AI storytelling YouTube channel powered by character AI.",
      link: "https://www.youtube.com/@pixelfables4u",
    },
  ];

  return (
    <section className="p-8 md:p-16 border-t border-green-700">
      <h2 className="text-3xl text-green-300 text-center mb-6">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <div
            key={i}
            className="border border-green-600 p-4 rounded-lg bg-black hover:bg-green-950/20 transition"
          >
            <h3 className="text-xl text-green-300 font-semibold">{p.name}</h3>
            <p className="text-green-400 text-sm mt-2">{p.desc}</p>
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-sm text-green-500 underline"
            >
              View Project →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
