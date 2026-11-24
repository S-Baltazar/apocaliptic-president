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

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            OBRAS ESPECIALES // MARAVILLAS CÍVICAS
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

        <h2 className="modal-title">GRANDES PROYECTOS DE RECONSTRUCCIÓN</h2>
        {gameState.activeProject ? (
          <div className="pixel-box-dark feedback-banner" style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>
            En construcción: <strong>{gameState.activeProject.name}</strong> (faltan{' '}
            {gameState.activeProject.monthsLeft} meses)
          </div>
        ) : (
          <p className="modal-desc">
            Solo puedes construir una gran obra a la vez. Al completarse otorga bonificaciones
            permanentes a toda Buenos Aires.
          </p>
        )}

        {feedback && <div className="pixel-box-dark feedback-banner">{feedback}</div>}

        <div className="powers-grid">
          {SPECIAL_PROJECTS.map((proj) => {
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
          })}
        </div>
      </div>
    </div>
  );
}
