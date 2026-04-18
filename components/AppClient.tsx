"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CreateSessionInput,
  LanguageView,
  SessionMode,
  SessionPublic,
  Sloka,
  SlokaSummary,
} from "@/lib/domain/types";

type Route = "home" | "library" | "detail" | "create" | "share" | "join" | "live";

type ApiError = {
  error: string;
};

type CreateSessionResponse = {
  session: SessionPublic & { hostKey: string };
};

type AppClientProps = {
  initialSlokaList: SlokaSummary[];
  initialSloka: Sloka;
  initialSessions: SessionPublic[];
};
type SlokaLineItem = Sloka["lines"][number];

const DEFAULT_MODE: SessionMode = "Host controls each line";
const DEFAULT_JOIN_NAME = "Participant";
const WORD_PUNCTUATION_PATTERN = /[.,;:!?()[\]{}"']/g;
const INDIAN_LANG_PREFIXES = ["en-in", "hi-in", "ta-in", "te-in", "kn-in", "ml-in", "mr-in", "bn-in", "gu-in", "pa-in"];
const TAMIL_SCRIPT_PATTERN = /[\u0b80-\u0bff]/;

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(errorBody?.error ?? `Request failed with status ${response.status}.`);
  }
  return (await response.json()) as T;
}

function formatLanguageView(value: LanguageView) {
  if (value === "tamil") return "Tamil only";
  if (value === "english") return "English only";
  return "Tamil + English";
}

function getPronunciationWords(pronunciation: string): string[] {
  return pronunciation
    .split(/\s+/)
    .map((word) => word.replace(/-/g, "").replace(WORD_PUNCTUATION_PATTERN, "").trim())
    .filter((word) => word.length > 0);
}

function normalizeSpeechText(text: string): string {
  return text.replace(/-/g, "").replace(/\s*;\s*/g, ", ").replace(/\s+/g, " ").trim();
}

function isLikelyIndianVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  return INDIAN_LANG_PREFIXES.some((prefix) => lang.startsWith(prefix)) || name.includes("india");
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  let score = 0;

  if (lang.startsWith("en-in")) score += 120;
  else if (INDIAN_LANG_PREFIXES.some((prefix) => lang.startsWith(prefix))) score += 100;

  if (name.includes("india") || name.includes("hindi") || name.includes("tamil")) score += 24;
  if (voice.localService) score += 6;
  if (voice.default) score += 3;

  return score;
}

