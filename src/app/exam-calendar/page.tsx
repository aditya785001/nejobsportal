"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────

interface ExamEvent {
  id: string;
  examName: string;
  conductingBody: string | null;
  state: string;
  examType: string;
  eventDate: string;
  description: string | null;
  officialUrl: string | null;
  isTentative: boolean;
}

const STATES = [
  { value: "", label: "All States" },
  { value: "Assam", label: "Assam" },
  { value: "ArunachalPradesh", label: "Arunachal Pradesh" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tripura", label: "Tripura" },
  { value: "AllIndia", label: "All India" },
];

const EVENT_TYPES = [
  { value: "", label: "All Types" },
  { value: "Last Date", label: "Last Date" },
  { value: "Notification", label: "Notification" },
  { value: "Result", label: "Result" },
  { value: "Admit Card", label: "Admit Card" },
  { value: "Exam Date", label: "Exam Date" },
  { value: "Interview", label: "Interview" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── Color map for event types ────────────────────────────────────────

function typeColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("last date") || t.includes("deadline")) return "bg-red-100 text-red-700 border-red-200";
  if (t.includes("result")) return "bg-green-100 text-green-700 border-green-200";
  if (t.includes("notification") || t.includes("admit")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (t.includes("exam") || t.includes("interview")) return "bg-purple-100 text-purple-700 border-purple-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function typeDotColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("last date") || t.includes("deadline")) return "bg-red-500";
  if (t.includes("result")) return "bg-green-500";
  if (t.includes("notification") || t.includes("admit")) return "bg-blue-500";
  if (t.includes("exam") || t.includes("interview")) return "bg-purple-500";
  return "bg-gray-500";
}

// ── Helpers ──────────────────────────────────────────────────────────

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// ── Component ────────────────────────────────────────────────────────

export default function ExamCalendarPage() {
  const [events, setEvents] = useState<ExamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      params.set("month", `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`);
      if (stateFilter) params.set("state", stateFilter);
      if (typeFilter) params.set("examType", typeFilter);

      const res = await fetch(`/api/exam-calendar?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, stateFilter, typeFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calendar grid calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Build a lookup: date string -> events on that date
  const eventsByDate = new Map<string, ExamEvent[]>();
  for (const ev of events) {
    const d = new Date(ev.eventDate);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key)!.push(ev);
  }

  // Filtered events for the list view
  const filteredEvents = events.filter((ev) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.examName.toLowerCase().includes(q) ||
        (ev.conductingBody || "").toLowerCase().includes(q) ||
        (ev.description || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort by date
  filteredEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold">📅 Exam Calendar</h1>
          <p className="text-sm text-green-100 mt-1">
            Track important dates for government exams, results, admissions, and scholarships across Northeast India
          </p>
        </div>
      </div>

      <div className="container-main py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
              >
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exams, conducting bodies..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
              />
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              ← Prev
            </button>
            <h2 className="text-lg font-bold text-gray-800 min-w-[180px] text-center">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next →
            </button>
          </div>
          <button onClick={goToday} className="px-3 py-1.5 text-sm bg-[#1a6b3c]/10 text-[#1a6b3c] border border-[#1a6b3c]/30 rounded-lg hover:bg-[#1a6b3c]/20 transition-colors font-medium">
            📍 Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-start-${i}`} className="min-h-[90px] bg-gray-50/50 border-b border-r border-gray-100" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const key = `${year}-${month}-${day}`;
              const dayEvents = eventsByDate.get(key) || [];
              const isToday = sameDay(date, today);
              const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <div
                  key={day}
                  className={`min-h-[90px] border-b border-r border-gray-100 p-1 transition-colors ${
                    isToday ? "bg-[#1a6b3c]/5 ring-1 ring-inset ring-[#1a6b3c]/30" : isPast ? "bg-gray-50/30" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 px-1 py-0.5 rounded ${
                    isToday ? "bg-[#1a6b3c] text-white w-6 h-6 flex items-center justify-center" : "text-gray-600"
                  }`}>
                    {isToday ? day : day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        title={`${ev.examName} — ${ev.examType}`}
                        className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate border ${typeColor(ev.examType)}`}
                      >
                        {ev.examType === "Last Date" ? "📋" : ev.examType === "Result" ? "✅" : "📌"}{" "}
                        {ev.examName.length > 25 ? ev.examName.substring(0, 22) + "..." : ev.examName}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-gray-400 font-medium px-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty cells after last day */}
            {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`empty-end-${i}`} className="min-h-[90px] bg-gray-50/50 border-b border-gray-100" />
            ))}
          </div>
        </div>

        {/* Events List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {loading ? "Loading events..." : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? "s" : ""} in ${MONTHS[month]} ${year}`}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-lg" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No events found for this month</p>
              <p className="text-gray-400 text-sm mt-1">Try changing filters or browsing a different month</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {filteredEvents.map((ev) => {
                const d = new Date(ev.eventDate);
                return (
                  <div key={ev.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                    {/* Date badge */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-lg font-bold text-gray-800 leading-none">{d.getDate()}</div>
                      <div className="text-xs text-gray-500 uppercase mt-0.5">{MONTHS[d.getMonth()].substring(0, 3)}</div>
                    </div>
                    {/* Dot */}
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeDotColor(ev.examType)}`} />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColor(ev.examType)}`}>
                          {ev.examType}
                        </span>
                        {ev.isTentative && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Tentative
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{ev.examName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        {ev.conductingBody && <span>🏛️ {ev.conductingBody}</span>}
                        <span>📍 {STATES.find((s) => s.value === ev.state)?.label || ev.state}</span>
                      </div>
                      {ev.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ev.description.replace(/\[src:[^\]]+\]\s*/g, "")}</p>
                      )}
                    </div>
                    {/* Link */}
                    <div className="flex-shrink-0">
                      {ev.officialUrl && (
                        <a
                          href={ev.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#1a6b3c] hover:underline font-medium"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Automatically populated</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Exam events are automatically extracted when new jobs, results, admissions, or scholarships are posted.
                Dates marked as <span className="font-medium">Tentative</span> may change — always verify on the official notification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
