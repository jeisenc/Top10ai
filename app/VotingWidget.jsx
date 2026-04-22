"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getTimeUntilDrop() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0);

  // If it's before 06:00 today, next drop is today at 06:00
  const todayDrop = new Date();
  todayDrop.setHours(6, 0, 0, 0);
  const target = now < todayDrop ? todayDrop : tomorrow;

  const diff = target - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total: diff };
}

export default function VotingWidget() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilDrop());
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteDate, setVoteDate] = useState(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilDrop());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load vote options and counts
  useEffect(() => {
    async function loadVotes() {
      setLoading(true);

      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      setVoteDate(tomorrowStr);

      // Check if user already voted (stored in localStorage)
      const storedVote = localStorage.getItem(`vote_${tomorrowStr}`);
      if (storedVote) setUserVote(storedVote);

      // Get vote options for tomorrow
      const { data: optionsData } = await supabase
        .from("vote_options")
        .select("options")
        .eq("vote_date", tomorrowStr)
        .single();

      if (optionsData?.options) {
        setOptions(optionsData.options);
      }

      // Get vote counts
      const { data: votesData } = await supabase
        .from("daily_votes")
        .select("option_text, vote_count")
        .eq("vote_date", tomorrowStr);

      if (votesData) {
        const voteMap = {};
        let total = 0;
        votesData.forEach(v => {
          voteMap[v.option_text] = v.vote_count;
          total += v.vote_count;
        });
        setVotes(voteMap);
        setTotalVotes(total);
      }

      setLoading(false);
    }

    loadVotes();

    // Refresh votes every 30 seconds
    const interval = setInterval(loadVotes, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleVote(option) {
    if (userVote || voting || !voteDate) return;

    setVoting(true);

    // Optimistic update
    setUserVote(option);
    setVotes(prev => ({ ...prev, [option]: (prev[option] || 0) + 1 }));
    setTotalVotes(prev => prev + 1);
    localStorage.setItem(`vote_${voteDate}`, option);

    // Save to Supabase
    const { error } = await supabase.rpc("increment_vote", {
      p_vote_date: voteDate,
      p_option_text: option,
    });

    if (error) {
      // Fallback: direct update
      const current = votes[option] || 0;
      await supabase
        .from("daily_votes")
        .update({ vote_count: current + 1 })
        .eq("vote_date", voteDate)
        .eq("option_text", option);
    }

    setVoting(false);
  }

  const pad = n => String(n).padStart(2, "0");
  const hasVoted = !!userVote;
  const hasOptions = options.length > 0;

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #d4d0cb",
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
    }}>

      {/* Countdown header */}
      <div style={{
        background: "#1a1a1a",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>
            Próximo Top 10 em
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
              {pad(timeLeft.hours)}
            </span>
            <span style={{ fontSize: 20, color: "#c0392b", fontWeight: 800 }}>:</span>
            <span style={{ fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
              {pad(timeLeft.minutes)}
            </span>
            <span style={{ fontSize: 20, color: "#c0392b", fontWeight: 800 }}>:</span>
            <span style={{ fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
              {pad(timeLeft.seconds)}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            horas · minutos · segundos
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>Às 06:00</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Gerado automaticamente por IA</p>
        </div>
      </div>

      {/* Voting section */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px" }}>
            Adivinha a categoria de amanhã
          </h3>
          {totalVotes > 0 && (
            <span style={{ fontSize: 12, color: "#595959", fontWeight: 500 }}>
              {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#595959", marginBottom: 14, lineHeight: 1.5 }}>
          A IA vai escolher a categoria mais procurada pelos portugueses amanhã. Qual achas que vai ser?
        </p>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 44, background: "#f5f2ee", borderRadius: 10, border: "1.5px solid #e8e4df" }} />
            ))}
          </div>
        ) : !hasOptions ? (
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
              const isWinning = hasVoted && count === Math.max(...Object.values(votes));

              return (
                <button
                  key={option}
                  onClick={() => handleVote(option)}
                  disabled={hasVoted || voting}
                  style={{
                    width: "100%", border: "none", background: "none",
                    padding: 0, cursor: hasVoted ? "default" : "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent",
                    borderRadius: 10, overflow: "hidden",
                    outline: isMyVote ? "2px solid #c0392b" : "1.5px solid #d4d0cb",
                    outlineOffset: "-1.5px",
                    transition: "outline 0.15s",
                  }}
                >
                  <div style={{ position: "relative", background: "#faf9f7", borderRadius: 10, overflow: "hidden" }}>
                    {/* Progress bar */}
                    {hasVoted && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        width: `${pct}%`,
                        background: isMyVote ? "#fff0ee" : "#f5f2ee",
                        transition: "width 0.6s ease",
                        borderRadius: 10,
                      }} />
                    )}

                    {/* Content */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isMyVote && (
                          <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: isMyVote ? 700 : 600, color: isMyVote ? "#c0392b" : "#1a1a1a" }}>
                          {option}
                        </span>
                        {hasVoted && isWinning && (
                          <span style={{ fontSize: 11, background: "#fff0ee", color: "#c0392b", fontWeight: 700, padding: "1px 6px", borderRadius: 4 }}>
                            🔥 A ganhar
                          </span>
                        )}
                      </div>
                      {hasVoted && (
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

        {hasVoted && (
          <p style={{ fontSize: 12, color: "#595959", marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
            Voto registado! Descobre se acertaste amanhã às 06:00 🎯
          </p>
        )}
      </div>
    </div>
  );
}
