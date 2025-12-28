import emailjs from "@emailjs/browser";
import React, { useEffect, useRef, useState } from "react";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { Terminal, Folder, Code, FileText, Mail, Github, Linkedin, Zap } from "lucide-react";

const getFirebaseFunctions = () => {
  const isMock = !(
    typeof window.initializeApp === 'function' &&
    typeof window.getAuth === 'function' &&
    typeof window.getFirestore === 'function'
  );

  if (isMock) {
    const dummyFunc = () => {};
    const dummyPromise = () => Promise.resolve({ user: { uid: 'mock-user-id' } });
    const dummyUnsub = () => (() => {});
    
    return {
      initializeApp: dummyFunc,
      getAuth: dummyFunc,
      signInAnonymously: dummyPromise,
      signInWithCustomToken: dummyPromise,
      onAuthStateChanged: dummyUnsub,
      getFirestore: dummyFunc,
      onSnapshot: dummyUnsub,
      collection: dummyFunc,
      query: dummyFunc,
      limit: dummyFunc,
      setLogLevel: dummyFunc,
      isMock: true
    };
  }

  return {
    initializeApp: window.initializeApp,
    getAuth: window.getAuth,
    signInAnonymously: window.signInAnonymously,
    signInWithCustomToken: window.signInWithCustomToken,
    onAuthStateChanged: window.onAuthStateChanged,
    getFirestore: window.getFirestore,
    onSnapshot: window.onSnapshot,
    collection: window.collection,
    query: window.query,
    limit: window.limit,
    setLogLevel: window.setLogLevel,
    isMock: false
  };
};

