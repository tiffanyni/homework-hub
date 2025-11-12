import { useState, useEffect } from "react";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState("Strengths Journal");

  // === personas ===
  const PERSONAS = [
    "Sarah Thompson",
    "Michael Reyes",
    "Aisha Khan",
    "Daniel Park",
    "Elena Garcia",
    "Emily Chen",
    "Marcus Green",
  ];
  const [selectedPersona, setSelectedPersona] = useState("Aisha Khan");

  // === backend API ===
  const API_BASE = "http://127.0.0.1:8000";

  // === AI Hint (existing) ===
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // === Mentor Notes (new feature) ===
  const [mentorNotes, setMentorNotes] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState("");

  // === map assignment titles -> exact questions/prompts ===
  const questionByTitle = {
    "Strengths Journal":
      "Write 3 moments this week that energized you. Tag skills you used.",
    "STAR Story: Relocation Win":
      "Draft a STAR story that turns a challenge into a strength.",
    "Resume Transferables":
      "Reframe 3 experiences into resume bullets with impact.",
    "Micro-Network Task":
      "Send 1 informational-interview request using our template.",
  };

  // === keep visible prompt in sync ===
  const [currentPrompt, setCurrentPrompt] = useState(
    questionByTitle["Strengths Journal"]
  );

  useEffect(() => {
    setCurrentPrompt(
      questionByTitle[selected] || questionByTitle["Strengths Journal"]
    );
  }, [selected]);

  const assignments = [
    {
      title: "Strengths Journal",
      stage: "Confidence",
      eta: "8–10 min",
      due: "Due in 3 days",
      desc: "Write 3 moments this week that energized you. Tag skills you used.",
      status: "Not started",
    },
    {
      title: "STAR Story: Relocation Win",
      stage: "Identity → Career",
      eta: "12–15 min",
      due: "Due in 5 days",
      desc: "Draft a STAR story that turns a challenge into a strength.",
      status: "In progress",
    },
    {
      title: "Micro-Network Task",
      stage: "Career Exploration",
      eta: "5–7 min",
      due: "Due tomorrow",
      desc: "Send 1 informational-interview request using our template.",
      status: "Not started",
    },
    {
      title: "Resume Transferables",
      stage: "Job-Search Readiness",
      eta: "10–12 min",
      due: "Due next week",
      desc: "Reframe 3 experiences into resume bullets with impact.",
      status: "Not started",
    },
  ];

  // === call API for AI Hint ===
  async function getAiHint() {
    if (selected === "Micro-Network Task") return;
    setLoading(true);
    setError("");
    setHints([]);
    try {
      const res = await fetch(`${API_BASE}/ai-hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question:
            questionByTitle[selected] || questionByTitle["Strengths Journal"],
          resume_name: selectedPersona,
          meeting_notes: "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHints(Array.isArray(data.hints) ? data.hints : []);
    } catch (e) {
      setError(e.message || "AI hint failed");
    } finally {
      setLoading(false);
    }
  }

  // === call backend for mentor notes summary ===
  async function generateSummary() {
    setTaskLoading(true);
    setTaskError("");
    setAiResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate-weekly-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_notes: mentorNotes }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      setTaskError(e.message || "Failed to connect to backend");
    } finally {
      setTaskLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Homework Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <label className="mr-2 text-gray-600">Persona:</label>
            <select
              className="bg-gray-100 px-3 py-1 rounded-xl"
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
            >
              {PERSONAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-xl">
            Stage: <span className="font-semibold">Confidence → Career</span>
          </div>
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-xl">
            Streak: <span className="font-semibold">3 days</span>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 text-sm">
        {["dashboard", "activity", "feedback", "mentorNotes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-3 py-1.5 rounded-xl ${
              view === tab ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {{
              dashboard: "Assignments",
              activity: "Activity Player",
              feedback: "Feedback",
              mentorNotes: "Mentor Notes",
            }[tab]}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {view === "dashboard" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div
                key={a.title}
                className="border rounded-2xl p-4 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-xs text-gray-500">
                      {a.stage} • {a.eta}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-lg ${
                      a.status === "In progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{a.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{a.due}</span>
                  <div className="flex gap-2">
                    <button
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-xl"
                      onClick={() => {
                        setSelected(a.title);
                        setView("activity");
                        setHints([]);
                        setError("");
                        setCurrentPrompt(questionByTitle[a.title] || "");
                      }}
                    >
                      {a.status === "In progress" ? "Resume" : "Start"}
                    </button>
                    <button className="text-sm bg-gray-100 px-3 py-1 rounded-xl">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold">Coach</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
              Today’s nudge: Try{" "}
              <span className="font-medium">{assignments[0].title}</span>.
            </div>
          </div>
        </div>
      )}

      {/* Activity Player */}
      {view === "activity" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selected}</h3>
                <p className="text-xs text-gray-500">Step 1 of 3 • ~10 min</p>
              </div>
              <button
                className="text-sm bg-gray-100 px-3 py-1 rounded-xl"
                onClick={() => setView("dashboard")}
              >
                Save & Exit
              </button>
            </div>
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Prompt:</span> {currentPrompt}
              </p>
            </div>

            {selected === "Micro-Network Task" ? (
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p>Use the template below to send one networking message.</p>
                <pre className="bg-gray-100 p-2 rounded-xl text-xs whitespace-pre-wrap">
                  {`Subject: Quick 15-min chat about your role at [Company]?\n\nHi [Name], I'm exploring [field] and noticed your background in [topic]. Would you be open to a quick 15-min chat next week?\nThanks! —[Your Name]`}
                </pre>
              </div>
            ) : (
              <>
                <textarea
                  className="mt-3 w-full h-40 border rounded-xl p-3 text-sm"
                  placeholder="Type your reflections here…"
                ></textarea>
                <div className="mt-3 flex gap-2">
                  <button
                    className="text-sm bg-gray-100 px-3 py-1 rounded-xl"
                    onClick={getAiHint}
                    disabled={loading}
                  >
                    {loading ? "Thinking…" : "Get AI Hint"}
                  </button>
                  <button className="text-sm bg-gray-100 px-3 py-1 rounded-xl">
                    Insert Example
                  </button>
                  <button
                    className="ml-auto text-sm bg-blue-600 text-white px-4 py-1.5 rounded-xl"
                    onClick={() => setView("feedback")}
                  >
                    Submit for Review
                  </button>
                </div>
                {(error || hints.length > 0) && (
                  <div className="mt-4 border rounded-xl p-3 bg-gray-50 text-sm">
                    {error ? (
                      <div className="text-red-600">Error: {error}</div>
                    ) : (
                      <>
                        <div className="font-semibold mb-1">AI Hints</div>
                        <ul className="list-disc list-inside space-y-1">
                          {hints.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="border rounded-2xl p-4 text-sm text-gray-700 space-y-3">
            <h4 className="font-semibold">Progress</h4>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 w-1/3"></div>
            </div>
            <p className="text-xs text-gray-500">1/3 steps completed</p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {view === "feedback" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 border rounded-2xl p-4">
            <h3 className="font-semibold">Quick Feedback</h3>
            <p className="text-sm text-gray-600">
              Help us improve. Takes 30–45 seconds.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-3">
                <p className="text-sm">How helpful was this activity?</p>
                <div className="mt-2 flex gap-2 text-sm">
                  {["1", "2", "3", "4", "5"].map((n) => (
                    <button key={n} className="px-3 py-1 bg-gray-100 rounded-xl">
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl p-3">
                <p className="text-sm">Effort required felt…</p>
                <div className="mt-2 flex gap-2 text-sm">
                  {["Too low", "Just right", "Too high"].map((t) => (
                    <button key={t} className="px-3 py-1 bg-gray-100 rounded-xl">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl p-3 col-span-2">
                <p className="text-sm">Anything we should change?</p>
                <textarea
                  className="mt-2 w-full h-20 border rounded-xl p-2 text-sm"
                  placeholder="Optional"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-xl"
                onClick={() => setView("dashboard")}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Notes */}
      {view === "mentorNotes" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 border rounded-2xl p-4">
            <h3 className="font-semibold mb-1">Mentor Notes → AI Summary</h3>
            <p className="text-sm text-gray-600 mb-3">
              Enter session notes and generate a summary + tasks.
            </p>
            <textarea
              value={mentorNotes}
              onChange={(e) => setMentorNotes(e.target.value)}
              className="w-full h-40 border rounded-xl p-3 text-sm mb-3"
              placeholder="Ex: Mentee was more confident in interviews but still unsure about resume focus..."
            />
            <div className="flex gap-2">
              <button
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-xl"
                onClick={generateSummary}
                disabled={taskLoading}
              >
                {taskLoading ? "Generating..." : "Generate AI Summary"}
              </button>
              <button
                className="text-sm bg-gray-100 px-3 py-1 rounded-xl"
                onClick={() => setMentorNotes("")}
              >
                Clear
              </button>
            </div>

            {/* Output */}
            {taskError && (
              <div className="mt-4 text-red-600 text-sm">❌ {taskError}</div>
            )}
            {aiResult && (
              <div className="mt-6 space-y-4">
                <div className="border rounded-xl p-4 bg-blue-50">
                  <h4 className="font-semibold text-sm mb-1">
                    🧭 Session Summary
                  </h4>
                  <p className="text-sm text-gray-700">
                    {aiResult.session_summary ||
                      aiResult.raw_output ||
                      "No summary text available."}
                  </p>
                </div>
                <div className="border rounded-xl p-4 bg-green-50">
                  <h4 className="font-semibold text-sm mb-1">
                    ✅ Recommended Next Steps
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {(aiResult.next_steps || []).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                {aiResult.emotional_progress && (
                  <div className="border rounded-xl p-4 bg-purple-50">
                    <h4 className="font-semibold text-sm mb-1">
                      💬 Emotional Progress
                    </h4>
                    <p className="text-sm text-gray-700">
                      {aiResult.emotional_progress}
                    </p>
                  </div>
                )}
                <details className="border rounded-xl p-2 bg-gray-50 text-xs">
                  <summary className="cursor-pointer text-gray-700">
                    View raw JSON
                  </summary>
                  <pre className="overflow-auto text-xs mt-2">
                    {JSON.stringify(aiResult, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
          <div className="border rounded-2xl p-6">
            <h4 className="font-semibold mb-2">Quick Directions</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Write 3–5 sentences max.</li>
              <li>Include confidence, blockers, or wins.</li>
              <li>Click “Generate AI Summary.”</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
