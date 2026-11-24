import React from 'react';
import { SPECIAL_PROJECTS } from '../data/gameCatalog.js';

export default function ProjectsModal({
  isOpen,
  gameState,
  feedback,
  onStartProject,
  onClose,
}) {
  if (!isOpen) return null;

  const agendaIds = gameState.projectsAgenda || SPECIAL_PROJECTS.slice(0, 3).map((p) => p.id);
  const visibleIds = new Set(agendaIds);
  if (gameState.activeProject?.id) visibleIds.add(gameState.activeProject.id);

  const visibleProjects = [...visibleIds]
    .map((id) => SPECIAL_PROJECTS.find((p) => p.id === id))
    .filter(Boolean);

  const completedProjectObjects = (gameState.completedProjects || [])
    .map((id) => SPECIAL_PROJECTS.find((p) => p.id === id))
    .filter(Boolean);

  const nextRotation = gameState.projectsNextRotationMonth || gameState.month + 3;

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            OBRAS ESPECIALES // PLAN TRIMESTRAL
          </span>
          <button
            type="button"
            className="pixel-btn pixel-btn--secondary"
            style={{ padding: '4px 10px', fontSize: '9px' }}
            onClick={onClose}
          >
            CERRAR
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <h2 className="modal-title">GRANDES PROYECTOS DE RECONSTRUCCIÓN</h2>
          <span className="sector-badge lvl-3" style={{ fontSize: '9px', padding: '4px 8px' }}>
            PRÓXIMA RENOVACIÓN: MES {nextRotation}
          </span>
        </div>

        {gameState.activeProject ? (
          <div
            className="pixel-box-dark feedback-banner"
            style={{ color: '#38bdf8', borderColor: '#38bdf8' }}
          >
            En construcción: <strong>{gameState.activeProject.name}</strong> (faltan{' '}
            {gameState.activeProject.monthsLeft} meses)
          </div>
        ) : (
          <p className="modal-desc">
            Las obras disponibles cambian automáticamente cada 3 meses. Solo puedes construir una
            gran obra a la vez.
          </p>
        )}

        {feedback && <div className="pixel-box-dark feedback-banner">{feedback}</div>}

        <div className="powers-grid">
          {visibleProjects.length === 0 ? (
            <div className="pixel-box-dark" style={{ padding: '14px', fontSize: '19px' }}>
              ¡Has completado todas las grandes obras especiales de Buenos Aires!
            </div>
          ) : (
            visibleProjects.map((proj) => {
              const done = gameState.completedProjects.includes(proj.id);
              const inProgress = gameState.activeProject?.id === proj.id;
              return (
                <div key={proj.id} className="pixel-box-dark power-card">
                  <div className="power-top">
                    <span className="power-name">{proj.name}</span>
                    <span
                      className="power-relation"
                      style={{
                        background: done ? '#14532d' : inProgress ? '#164e63' : '#374151',
                        color: '#fff',
                      }}
                    >
                      {done ? 'LISTA' : inProgress ? 'EN OBRA' : `${proj.monthsRequired} MESES`}
                    </span>
                  </div>
                  <p className="power-desc">{proj.detail}</p>
                  <div style={{ fontSize: '18px', color: '#f59e0b' }}>Inversión: ${proj.cost}k</div>

                  {!done && (
                    <button
                      type="button"
                      className="pixel-btn"
                      style={{ fontSize: '9px', marginTop: 'auto' }}
                      disabled={Boolean(gameState.activeProject)}
                      onClick={() => onStartProject(proj.id)}
                    >
                      {inProgress ? 'CONSTRUYENDO...' : `INICIAR OBRA ($${proj.cost}k)`}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {completedProjectObjects.length > 0 && (
          <div className="pixel-box-dark" style={{ padding: '10px 12px' }}>
            <div className="sectors-title" style={{ marginBottom: '6px' }}>
              OBRAS ESPECIALES COMPLETADAS ({completedProjectObjects.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {completedProjectObjects.map((p) => (
                <span key={p.id} className="sector-badge lvl-2" style={{ fontSize: '8px' }}>
                  ✓ {p.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
