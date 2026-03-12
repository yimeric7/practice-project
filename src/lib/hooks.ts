"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import type { Card, Mission } from "./types";
import * as storage from "./storage";

// ── useMissions ──────────────────────────────────────
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMissions(storage.getMissions());
    setLoaded(true);
  }, []);

  const reload = useCallback(() => setMissions(storage.getMissions()), []);

  const addMission = useCallback(
    (m: Mission) => {
      storage.saveMission(m);
      reload();
    },
    [reload]
  );

  const updateMission = useCallback(
    (m: Mission) => {
      storage.saveMission(m);
      reload();
    },
    [reload]
  );

  const deleteMission = useCallback(
    (id: string) => {
      storage.deleteMission(id);
      reload();
    },
    [reload]
  );

  return { missions, loaded, addMission, updateMission, deleteMission };
}

// ── useReviewSession ─────────────────────────────────
type Phase = "fighting" | "complete" | "defeated";
type Effect = "hit" | "blocked" | null;

interface ReviewState {
  cards: Card[];
  currentIndex: number;
  isFlipped: boolean;
  comboCount: number;
  maxCombo: number;
  health: number;
  maxHealth: number;
  correct: number;
  wrong: number;
  furyActivations: number;
  lastEffect: Effect;
  phase: Phase;
}

type ReviewAction =
  | { type: "flip" }
  | { type: "grade_correct" }
  | { type: "grade_wrong" }
  | { type: "clear_effect" }
  | { type: "next" };

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case "flip":
      return { ...state, isFlipped: true };

    case "grade_correct": {
      const newCombo = state.comboCount + 1;
      const wasFury = state.comboCount >= 5;
      const nowFury = newCombo >= 5;
      return {
        ...state,
        correct: state.correct + 1,
        comboCount: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        furyActivations:
          state.furyActivations + (!wasFury && nowFury ? 1 : 0),
        lastEffect: "hit",
      };
    }

    case "grade_wrong": {
      const newHealth = state.health - 1;
      return {
        ...state,
        wrong: state.wrong + 1,
        comboCount: 0,
        health: newHealth,
        lastEffect: "blocked",
        phase: newHealth <= 0 ? "defeated" : state.phase,
      };
    }

    case "clear_effect":
      return { ...state, lastEffect: null };

    case "next": {
      const nextIdx = state.currentIndex + 1;
      if (nextIdx >= state.cards.length) {
        return { ...state, phase: "complete", isFlipped: false };
      }
      return { ...state, currentIndex: nextIdx, isFlipped: false };
    }

    default:
      return state;
  }
}

export function useReviewSession(
  cards: Card[],
  maxHealth: number = 3
) {
  const [state, dispatch] = useReducer(reviewReducer, {
    cards,
    currentIndex: 0,
    isFlipped: false,
    comboCount: 0,
    maxCombo: 0,
    health: maxHealth,
    maxHealth,
    correct: 0,
    wrong: 0,
    furyActivations: 0,
    lastEffect: null,
    phase: cards.length === 0 ? "complete" : "fighting",
  });

  const flip = useCallback(() => dispatch({ type: "flip" }), []);
  const gradeCorrect = useCallback(() => dispatch({ type: "grade_correct" }), []);
  const gradeWrong = useCallback(() => dispatch({ type: "grade_wrong" }), []);
  const clearEffect = useCallback(() => dispatch({ type: "clear_effect" }), []);
  const next = useCallback(() => dispatch({ type: "next" }), []);

  const currentCard = state.cards[state.currentIndex] ?? null;
  const isFury = state.comboCount >= 5;
  const progress = state.cards.length
    ? Math.round(((state.currentIndex + 1) / state.cards.length) * 100)
    : 0;

  return {
    ...state,
    currentCard,
    isFury,
    progress,
    flip,
    gradeCorrect,
    gradeWrong,
    clearEffect,
    next,
  };
}
