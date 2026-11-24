import React, { useEffect, useMemo, useState } from 'react';
import PresidentSelect from './components/PresidentSelect.jsx';
import Scene3D from './components/Scene3D.jsx';
import HudPanel from './components/HudPanel.jsx';
import SecretaryBriefing from './components/SecretaryBriefing.jsx';
import { PRESIDENTS_FALLBACK, buildSecretaryBriefing } from './data/presidents.js';
import { fetchPresidents, startGameSession } from './services/api.js';

export default function App() {
  const [presidents, setPresidents] = useState(PRESIDENTS_FALLBACK);
  const [gameState, setGameState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    fetchPresidents().then(setPresidents);
  }, []);

  const handleStartGame = async (playerName, presidentId) => {
    setIsSubmitting(true);
    const state = await startGameSession(playerName, presidentId);
    setGameState(state);
    setShowBriefing(true);
    setSelectedSector(null);
    setIsSubmitting(false);
  };

  const briefingLines = useMemo(() => {
    if (!gameState) return [];
    return buildSecretaryBriefing(gameState.playerName, gameState.president);
  }, [gameState]);

  if (!gameState) {
    return (
      <PresidentSelect
        presidents={presidents}
        onStartGame={handleStartGame}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <main className="game-viewport">
      <Scene3D onSelectSector={setSelectedSector} />

      <div className="hud-layer">
        <HudPanel
          gameState={gameState}
          selectedSector={selectedSector}
          onCloseSector={() => setSelectedSector(null)}
        />

        {showBriefing ? (
          <SecretaryBriefing
            lines={briefingLines}
            onFinish={() => setShowBriefing(false)}
          />
        ) : (
          <div className="pixel-box hint-bar interactive">
            Arrastra para rotar la ciudad destruida • Haz clic en un edificio (Subte, Puerto,
            Hospital, Energía o Comisaría) para inspeccionarlo •{' '}
            <button
              type="button"
              className="pixel-btn pixel-btn--secondary"
              style={{ padding: '4px 10px', fontSize: '9px', marginLeft: '8px' }}
              onClick={() => setShowBriefing(true)}
            >
              VER INFORME
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