export function AppClient({ initialSlokaList, initialSloka, initialSessions }: AppClientProps) {
  const [route, setRoute] = useState<Route>("home");
  const [slokaList] = useState<SlokaSummary[]>(initialSlokaList);
  const [selectedSloka, setSelectedSloka] = useState<Sloka | null>(initialSloka);
  const [selectedSlokaId, setSelectedSlokaId] = useState<string>(initialSloka.id);
  const [languageView, setLanguageView] = useState<LanguageView>("both");
  const [sessionTitle, setSessionTitle] = useState<string>("Navaratri Devi Chanting");
  const [sessionTime, setSessionTime] = useState<string>("Tonight, 7:30 PM");
  const [sessionMode, setSessionMode] = useState<SessionMode>(DEFAULT_MODE);
  const [session, setSession] = useState<SessionPublic | null>(null);
  const [sessions, setSessions] = useState<SessionPublic[]>(initialSessions);
  const [hostKey, setHostKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [joinCode, setJoinCode] = useState<string>("");
  const [joinName, setJoinName] = useState<string>(DEFAULT_JOIN_NAME);
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [wordByWordMode, setWordByWordMode] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>("");

  const categories = useMemo(() => {
    const values = new Set(slokaList.map((sloka) => sloka.category));
    return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [slokaList]);

  const filteredSlokas = useMemo(() => {
    const query = librarySearch.trim().toLowerCase();
    return slokaList.filter((sloka) => {
      const categoryMatch = libraryCategory === "all" || sloka.category === libraryCategory;
      const textMatch =
        query.length === 0 ||
        sloka.title.toLowerCase().includes(query) ||
        sloka.titleTamil.toLowerCase().includes(query) ||
        sloka.category.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }, [libraryCategory, librarySearch, slokaList]);

  const progress = useMemo(() => {
    if (!session || !selectedSloka || selectedSloka.lines.length === 0) return 0;
    return ((session.currentLine + 1) / selectedSloka.lines.length) * 100;
  }, [session, selectedSloka]);

  const activeLine = useMemo(() => {
    if (!session || !selectedSloka) return null;
    return selectedSloka.lines[session.currentLine] ?? selectedSloka.lines[0] ?? null;
  }, [session, selectedSloka]);
  const selectedVoice = useMemo(() => {
    return voiceOptions.find((voice) => voice.voiceURI === selectedVoiceUri) ?? voiceOptions[0] ?? null;
  }, [selectedVoiceUri, voiceOptions]);

  const isHost = hostKey.length > 0;

  const upsertSession = useCallback((nextSession: SessionPublic) => {
    setSessions((previous) => {
      const withoutCurrent = previous.filter((existing) => existing.id !== nextSession.id);
      return [nextSession, ...withoutCurrent].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
  }, []);

  const loadSlokaDetail = useCallback(async (slokaId: string) => {
    try {
      setError("");
      const data = await readJson<{ sloka: Sloka }>(await fetch(`/api/slokas/${encodeURIComponent(slokaId)}`));
      setSelectedSloka(data.sloka);
      setSelectedSlokaId(data.sloka.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sloka detail.");
    }
  }, []);

  const refreshSession = useCallback(
    async (sessionId: string) => {
      try {
        const data = await readJson<{ session: SessionPublic }>(await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`));
        setSession(data.session);
        upsertSession(data.session);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to refresh session.");
      }
    },
    [upsertSession],
  );

  const stopSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback((text: string, options?: { rate?: number; pitch?: number }) => {
    const speechText = text.trim();
    if (!speechText) return false;

    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    ) {
      setLiveMessage("Audio is not supported in this browser.");
      return false;
    }

    const speechApi = window.speechSynthesis;
    speechApi.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1;

    const voices = speechApi.getVoices();
    const sortedVoices = [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left));
    const preferredVoice =
      (selectedVoiceUri ? voices.find((voice) => voice.voiceURI === selectedVoiceUri) : null) ??
      sortedVoices[0] ??
      null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setLiveMessage("Audio playback failed. Please try again.");
    };

    speechApi.speak(utterance);
    return true;
  }, [selectedVoiceUri]);

  const getLineSpeechText = useCallback((line: SlokaLineItem): string => {
    if (selectedVoice?.lang.toLowerCase().startsWith("ta") && TAMIL_SCRIPT_PATTERN.test(line.tamil)) {
      return normalizeSpeechText(line.tamil);
    }
    return normalizeSpeechText(line.pronunciation?.trim() || line.english.trim() || line.tamil.trim());
  }, [selectedVoice]);

  const playLineAudio = useCallback(
    (line: SlokaLineItem) => {
      const speechText = getLineSpeechText(line);
      if (speakText(speechText, { rate: 0.88 })) {
        setLiveMessage("Playing line audio.");
      }
    },
    [getLineSpeechText, speakText],
  );

  const repeatLineAudio = useCallback(
    (line: SlokaLineItem) => {
      const speechText = getLineSpeechText(line);
      if (!speechText) return;
      const repeatedText = `${speechText}. ${speechText}. ${speechText}.`;
      if (speakText(repeatedText, { rate: 0.82 })) {
        setLiveMessage("Repeating this line 3 times for group practice.");
      }
    },
    [getLineSpeechText, speakText],
  );

  const playWordAudio = useCallback(
    (word: string) => {
      if (speakText(word, { rate: 0.78, pitch: 1.02 })) {
        setLiveMessage(`Word: ${word}`);
      }
    },
    [speakText],
  );

  useEffect(() => {
    if (route !== "live" || !session?.id) return;

    const timer = setInterval(() => {
      void refreshSession(session.id);
    }, 2500);

    return () => clearInterval(timer);
  }, [refreshSession, route, session?.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const speechApi = window.speechSynthesis;
    const loadVoices = () => {
      const voices = speechApi.getVoices();
      if (voices.length === 0) return;
      const sortedVoices = [...voices].sort((left, right) => {
        const scoreDelta = scoreVoice(right) - scoreVoice(left);
        if (scoreDelta !== 0) return scoreDelta;
        return left.name.localeCompare(right.name);
      });
      setVoiceOptions(sortedVoices);
      setSelectedVoiceUri((previous) => previous || sortedVoices[0]?.voiceURI || "");
    };

    loadVoices();
    speechApi.addEventListener?.("voiceschanged", loadVoices);
    speechApi.onvoiceschanged = loadVoices;

    return () => {
      speechApi.removeEventListener?.("voiceschanged", loadVoices);
      if (speechApi.onvoiceschanged === loadVoices) {
        speechApi.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  async function handleCreateSession() {
    try {
      setLoading(true);
      setError("");
      const payload: CreateSessionInput = {
        title: sessionTitle,
        slokaId: selectedSlokaId,
        scheduledAt: sessionTime,
        languageView,
        mode: sessionMode,
      };

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJson<CreateSessionResponse>(response);

      setSession(data.session);
      setHostKey(data.session.hostKey);
      setLiveMessage("");
      setCopied(false);
      setJoinCode(data.session.inviteCode);
      upsertSession(data.session);
      await loadSlokaDetail(payload.slokaId);
      setRoute("share");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create session.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSession(invite: string) {
    try {
      setLoading(true);
      setError("");

      const inviteCode = invite.trim().toUpperCase();
      if (!inviteCode) {
        throw new Error("Invite code is required.");
      }

      const response = await fetch("/api/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode,
          name: joinName.trim() || DEFAULT_JOIN_NAME,
        }),
      });

      const data = await readJson<{ session: SessionPublic }>(response);
      setHostKey("");
      setSession(data.session);
      setLanguageView(data.session.languageView);
      setSessionMode(data.session.mode);
      upsertSession(data.session);
      await loadSlokaDetail(data.session.slokaId);
      setRoute("live");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join session.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyInvite() {
    if (!session) return;

    const inviteText = `Join ${session.title} at ${session.scheduledAt}: slokasabha.app/join/${session.inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteText);
    } catch {
      // Clipboard access can fail in restricted browsers.
    }
    setCopied(true);
  }

  async function updateLine(action: "next" | "prev") {
    if (!session || !isHost) return;

    try {
      setError("");
      const response = await fetch(`/api/sessions/${encodeURIComponent(session.id)}/line`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, hostKey }),
      });
      const data = await readJson<{ session: SessionPublic }>(response);
      setSession(data.session);
      upsertSession(data.session);
      setLiveMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update live line.");
    }
  }

  function goTo(nextRoute: Route) {
    setRoute(nextRoute);
    if (nextRoute !== "share") setCopied(false);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>Sloka Sabha</strong>
            <span>Phase 1 - browse, create, join, live</span>
          </div>
        </div>
      </header>

      <main>
        {error && <div className="toast visible">{error}</div>}
        {loading && <div className="toast visible">Loading...</div>}

        {route === "home" && (
          <section className="screen active">
            <div className="hero-panel">
              <span className="badge">Tamil + English</span>
              <h1>Phase 1 is now functional.</h1>
              <p>Browse slokas, create sessions, share invite codes, and join live chanting rooms.</p>
              <div className="action-row">
                <button className="primary-button" onClick={() => goTo("create")} type="button">
                  Create Session
                </button>
                <button className="secondary-button" onClick={() => goTo("library")} type="button">
                  Explore Slokas
                </button>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <h3>{slokaList.length}</h3>
                <p>Slokas in catalog</p>
              </article>
              <article className="stat-card">
                <h3>{categories.length - 1}</h3>
                <p>Categories</p>
              </article>
              <article className="stat-card">
                <h3>{sessions.length}</h3>
                <p>Recent sessions</p>
              </article>
            </div>

            <div className="section-heading">
              <h2>Join with Invite Code</h2>
              <button className="text-button" onClick={() => goTo("join")} type="button">
                Open join screen
              </button>
            </div>

            <article className="event-card">
              <label className="field-label" htmlFor="join-code-home">
                Invite code
              </label>
              <input
                id="join-code-home"
                className="search-input"
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value)}
              />
              <label className="field-label" htmlFor="join-name-home">
                Display name
              </label>
              <input
                id="join-name-home"
                className="search-input"
                placeholder="Your name"
                value={joinName}
                onChange={(event) => setJoinName(event.target.value)}
              />
              <button className="primary-button full" onClick={() => void handleJoinSession(joinCode)} type="button">
                Join Session
              </button>
            </article>

            <div className="section-heading">
              <h2>Recent Sessions</h2>
            </div>

            <div className="session-list">
              {sessions.length === 0 && (
                <article className="event-card">
                  <h3>No sessions yet</h3>
                  <p>Create your first session and share the invite code.</p>
                </article>
              )}

              {sessions.slice(0, 4).map((existing) => (
                <article className="event-card" key={existing.id}>
                  <div className="event-top">
                    <span className="badge live-badge">{existing.participantCount} joined</span>
                    <span>{formatLanguageView(existing.languageView)}</span>
                  </div>
                  <h3>{existing.title}</h3>
                  <p>
                    {existing.scheduledAt} - code {existing.inviteCode}
                  </p>
                  <div className="action-row">
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setJoinCode(existing.inviteCode);
                        goTo("join");
                      }}
                      type="button"
                    >
                      Join
                    </button>
                    <button
                      className="primary-button"
                      onClick={async () => {
                        setSession(existing);
                        setHostKey("");
                        await loadSlokaDetail(existing.slokaId);
                        goTo("live");
                      }}
                      type="button"
                    >
                      Open
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {route === "library" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Sloka Library</h1>
                <p>Search and filter all available slokas.</p>
              </div>
            </div>

            <label className="field-label" htmlFor="library-search">
              Search
            </label>
            <input
              id="library-search"
              className="search-input"
              placeholder="Search by title, category, or Tamil text"
              value={librarySearch}
              onChange={(event) => setLibrarySearch(event.target.value)}
            />

            <div className="chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`chip ${libraryCategory === category ? "active" : ""}`}
                  onClick={() => setLibraryCategory(category)}
                  type="button"
                >
                  {category === "all" ? "All" : category}
                </button>
              ))}
            </div>

            <div className="sloka-list">
              {filteredSlokas.length === 0 && (
                <article className="event-card">
                  <h3>No slokas found</h3>
                  <p>Try a different search term or category.</p>
                </article>
              )}

              {filteredSlokas.map((sloka) => (
                <button
                  className="sloka-row"
                  key={sloka.id}
                  onClick={() => {
                    void loadSlokaDetail(sloka.id);
                    goTo("detail");
                  }}
                  type="button"
                >
                  <span className="tile">{sloka.icon}</span>
                  <span>
                    <strong>{sloka.title}</strong>
                    <small>
                      {sloka.titleTamil} - {sloka.category} - {sloka.duration} - {sloka.lineCount} lines
                    </small>
                  </span>
                  <span>{">"}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {route === "detail" && selectedSloka && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("library")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>{selectedSloka.title}</h1>
                <p>
                  {selectedSloka.titleTamil} - {selectedSloka.category} - {selectedSloka.duration}
                </p>
              </div>
            </div>

            <div className="action-row">
              <button
                className="secondary-button"
                onClick={() => setShowPronunciation((value) => !value)}
                type="button"
              >
                {showPronunciation ? "Hide Pronunciation" : "Show Pronunciation"}
              </button>
              <button
                className="secondary-button"
                onClick={() => setWordByWordMode((value) => !value)}
                type="button"
              >
                {wordByWordMode ? "Word Mode On" : "Word Mode Off"}
              </button>
            </div>

            <div className="voice-control">
              <label className="field-label" htmlFor="voice-select-detail">
                Accent voice
              </label>
              <select
                className="voice-select"
                id="voice-select-detail"
                onChange={(event) => setSelectedVoiceUri(event.target.value)}
                value={selectedVoiceUri}
              >
                {voiceOptions.length === 0 && <option value="">Loading system voices...</option>}
                {voiceOptions.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang}){isLikelyIndianVoice(voice) ? " - Indian" : ""}
                  </option>
                ))}
              </select>
              <p className="voice-help">Pick an Indian voice for better chanting pronunciation.</p>
            </div>

            <div className="reader-card">
              {selectedSloka.lines.map((line, index) => (
                <article className="line-block" key={`${selectedSloka.id}-${index + 1}`}>
                  <strong>
                    {index + 1}. {line.tamil}
                  </strong>
                  <span>{line.english}</span>
                  {showPronunciation && line.pronunciation && (
                    <>
                      <p className="pronunciation-line">Pronunciation: {line.pronunciation}</p>
                      <button className="word-audio-button" onClick={() => playLineAudio(line)} type="button">
                        Play Line Audio
                      </button>
                      {wordByWordMode && (
                        <div className="word-chip-row">
                          {getPronunciationWords(line.pronunciation).map((word, wordIndex) => (
                            <button
                              className="word-chip"
                              key={`${selectedSloka.id}-${index + 1}-word-${wordIndex}`}
                              onClick={() => playWordAudio(word)}
                              type="button"
                            >
                              {word}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <small>{line.meaning}</small>
                </article>
              ))}
            </div>

            <button className="primary-button full" onClick={() => goTo("create")} type="button">
              Create Session With This Sloka
            </button>
          </section>
        )}

        {route === "create" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Create Session</h1>
                <p>Choose sloka and mode, then generate invite.</p>
              </div>
            </div>

            <form
              className="session-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreateSession();
              }}
            >
              <label>
                <span>Session title</span>
                <input onChange={(event) => setSessionTitle(event.target.value)} value={sessionTitle} />
              </label>

              <label>
                <span>Sloka</span>
                <select
                  onChange={(event) => {
                    const nextId = event.target.value;
                    void loadSlokaDetail(nextId);
                  }}
                  value={selectedSlokaId}
                >
                  {slokaList.map((sloka) => (
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
                <select
                  onChange={(event) => setLanguageView(event.target.value as LanguageView)}
                  value={languageView}
                >
                  <option value="both">Tamil + English</option>
                  <option value="tamil">Tamil only</option>
                  <option value="english">English only</option>
                </select>
              </label>

              <label>
                <span>Mode</span>
                <select onChange={(event) => setSessionMode(event.target.value as SessionMode)} value={sessionMode}>
                  <option>Host controls each line</option>
                  <option>Call and repeat</option>
                  <option>Auto-scroll with audio</option>
                </select>
              </label>

              <button className="primary-button full" type="submit">
                Create Invite
              </button>
            </form>
          </section>
        )}

        {route === "share" && session && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("create")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Share Session</h1>
                <p>Invite code generated by backend.</p>
              </div>
            </div>

            <article className="event-card">
              <span className="badge">Ready</span>
              <h3>{session.title}</h3>
              <p>
                {session.scheduledAt} - {formatLanguageView(session.languageView)} - {selectedSloka?.title ?? "Sloka"}
              </p>
              <div className="invite-box">{`slokasabha.app/join/${session.inviteCode}`}</div>
              <button className="secondary-button full" onClick={handleCopyInvite} type="button">
                Copy Invite Text
              </button>
              <button className="primary-button full" onClick={() => goTo("live")} type="button">
                Start Live Room
              </button>
              <button
                className="secondary-button full"
                onClick={() => {
                  setJoinCode(session.inviteCode);
                  goTo("join");
                }}
                type="button"
              >
                Test Join As Participant
              </button>
            </article>
            <div className={`toast ${copied ? "visible" : ""}`}>Invite copied.</div>
          </section>
        )}

        {route === "join" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => goTo("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Join Session</h1>
                <p>Enter invite code from the host.</p>
              </div>
            </div>

            <article className="event-card">
              <label className="field-label" htmlFor="join-code-screen">
                Invite code
              </label>
              <input
                id="join-code-screen"
                className="search-input"
                placeholder="Example: A1B2C3D4"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value)}
              />
              <label className="field-label" htmlFor="join-name-screen">
                Display name
              </label>
              <input
                id="join-name-screen"
                className="search-input"
                placeholder="Your name"
                value={joinName}
                onChange={(event) => setJoinName(event.target.value)}
              />
              <button className="primary-button full" onClick={() => void handleJoinSession(joinCode)} type="button">
                Join Live Room
              </button>
            </article>
          </section>
        )}

        {route === "live" && session && selectedSloka && activeLine && (
          <section className="screen active live-screen">
            <div className="screen-top">
              <button className="icon-button dark" onClick={() => goTo("share")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Live Chant Room</h1>
                <p>
                  {session.participantCount} joined - {session.mode} - {isHost ? "Host" : "Participant"}
                </p>
              </div>
            </div>

            <div className="action-row">
              <button
                className="secondary-button"
                onClick={() => setShowPronunciation((value) => !value)}
                type="button"
              >
                {showPronunciation ? "Hide Pronunciation" : "Show Pronunciation"}
              </button>
              <button
                className="secondary-button"
                onClick={() => setWordByWordMode((value) => !value)}
                type="button"
              >
                {wordByWordMode ? "Word Mode On" : "Word Mode Off"}
              </button>
            </div>

            <div className="voice-control">
              <label className="field-label" htmlFor="voice-select-live">
                Accent voice
              </label>
              <select
                className="voice-select"
                id="voice-select-live"
                onChange={(event) => setSelectedVoiceUri(event.target.value)}
                value={selectedVoiceUri}
              >
                {voiceOptions.length === 0 && <option value="">Loading system voices...</option>}
                {voiceOptions.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang}){isLikelyIndianVoice(voice) ? " - Indian" : ""}
                  </option>
                ))}
              </select>
              <p className="voice-help">Try en-IN, hi-IN, or ta-IN voices for better accent.</p>
            </div>

            <article className="chant-card">
              <span className="line-count">
                Line {session.currentLine + 1} of {selectedSloka.lines.length}
              </span>
              {(session.languageView === "both" || session.languageView === "tamil") && (
                <div className="tamil-line">{activeLine.tamil}</div>
              )}
              {(session.languageView === "both" || session.languageView === "english") && (
                <div className="english-line">{activeLine.english}</div>
              )}
              {showPronunciation && activeLine.pronunciation && (
                <>
                  <p className="live-pronunciation-line">Pronunciation: {activeLine.pronunciation}</p>
                  {wordByWordMode && (
                    <div className="word-chip-row live-word-chip-row">
                      {getPronunciationWords(activeLine.pronunciation).map((word, wordIndex) => (
                        <button
                          className="word-chip"
                          key={`${session.id}-active-word-${wordIndex}`}
                          onClick={() => playWordAudio(word)}
                          type="button"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <p className="meaning-line">{liveMessage || activeLine.meaning}</p>
              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </article>

            <div className="host-controls">
              <button disabled={!isHost} onClick={() => void updateLine("prev")} type="button">
                {"<"} Prev
              </button>
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeech();
                    setLiveMessage("Audio stopped.");
                    return;
                  }
                  playLineAudio(activeLine);
                }}
                type="button"
              >
                {isSpeaking ? "Stop Audio" : "Audio"}
              </button>
              <button onClick={() => repeatLineAudio(activeLine)} type="button">
                Repeat
              </button>
              <button disabled={!isHost} onClick={() => void updateLine("next")} type="button">
                Next {">"}
              </button>
            </div>

            {!isHost && (
              <button className="secondary-button full" onClick={() => void refreshSession(session.id)} type="button">
                Refresh from Host
              </button>
            )}

            <article className="participant-note">
              <span className="badge">Phase 1 backend state</span>
              <p>Host controls line updates. Participants see live progress through refresh/polling.</p>
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
        <button className={route === "join" ? "active" : ""} onClick={() => goTo("join")} type="button">
          Join
        </button>
        <button className={route === "live" ? "active" : ""} onClick={() => goTo("live")} type="button">
          Live
        </button>
      </nav>
    </div>
  );
}
