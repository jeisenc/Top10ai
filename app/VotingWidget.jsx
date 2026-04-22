"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getTimeUntilDrop() {
  const now = new Date();

  // Next 06:00 UTC
  const next = new Date();
  next.setUTCHours(6, 0, 0, 0);
  if (now >= next) next.setUTCDate(next.getUTCDate() + 1);

  const diff = next - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function getTomorrowUTC() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function VotingWidget() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilDrop());
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteDate] = useState(getTomorrowUTC());

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeUntilDrop()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load options + votes
  useEffect(() => {
    const stored = localStorage.getItem(`vote_${voteDate}`);
    if (stored) setUserVote(stored);

    async function load() {
      setLoading(true);

      const { data: optData } = await supabase
        .from("vote_options")
        .select("options")
        .eq("vote_date", voteDate)
        .single();

      if (optData?.options) setOptions(optData.options);

      const { data: voteData } = await supabase
        .from("daily_votes")
        .select("option_text, vote_count")
        .eq("vote_date", voteDate);

      if (voteData) {
        const map = {};
        let total = 0;
        voteData.forEach(v => { map[v.option_text] = v.vote_count; total += v.vote_count; });
        setVotes(map);
        setTotalVotes(total);
      }

      setLoading(false);
    }

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [voteDate]);

  async function handleVote(option) {
    if (userVote) return;

    // Optimistic update
    setUserVote(option);
    setVotes(prev => ({ ...prev, [option]: (prev[option] || 0) + 1 }));
    setTotalVotes(prev => prev + 1);
    localStorage.setItem(`vote_${voteDate}`, option);

    // Try RPC first, fallback to direct update
    const { error } = await supabase.rpc("increment_vote", {
      p_vote_date: voteDate,
      p_option_text: option,
    });

    if (error) {
      await supabase
        .from("daily_votes")
        .update({ vote_count: (votes[option] || 0) + 1 })
        .eq("vote_date", voteDate)
        .eq("option_text", option);
    }
  }

  const pad = n => String(n).padStart(2, "0");
  const maxVotes = Math.max(...Object.values(votes), 0);

  return (
    <div style={{ background: "#fff", border: "1.5px solid #d4d0cb", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>

      {/* Countdown */}
      <div style={{ background: "#1a1a1a", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
            Próximo Top 10 em
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((val, i) => (
              <span key={i} style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: "clamp(28px, 7vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {pad(val)}
                </span>
                {i < 2 && <span style={{ fontSize: 22, color: "#c0392b", fontWeight: 800, lineHeight: 1 }}>:</span>}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>horas · minutos · segundos</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>Às 06:00 todos os dias</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Gerado automaticamente por IA</p>
        </div>
      </div>

      {/* Poll */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px" }}>
            Adivinha a categoria de amanhã 🎯
          </h3>
          {totalVotes > 0 && (
            <span style={{ fontSize: 12, color: "#595959", fontWeight: 500 }}>
              {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#595959", marginBottom: 14, lineHeight: 1.5 }}>
          A IA escolhe diariamente com base no que os portugueses mais pesquisam. Qual achas que será amanhã?
        </p>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 44, background: "#f5f2ee", borderRadius: 10, border: "1.5px solid #e8e4df" }} />
            ))}
          </div>
        ) : options.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", background: "#f8f7f4", borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: "#595959" }}>As opções de amanhã ainda não estão disponíveis.</p>
            <p style={{ fontSize: 12, color: "#767676", marginTop: 4 }}>Volta mais tarde!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((option) => {
              const count = votes[option] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isMyVote = userVote === option;
              const isWinning = userVote && count === maxVotes && count > 0;

              return (
                <button
                  key={option}
                  onClick={() => handleVote(option)}
                  disabled={!!userVote}
                  style={{
                    width: "100%", border: "none", background: "none",
                    padding: 0, cursor: userVote ? "default" : "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent",
                    borderRadius: 10, overflow: "hidden",
                    outline: isMyVote ? "2px solid #c0392b" : "1.5px solid #d4d0cb",
                    outlineOffset: "-1.5px",
                  }}
                >
                  <div style={{ position: "relative", background: "#faf9f7", borderRadius: 10, overflow: "hidden", minHeight: 44 }}>
                    {/* Progress bar */}
                    {userVote && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        width: `${pct}%`,
                        background: isMyVote ? "#fff0ee" : "#f0ede8",
                        transition: "width 0.8s ease",
                        borderRadius: 10,
                      }} />
                    )}
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isMyVote && <span style={{ fontSize: 14, color: "#c0392b" }}>✓</span>}
                        <span style={{ fontSize: 13, fontWeight: isMyVote ? 700 : 600, color: isMyVote ? "#c0392b" : "#1a1a1a" }}>
                          {option}
                        </span>
                        {userVote && isWinning && (
                          <span style={{ fontSize: 12, background: "#fff0ee", color: "#c0392b", fontWeight: 700, padding: "1px 6px", borderRadius: 4 }}>
                            🔥 A ganhar
                          </span>
                        )}
                      </div>
                      {userVote && (
                        <span style={{ fontSize: 13, fontWeight: 700, color: isMyVote ? "#c0392b" : "#595959", flexShrink: 0 }}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {userVote && (
          <p style={{ fontSize: 12, color: "#595959", marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
            Voto registado! Descobre se acertaste amanhã às 06:00 🎯
          </p>
        )}
      </div>
    </div>
  );
}
