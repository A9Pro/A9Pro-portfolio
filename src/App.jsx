import React, { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Terminal, Folder, Code, FileText, Mail, Github, Linkedin, Zap } from "lucide-react";

// The standard module imports below are commented out to prevent Rollup/Vite errors
// in environments where 'firebase' is not installed via npm but loaded via a global CDN.

// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, onSnapshot, collection, query, limit, setLogLevel } from 'firebase/firestore';

/**
 * Safely accesses the Firebase functions from the global scope, assuming they are
 * loaded via modular CDN scripts. If not found, returns safe dummy functions
 * to prevent runtime crashes.
 */
const getFirebaseFunctions = () => {
  // Check for the presence of the key modular functions in the global scope
  const isMock = !(
    typeof window.initializeApp === 'function' &&
    typeof window.getAuth === 'function' &&
    typeof window.getFirestore === 'function'
  );

  if (isMock) {
    // Return console-safe dummy functions
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
      isMock: true // Flag to indicate mock mode
    };
  }

  // If they are available, return the global functions (assuming modular loading)
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
    isMock: false // Flag to indicate real mode
  };
};


/* ----- TypeAnimation Component (Custom Implementation) ----- */
/**
 * Simulates a typing and deleting animation based on a sequence array.
 */
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


/* ----- Contact Form Component ----- */
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Message sent! (Demo mode)");
    setTimeout(() => setStatus(""), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="text-[9px] block mb-1" style={{ color: "var(--color-text-secondary)" }}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-1.5 rounded text-[10px]"
          style={{ backgroundColor: "#02161a", border: "1px solid #06424a", color: "var(--color-text-main)" }}
          required
        />
      </div>
      <div>
        <label className="text-[9px] block mb-1" style={{ color: "var(--color-text-secondary)" }}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-1.5 rounded text-[10px]"
          style={{ backgroundColor: "#02161a", border: "1px solid #06424a", color: "var(--color-text-main)" }}
          required
        />
      </div>
      <div>
        <label className="text-[9px] block mb-1" style={{ color: "var(--color-text-secondary)" }}>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-1.5 rounded text-[10px] resize-none"
          style={{ backgroundColor: "#02161a", border: "1px solid #06424a", color: "var(--color-text-main)" }}
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-1.5 rounded text-[10px]"
        style={{ backgroundColor: "#02414a", border: "1px solid #05565d", color: "var(--color-text-main)" }}
      >
        Send Message
      </button>
      {status && <div className="text-[9px] text-center" style={{ color: "var(--color-accent-green)" }}>{status}</div>}
    </form>
  );
}

/* ----- Global styles (theming, cursor, responsive) ----- */
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
    height: 10px;
    background-color: transparent;
    border-right: 2px solid var(--color-text-main);
    animation: blink 1s step-end infinite;
    margin-left: 6px;
    transform: translateY(1px);
  }

  /* Mobile Responsive Styles */
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
      width: 80%; 
      height: 100vh; 
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
      height: 100vh; 
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
    .content-grid > div { width: 100% !important; }
    iframe { height: 200px !important; }
  }

  @media (min-width: 769px) {
    .hamburger { display: none; }
    .sidebar { position: relative !important; left: 0 !important; }
  }

  /* Ultra small devices */
  @media (max-width: 400px) {
    h1 { font-size: 1.2rem !important; }
    nav button span { display: none; }
  }
