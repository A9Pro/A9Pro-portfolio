import React, { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Terminal, Folder, Code, FileText, Mail, Github, Linkedin } from "lucide-react";

// --- Global Styles for Theming and Cursors ---
const globalStyles = `
    /* Base/Default Theme (Dark Blue) */
    :root {
        --color-bg-primary: #02040a;
        --color-bg-secondary: #031220;
        --color-bg-card: #071a2b;
        --color-bg-input: #001219;
        --color-border: #102030;
        --color-border-sub: #08303b;
        --color-text-main: #c9f3ff; /* Light Cyan */
        --color-text-secondary: #8fdbe6; /* Muted Cyan */
        --color-accent-blue: #5af; /* Bright Blue */
        --color-accent-green: #0f0; /* Bright Green */
        --color-accent-red: #f55; /* Red */
    }

    /* Hacker Neon Theme Override - Applied when 'hacker-neon' class is on <html> */
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
        
        /* Apply simple neon glow effect */
        text-shadow: 0 0 1px var(--color-text-main);
    }
    .hacker-neon .bg-neon-accent {
        background-color: var(--color-accent-green) !important;
        color: #000000 !important;
        text-shadow: none !important;
        font-weight: bold;
    }
    .hacker-neon .bg-neon-accent-alt {
        background-color: var(--color-border-sub) !important;
        box-shadow: 0 0 5px var(--color-border) inset, 0 0 5px var(--color-border);
    }

    /* Blinking cursor for the terminal */
    @keyframes blink {
        from, to { border-color: transparent }
        50% { border-color: var(--color-text-main); }
    }
    .blinking-cursor {
        display: inline-block;
        width: 6px;
        height: 10px;
        background-color: transparent;
        border-right: 2px solid var(--color-text-main);
        animation: blink 1s step-end infinite;
        margin-left: 2px;
        transform: translateY(1px);
    }
`;

