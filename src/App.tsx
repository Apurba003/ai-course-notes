import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Gauge,
  Lightbulb,
  ListChecks,
  Play,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";

type Note = {
  title: string;
  summary: string;
  bullets: string[];
  timestamp: string;
};

const demoTranscript = `[00:00] Welcome to the course. In this lesson we will learn how a strong value proposition makes a product easier to understand.
[00:42] A value proposition explains who the product is for, what problem it solves, and why it is better than alternatives.
[01:36] Start with the customer's job to be done. Avoid vague features and focus on a measurable outcome.
[02:25] The three-part framework is audience, problem, and promised outcome. Keep the sentence short enough to remember.
[03:14] Test the proposition with real users. If they cannot repeat it after one conversation, simplify the language.
[04:08] The final exercise is to write three versions and choose the one with the clearest benefit.`;

function parseTranscript(text: string): Note[] {
  const rows = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const parsed = rows.map((row, index) => {
    const match = row.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(.*)$/);
    return { timestamp: match?.[1] ?? `00:${String(index * 30).padStart(2, "0")}`, text: match?.[2] ?? row };
  });
  return parsed.slice(0, 12).map((item, index) => ({
    title: index === 0 ? "Lesson context" : `Key idea ${index}`,
    summary: item.text,
    bullets: [
      item.text,
      index % 2 === 0 ? "Connect this idea to the next example before moving on." : "Write one practical example in your own words.",
      "Keep the original timestamp so the source can be checked later."
    ],
    timestamp: item.timestamp
  }));
}

function App() {
  const [transcript, setTranscript] = useState(demoTranscript);
  const [active, setActive] = useState(0);
  const [generated, setGenerated] = useState(true);
  const [fileName, setFileName] = useState("Demo lesson transcript");
  const fileInput = useRef<HTMLInputElement>(null);
  const notes = useMemo(() => parseTranscript(transcript), [transcript]);

  const loadFile = (file: File) => {
    setFileName(file.name);
    if (file.type.startsWith("video/")) {
      setTranscript(demoTranscript);
      setGenerated(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setTranscript(String(reader.result ?? ""));
      setGenerated(false);
    };
    reader.readAsText(file);
  };

  const generate = () => {
    setGenerated(true);
    setActive(0);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><BrainCircuit size={20} /></div><span>NotePilot <em>AI</em></span></div>
        <div className="status"><span className="status-dot" /> Local workspace <span className="divider" /> <span>Windows + Tablet</span></div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> AI study companion</div>
          <h1>Watch less. <span>Understand more.</span></h1>
          <p>Turn course videos into clean, timestamped notes, visual explanations and revision cards.</p>
        </div>
        <button className="primary-btn" onClick={() => fileInput.current?.click()}><Upload size={17} /> Import lesson</button>
        <input ref={fileInput} hidden type="file" accept=".txt,.srt,.vtt,video/*" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) loadFile(file);
        }} />
      </section>

      <section className="workspace">
        <aside className="panel source-panel">
          <div className="panel-heading"><div><span className="overline">SOURCE</span><h2>{fileName}</h2></div><button className="icon-btn" onClick={() => fileInput.current?.click()}><Upload size={17} /></button></div>
          <div className="video-card">
            <div className="play-orb"><Play size={22} fill="currentColor" /></div>
            <div className="video-meta"><strong>Course lesson</strong><span>Transcript-powered preview</span></div>
            <div className="video-length"><Clock3 size={14} /> 05:12</div>
          </div>
          <div className="transcript-label"><span>Transcript input</span><span className="pill">Auto timestamps</span></div>
          <textarea value={transcript} onChange={(event) => { setTranscript(event.target.value); setGenerated(false); }} aria-label="Transcript input" />
          <button className="generate-btn" onClick={generate}><WandSparkles size={17} /> {generated ? "Regenerate notes" : "Generate AI notes"} <ChevronRight size={17} /></button>
          <p className="privacy"><Check size={14} /> Your imported lesson stays in this browser.</p>
        </aside>

        <section className="panel notes-panel">
          <div className="panel-heading"><div><span className="overline">AI NOTEBOOK</span><h2>Premium study notes</h2></div><div className="confidence"><Gauge size={16} /><span>Context confidence</span><strong>94%</strong></div></div>
          <div className="note-tabs"><button className="selected"><FileText size={15} /> Notes</button><button><ListChecks size={15} /> Flashcards <small>6</small></button><button><BookOpen size={15} /> Glossary</button></div>
          {generated ? <div className="notes-list">{notes.map((note, index) => (
            <article key={`${note.timestamp}-${index}`} className={`note-card ${active === index ? "active" : ""}`} onClick={() => setActive(index)}>
              <div className="note-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="note-body"><div className="note-title-row"><h3>{note.title}</h3><span className="timestamp"><Clock3 size={13} /> {note.timestamp}</span></div><p>{note.summary}</p><ul>{note.bullets.slice(1).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>
            </article>
          ))}</div> : <div className="empty-state"><WandSparkles size={28} /><h3>Your notes are ready to generate</h3><p>Press “Generate AI notes” to structure this lesson.</p></div>}
        </section>

        <aside className="panel insight-panel">
          <div className="panel-heading"><div><span className="overline">REVISION KIT</span><h2>Study insights</h2></div><Sparkles size={18} className="gold" /></div>
          <div className="insight highlight"><div className="insight-icon"><Lightbulb size={18} /></div><div><span className="insight-label">Core takeaway</span><p>A good proposition connects a specific audience to a measurable outcome.</p></div></div>
          <div className="diagram"><div className="diagram-title">Value proposition map</div><div className="diagram-flow"><span>Audience</span><b>+</b><span>Problem</span><b>→</b><span className="accent">Outcome</span></div></div>
          <div className="quick-stats"><div><strong>{notes.length}</strong><span>Key ideas</span></div><div><strong>6</strong><span>Flashcards</span></div><div><strong>3</strong><span>Terms</span></div></div>
          <div className="next-step"><span className="overline">NEXT STEP</span><p>Review the highlighted timestamps, then test yourself without looking at the notes.</p><button>Start quick quiz <ChevronRight size={15} /></button></div>
        </aside>
      </section>
      <footer><span><Sparkles size={13} /> Designed for focused learning</span><span>NotePilot AI · MVP 0.1</span></footer>
    </main>
  );
}

export default App;
