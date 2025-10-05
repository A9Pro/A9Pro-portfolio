import React, { useState } from "react";
import { Mail, Send, User, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/mpwylppe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(""), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div
      className="rounded-lg p-4 md:p-6"
      style={{
        background: "linear-gradient(180deg, #02111a 0%, #041422 100%)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail size={20} style={{ color: "var(--color-accent-green)" }} />
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-main)" }}>
          <span style={{ color: "var(--color-accent-green)" }}>Get</span> In{" "}
          <span style={{ color: "var(--color-accent-blue)" }}>Touch</span>
        </h2>
      </div>

      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        Have a project in mind or want to collaborate? Drop me a message and I'll get back to you ASAP.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--color-text-main)" }}>
            <User size={14} style={{ color: "var(--color-accent-green)" }} />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded text-sm font-mono outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg-input)",
              border: "1px solid var(--color-border-sub)",
              color: "var(--color-text-main)",
            }}
            placeholder="John Doe"
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent-green)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-sub)")}
          />
        </div>

        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--color-text-main)" }}>
            <Mail size={14} style={{ color: "var(--color-accent-blue)" }} />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded text-sm font-mono outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg-input)",
              border: "1px solid var(--color-border-sub)",
              color: "var(--color-text-main)",
            }}
            placeholder="john@example.com"
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-sub)")}
          />
        </div>

        <div>
          <label htmlFor="message" className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--color-text-main)" }}>
            <MessageSquare size={14} style={{ color: "var(--color-accent-red)" }} />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-3 py-2 rounded text-sm font-mono outline-none resize-none transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg-input)",
              border: "1px solid var(--color-border-sub)",
              color: "var(--color-text-main)",
            }}
            placeholder="Your message here..."
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent-red)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-sub)")}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3 px-4 rounded font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: status === "submitting" ? "#023332" : "#02414a",
            border: "1px solid var(--color-accent-green)",
            color: "var(--color-text-main)",
          }}
        >
          {status === "submitting" ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>

        {status === "success" && (
          <div
            className="p-3 rounded text-sm text-center"
            style={{
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              border: "1px solid var(--color-accent-green)",
              color: "var(--color-accent-green)",
            }}
          >
            ✓ Message sent successfully! I'll get back to you soon.
          </div>
        )}

        {status === "error" && (
          <div
            className="p-3 rounded text-sm text-center"
            style={{
              backgroundColor: "rgba(255, 85, 85, 0.1)",
              border: "1px solid var(--color-accent-red)",
              color: "var(--color-accent-red)",
            }}
          >
            ✗ Oops! Something went wrong. Please try again.
          </div>
        )}
      </form>

      <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-border-sub)" }}>
        <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>
          Or email me directly at{" "}
          <a
            href="mailto:adejaretalabi101@gmail.com"
            className="underline"
            style={{ color: "var(--color-accent-green)" }}
          >
            adejaretalabi101@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}