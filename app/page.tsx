"use client";

import { useMemo, useState } from "react";

type Line = {
  tamil: string;
  english: string;
  meaning: string;
};

type Sloka = {
  id: string;
  title: string;
  titleTamil: string;
  category: string;
  duration: string;
  icon: string;
  lines: Line[];
};

const slokas: Sloka[] = [
  {
    id: "devi",
    title: "Mahishasura Mardini",
    titleTamil: "மஹிஷாசுர மர்தினி",
    category: "Navaratri",
    duration: "18 min",
    icon: "அ",
    lines: [
      {
        tamil: "அயி கிரி நந்தினி நந்தித மேதினி",
        english: "Ayi Giri Nandini Nandita Medini",
        meaning: "O daughter of the mountain, joy of the earth.",
      },
      {
        tamil: "விச்வ வினோதினி நந்திநுதே",
        english: "Vishva Vinodini Nandinute",
        meaning: "One who delights the world and is praised by Nandi.",
      },
      {
        tamil: "கிரிவர விந்த்ய சிரோதிநிவாசினி",
        english: "Girivara Vindhya Shirodhi Nivasini",
        meaning: "One who dwells among the great mountains.",
      },
      {
        tamil: "விஷ்ணு விலாசினி ஜிஷ்ணு நுதே",
        english: "Vishnu Vilasini Jishnu Nute",
        meaning: "One praised by Vishnu and the victorious ones.",
      },
    ],
  },
  {
    id: "lakshmi",
    title: "Lakshmi Ashtottaram",
    titleTamil: "லக்ஷ்மி அஷ்டோத்திரம்",
    category: "Friday Puja",
    duration: "12 min",
    icon: "ॐ",
    lines: [
      {
        tamil: "ஓம் ப்ரக்ருத்யை நம:",
        english: "Om Prakrutyai Namah",
        meaning: "Salutations to the primordial Mother.",
      },
      {
        tamil: "ஓம் விக்ருத்யை நம:",
        english: "Om Vikrutyai Namah",
        meaning: "Salutations to the one who manifests in many forms.",
      },
      {
        tamil: "ஓம் வித்யாயை நம:",
        english: "Om Vidyayai Namah",
        meaning: "Salutations to the giver of knowledge.",
      },
    ],
  },
  {
    id: "saraswati",
    title: "Saraswati Beginner Slokas",
    titleTamil: "சரஸ்வதி ஸ்லோகங்கள்",
    category: "Kids Class",
    duration: "8 min",
    icon: "♪",
    lines: [
      {
        tamil: "சரஸ்வதி நமஸ்துப்யம்",
        english: "Saraswati Namastubhyam",
        meaning: "Salutations to Saraswati.",
      },
      {
        tamil: "வரதே காமரூபிணி",
        english: "Varade Kamarupini",
        meaning: "Bestower of blessings, who takes graceful forms.",
      },
      {
        tamil: "வித்யாரம்பம் கரிஷ்யாமி",
        english: "Vidyarambham Karishyami",
        meaning: "I begin my learning.",
      },
    ],
  },
];

type Route = "home" | "library" | "detail" | "create" | "share" | "live";

