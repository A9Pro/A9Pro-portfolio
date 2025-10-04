import React from "react";

export default function About() {
  return (
    <section className="p-8 md:p-16 text-center border-t border-green-700">
      <h2 className="text-3xl text-green-300 mb-4">About Me</h2>
      <p className="text-green-400 max-w-2xl mx-auto leading-relaxed">
        I'm <span className="text-green-300 font-semibold">Adejare</span>, also
        known as <span className="text-green-300">A9Pro</span>.  
        A full-stack developer, crypto trader, and creator passionate about
        crafting interactive digital experiences and automation tools.
      </p>
    </section>
  );
}
