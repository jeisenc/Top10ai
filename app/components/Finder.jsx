"use client";

import { useState } from "react";

const TYPES = [
  { id: "robot", label: "Robot" },
  { id: "robot-lava", label: "Robot que lava" },
  { id: "vertical", label: "Vertical sem fios" },
  { id: "treno", label: "Tradicional" },
];

const BUDGETS = [
  { id: "low", label: "Até 200 €" },
  { id: "any", label: "Mais de 200 €" },
];

// Maps the answers to the guide that fits best. Kept deliberately simple:
// every combination lands on a real guide.
function target(type, budget, pets) {
  if (pets) return "aspiradores-pelos-animais";
  if (type === "robot" && budget === "low") return "robot-aspirador-ate-200-euros";
  if (type === "robot") return "robots-aspiradores";
  if (type === "robot-lava") return "robot-aspira-e-lava";
  if (type === "vertical") return "aspiradores-sem-fios";
  return "aspiradores-de-po";
}

function Chips({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="chips">
        {options.map((o) => (
          <button key={o.id} type="button" className="chip" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Finder() {
  const [type, setType] = useState("robot");
  const [budget, setBudget] = useState("any");
  const [pets, setPets] = useState(false);

  return (
    <div className="finder" role="group" aria-label="Encontra o aspirador certo">
      <Chips legend="Que tipo procuras?" options={TYPES} value={type} onChange={setType} />
      <Chips legend="Orçamento" options={BUDGETS} value={budget} onChange={setBudget} />
      <fieldset>
        <legend>A tua casa</legend>
        <div className="chips">
          <button type="button" className="chip" aria-pressed={pets} onClick={() => setPets(!pets)}>
            Tenho cão ou gato
          </button>
        </div>
      </fieldset>
      <a className="btn" href={`/${target(type, budget, pets)}`} style={{ alignSelf: "flex-start" }}>
        Ver recomendações
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  );
}
