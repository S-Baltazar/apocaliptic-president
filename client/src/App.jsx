import React, { useEffect, useMemo, useState } from 'react';
import PresidentSelect from './components/PresidentSelect.jsx';
import Scene3D from './components/Scene3D.jsx';
import HudPanel from './components/HudPanel.jsx';
import SecretaryBriefing from './components/SecretaryBriefing.jsx';
import EventModal from './components/EventModal.jsx';
import ForeignAidModal from './components/ForeignAidModal.jsx';
import EconomyModal from './components/EconomyModal.jsx';
import CongressModal from './components/CongressModal.jsx';
import ProjectsModal from './components/ProjectsModal.jsx';
import { PRESIDENTS_FALLBACK, buildSecretaryBriefing } from './data/presidents.js';
import {
  fetchPresidents,
  startGameSession,
  changeSectorLevel,
  updateTaxes,
  toggleSocialPlan,
  proposeLaw,
  startSpecialProject,
  holdPressConference,
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
    description: 'Red energética de Buenos Aires. Mantenerla estable evita apagones y sostiene la producción.',
  },
  hospital: {
    id: 'hospital',
    title: 'HOSPITAL CENTRAL',
    description: 'Salud pública y respuesta sanitaria ante brotes y emergencias urbanas.',
  },
  policia: {
    id: 'policia',
    title: 'COMISARÍA Y BOMBEROS',
    description: 'Seguridad ciudadana y control de incendios. Protege el orden público frente a crisis.',
  },
};

export default function App() {
  const [presidents, setPresidents] = useState(PRESIDENTS_FALLBACK);
  const [gameState, setGameState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorError, setSectorError] = useState('');

  const [showEconomy, setShowEconomy] = useState(false);
  const [showCongress, setShowCongress] = useState(false);
  const [congressFeedback, setCongressFeedback] = useState('');
  const [showProjects, setShowProjects] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState('');
  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [diplomacyFeedback, setDiplomacyFeedback] = useState('');

  useEffect(() => {
    fetchPresidents().then(setPresidents);
  }, []);

  const handleStartGame = async (playerName, presidentId, gameMode) => {
    setIsSubmitting(true);
    const state = await startGameSession(playerName, presidentId, gameMode);
    setGameState(state);
    setShowBriefing(true);
    setSelectedSector(null);
    setSectorError('');
    setShowEconomy(false);
    setShowCongress(false);
    setShowProjects(false);
    setShowDiplomacy(false);
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

  const handleSaveTaxes = async (national, customs) => {
    const res = await updateTaxes(gameState, national, customs);
    if (res.gameState) setGameState(res.gameState);
  };

  const handleTogglePlan = async (planId) => {
    const res = await toggleSocialPlan(gameState, planId);
    if (res.gameState) setGameState(res.gameState);
  };

  const handleProposeLaw = async (lawId, negotiate) => {
    const res = await proposeLaw(gameState, lawId, negotiate);
    if (res.error) {
      setCongressFeedback(res.error);
      return;
    }
    if (res.gameState) setGameState(res.gameState);
    if (res.message) setCongressFeedback(res.message);
  };

  const handleStartProject = async (projectId) => {
    const res = await startSpecialProject(gameState, projectId);
    if (res.error) {
      setProjectFeedback(res.error);
      return;
    }
    if (res.gameState) setGameState(res.gameState);
    if (res.message) setProjectFeedback(res.message);
  };

  const handlePressConference = async () => {
    const res = await holdPressConference(gameState);
    if (res.gameState) setGameState(res.gameState);
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
      <Scene3D
        sectors={gameState.sectors}
        weather={gameState.weather}
        onSelectSector={handleSelectSector}
      />

      <div className="hud-layer">
        <HudPanel
          gameState={gameState}
          selectedSector={selectedSector}
          sectorError={sectorError}
          onSelectSectorById={handleSelectSectorById}
          onCloseSector={() => setSelectedSector(null)}
          onChangeSectorLevel={handleChangeSectorLevel}
          onAdvanceMonth={handleAdvanceMonth}
          onOpenEconomy={() => setShowEconomy(true)}
          onOpenCongress={() => {
            setCongressFeedback('');
            setShowCongress(true);
          }}
          onOpenProjects={() => {
            setProjectFeedback('');
            setShowProjects(true);
          }}
          onOpenDiplomacy={() => {
            setDiplomacyFeedback('');
            setShowDiplomacy(true);
          }}
          onPressConference={handlePressConference}
        />

        {showBriefing ? (
          <SecretaryBriefing lines={briefingLines} onFinish={() => setShowBriefing(false)} />
        ) : (
          <div className="pixel-box hint-bar interactive">
            Clic en sectores o edificios 3D para subir/bajar nivel • Usa Economía, Congreso, Obras y
            Potencias •{' '}
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

      <EconomyModal
        isOpen={showEconomy}
        gameState={gameState}
        onSaveTaxes={handleSaveTaxes}
        onTogglePlan={handleTogglePlan}
        onClose={() => setShowEconomy(false)}
      />

      <CongressModal
        isOpen={showCongress}
        gameState={gameState}
        feedback={congressFeedback}
        onProposeLaw={handleProposeLaw}
        onClose={() => setShowCongress(false)}
      />

      <ProjectsModal
        isOpen={showProjects}
        gameState={gameState}
        feedback={projectFeedback}
        onStartProject={handleStartProject}
        onClose={() => setShowProjects(false)}
      />

      <ForeignAidModal
        isOpen={showDiplomacy}
        month={gameState.month}
        cooldowns={gameState.diplomacyCooldowns}
        feedback={diplomacyFeedback}
        onRequestAid={handleRequestAid}
        onClose={() => setShowDiplomacy(false)}
      />

      {gameState.victoryEnding && (
        <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
          <div className="pixel-box modal-card">
            <span className="setup-badge" style={{ color: '#22c55e', borderColor: '#14532d' }}>
              MANDATO COMPLETADO // MES 36
            </span>
            <h2 className="modal-title" style={{ color: '#22c55e' }}>
              {gameState.victoryEnding.title}
            </h2>
            <p className="modal-desc">{gameState.victoryEnding.desc}</p>
            <button type="button" className="pixel-btn" onClick={() => setGameState(null)}>
              JUGAR NUEVO MANDATO ▶
            </button>
          </div>
        </div>
      )}

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
            <button type="button" className="pixel-btn" onClick={() => setGameState(null)}>
              REINICIAR MANDATO ▶
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
