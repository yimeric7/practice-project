"use client";

import { useState, useEffect } from "react";
import { Dojo } from "@/lib/types";
import { loadDojos } from "@/lib/storage";
import DojoCard from "@/components/DojoCard";
import CreateDojoModal from "@/components/CreateDojoModal";
import Mochi from "@/components/Mochi";
import Blossoms from "@/components/Blossoms";

export default function VillageMap() {
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDojos(loadDojos());
    setLoaded(true);
  }, []);

  function refresh() {
    setDojos(loadDojos());
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Mochi mood="sleeping" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Blossoms count={6} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">🏯 The Village</h1>
          <p className="text-sm opacity-60 italic">
            A quiet dojo in the woods. Your scrolls are waiting.
          </p>
        </header>

        {/* Mochi greeting */}
        <div className="flex justify-center mb-8">
          <Mochi
            mood={dojos.length === 0 ? "thinking" : "happy"}
            showWisdom={dojos.length > 0}
          />
        </div>

        {/* Dojos grid */}
        {dojos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-2 opacity-70">
              The village is quiet...
            </p>
            <p className="text-sm opacity-50 mb-6">
              Build your first dojo to begin training.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {dojos.map((dojo) => (
              <DojoCard key={dojo.id} dojo={dojo} />
            ))}
          </div>
        )}

        {/* Create button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 rounded-2xl font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--moss)",
              color: "white",
            }}
          >
            + Build New Dojo
          </button>
        </div>
      </div>

      {showCreate && (
        <CreateDojoModal
          onClose={() => setShowCreate(false)}
          onCreated={() => refresh()}
        />
      )}
    </div>
  );
}