export default function HackerUIProfile() {
    const [activePane, setActivePane] = useState("terminal");
    const [terminalLines, setTerminalLines] = useState([
        "Welcome to Ade's hacker-style portfolio — 2025 interface",
        "Type 'help' for commands.",
    ]);
    const [cmd, setCmd] = useState("");
    const [projects] = useState([
        {
            id: 1,
            title: "Lagos Racer (Game)",
            desc: "Open-world street racer inspired by Lagos. Unity + WebGL demo.",
            tags: ["Game", "Unity", "WebGL"],
            url: "#",
        },
        {
            id: 2,
            title: "Sniper Bot (MT5)",
            desc: "High-frequency sniper logic integrated with MT5. Python backend.",
            tags: ["Trading", "Python", "MT5"],
            url: "#",
        },
        {
            id: 3,
            title: "Pixelfables4U (Stories)",
            desc: "AI story pipeline + TTS for YouTube. Channel tooling & automation.",
            tags: ["AI", "Youtube", "Automation"],
            url: "#",
        },
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

    // 1. INITIAL THEME LOAD (USER-REQUESTED)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'hacker-neon') {
            document.documentElement.classList.add('hacker-neon');
        }
    }, []);
    
    // Removed the inefficient setInterval useEffect.

    function appendTerminal(text) {
        setTerminalLines((t) => [...t, text]);
        // Auto-scroll to bottom
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
            appendTerminal("theme — toggle look");
            appendTerminal("clear — clear terminal");
            return;
        }
        if (c === "projects") {
            projects.forEach((p) => appendTerminal(`${p.id}. ${p.title} — ${p.desc}`));
            return;
        }
        if (c === "whoami") {
            appendTerminal("Adejare Talabi — coder, trader, creator. Lagos-based. Loves games & trading bots.");
            return;
        }
        if (c === "contact") {
            appendTerminal("Email: adejaretalabi101@gmail.com");
            appendTerminal("Telegram: 969657262");
            appendTerminal("Github: github.com/cryptothugg101");
            return;
        }
        if (c === "clear") {
            setTerminalLines([]);
            return;
        }
        
        // 2. THEME COMMAND LOGIC (USER-REQUESTED)
        if (c === "theme") {
            const isNeon = document.documentElement.classList.toggle("hacker-neon");
            localStorage.setItem("theme", isNeon ? "hacker-neon" : "default");
            appendTerminal(`Theme toggled! Current theme: ${isNeon ? 'hacker-neon' : 'default'}`);
            return;
        }

        appendTerminal(`Command not found: ${c} — type 'help'`);
    }

    function runPreview() {
        const blob = new Blob([editorCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        if (previewRef.current) previewRef.current.src = url;
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            runCommand();
        }
    };

    useEffect(() => {
        runPreview();
    }, []);

    return (
        <MotionConfig transition={{ duration: 0.18 }}>
            <style>{globalStyles}</style>
            <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-main)' }}>
                <div className="flex h-screen">
                    {/* LEFT SIDEBAR */}
                    <aside className="w-[200px] border-r p-3 flex flex-col" style={{ 
                        backgroundColor: 'var(--color-bg-secondary)', 
                        borderColor: 'var(--color-border)',
                        // Using linear-gradient directly on style for full control
                        background: 'linear-gradient(180deg, var(--color-bg-secondary) 0%, #041426 50%, #021018 100%)'
                    }}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ 
                                background: 'linear-gradient(45deg, var(--color-accent-blue), var(--color-accent-green))', 
                                color: 'var(--color-bg-primary)' 
                            }}>AT</div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-semibold truncate">Adejare Talabi</h2>
                                <p className="text-[9px] truncate" style={{ color: 'var(--color-text-secondary)' }}>Coder • Trader • Game dev</p>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-0.5 text-xs mb-3">
                            {/* Navigation Buttons */}
                            {[
                                { name: 'terminal', icon: Terminal, text: 'Terminal' },
                                { name: 'explorer', icon: Folder, text: 'Explorer' },
                                { name: 'projects', icon: Code, text: 'Projects' },
                                { name: 'editor', icon: FileText, text: 'Live Editor' },
                            ].map(({ name, icon: Icon, text }) => (
                                <button
                                    key={name}
                                    onClick={() => setActivePane(name)}
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors duration-100 ${
                                        activePane === name 
                                            ? 'bg-neon-accent-alt' 
                                            : 'hover:bg-[#04111a]'
                                    }`}
                                    style={{ color: activePane === name ? 'var(--color-accent-green)' : 'var(--color-text-main)' }}
                                >
                                    <Icon size={13} style={{ color: activePane === name ? 'var(--color-accent-green)' : 'var(--color-text-secondary)' }}/> {text}
                                </button>
                            ))}
                        </nav>

                        {/* Status Panel */}
                        <div className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>
                            <div className="mb-1.5 font-medium" style={{ color: 'var(--color-text-main)' }}>Status</div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="p-1 rounded text-center" style={{ backgroundColor: '#021218', borderColor: 'var(--color-border-sub)', border: '1px solid' }}>Node: <span style={{ color: 'var(--color-accent-green)' }}>v20.11</span></div>
                                <div className="p-1 rounded text-center" style={{ backgroundColor: '#021218', borderColor: 'var(--color-border-sub)', border: '1px solid' }}>Python: <span style={{ color: 'var(--color-accent-green)' }}>3.11</span></div>
                                <div className="p-1 rounded text-center" style={{ backgroundColor: '#021218', borderColor: 'var(--color-border-sub)', border: '1px solid' }}>MT5: <span style={{ color: 'var(--color-accent-green)' }}>Connected</span></div>
                                <div className="p-1 rounded text-center" style={{ backgroundColor: '#021218', borderColor: 'var(--color-border-sub)', border: '1px solid' }}>Discord: <span style={{ color: 'var(--color-accent-red)' }}>Offline</span></div>
                            </div>
                        </div>

                        {/* Contact Footer */}
                        <div className="mt-auto pt-2" style={{ borderTop: '1px solid var(--color-border-sub)' }}>
                            <div className="text-[9px] mb-1" style={{ color: 'var(--color-text-main)' }}>Contact</div>
                            <div className="text-[9px] mb-1.5 truncate" style={{ color: 'var(--color-text-secondary)' }}>adejaretalabi101@gmail.com</div>
                            <div className="flex gap-1.5">
                                <a className="p-1 rounded hover:bg-neon-accent-alt" style={{ backgroundColor: '#021218', border: '1px solid var(--color-border-sub)' }} href="https://github.com/cryptothugg101" target="_blank" rel="noopener noreferrer">
                                    <Github size={13} style={{ color: 'var(--color-text-main)' }}/>
                                </a>
                                <a className="p-1 rounded hover:bg-neon-accent-alt" style={{ backgroundColor: '#021218', border: '1px solid var(--color-border-sub)' }} href="#" target="_blank" rel="noopener noreferrer">
                                    <Linkedin size={13} style={{ color: 'var(--color-text-main)' }}/>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto p-3">
                            <div className="rounded-lg p-3 h-full" style={{ 
                                background: 'linear-gradient(180deg, #02111a 0%, #041422 100%)', 
                                border: '1px solid var(--color-border-sub)'
                            }}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <motion.h1
                                            className="text-3xl md:text-5xl font-bold mb-2 text-green-300"
                                            initial={{ opacity: 0, y: -40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 }}
                                        >
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
                                            className="text-sm md:text-lg text-green-400"
                                            repeat={Infinity}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>Session: <span className="font-medium" style={{ color: 'var(--color-accent-green)' }}>Dev</span></span>
                                        <span className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: '#00151a', border: '1px solid #07303b', color: 'var(--color-accent-green)' }}>Live</span>
                                    </div>
                                </div>

                                {/* Inner Content Grid */}
                                <div className="flex gap-2 h-[calc(100%-60px)]">
                                    {/* Left 2/3rds Column */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Projects Card */}
                                            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="rounded-lg p-2.5" style={{ backgroundColor: '#031926', border: '1px solid var(--color-border-sub)' }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h3 className="text-xs font-semibold" style={{ color: 'var(--color-accent-green)' }}>Projects</h3>
                                                        <p className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>Recent & featured</p>
                                                    </div>
                                                    <span className="text-[9px]" style={{ color: 'var(--color-accent-blue)' }}>{projects.length} items</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {projects.map((p) => (
                                                        <div key={p.id} className="p-1.5 rounded" style={{ backgroundColor: '#021e25', border: '1px solid #06363f' }}>
                                                            <div className="font-medium text-[10px]">{p.title}</div>
                                                            <div className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>{p.desc}</div>
                                                            <div className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{p.tags.join(", ")}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Live Editor Card */}
                                            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="rounded-lg p-2.5" style={{ backgroundColor: '#031926', border: '1px solid var(--color-border-sub)' }}>
                                                <h3 className="text-xs font-semibold" style={{ color: 'var(--color-accent-blue)' }}>Live Editor</h3>
                                                <p className="text-[9px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>Quick HTML/CSS preview</p>
                                                <div className="flex gap-1.5 mb-2">
                                                    <button onClick={() => setActivePane("editor")} className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: '#02222a', border: '1px solid #06404b' }}>Open Editor</button>
                                                    <button onClick={runPreview} className="px-2 py-1 rounded text-[10px] bg-neon-accent" style={{ border: '1px solid var(--color-accent-green)' }}>Run</button>
                                                </div>
                                                <div className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>Preview in sandboxed iframe. Great for demos, micro-sites.</div>
                                            </motion.div>
                                        </div>

                                        {/* Dynamic Pane (Terminal, Explorer, Projects, Editor) */}
                                        <div className="flex-1 rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border-sub)' }}>
                                            {activePane === "terminal" && (
                                                <div className="p-2.5 h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg-input)' }}>
                                                    <div id="terminal-output" className="flex-1 overflow-auto font-mono text-[10px] text-[#bff3ff]" style={{ color: 'var(--color-text-main)' }}>
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
                                                            style={{ borderBottom: '1px solid var(--color-border-sub)' }}
                                                            autoFocus
                                                        />
                                                        {/* Blinking Cursor at the end of the input field */}
                                                        <span className="blinking-cursor"></span> 
                                                        <button onClick={runCommand} className="px-2 py-0.5 rounded text-[10px] bg-neon-accent" style={{ backgroundColor: '#02414a', border: '1px solid #05565d' }}>Run</button>
                                                    </div>
                                                </div>
                                            )}

                                            {activePane === "explorer" && (
                                                <div className="p-2.5 h-full overflow-auto" style={{ backgroundColor: 'var(--color-bg-input)' }}>
                                                    <div className="space-y-1.5">
                                                        {[
                                                            { text: 'src/', icon: Folder },
                                                            { text: 'package.json', icon: FileText },
                                                            { text: 'README.md', icon: Code },
                                                        ].map(({ text, icon: Icon }) => (
                                                            <div key={text} className="flex items-center gap-2 p-1.5 rounded" style={{ backgroundColor: '#01161a', border: '1px solid #053038' }}>
                                                                <Icon size={13} style={{ color: 'var(--color-text-secondary)' }}/> 
                                                                <span className="text-[10px]">{text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activePane === "projects" && (
                                                <div className="p-2.5 h-full overflow-auto" style={{ backgroundColor: 'var(--color-bg-input)' }}>
                                                    <div className="space-y-1.5">
                                                        {projects.map((p) => (
                                                            <div key={p.id} className="p-2 rounded" style={{ backgroundColor: '#011a23', border: '1px solid #05424a' }}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-xs">{p.title}</div>
                                                                        <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{p.desc}</div>
                                                                    </div>
                                                                    <a className="text-[9px] px-1.5 py-0.5 rounded ml-2 bg-neon-accent" href={p.url} style={{ backgroundColor: '#02242d', border: '1px solid #05424a' }}>Open</a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activePane === "editor" && (
                                                <div className="p-2.5 h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg-input)' }}>
                                                    <div className="flex-1 grid grid-cols-2 gap-2 mb-2">
                                                        <textarea value={editorCode} onChange={(e) => setEditorCode(e.target.value)} className="w-full h-full p-2 rounded text-[10px] font-mono border resize-none" style={{ backgroundColor: '#02161a', borderColor: '#06424a', color: 'var(--color-text-main)' }} />
                                                        <div className="h-full rounded border overflow-hidden" style={{ borderColor: '#06424a' }}>
                                                            <iframe title="preview" ref={previewRef} sandbox="allow-scripts allow-forms" className="w-full h-full bg-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button onClick={runPreview} className="px-2 py-0.5 rounded text-[10px] bg-neon-accent" style={{ backgroundColor: '#02414a', border: '1px solid #05565d' }}>Run</button>
                                                        <button onClick={() => { 
                                                            // Use execCommand for broader compatibility in iFrames
                                                            const textarea = document.createElement('textarea');
                                                            textarea.value = editorCode;
                                                            document.body.appendChild(textarea);
                                                            textarea.select();
                                                            document.execCommand('copy');
                                                            document.body.removeChild(textarea);
                                                            appendTerminal('Code copied to clipboard'); 
                                                        }} className="px-2 py-0.5 rounded text-[10px]" style={{ border: '1px solid #05565d' }}>Copy</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right 1/3rd Column */}
                                    <div className="w-[180px] flex flex-col gap-2">
                                        {/* Profile Card */}
                                        <div className="rounded-lg p-2.5" style={{ backgroundColor: '#02151a', border: '1px solid var(--color-border-sub)' }}>
                                            <h4 className="text-[10px] font-semibold" style={{ color: 'var(--color-accent-red)' }}>Profile</h4>
                                            <p className="text-[9px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>Lagos • Maker • Trader • Dev</p>
                                            <div className="text-[9px] mb-1" style={{ color: 'var(--color-accent-green)' }}>Skills</div>
                                            <div className="flex flex-wrap gap-1">
                                                {["React", "Python", "MT5", "Unity"].map(skill => (
                                                    <span key={skill} className="px-1.5 py-0.5 text-[9px] rounded" style={{ backgroundColor: '#001a1f', border: '1px solid #05424a' }}>{skill}</span>
                                                ))}
                                            </div>
                                            <div className="mt-2 pt-2" style={{ borderTop: '1px solid #05303a' }}>
                                                <div className="text-[9px] mb-1" style={{ color: 'var(--color-text-main)' }}>Quick contact</div>
                                                <a href="mailto:adejaretalabi101@gmail.com" className="w-full text-[9px] rounded p-1 flex items-center justify-center gap-1" style={{ backgroundColor: '#022226', border: '1px solid #05424a' }}>
                                                    <Mail size={11} style={{ color: 'var(--color-accent-green)' }}/> Mail
                                                </a>
                                            </div>
                                        </div>

                                        {/* Quick Links Card */}
                                        <div className="rounded-lg p-2.5" style={{ backgroundColor: '#011b22', border: '1px solid #06313a' }}>
                                            <h4 className="text-[10px] font-semibold mb-1.5" style={{ color: 'var(--color-text-main)' }}>Quick Links</h4>
                                            <div className="space-y-1">
                                                <a className="block text-[10px] p-1 rounded text-center bg-neon-accent-alt" href="#" style={{ backgroundColor: '#02242d', border: '1px solid #05424a' }}>Resume</a>
                                                <a className="block text-[10px] p-1 rounded text-center bg-neon-accent-alt" href="#" style={{ backgroundColor: '#02242d', border: '1px solid #05424a' }}>Portfolio ZIP</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="px-3 py-2 text-[9px] flex items-center justify-between" style={{ borderTop: '1px solid #0b2b36', color: 'var(--color-text-secondary)' }}>
                            <span>Made with <span style={{ color: 'var(--color-accent-red)' }}>♥</span> — <span style={{ color: 'var(--color-accent-green)' }}>Hacker UI</span> • <span style={{ color: 'var(--color-accent-blue)' }}>2025</span></span>
                            <span style={{ color: 'var(--color-accent-green)' }}>Version 1.0</span>
                        </footer>
                    </main>
                </div>
            </div>
        </MotionConfig>
    );
}