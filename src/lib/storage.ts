"use client";

import { Dojo, Season } from "./types";

const STORAGE_KEY = "ninja-dojo-data";

export function loadDojos(): Dojo[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDojos(dojos: Dojo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dojos));
}

export function addDojo(dojo: Dojo) {
  const dojos = loadDojos();
  dojos.push(dojo);
  saveDojos(dojos);
}

export function updateDojo(updated: Dojo) {
  const dojos = loadDojos();
  const idx = dojos.findIndex((d) => d.id === updated.id);
  if (idx >= 0) {
    dojos[idx] = updated;
    saveDojos(dojos);
  }
}

export function deleteDojo(id: string) {
  const dojos = loadDojos().filter((d) => d.id !== id);
  saveDojos(dojos);
}

export function computeSeason(dojo: Dojo): Season {
  const total = dojo.totalReviews;
  if (total < 25) return "spring";
  if (total < 75) return "summer";
  if (total < 150) return "autumn";
  return "winter";
}
