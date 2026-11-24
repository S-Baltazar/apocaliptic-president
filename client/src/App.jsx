import React, { useEffect, useMemo, useState } from 'react';
import PresidentSelect from './components/PresidentSelect.jsx';
import Scene3D from './components/Scene3D.jsx';
import HudPanel from './components/HudPanel.jsx';
import SecretaryBriefing from './components/SecretaryBriefing.jsx';
import EventModal from './components/EventModal.jsx';
import ForeignAidModal from './components/ForeignAidModal.jsx';
import { PRESIDENTS_FALLBACK, buildSecretaryBriefing } from './data/presidents.js';
import {
  fetchPresidents,
  startGameSession,
  changeSectorLevel,
  advanceMonth,
  resolveGameEvent,
  requestForeignAid,
} from './services/api.js';

const SECTOR_INFO_BY_ID = {
  subte: {
    id: 'subte',
    title: 'SUBTE PORTEÑO',
    description:
      'Red subterránea bajo la Av. 9 de Julio. Subir a nivel futurista ($400k/mes) dispara los ingresos, pero exige caja sólida.',
  },
  puerto: {
    id: 'puerto',
    title: 'PUERTO MADERO',
    description:
      'Diques comerciales y Puente de la Mujer. Fundamental para multiplicar ingresos por comercio exterior.',
  },
  energia: {
    id: 'energia',
    title: 'CENTRAL ELÉCTRICA',
    description:
      'Red energética de Buenos Aires. Mantenerla estable evita apagones y sostiene la producción.',
  },
  hospital: {
    id: 'hospital',
    title: 'HOSPITAL CENTRAL',
    description:
      'Salud pública y respuesta sanitaria ante brotes y emergencias urbanas.',
  },
  policia: {
    id: 'policia',
    title: 'COMISARÍA Y BOMBEROS',
    description:
      'Seguridad ciudadana y control de incendios. Protege el orden público frente a crisis.',
  },
};

export default function App() {
  const [presidents, setPresidents] = useState(PRESIDENTS_FALLBACK);
  const [gameState, setGameState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorError, setSectorError] = useState('');
  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [diplomacyFeedback, setDiplomacyFeedback] = useState('');

  useEffect(() => {
    fetchPresidents().then(setPresidents);
  }, []);

  const handleStartGame = async (playerName, presidentId) => {
    setIsSubmitting(true);
    const state = await startGameSession(playerName, presidentId);
    setGameState(state);
    setShowBriefing(true);
    setSelectedSector(null);
    setSectorError('');
    setShowDiplomacy(false);
    setDiplomacyFeedback('');
    setIsSubmitting(false);
  };

  const handleSelectSector = (sectorObj) => {
    setSectorError('');
    setSelectedSector(sectorObj);
  };

  const handleSelectSectorById = (sectorId) => {
    setSectorError('');
    setSelectedSector(SECTOR_INFO_BY_ID[sectorId] || null);
  };

  const handleChangeSectorLevel = async (sectorId, direction) => {
    setSectorError('');
    const result = await changeSectorLevel(gameState, sectorId, direction);
    if (result.error) {
      setSectorError(result.error);
      return;
    }
    setGameState(result.gameState);
  };

  const handleAdvanceMonth = async () => {
    const next = await advanceMonth(gameState);
    setGameState(next);
  };

  const handleResolveEvent = async (optionIndex) => {
    const next = await resolveGameEvent(gameState, optionIndex);
    setGameState(next);
  };

  const handleRequestAid = async (powerId, actionId) => {
    const result = await requestForeignAid(gameState, powerId, actionId);
    if (result.error) {
      setDiplomacyFeedback(result.error);
      return;
    }
    setGameState(result.gameState);
    setDiplomacyFeedback(result.message || 'Acuerdo firmado.');
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
      <Scene3D sectors={gameState.sectors} onSelectSector={handleSelectSector} />

      <div className="hud-layer">
        <HudPanel
          gameState={gameState}
          selectedSector={selectedSector}
          sectorError={sectorError}
          onSelectSectorById={handleSelectSectorById}
          onCloseSector={() => setSelectedSector(null)}
          onChangeSectorLevel={handleChangeSectorLevel}
          onAdvanceMonth={handleAdvanceMonth}
          onOpenDiplomacy={() => {
            setDiplomacyFeedback('');
            setShowDiplomacy(true);
          }}
        />

        {showBriefing ? (
          <SecretaryBriefing
            lines={briefingLines}
            onFinish={() => setShowBriefing(false)}
          />
        ) : (
          <div className="pixel-box hint-bar interactive">
            Haz clic en los sectores de la izquierda o en los edificios 3D para subir/bajar su nivel •{' '}
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

      <EventModal event={gameState.activeEvent} onResolve={handleResolveEvent} />

      <ForeignAidModal
        isOpen={showDiplomacy}
        month={gameState.month}
        cooldowns={gameState.diplomacyCooldowns}
        feedback={diplomacyFeedback}
        onRequestAid={handleRequestAid}
        onClose={() => setShowDiplomacy(false)}
      />

      {gameState.gameOverReason && (
        <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
          <div className="pixel-box modal-card">
            <span className="setup-badge" style={{ color: '#ef4444', borderColor: '#7f1d1d' }}>
              FIN DEL MANDATO // GAME OVER
            </span>
            <h2 className="modal-title" style={{ color: '#ef4444' }}>
              COLAPSO PRESIDENCIAL
            </h2>
            <p className="modal-desc">{gameState.gameOverReason}</p>
            <button
              type="button"
              className="pixel-btn"
              onClick={() => setGameState(null)}
            >
              REINICIAR MANDATO ▶
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
