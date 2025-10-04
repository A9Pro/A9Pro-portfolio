import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function Contact() {
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_PUBLIC_KEY")
      .then(() => {
        setStatus("Message sent successfully ✅");
      })
      .catch(() => {
        setStatus("Failed to send message ❌");
      });
    e.target.reset();
  };

  return (
    <section className="p-8 md:p-16 border-t border-green-700 text-center">
      <h2 className="text-3xl text-green-300 mb-6">Contact Me</h2>

      <form onSubmit={sendEmail} className="max-w-md mx-auto flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="bg-black border border-green-700 p-2 text-green-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="bg-black border border-green-700 p-2 text-green-300 rounded"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          className="bg-black border border-green-700 p-2 text-green-300 rounded"
        ></textarea>
        <button
          type="submit"
          className="border border-green-700 hover:bg-green-800/20 text-green-300 py-2 rounded"
        >
          Send
        </button>
      </form>

      {status && <p className="mt-4 text-green-400">{status}</p>}
    </section>
  );
}