export default function Home() {
  const [route, setRoute] = useState<Route>("home");
  const [selectedSlokaId, setSelectedSlokaId] = useState<string>("devi");
  const [languageView, setLanguageView] = useState<string>("both");
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [sessionTitle, setSessionTitle] = useState<string>("Navaratri Devi Chanting");
  const [sessionTime, setSessionTime] = useState<string>("Tonight, 7:30 PM");
  const [sessionMode, setSessionMode] = useState<string>("Host controls each line");

  const selectedSloka = useMemo(
    () => slokas.find((sloka) => sloka.id === selectedSlokaId) ?? slokas[0],
    [selectedSlokaId],
  );

  const activeLine = selectedSloka.lines[currentLine] ?? selectedSloka.lines[0];
  const progress = ((currentLine + 1) / selectedSloka.lines.length) * 100;

  const sessionLanguageLabel =
    languageView === "tamil"
      ? "Tamil only"
      : languageView === "english"
        ? "English only"
        : "Tamil + English";

  const inviteCode = "NAVA-730";

  async function handleCopyInvite() {
    const inviteText = `Join ${sessionTitle} at ${sessionTime}: slokasabha.app/join/${inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteText);
    } catch {
      // Clipboard permissions can fail in restricted browsers.
    }
    setCopied(true);
  }

  function goTo(routeName: Route) {
    setRoute(routeName);
    if (routeName !== "share") setCopied(false);
  }

  function selectSlokaAndOpenDetail(id: string) {
    setSelectedSlokaId(id);
    setCurrentLine(0);
    setLiveMessage("");
    goTo("detail");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>Sloka Sabha</strong>
            <span>Phase 2 · Next.js foundation</span>
          </div>
        </div>
      </header>

      <main>
        {route === "home" && (
          <section className="screen active">
            <div className="hero-panel">
              <span className="badge">Tamil + English</span>
              <h1>Chant together with one shared line.</h1>
              <p>Create a session, share a link, and guide everyone line by line.</p>
              <div className="action-row">
                <button className="primary-button" onClick={() => goTo("create")} type="button">
                  Create Session
                </button>
                <button className="secondary-button" onClick={() => goTo("library")} type="button">
                  Browse Slokas
                </button>
              </div>
            </div>

            <div className="section-heading">
              <h2>Upcoming</h2>
            </div>
            <article className="event-card">
              <div className="event-top">
                <span className="badge live-badge">Demo</span>
                <span>12 people</span>
              </div>
              <h3>Navaratri Devi Chanting</h3>
              <p>Tonight, 7:30 PM · Tamil + English · host controlled</p>
              <button className="primary-button full" onClick={() => goTo("live")} type="button">
                Start Demo Room
              </button>
            </article>
          </section>
        )}

        {route === "library" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("home")} type="button" title="Back">
                ‹
              </button>
              <div>
                <h1>Sloka Library</h1>
                <p>Starter content for this development phase.</p>
              </div>
            </div>

            <div className="filter-row">
              {["both", "tamil", "english"].map((lang) => (
                <button
                  key={lang}
                  className={`filter ${languageView === lang ? "active" : ""}`}
                  onClick={() => setLanguageView(lang)}
                  type="button"
                >
                  {lang === "both" ? "Both" : lang === "tamil" ? "Tamil" : "English"}
                </button>
              ))}
            </div>

            <div className="sloka-list">
              {slokas.map((sloka) => (
                <button className="sloka-row" key={sloka.id} onClick={() => selectSlokaAndOpenDetail(sloka.id)} type="button">
                  <span className="tile">{sloka.icon}</span>
                  <span>
                    <strong>{sloka.title}</strong>
                    <small>
                      {sloka.titleTamil} · {sloka.category} · {sloka.duration}
                    </small>
                  </span>
                  <span>›</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {route === "detail" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("library")} type="button" title="Back">
                ‹
              </button>
              <div>
                <h1>{selectedSloka.title}</h1>
                <p>
                  {selectedSloka.titleTamil} · {selectedSloka.category} · {selectedSloka.duration}
                </p>
              </div>
            </div>

            <div className="reader-card">
              {selectedSloka.lines.map((line, index) => (
                <article className="line-block" key={`${selectedSloka.id}-${index + 1}`}>
                  <strong>
                    {index + 1}. {line.tamil}
                  </strong>
                  <span>{line.english}</span>
                  <small>{line.meaning}</small>
                </article>
              ))}
            </div>

            <button className="primary-button full" onClick={() => goTo("create")} type="button">
              Create Session With This
            </button>
          </section>
        )}

        {route === "create" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("home")} type="button" title="Back">
                ‹
              </button>
              <div>
                <h1>Create Session</h1>
                <p>Set up the group chanting room.</p>
              </div>
            </div>

            <form
              className="session-form"
              onSubmit={(event) => {
                event.preventDefault();
                goTo("share");
              }}
            >
              <label>
                <span>Session title</span>
                <input onChange={(event) => setSessionTitle(event.target.value)} value={sessionTitle} />
              </label>

              <label>
                <span>Sloka pack</span>
                <select
                  onChange={(event) => {
                    setSelectedSlokaId(event.target.value);
                    setCurrentLine(0);
                    setLiveMessage("");
                  }}
                  value={selectedSlokaId}
                >
                  {slokas.map((sloka) => (
                    <option key={sloka.id} value={sloka.id}>
                      {sloka.title} - {sloka.category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Date and time</span>
                <input onChange={(event) => setSessionTime(event.target.value)} value={sessionTime} />
              </label>

              <label>
                <span>Language view</span>
                <select onChange={(event) => setLanguageView(event.target.value)} value={languageView}>
                  <option value="both">Tamil + English</option>
                  <option value="tamil">Tamil only</option>
                  <option value="english">English only</option>
                </select>
              </label>

              <label>
                <span>Mode</span>
                <select onChange={(event) => setSessionMode(event.target.value)} value={sessionMode}>
                  <option>Host controls each line</option>
                  <option>Call and repeat</option>
                  <option>Auto-scroll with audio</option>
                </select>
              </label>

              <button className="primary-button full" type="submit">
                Create Share Link
              </button>
            </form>
          </section>
        )}

        {route === "share" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("create")} type="button" title="Back">
                ‹
              </button>
              <div>
                <h1>Share Session</h1>
                <p>Send this to WhatsApp, SMS, or email.</p>
              </div>
            </div>

            <article className="event-card">
              <span className="badge">Ready</span>
              <h3>{sessionTitle}</h3>
              <p>
                {sessionTime} · {sessionLanguageLabel} · {selectedSloka.title}
              </p>
              <div className="invite-box">{`slokasabha.app/join/${inviteCode}`}</div>
              <button className="secondary-button full" onClick={handleCopyInvite} type="button">
                Copy Invite Text
              </button>
              <button className="primary-button full" onClick={() => goTo("live")} type="button">
                Start Live Room
              </button>
            </article>
            <div className={`toast ${copied ? "visible" : ""}`}>Invite copied.</div>
          </section>
        )}

        {route === "live" && (
          <section className="screen active live-screen">
            <div className="screen-top">
              <button className="icon-button dark" onClick={() => goTo("share")} type="button" title="Back">
                ‹
              </button>
              <div>
                <h1>Live Chant Room</h1>
                <p>12 joined · {sessionMode}</p>
              </div>
            </div>

            <article className="chant-card">
              <span className="line-count">
                Line {currentLine + 1} of {selectedSloka.lines.length}
              </span>
              {(languageView === "both" || languageView === "tamil") && <div className="tamil-line">{activeLine.tamil}</div>}
              {(languageView === "both" || languageView === "english") && (
                <div className="english-line">{activeLine.english}</div>
              )}
              <p className="meaning-line">{liveMessage || activeLine.meaning}</p>
              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </article>

            <div className="host-controls">
              <button
                onClick={() => {
                  setCurrentLine((line) => Math.max(0, line - 1));
                  setLiveMessage("");
                }}
                type="button"
              >
                ‹ Prev
              </button>
              <button onClick={() => setLiveMessage("Playing slow line audio in teaching mode.")} type="button">
                ▶ Audio
              </button>
              <button onClick={() => setLiveMessage("Repeating this line 3 times for group practice.")} type="button">
                ↻ Repeat
              </button>
              <button
                onClick={() => {
                  setCurrentLine((line) => Math.min(selectedSloka.lines.length - 1, line + 1));
                  setLiveMessage("");
                }}
                type="button"
              >
                Next ›
              </button>
            </div>

            <article className="participant-note">
              <span className="badge">Next integration</span>
              <p>Phase 3 will sync line changes through Supabase Realtime so all participants follow the host instantly.</p>
            </article>
          </section>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Primary">
        <button className={route === "home" ? "active" : ""} onClick={() => goTo("home")} type="button">
          Home
        </button>
        <button className={route === "library" ? "active" : ""} onClick={() => goTo("library")} type="button">
          Library
        </button>
        <button className={route === "create" ? "active" : ""} onClick={() => goTo("create")} type="button">
          Create
        </button>
        <button className={route === "live" ? "active" : ""} onClick={() => goTo("live")} type="button">
          Live
        </button>
      </nav>
    </div>
  );
}
