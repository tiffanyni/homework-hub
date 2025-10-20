import { useState } from "react";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState("Strengths Journal");

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

  return (
    <div className="p-6 space-y-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Homework Hub</h1>
        </div>
        <div className="flex items-center gap-3">
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
        <button
          onClick={() => setView("dashboard")}
          className={`px-3 py-1.5 rounded-xl ${
            view === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setView("activity")}
          className={`px-3 py-1.5 rounded-xl ${
            view === "activity" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Activity Player
        </button>
        <button
          onClick={() => setView("feedback")}
          className={`px-3 py-1.5 rounded-xl ${
            view === "feedback" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Feedback
        </button>
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

          {/* Coach / Nudges */}
          <div className="border rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold">Coach</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
              Today’s nudge: Try{" "}
              <span className="font-medium">{assignments[0].title}</span>.
              Reflect on 3 energizing moments — I’ll auto-tag strengths for you.
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">Quick Resources</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>STAR method one-pager</li>
                <li>Networking message template</li>
                <li>Resume impact verb list</li>
              </ul>
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
                <span className="font-semibold">Prompt:</span> Write three
                moments in the past week that made you feel energized or proud.
                For each moment, add a short note on what skill you used (e.g.,
                organizing, problem-solving, empathy).
              </p>
            </div>

            <textarea
              className="mt-3 w-full h-40 border rounded-xl p-3 text-sm"
              placeholder="Type your reflections here…"
            ></textarea>

            <div className="mt-3 flex gap-2">
              <button className="text-sm bg-gray-100 px-3 py-1 rounded-xl">
                Get AI Hint
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

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">
                Attach Artifact (optional)
              </h4>
              <div className="border rounded-xl p-3 text-sm text-gray-600">
                Drop files here or click to upload (resume, notes, screenshots)
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="border rounded-2xl p-4 space-y-4">
            <h4 className="font-semibold">Progress</h4>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 w-1/3"></div>
            </div>
            <p className="text-xs text-gray-500">1/3 steps completed</p>
            <div>
              <h4 className="text-sm font-semibold mb-1">Next up</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Auto-tag skills</li>
                <li>Create 1 STAR bullet</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm">
              Your mentor will review this before your next session. You’ll get
              suggestions in the app.
            </div>
          </div>
        </div>
      )}

      {/* Feedback View */}
      {view === "feedback" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 border rounded-2xl p-4">
            <h3 className="font-semibold">Quick Feedback</h3>
            <p className="text-sm text-gray-600">
              Help us improve these activities. This takes{" "}
              <strong>30–45 seconds</strong>.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-3">
                <p className="text-sm">How helpful was this activity?</p>
                <div className="mt-2 flex gap-2 text-sm">
                  {["1", "2", "3", "4", "5"].map((n) => (
                    <button
                      key={n}
                      className="px-3 py-1 rounded-xl bg-gray-100"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl p-3">
                <p className="text-sm">Effort required felt…</p>
                <div className="mt-2 flex gap-2 text-sm">
                  {["Too low", "Just right", "Too high"].map((t) => (
                    <button
                      key={t}
                      className="px-3 py-1 rounded-xl bg-gray-100"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl p-3">
                <p className="text-sm">Would you recommend this to a peer?</p>
                <div className="mt-2 flex gap-2 text-sm">
                  {["No", "Maybe", "Yes"].map((t) => (
                    <button
                      key={t}
                      className="px-3 py-1 rounded-xl bg-gray-100"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl p-3">
                <p className="text-sm">Anything we should change?</p>
                <textarea
                  className="mt-2 w-full h-20 border rounded-xl p-2 text-sm"
                  placeholder="Optional: 1-2 lines"
                ></textarea>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-xl"
                onClick={() => setView("dashboard")}
              >
                Submit Feedback
              </button>
            </div>
          </div>

          <div className="border rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold">After you submit</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>AI draft of resume bullet (edit anytime)</li>
              <li>Mentor notes appear within 48h</li>
              <li>Next activity unlocked</li>
            </ul>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-sm">
              Thanks! Your input helps us test engagement (activation,
              completion, retention).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