`;

export default function HackerUIProfile() {
  const [activePane, setActivePane] = useState("terminal");
  const [terminalLines, setTerminalLines] = useState([
    "Welcome to A9Pro's portfolio — interface",
    "Type 'help' for commands.",
  ]);
  const [cmd, setCmd] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hobbiesVisible, setHobbiesVisible] = useState(false);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);

  // --- Firebase State (Re-added) ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Get Firebase functions via the local helper for build compatibility
  const { initializeApp, getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, getFirestore, onSnapshot, collection, query, limit, setLogLevel, isMock } = getFirebaseFunctions();
  
  // --- Dynamic Projects State (Re-added structure) ---
  const initialProjects = [
    { id: 1, title: "Lagos Racer (Game)", desc: "Open-world street racer inspired by Lagos. Unity + WebGL demo.", tags: ["Game", "Unity", "WebGL"], url: "#" },
    { id: 2, title: "Sniper Bot (MT5)", desc: "High-frequency sniper logic integrated with MT5. Python backend.", tags: ["Trading", "Python", "MT5"], url: "#" },
    { id: 3, title: "Pixelfables4U (Stories)", desc: "AI story pipeline + TTS for YouTube. Channel tooling & automation.", tags: ["AI", "Youtube", "Automation"], url: "#" },
  ];
  const [projects, setProjects] = useState(initialProjects); // Default to mock data

  // --- Hobby Carousel Touch/Swipe State (Re-added) ---
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  // Use the updated hobby list from the user's input
  const [hobbies] = useState([
    { id: 1, emoji: "💹", title: "Trading", desc: "Sniper XAU/USD & BTC scalper" },
    { id: 2, emoji: "💻", title: "Coding", desc: "Building bots & web apps" },
    { id: 3, emoji: "🎮", title: "Gaming", desc: "GTA & PUBG enthusiast" },
    { id: 4, emoji: "🎨", title: "Design", desc: "UI/UX & visual narratives" },
    { id: 5, emoji: "🎭", title: "Writing", desc: "Scripts & digital tales" },
    { id: 6, emoji: "🎧", title: "Music", desc: "Olamide, Eminem, B.I.G, 50CENT, Reminisce, Seyi Vibez, Lil Wayne, Afro vibes on repeat" },
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
  
  // --- Initialization and Theme Setup ---
  useEffect(() => {
    document.documentElement.classList.add("hacker-neon");
    setTimeout(() => setHobbiesVisible(true), 500);
  }, []);

  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    try {
      if (isMock) { 
        console.warn("Firebase SDK not fully loaded. Running in Mock Data Mode.");
        setProjects(initialProjects);
        setIsAuthReady(true);
        return;
      }
      
      // If not in mock mode, these are safe to call
      setLogLevel('debug');
      
      // Replace with your actual Firebase config logic
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      
      setDb(firestore);
      setAuth(authInstance);

      const authenticate = async () => {
        try {
          // Replace with your actual auth token logic
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
      setProjects(initialProjects); // Use fallback data if Firebase fails
      setIsAuthReady(true);
    }
  }, []);

  // --- Project Data Listener (Firestore) ---
  useEffect(() => {
    if (!db || !isAuthReady || isMock) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const projectsCollectionPath = `artifacts/${appId}/public/data/projects`;
    
    try {
      // Ensure required Firestore functions are available (should be covered by isMock check, but added for safety)
      if (typeof collection !== 'function' || typeof query !== 'function' || typeof limit !== 'function' || typeof onSnapshot !== 'function') {
          console.warn("Required Firestore functions not available globally, skipping real-time listener.");
          return;
      }
        
      const q = query(collection(db, projectsCollectionPath), limit(5));
      
      // MOCKING REALTIME LISTENER: In a real app, you would use onSnapshot here.
      // Since we cannot rely on the Canvas environment having this collection,
      // we keep the mock data but show the connection status.
      
      // Example of where onSnapshot would go:
      /*
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(fetchedProjects);
      }, (error) => {
        console.error("Firestore error:", error);
      });
      return () => unsubscribe();
      */

      // --- MOCK DATA ASSIGNMENT FOR DEMO ---
      // setProjects(initialProjects); // Using initial state set earlier
      
    } catch (e) {
      console.error("Error setting up project listener:", e);
    }

  }, [db, isAuthReady, isMock]);

  // --- Theme Toggle Logic (Re-added) ---
  const toggleTheme = () => {
    const isNeon = document.documentElement.classList.toggle("hacker-neon");
    return isNeon;
  }

  // Hobby carousel effect (Re-added)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHobbyIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hobbies.length]);

  // --- Terminal Command Functions ---
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
      appendTerminal("X: cryptothugg101");
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
  // --- End Terminal Functions ---


  // --- Live Editor Functions ---
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
  // --- End Live Editor Functions ---


  // --- Hobby Carousel Swipe Handling (Re-added) ---
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
      // Swiped Right (Previous)
      setCurrentHobbyIndex((prevIndex) => (prevIndex - 1 + hobbies.length) % hobbies.length);
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      // Swiped Left (Next)
      setCurrentHobbyIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }
    // Reset delta
    touchDeltaX.current = 0;
  };
  // --- End Swipe Handling ---


  return (
    <MotionConfig transition={{ duration: 0.18 }}>
      <style>{globalStyles}</style>
      <div className="min-h-screen w-full" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-main)" }}>
        <div className="flex h-screen flex-col md:flex-row">
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
                  MT5: <span style={{ color: isMock ? "var(--color-accent-red)" : "var(--color-accent-green)" }}>{isMock ? "Mock" : "Connected"}</span>
                </div>
                <div className="p-1 rounded text-center" style={{ backgroundColor: "#021218", borderColor: "var(--color-border-sub)", border: "1px solid" }}>
                  Discord: <span style={{ color: isMock ? "var(--color-accent-red)" : "var(--color-accent-green)" }}>{isMock ? "a9_pro101" : "a9_pro101"}</span>
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

          <main className="flex-1 flex flex-col overflow-hidden p-4 overflow-y-auto">
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
                  {/* --- Theme Toggle Button (Re-added) --- */}
                  <button
                    onClick={toggleTheme}
                    className="px-2 py-1 rounded text-[10px] flex items-center gap-1 hover-neon"
                    style={{ backgroundColor: "#00151a", border: "1px solid var(--color-border-sub)", color: "var(--color-text-main)" }}
                    aria-label="Toggle Theme"
                  >
                    <Zap size={10} style={{ color: "var(--color-accent-blue)" }}/> Theme
                  </button>
                  {/* --- End Theme Toggle Button --- */}
                  
                  <span className="text-[9px]" style={{ color: "var(--color-text-secondary)" }}>
                    Session: <span className="font-medium" style={{ color: "var(--color-accent-green)" }}>Dev</span>
                  </span>
                  <span className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: "#00151a", border: "1px solid #07303b", color: "var(--color-accent-green)" }}>
                    Live
                  </span>
                </div>
              </div>

              <div className="flex gap-2 h-[calc(100%-60px)] content-grid">
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
                        <button onClick={() => { setActivePane("editor"); if (window.innerWidth < 769) setSidebarOpen(false); }} className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: "#02222a", border: "1px solid #06404b" }}>
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
                    {/* --- Swipeable Hobbies Carousel Container (Re-added) --- */}
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
                            // Transition logic for slide effect
                            transform: index === currentHobbyIndex ? "translateX(0)" : (
                                index < currentHobbyIndex ? "translateX(-100%)" : "translateX(100%)"
                            ),
                            transition: "opacity 0.5s, transform 0.5s"
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl">{hobby.emoji}</span>
                            {/* --- Hobby Title Styling (MODIFIED for Yellow) --- */}
                            <span className="text-[10px] font-medium" style={{ color: "#FFFF00" }}>{hobby.title}</span>
                            {/* --- End Hobby Title Styling --- */}
                          </div>
                          <p className="text-[9px] mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
                            {hobby.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* --- End Swipeable Hobbies Carousel Container --- */}

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
  );
}