const formatDateTime = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const period = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours = hours - 12;
  const displayHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${period}`;
};

const WelcomeLoader = ({ onComplete, minMs = 4000, audioSrc = "/startup.mp3" }) => {
  const [deviceInfo, setDeviceInfo] = useState({
    device: "Detecting...",
    location: "Detecting...",
    dateTime: formatDateTime(new Date()),
  });
  const [loadProgress, setLoadProgress] = useState(0);
  const [initText, setInitText] = useState("");
  const fullText = "EXECUTE INIT SCRIPT";


  const [worldTimes, setWorldTimes] = useState([]);


  const audioRef = useRef(null);

  useEffect(() => {

    if (audioSrc) {
      try {
        const a = new Audio(audioSrc);
        a.preload = "auto";
        a.volume = 0.25;

        a.play().catch(() => {});
        audioRef.current = a;
      } catch (e) {
        audioRef.current = null;
      }
    }
    return () => {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch(e) {}
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  useEffect(() => {

    const timeTimer = setInterval(() => {
      setDeviceInfo(prev => ({
        ...prev,
        dateTime: formatDateTime(new Date()),
      }));
    }, 1000);
    return () => clearInterval(timeTimer);
  }, []);

  useEffect(() => {

    const cities = [
      { name: "New York", tz: "America/New_York" },
      { name: "London", tz: "Europe/London" },
      { name: "Dubai", tz: "Asia/Dubai" },
      { name: "Tokyo", tz: "Asia/Tokyo" },
      { name: "Sydney", tz: "Australia/Sydney" },
    ];

    const updateTimes = () => {
      const now = new Date();
      const formatted = cities.map((c) => {
        const time = now.toLocaleTimeString("en-US", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        return { name: c.name, time };
      });
      setWorldTimes(formatted);
    };

    updateTimes();
    const t = setInterval(updateTimes, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {

    try {
      const userAgent = (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : "";
      let device = "Desktop (PC)";
      if (/mobile/i.test(userAgent)) device = "Mobile (Phone)";
      else if (/tablet/i.test(userAgent)) device = "Tablet (Pad)";
      else if (/window|window os x/i.test(useragent)) devive = "Desktop (Window OS)";
      else if (/macintosh|mac os x/i.test(userAgent)) device = "Desktop (Mac)";

      let location = "Earth";
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            location = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
            setDeviceInfo(prev => ({ ...prev, device, location }));
          },
          () => {
            setDeviceInfo(prev => ({ ...prev, device, location: "ACCESS DENIED" }));
          },
          { maximumAge: 60_000, timeout: 5000 }
        );
      } else {
        setDeviceInfo(prev => ({ ...prev, device, location: "UNAVAILABLE" }));
      }

      const totalTime = Math.max(minMs, 4000);
      const interval = 30;
      let currentProgress = 0;

      const progressTimer = setInterval(() => {
        currentProgress += (interval / totalTime) * 100;
        if (currentProgress >= 100) {
          setLoadProgress(100);
          clearInterval(progressTimer);

          setTimeout(() => {
            try { onComplete && onComplete(); } catch (e) {}
          }, 500);
        } else {
          setLoadProgress(Math.min(100, currentProgress));
        }
      }, interval);

      return () => clearInterval(progressTimer);
    } catch (e) {
      setTimeout(() => onComplete && onComplete(), minMs);
    }
  }, [onComplete, minMs]);

  useEffect(() => {

    let charIndex = 0;
    setInitText('');
    const delayBeforeTyping = 100;
    
    const startTyping = setTimeout(() => {
        const typeTimer = setInterval(() => {
            if (charIndex <= fullText.length) {
              setInitText(fullText.substring(0, charIndex));
              charIndex++;
            } else {
              clearInterval(typeTimer);
            }
        }, 70);
        return () => clearInterval(typeTimer);
    }, delayBeforeTyping);
    
    return () => clearTimeout(startTyping);
  }, []);

  const { device, location, dateTime } = deviceInfo;
  const progressPercent = Math.floor(loadProgress);
  const loadingBarWidth = `${progressPercent}%`;

  const accentGreen = "#00ff99";
  const hudBorder = `2px solid ${accentGreen}`;
  const hudBoxShadow = `0 0 8px ${accentGreen}`;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-[100] font-mono overflow-hidden"
      style={{ backgroundColor: "#011006ff" }}
      aria-live="polite"
      role="status"
    >
      <style>{`
        .blinking-cursor {
          display: inline-block;
          width: 8px;
          height: 12px;
          margin-left: 2px;
          background-color: ${accentGreen};
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        .world-time-row { display:flex; justify-content:space-between; font-size:12px; }
      `}</style>

      <div className="flex flex-col items-center justify-center -translate-y-12 px-4">
        {/* top HUD */}
        <div style={{ position: 'relative', paddingBottom: '8px' }}>
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 220,
              height: 30,
              border: hudBorder,
              backgroundImage: "repeating-linear-gradient(45deg, " + accentGreen + " 0, " + accentGreen + " 2px, transparent 2px, transparent 8px)",
              backgroundSize: "12px 12px",
              boxShadow: hudBoxShadow,
            }}
            aria-hidden="true"
          />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '8px', width: '2px', backgroundColor: accentGreen }} />
        </div>

        {/* main HUD row */}
        <div className="flex items-end gap-2 mt-5" style={{ marginTop: 20 }}>
          {/* left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                width: 80,
                height: 80,
                border: hudBorder,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: hudBoxShadow,
                position: "relative",
              }}
              aria-hidden="true"
            >
              <div style={{ width: 50, height: 50, border: `1px solid ${accentGreen}`, borderRadius: "50%" }} />
              <motion.span 
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: "absolute",
                  color: accentGreen,
                  fontSize: 24,
                  fontWeight: "bold",
                  textShadow: `0 0 10px ${accentGreen}`,
                }}
              >
                {progressPercent}%
              </motion.span>
            </motion.div>
            <div style={{ height: 8, width: 2, backgroundColor: accentGreen }} />
            <div style={{ border: hudBorder, width: 100, height: 30, boxShadow: hudBoxShadow, marginTop: 2 }} />
          </div>

          {/* center */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: hudBorder,
            padding: "8px 16px 12px",
            minWidth: 360,
            boxShadow: hudBoxShadow,
            position: "relative",
            color: accentGreen,
            fontSize: 12,
          }}>
            <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderTop: hudBorder, borderRight: hudBorder }} />
            <div style={{ position: "absolute", bottom: -2, left: -2, width: 10, height: 10, borderBottom: hudBorder, borderLeft: hudBorder }} />

            <motion.div animate={{ y: [0, 60, 0] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ position: "absolute", left: 0, right: 0, height: 2, backgroundColor: accentGreen, boxShadow: `0 0 10px ${accentGreen}`, opacity: 0.5 }} />

            <div style={{ marginBottom: 8, position: "relative", zIndex: 10 }}>
              <div className="flex justify-between mb-2">
                <span>SYSTEM TIME/DATE:</span>
                <span style={{ color: accentGreen, fontWeight: 'bold' }}>{dateTime}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>DEVICE TYPE:</span>
                <span style={{ color: accentGreen, fontWeight: 'bold' }}>{device}</span>
              </div>
              <div className="flex justify-between">
                <span>COORDINATES:</span>
                <span style={{ color: accentGreen, fontWeight: 'bold' }}>{location}</span>
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: accentGreen, margin: "4px 0 8px", opacity: 0.5 }} />

            <div style={{ position: "relative", zIndex: 10 }}>
              <div style={{ position: "absolute", top: -10, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: accentGreen }} />
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flexGrow: 1, height: 8, border: `1px solid ${accentGreen}`, position: "relative" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: loadingBarWidth }} transition={{ duration: 0.1, ease: "linear" }} style={{ height: "100%", backgroundColor: accentGreen, boxShadow: `0 0 5px ${accentGreen}` }} />
                </div>

                <span style={{ fontSize: 14, fontWeight: "bold" }}>{progressPercent}%</span>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, textAlign: "center" }}>
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                SYSTEM BOOT UP SEQUENCE ACTIVE...
              </motion.span>
            </div>
          </div>

          {/* right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ width: 80, height: 80, border: hudBorder, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hudBoxShadow, backgroundColor: 'rgba(0, 255, 153, 0.05)' }}>
              <span style={{ color: accentGreen, fontSize: 36, fontWeight: "bold", textShadow: `0 0 10px ${accentGreen}` }}>$</span>
            </motion.div>
          </div>
        </div>

        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ marginTop: 16, border: hudBorder, width: 420, height: "auto", minHeight: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: accentGreen, fontSize: 12, boxShadow: hudBoxShadow, padding: 8 }}>
          <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: "monospace", fontSize: 13 }}>{initText}</div>
            {progressPercent < 100 && <span className="blinking-cursor" aria-hidden="true"></span>}
          </div>

          <div style={{ width: "100%", marginTop: 6 }}>
            <div style={{ textAlign: "center", marginBottom: 6, fontSize: 12 }}>🌐 GLOBAL TIME (AM/PM)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, width: "100%" }}>
              {worldTimes.map((c) => (
                <div key={c.name} className="world-time-row" style={{ color: accentGreen }}>
                  <span style={{ textAlign: "left" }}>{c.name}</span>
                  <span style={{ textAlign: "right" }}>{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TypeAnimation = ({ sequence, speed = 60, repeat = 0, className, wrapper = "span" }) => {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(true);
  
  const sequenceRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timerRef = useRef(null);
  const totalRepeatsRef = useRef(0);

  const startTyping = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (repeat !== Infinity && totalRepeatsRef.current > repeat && sequenceRef.current === 0) {
      setCursor(false);
      return;
    }

    const currentStep = sequence[sequenceRef.current];

    if (typeof currentStep === 'number') {
      setCursor(false);
      timerRef.current = setTimeout(() => {
        setCursor(true);
        sequenceRef.current = (sequenceRef.current + 1) % sequence.length;
        if (sequenceRef.current === 0) totalRepeatsRef.current += 1;
        startTyping();
      }, currentStep);
      return;
    }

    if (typeof currentStep === 'string') {
      const fullText = currentStep;
      
      if (!isDeletingRef.current) {
        if (charIndexRef.current < fullText.length) {
          setText(fullText.substring(0, charIndexRef.current + 1));
          charIndexRef.current++;
          timerRef.current = setTimeout(startTyping, speed);
        } else {
          isDeletingRef.current = true;
          timerRef.current = setTimeout(startTyping, 1000);
        }
      } else {
        if (charIndexRef.current > 0) {
          setText(fullText.substring(0, charIndexRef.current - 1));
          charIndexRef.current--;
          timerRef.current = setTimeout(startTyping, speed / 2);
        } else {
          isDeletingRef.current = false;
          sequenceRef.current = (sequenceRef.current + 1) % sequence.length;
          if (sequenceRef.current === 0) totalRepeatsRef.current += 1;
          
          timerRef.current = setTimeout(startTyping, 100);
        }
      }
      return;
    }
    
    sequenceRef.current = (sequenceRef.current + 1) % sequence.length;
    if (sequenceRef.current === 0) totalRepeatsRef.current += 1;
    startTyping();
  };

  useEffect(() => {
    startTyping();
    return () => clearTimeout(timerRef.current);
  }, [sequence, speed, repeat]);

  const WrapperComponent = motion[wrapper] || motion.span;

  return (
    <WrapperComponent className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {text}
      <span 
        className="blinking-cursor" 
        style={{ 
          opacity: cursor ? 1 : 0
        }} 
        aria-hidden="true" 
      />
    </WrapperComponent>
  );
};

function ContactForm() {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      await emailjs.sendForm(
        "service_ax1p5i3",    
        "template_e256uwb",   
                form.current,
        "QDLxZEbqmEEezRLh3"    
      );
      setStatus("✅ Message sent successfully!");
      form.current.reset();
    } catch (error) {
      console.error("Email send failed:", error);
      setStatus("❌ Failed to send message. Try again later.");
    } finally {
      setSending(false);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  return (
    <form
      ref={form}
      onSubmit={sendEmail}
      className="space-y-3 max-w-md mx-auto p-3 rounded-lg shadow-lg transition-all"
      style={{
        backgroundColor: "#00191f",
        border: "1px solid #043036",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.05)",
      }}
    >
      <h2
        className="text-[12px] font-semibold mb-2 text-center"
        style={{ color: "var(--color-accent-green)" }}
      >
        Contact Me
      </h2>

      <div>
        <label
          className="text-[9px] block mb-1 font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Name
        </label>
        <input
          type="text"
          name="from_name"
          required
          className="w-full p-2 rounded text-[10px] transition-all focus:outline-none"
          style={{
            backgroundColor: "#02161a",
            border: "1px solid #06424a",
            color: "var(--color-text-main)",
          }}
        />
      </div>

      <div>
        <label
          className="text-[9px] block mb-1 font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Email
        </label>
        <input
          type="email"
          name="reply_to"
          required
          className="w-full p-2 rounded text-[10px] transition-all focus:outline-none"
          style={{
            backgroundColor: "#02161a",
            border: "1px solid #06424a",
            color: "var(--color-text-main)",
          }}
        />
      </div>

      <div>
        <label
          className="text-[9px] block mb-1 font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Message
        </label>
        <textarea
          name="message"
          rows={4}
          required
          className="w-full p-2 rounded text-[10px] resize-none transition-all focus:outline-none"
          style={{
            backgroundColor: "#02161a",
            border: "1px solid #06424a",
            color: "var(--color-text-main)",
          }}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full p-2 rounded text-[10px] font-medium transition-all"
        style={{
          backgroundColor: sending ? "#032d33" : "#02414a",
          border: "1px solid #05565d",
          color: "var(--color-text-main)",
          opacity: sending ? 0.6 : 1,
        }}
      >
        {sending ? "Sending..." : "Send Message"}
      </button>

      {status && (
        <div
          className="text-[9px] text-center mt-2 transition-all"
          style={{ color: "var(--color-accent-green)" }}
        >
          {status}
        </div>
      )}
    </form>
  );
}

const globalStyles = `
  :root {
    --color-bg-primary: #02040a;
    --color-bg-secondary: #031220;
    --color-bg-card: #071a2b;
    --color-bg-input: #001219;
    --color-border: #102030;
    --color-border-sub: #08303b;
    --color-text-main: #c9f3ff;
    --color-text-secondary: #8fdbe6;
    --color-accent-blue: #5af;
    --color-accent-green: #0f0;
    --color-accent-red: #f55;
  }

  .hacker-neon {
    --color-bg-primary: #000000;
    --color-bg-secondary: #0a0a0a;
    --color-bg-card: #151515;
    --color-bg-input: #0a1a0a;
    --color-border: #00ff66;
    --color-border-sub: #009933;
    --color-text-main: #00ff66;
    --color-text-secondary: #00aa33;
    --color-accent-blue: #00ff66;
    --color-accent-green: #00ff66;
    --color-accent-red: #ff0000;
    text-shadow: 0 0 1px var(--color-text-main);
  }
  .hacker-neon .bg-neon-accent {
    background-color: var(--color-accent-green) !important;
    color: #000 !important;
    text-shadow: none !important;
    font-weight: bold;
  }
  .hacker-neon .bg-neon-accent-alt {
    background-color: var(--color-border-sub) !important;
    box-shadow: 0 0 5px var(--color-border) inset, 0 0 5px var(--color-border);
  }
  .hacker-neon .hover-neon:hover {
    box-shadow: 0 0 5px var(--color-border);
    transition: box-shadow 0.2s ease-in-out;
  }

  @keyframes blink {
    from, to { border-color: transparent; }
    50% { border-color: var(--color-text-main); }
  }
  .blinking-cursor {
    display: inline-block;
    width: 6px;
    height: 30px;
    background-color: transparent;
    border-right: 2px solid var(--color-text-main);
    animation: blink 1s step-end infinite;
    margin-left: 6px;
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    .header, .content-grid { flex-direction: column; align-items: flex-start; }
    .right-column { width: 100% !important; margin-top: 1rem; }
    h1 { font-size: 1.5rem !important; }
    .text-sm { font-size: 0.75rem !important; }
    .text-lg { font-size: 0.875rem !important; }

    body { overflow-x: hidden; }
    .sidebar { 
      position: fixed; 
      top: 0; 
      left: -100%; 
      width: 100%; 
      height: 300vh; 
      z-index: 50; 
      transition: left 0.3s ease-in-out; 
      overflow-y: auto; 
    }
    .sidebar.open { left: 0; }
    .overlay { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 300vh; 
      background: rgba(0,0,0,0.5); 
      z-index: 40; 
      opacity: 0; 
      visibility: hidden; 
      transition: opacity 0.3s ease-in-out; 
    }
    .overlay.open { opacity: 1; visibility: visible; }
    .hamburger { display: block; z-index: 60; }
    nav button { padding: 0.5rem 0.75rem !important; font-size: 0.75rem !important; }
    main { width: 100%; padding: 1rem !important; }
    .header { flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
    .content-grid { flex-direction: column !important; height: auto !important; }
    .content-grid { min-height: 0 !important; }
    .content-grid > div { width: 100% !important; }
    iframe { height: 400px !important; }
  }

  @media (min-width: 769px) {
    .hamburger { display: none; }
    .sidebar { position: relative !important; left: 0 !important; }
  }

  @media (max-width: 400px) {
    h1 { font-size: 1.2rem !important; }
    nav button span { display: none; }
  }
`;

export function HackerUIProfileInner() {
  const [activePane, setActivePane] = useState("terminal");
  const [terminalLines, setTerminalLines] = useState([
    "Welcome to A9Pro's portfolio — interface",
    "Type 'help' for commands.",
  ]);
  const [cmd, setCmd] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hobbiesVisible, setHobbiesVisible] = useState(false);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);
  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const { initializeApp, getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, getFirestore, onSnapshot, collection, query, limit, setLogLevel, isMock } = getFirebaseFunctions();
  
  const initialProjects = [
    { id: 1, title: "IkeOluwa Grills and Chops (WebApp)", desc: "A full-stack resturant platform built for a delivery-only kitchen. Customers can browse small chops, grilled meals and book event packages - all orders are sent via email to the admin", tags: ["Next,js", "React", "TailwindCSS"], url: "https://ikeoluwa-grillz-az.vercel.app/", preview: "/projects/ikeoluwa-grills" },
    { id: 2, title: "Aso - Oke  (WebApp)", desc: "", tags: ["Next,js", "React", "TailwindCSS"], url: "https://aso-oke.vercel.app/", preview: "/projects/aso-oke" },
    { id: 3, title: "Kush High (WebApp)", desc: "A Nigeria webapp for smoke accessories", tags: ["Next,js", "React", "TailwindCSS"], url: "https://kush-high.vercel.app/", preview: "/projects/kush-high" },
    { id: 4, title: "Essentials by Derin (WebApp)", desc: "A full-stack platform built for fashion accesories", tags: ["Next,js", "React", "TailwindCSS"], url: "https://esderin.vercel.app/", preview: "/projects/esderin" },
    { id: 5, title: "HerPick (Mobile APP)", desc: "A Mobile application that helps user discover, save and manage their favorite items effortlessly. Built with React Native Expo and TypeScript, featuring smooth navigation and elegant UI design.", tags: ["React Native(Expo)", "TypeScript", "React Navighation", "Context API", "Android"], url: "https://github.com/A9Pro/HerPick", preview:"/projects/herpick" },
    { id: 6, title: "Sniper Bot (MT5)", desc: "High-frequency sniper logic integrated with MT5. Python backend.", tags: ["Trading", "Python", "MT5"], url: "#" },
  ];
  const [projects, setProjects] = useState(initialProjects);

  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const [hobbies] = useState([
    { id: 1, emoji: "💹", title: "Trading", desc: "Sniper XAU/USD & BTC scalper" },
    { id: 2, emoji: "💻", title: "Coding", desc: "Building bots & web apps" },
    { id: 3, emoji: "🎮", title: "Gaming", desc: "GTA & PUBG enthusiast" },
    { id: 4, emoji: "🎨", title: "Design", desc: "UI/UX & visual narratives" },
    { id: 5, emoji: "🎭", title: "Writing", desc: "Scripts & digital tales" },
    { id: 6, emoji: "🎧", title: "Music", desc: "Olamide, Eminem, B.I.G, Rick Ro$$,50CENT, Reminisce, Seyi Vibez, Lil Wayne, Afro vibes on repeat" },
    { id: 7, emoji: "🚗", title: "Cars", desc: "AMG, Supra, BMW lover, Street Racer Performance Racing" },
    { id: 8, emoji: "✈️", title: "Travel", desc: "Exploring new cultures" },
  ]);

  const [editorCode, setEditorCode] = useState(`<!doctype html>
<html>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <title>Live Preview</title>
    <style>body{font-family:system-ui;background:#071021;color:#0f0;padding:20px}h1{color:#0f0}p{color:#0f0}</style>
  </head>
  <body>
    <h1>Hello — live preview from the A9 UI</h1>
    <p>Edit HTML here and press Run to update the preview.</p>
  </body>
</html>`);
  const previewRef = useRef(null);
  
  useEffect(() => {
    document.documentElement.classList.add("hacker-neon");
    setTimeout(() => setHobbiesVisible(true), 500);
  }, []);

  useEffect(() => {
    try {
      if (isMock) { 
        console.warn("Firebase SDK not fully loaded. Running in Mock Data Mode.");
        setProjects(initialProjects);
        setIsAuthReady(true);
        return;
      }
      
      setLogLevel('debug');
      
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      
      setDb(firestore);
      setAuth(authInstance);

      const authenticate = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(authInstance, __initial_auth_token);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          await signInAnonymously(authInstance);
        }
      };

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        const currentUserId = user ? user.uid : crypto.randomUUID();
        setUserId(currentUserId);
        setIsAuthReady(true);
      });
      
      authenticate();
      return () => unsubscribe();

    } catch (e) {
      console.error("Firebase setup failed:", e);
      setProjects(initialProjects);
      setIsAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (!db || !isAuthReady || isMock) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const projectsCollectionPath = `artifacts/${appId}/public/data/projects`;
    
    try {
      if (typeof collection !== 'function' || typeof query !== 'function' || typeof limit !== 'function' || typeof onSnapshot !== 'function') {
          console.warn("Required Firestore functions not available globally, skipping real-time listener.");
          return;
      }
        
      const q = query(collection(db, projectsCollectionPath), limit(5));
      
    } catch (e) {
      console.error("Error setting up project listener:", e);
    }

  }, [db, isAuthReady, isMock]);

  const toggleTheme = () => {
    const isNeon = document.documentElement.classList.toggle("hacker-neon");
    return isNeon;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHobbyIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hobbies.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      
      if (!isMuted) {
        audioRef.current.play().catch(error => {
          console.log("Audio autoplay blocked:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  function appendTerminal(text) {
    setTerminalLines((t) => [...t, text]);
    setTimeout(() => {
      const el = document.getElementById("terminal-output");
      if (el) el.scrollTop = el.scrollHeight;
    }, 30);
  }

  function runCommand() {
    const raw = cmd.trim();
    if (!raw) return;
    appendTerminal(`> ${raw}`);
    handleCmd(raw.toLowerCase());
    setCmd("");
  }

  function handleCmd(c) {
    if (c === "help") {
      appendTerminal("help — show commands");
      appendTerminal("projects — list projects");
      appendTerminal("whoami — short bio");
      appendTerminal("contact — contact info");
      appendTerminal("theme — toggle look (CLI)");
      appendTerminal("clear — clear terminal");
      return;
    }
    if (c === "projects") {
      projects.forEach((p) => appendTerminal(`${p.id}. ${p.title} — ${p.desc}`));
      if (projects.length === 0) appendTerminal("No projects loaded.");
      return;
    }
    if (c === "whoami") {
      appendTerminal("Adejare Talabi — coder, trader, creator. Lagos-based. Loves games & trading bots.");
      if (userId) appendTerminal(`UserID: ${userId}`);
      return;
    }
    if (c === "contact") {
      appendTerminal("Email: adejaretalabi101@gmail.com");
      appendTerminal("Telegram: 969657262");
      appendTerminal("X: a9pro.dev");
      appendTerminal("Instagram: a9pro.dev");
      appendTerminal("Discord: a9_pro101");
      appendTerminal("SnapChat: hicethugg");
      appendTerminal("Github: github.com/A9Pro");
      return;
    }
    if (c === "clear") {
      setTerminalLines([]);
      return;
    }
    if (c === "theme") {
      const isNeon = toggleTheme();
      appendTerminal(`Theme toggled! Current theme: ${isNeon ? "hacker-neon" : "default"}`);
      return;
    }
    appendTerminal(`Command not found: ${c} — type 'help'`);
  }

  const toggleSound = () => {
    setIsMuted(prev => !prev);
    appendTerminal(isMuted ? "Sound enabled" : "Sound muted");
  };

  function runPreview() {
    const blob = new Blob([editorCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    if (previewRef.current) previewRef.current.src = url;
  }
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") runCommand();
  };
  
  useEffect(() => {
    runPreview();
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const SWIPE_THRESHOLD = 50;
    
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      setCurrentHobbyIndex((prevIndex) => (prevIndex - 1 + hobbies.length) % hobbies.length);
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      setCurrentHobbyIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }
    touchDeltaX.current = 0;
  };
  return (
    <>
      <MotionConfig transition={{ duration: 0.18 }}>
        <style>{globalStyles}</style>
        <div className="min-h-screen w-full" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-main)" }}>
          <div className="flex min-h-screen flex-col md:flex-row">
            <aside
              className={`sidebar ${sidebarOpen ? "open" : ""}`}
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
                background: "linear-gradient(180deg, var(--color-bg-secondary) 0%, #041426 50%, #021018 100%)",
                width: "16rem",
                borderRight: "1px solid var(--color-border)",
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column"
              }}
              aria-hidden={sidebarOpen ? "false" : "true"}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ background: "linear-gradient(45deg, var(--color-accent-blue), var(--color-accent-green))", color: "var(--color-bg-primary)" }}
                >
                  AT
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold truncate">Adejare Talabi</h2>
                  <p className="text-[9px] truncate" style={{ color: "var(--color-text-secondary)" }}>
                    Coder • Trader • Game dev
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-0.5 text-xs mb-3" aria-label="Main navigation">
                {[
                  { name: "terminal", icon: Terminal, text: "Terminal" },
                  { name: "explorer", icon: Folder, text: "Explorer" },
                  { name: "projects", icon: Code, text: "Projects" },
                  { name: "editor", icon: FileText, text: "Live Editor" },
                  { name: "contact", icon: Mail, text: "Contact" },
                ].map(({ name, icon: Icon, text }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setActivePane(name);
                      if (window.innerWidth < 769) setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors duration-100 ${
                      activePane === name ? "bg-neon-accent-alt" : "hover:bg-[#04111a]"
                    }`}
                    style={{ color: activePane === name ? "var(--color-accent-green)" : "var(--color-text-main)" }}
                    aria-pressed={activePane === name}
                  >
                    <Icon size={13} style={{ color: activePane === name ? "var(--color-accent-green)" : "var(--color-text-secondary)" }} />
                    <span>{text}</span>
                  </button>
                ))}
              </nav>

              <div className="text-[9px]" style={{ color: "var(--color-text-secondary)" }}>
                <div className="mb-1.5 font-medium" style={{ color: "var(--color-text-main)" }}>
                  Status
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="p-1 rounded text-center" style={{ backgroundColor: "#021218", borderColor: "var(--color-border-sub)", border: "1px solid" }}>
                    Node: <span style={{ color: "var(--color-accent-green)" }}>v20.11</span>
                  </div>
                  <div className="p-1 rounded text-center" style={{ backgroundColor: "#021218", borderColor: "var(--color-border-sub)", border: "1px solid" }}>
                    Python: <span style={{ color: "var(--color-accent-green)" }}>3.11</span>
                  </div>
                  <div className="p-1 rounded text-center" style={{ backgroundColor: "#021218", borderColor: "var(--color-border-sub)", border: "1px solid" }}>
                    MT5: <span style={{ color: "var(--color-accent-green)" }}>Connected</span>
                  </div>
                  <div className="p-1 rounded text-center" style={{ backgroundColor: "#021218", borderColor: "var(--color-border-sub)", border: "1px solid" }}>
                    Discord: <span style={{ color: "var(--color-accent-green)" }}>a9_pro101</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2" style={{ borderTop: "1px solid var(--color-border-sub)" }}>
                <div className="text-[9px] mb-1" style={{ color: "var(--color-text-main)" }}>
                  Contact
                </div>
                <div className="text-[9px] mb-1.5 truncate" style={{ color: "var(--color-text-secondary)" }}>
                  adejaretalabi101@gmail.com
                </div>
                <div className="flex gap-1.5">
                  <a className="p-1 rounded hover-neon" style={{ backgroundColor: "#021218", border: "1px solid var(--color-border-sub)" }} href="https://github.com/A9Pro" target="_blank" rel="noopener noreferrer">
                    <Github size={13} style={{ color: "var(--color-text-main)" }} />
                  </a>
                  <a className="p-1 rounded hover-neon" style={{ backgroundColor: "#021218", border: "1px solid var(--color-border-sub)" }} href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={13} style={{ color: "var(--color-text-main)" }} />
                  </a>
                </div>
              </div>
            </aside>

            <main className="flex-1 flex flex-col p-4 overflow-y-auto">
              <button
                className="hamburger md:hidden mb-3 p-2 rounded"
                onClick={() => setSidebarOpen((s) => !s)}
                aria-label="Toggle menu"
                style={{ border: "1px solid var(--color-border-sub)", color: "var(--color-text-main)" }}
              >
                ☰
              </button>

              <div 
                className={`overlay ${sidebarOpen ? "open" : ""}`} 
                onClick={() => setSidebarOpen(false)} 
                aria-hidden={!sidebarOpen} 
              />

              <div className="rounded-lg p-3 h-full" style={{ background: "linear-gradient(180deg, #02111a 0%, #041422 100%)", border: "1px solid var(--color-border-sub)" }}>
                <div className="flex items-start justify-between mb-3 header">
                  <div>
                    <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-green-300" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                      &lt;A9Pro /&gt;
                    </motion.h1>

                    <TypeAnimation
                      sequence={[
                        "Full-Stack Developer...",
                        1500,
                        "Crypto Trader...",
                        1500,
                        "Tech Innovator...",
                        1500,
                        "Welcome to My Digital Space 🚀",
                        2000,
                      ]}
                      wrapper="span"
                      speed={40}
                      className="text-sm sm:text-base md:text-lg text-green-400"
                      repeat={Infinity}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTheme}
                      className="px-2 py-1 rounded text-[10px] flex items-center gap-1 hover-neon"
                      style={{ backgroundColor: "#00151a", border: "1px solid var(--color-border-sub)", color: "var(--color-text-main)" }}
                      aria-label="Toggle Theme"
                    >
                      <Zap size={10} style={{ color: "var(--color-accent-blue)" }}/> Theme
                    </button>
                    
                    <button
                      onClick={toggleSound}
                      className="px-2 py-1 rounded text-[10px] flex items-center gap-1 hover-neon"
                      style={{ backgroundColor: "#00151a", border: "1px solid var(--color-border-sub)", color: "var(--color-text-main)" }}
                      aria-label="Toggle Sound"
                      title={isMuted ? "Enable sound" : "Disable sound"}
                    >
                      {isMuted ? "🔇" : "🔊"}
                    </button>
                    
                    <span className="text-[9px]" style={{ color: "var(--color-text-secondary)" }}>
                      Session: <span className="font-medium" style={{ color: "var(--color-accent-green)" }}>Dev</span>
                    </span>
                    <span className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: "#00151a", border: "1px solid #07303b", color: "var(--color-accent-green)" }}>
                      Live
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-1 min-h-0 content-grid">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-2.5" style={{ backgroundColor: "#031926", border: "1px solid var(--color-border-sub)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-xs font-semibold" style={{ color: "var(--color-accent-green)" }}>Projects</h3>
                            <p className="text-[9px]" style={{ color: "var(--color-text-secondary)"}}>
                              {isMock ? "Loaded from Mock Data" : (projects.length > 0 ? "Loaded from Store" : "Loading projects...")}
                            </p>
                          </div>
                          <span className="text-[9px]" style={{ color: "var(--color-accent-blue)" }}>{projects.length} items</span>
                        </div>
                        <div className="space-y-1.5">
                          {projects.length === 0 ? (
                             <div className="text-[10px] text-center py-2" style={{ color: "var(--color-text-secondary)" }}>
                              Attempting to load data...
                             </div>
                          ) : (
                            projects.map((p) => (
                              <div key={p.id} className="p-1.5 rounded" style={{ backgroundColor: "#021e25", border: "1px solid #06363f" }}>
                                <div className="font-medium text-[10px]">{p.title}</div>
                                <div className="text-[9px]" style={{ color: "var(--color-text-secondary)" }}>{p.desc}</div>
                                <div className="text-[9px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{p.tags ? p.tags.join(", ") : ''}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-2.5" style={{ backgroundColor: "#031926", border: "1px solid var(--color-border-sub)" }}>
                        <h3 className="text-xs font-semibold" style={{ color: "var(--color-accent-blue)" }}>Live Editor</h3>
                        <p className="text-[9px] mb-2" style={{ color: "var(--color-text-secondary)" }}>Quick HTML/CSS preview</p>

                        <div className="flex gap-1.5 mb-2">
                          <button onClick={() => { setActivePane("editor"); if (window.innerWidth < 1500) setSidebarOpen(false); }} className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: "#02222a", border: "1px solid #06404b" }}>
                            Open Editor
                          </button>
                          <button onClick={runPreview} className="px-2 py-1 rounded text-[10px]" style={{ border: "1px solid var(--color-accent-green)", backgroundColor: "#023332", color: "var(--color-text-main)" }}>
                            Run
                          </button>
                        </div>

                        <div className="text-[9px]" style={{ color: "var(--color-text-secondary)" }}>Preview in sandboxed iframe. Great for demos, micro-sites.</div>
                      </motion.div>
                    </div>

                    <div className="flex-1 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border-sub)" }}>
                      {activePane === "terminal" && (
                        <div className="p-2.5 h-full flex flex-col" style={{ backgroundColor: "var(--color-bg-input)" }}>
                          <div id="terminal-output" className="flex-1 overflow-auto font-mono text-[10px]" style={{ color: "var(--color-text-main)" }}>
                            {terminalLines.map((l, i) => (
                              <div key={i} className="py-0.5">{l}</div>
                            ))}
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-mono text-[10px]">$</span>
                            <input
                              value={cmd}
                              onChange={(e) => setCmd(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="flex-1 bg-transparent outline-none px-1 py-0.5 font-mono text-[10px]"
                              style={{ borderBottom: "1px solid var(--color-border-sub)" }}
                              autoFocus
                              aria-label="Terminal command input"
                            />
                            <span className="blinking-cursor" aria-hidden="true" />
                            <button onClick={runCommand} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: "#02414a", border: "1px solid #05565d", color: "var(--color-text-main)" }}>
                              Run
                            </button>
                          </div>
                        </div>
                      )}

                      {activePane === "explorer" && (
                        <div className="p-2.5 h-full overflow-auto" style={{ backgroundColor: "var(--color-bg-input)" }}>
                          <div className="space-y-1.5">
                            {[
                              { text: "src/", icon: Folder },
                              { text: "package.json", icon: FileText },
                              { text: "README.md", icon: Code },
                            ].map(({ text, icon: Icon }) => (
                              <div key={text} className="flex items-center gap-2 p-1.5 rounded" style={{ backgroundColor: "#01161a", border: "1px solid #053038" }}>
                                <Icon size={13} style={{ color: "var(--color-text-secondary)" }} />
                                <span className="text-[10px]">{text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePane === "projects" && (
                        <div className="p-2.5 h-full overflow-auto" style={{ backgroundColor: "var(--color-bg-input)" }}>
                          <div className="space-y-1.5">
                            {projects.map((p) => (
                              <div key={p.id} className="p-2 rounded" style={{ backgroundColor: "#011a23", border: "1px solid #05424a" }}>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-xs">{p.title}</div>
                                    <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>{p.desc}</div>
                                  </div>
                                  <a className="text-[9px] px-1.5 py-0.5 rounded ml-2" href={p.url} style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>
                                    Open
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePane === "editor" && (
                        <div className="p-2.5 h-full flex flex-col" style={{ backgroundColor: "var(--color-bg-input)" }}>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <textarea value={editorCode} onChange={(e) => setEditorCode(e.target.value)} className="w-full h-full p-2 rounded text-[10px] font-mono border resize-none" style={{ backgroundColor: "#02161a", borderColor: "#06424a", color: "var(--color-text-main)" }} />
                            <div className="h-full rounded border overflow-hidden" style={{ borderColor: "#06424a" }}>
                              <iframe title="preview" ref={previewRef} sandbox="allow-scripts allow-forms" className="w-full h-full bg-white" />
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            <button onClick={runPreview} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: "#02414a", border: "1px solid #05565d", color: "var(--color-text-main)" }}>
                              Run
                            </button>
                            <button 
                              onClick={() => {
                                try {
                                  const tempElement = document.createElement('textarea');
                                  tempElement.value = editorCode;
                                  document.body.appendChild(tempElement);
                                  tempElement.select();
                                  document.execCommand('copy');
                                  document.body.removeChild(tempElement);
                                  appendTerminal("Code copied to clipboard");
                                } catch (err) {
                                  appendTerminal("Failed to copy code");
                                }
                              }} 
                              className="px-2 py-0.5 rounded text-[10px]" 
                              style={{ border: "1px solid #05565d", color: "var(--color-text-main)" }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}

                      {activePane === "contact" && (
                        <div className="p-2.5 h-full overflow-auto" style={{ backgroundColor: "var(--color-bg-input)" }}>
                          <ContactForm />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-48 right-column flex flex-col gap-2">
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: "#02151a", border: "1px solid var(--color-border-sub)" }}>
                      <h4 className="text-[10px] font-semibold" style={{ color: "var(--color-accent-red)" }}>Profile</h4>
                      <p className="text-[9px] mb-2" style={{ color: "var(--color-text-secondary)" }}>Lagos • Maker • Trader • Gamer • Dev</p>
                      <div className="text-[9px] mb-1" style={{ color: "var(--color-accent-green)" }}>Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {["React", "Python", "MT5", "Unity"].map((skill) => (
                          <span key={skill} className="px-1.5 py-0.5 text-[9px] rounded" style={{ backgroundColor: "#001a1f", border: "1px solid #05424a" }}>{skill}</span>
                        ))}
                      </div>

                      <div className="text-[9px] mb-1 mt-3" style={{ color: "var(--color-accent-green)" }}>Hobbies</div>
                      <div 
                        className="relative h-[80px] overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {hobbies.map((hobby, index) => (
                          <div
                            key={hobby.id}
                            className="p-1.5 rounded absolute inset-0"
                            style={{
                              backgroundColor: "#001a1f",
                              border: "1px solid #05424a",
                              opacity: hobbiesVisible && index === currentHobbyIndex ? 1 : 0,
                              transform: index === currentHobbyIndex ? "translateX(0)" : (
                                  index < currentHobbyIndex ? "translateX(-100%)" : "translateX(100%)"
                              ),
                              transition: "opacity 0.5s, transform 0.5s"
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xl">{hobby.emoji}</span>
                              <span className="text-[10px] font-medium" style={{ color: "#FFFF00" }}>{hobby.title}</span>
                            </div>
                            <p className="text-[9px] mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
                              {hobby.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 pt-2" style={{ borderTop: "1px solid #05303a" }}>
                        <div className="text-[9px] mb-1" style={{ color: "var(--color-text-main)" }}>Quick contact</div>
                        <a href="mailto:adejaretalabi101@gmail.com" className="w-full text-[9px] rounded p-1 flex items-center justify-center gap-1" style={{ backgroundColor: "#022226", border: "1px solid #05424a", color: "var(--color-text-main)" }}>
                          <Mail size={11} style={{ color: "var(--color-accent-green)" }} /> Mail
                        </a>
                      </div>
                    </div>

                    <div className="rounded-lg p-2.5" style={{ backgroundColor: "#011b22", border: "1px solid #06313a" }}>
                      <h4 className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-text-main)" }}>Quick Links</h4>
                      <div className="space-y-1">
                        <a className="block text-[10px] p-1 rounded text-center" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Resume</a>
                        <a className="block text-[10px] p-1 rounded text-center" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Portfolio ZIP</a>
                      </div>
                    </div>

                    <div className="rounded-lg p-2.5" style={{ backgroundColor: "#011b22", border: "1px solid #06313a" }}>
                      <h4 className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-text-main)" }}>Contacts</h4>
                      <div className="space-y-1">
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Email: adejaretalabi101@gmail.com</a>
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Telegram: 969657262</a>
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>X: a9pro.dev</a>
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Instagram: a9pro.dev</a>
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundColor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Discord: a9_pro101</a>
                        <a className="block text-[10px] p-1 rounded text-left" href="#" style={{ backgroundcolor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>SnapChat: hicethugg</a>
                        <a className="block text-[10px] p-1 roinded text-left" href="#" style={{ backgroundcolor: "#02242d", border: "1px solid #05424a", color: "var(--color-text-main)" }}>Github: github.com/A9Pro</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="px-3 py-2 text-[9px] flex items-center justify-between" style={{ borderTop: "1px solid #0b2b36", color: "var(--color-text-secondary)" }}>
                <span>Made with <span style={{ color: "var(--color-accent-red)" }}>♥</span> — <span style={{ color: "var(--color-accent-green)" }}>Hacker UI</span> • <span style={{ color: "var(--color-accent-blue)" }}>2025</span></span>
                <span style={{ color: "var(--color-accent-green)" }}>Version 1.2</span>
              </footer>
            </main>
          </div>
        </div>
      </MotionConfig>
      
      <audio ref={audioRef} loop preload="auto">
        <source src="/ambient-cyber.mp3" type="audio/mpeg" />
        Your browser does not support audio.
      </audio>
    </>
  );
}

const App = () => {
  const [bootDone, setBootDone] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const wasBootShown = sessionStorage.getItem("bootDone");
    if (wasBootShown === "true") {
      setBootDone(true);
    }
  }, []);

  useEffect(() => {

    const { getAuth, onAuthStateChanged } = getFirebaseFunctions();
    let unsub = null;
    let readyTimeout = null;
    let marked = false;

    const markReady = () => {
      if (!marked) {
        marked = true;
        setFirebaseReady(true);
      }
    };

    try {

      readyTimeout = setTimeout(markReady, 3000);

      if (typeof onAuthStateChanged === "function") {
        const fakeAuth = getAuth();
        unsub = onAuthStateChanged(fakeAuth, (user) => markReady());
      }
    } catch {
      readyTimeout = setTimeout(markReady, 3000);
    }

    return () => {
      if (unsub) unsub();
      if (readyTimeout) clearTimeout(readyTimeout);
    };
  }, []);

  const handleBootComplete = () => {
    setBootDone(true);
    try { sessionStorage.setItem("bootDone", "true"); } catch(e) {}
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {!bootDone ? (
          <WelcomeLoader
            key="bootloader"
            onComplete={handleBootComplete}
            minMs={4000}
            audioSrc="/startup.mp3"
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="main-wrapper"
          >
            <HackerUIProfileInner />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export default App;