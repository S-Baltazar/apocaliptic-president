import React from 'react';
import { CONGRESS_LAWS } from '../data/gameCatalog.js';

export default function CongressModal({
  isOpen,
  gameState,
  feedback,
  onProposeLaw,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            CONGRESO DE LA NACIÓN // PROPUESTA DE LEYES
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

        <h2 className="modal-title">
          APOYO LEGISLATIVO ACTUAL: {gameState.stats.congressSupport}%
        </h2>
        <p className="modal-desc">
          Propón leyes estructurales. Si tu apoyo en el Congreso no alcanza, puedes negociar
          concesiones (-$70k) para sumar +18% de votos en la sesión.
        </p>

        {feedback && <div className="pixel-box-dark feedback-banner">{feedback}</div>}

        <div className="powers-grid">
          {CONGRESS_LAWS.map((law) => {
            const passed = gameState.passedLaws.includes(law.id);
            return (
              <div key={law.id} className="pixel-box-dark power-card">
                <div className="power-top">
                  <span className="power-name">{law.name}</span>
                  <span
                    className="power-relation"
                    style={{ background: passed ? '#14532d' : '#78350f', color: '#fff' }}
                  >
                    {passed ? 'APROBADA' : `REQ. ${law.difficulty}%`}
                  </span>
                </div>
                <p className="power-desc">{law.detail}</p>

                {!passed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="pixel-btn"
                      style={{ fontSize: '9px' }}
                      onClick={() => onProposeLaw(law.id, false)}
                    >
                      PROPONER A VOTACIÓN
                    </button>
                    <button
                      type="button"
                      className="pixel-btn pixel-btn--secondary"
                      style={{ fontSize: '9px' }}
                      onClick={() => onProposeLaw(law.id, true)}
                    >
                      NEGOCIAR VOTOS (-$70k / +18%)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
