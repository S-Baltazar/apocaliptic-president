import React from 'react';
import { FOREIGN_POWERS } from '../data/gameCatalog.js';

export default function ForeignAidModal({
  isOpen,
  month,
  cooldowns,
  feedback,
  onRequestAid,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            CANCILLERÍA // POTENCIAS EXTRANJERAS
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

        <h2 className="modal-title">AYUDA INTERNACIONAL PARA LA RECONSTRUCCIÓN</h2>
        <p className="modal-desc">
          Negocia préstamos, tratados comerciales o envíos humanitarios para sostener la caja de
          Buenos Aires. Cada acuerdo tiene un tiempo de espera de 3 meses.
        </p>

        {feedback && (
          <div className="pixel-box-dark feedback-banner">
            {feedback}
          </div>
        )}

        <div className="powers-grid">
          {FOREIGN_POWERS.map((power) => (
            <div key={power.id} className="pixel-box-dark power-card">
              <div className="power-top">
                <h3 className="power-name">{power.name}</h3>
                <span className="power-relation">{power.relation}</span>
              </div>
              <span className="power-specialty">{power.specialty}</span>
              <p className="power-desc">{power.description}</p>

              <div className="power-actions">
                {power.actions.map((action) => {
                  const key = `${power.id}:${action.id}`;
                  const availableAt = cooldowns?.[key] || 1;
                  const onCooldown = month < availableAt;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      className="pixel-btn power-action-btn"
                      disabled={onCooldown}
                      onClick={() => onRequestAid(power.id, action.id)}
                    >
                      <span>{action.label}</span>
                      <small className="power-detail">
                        {onCooldown ? `Disponible Mes ${availableAt}` : action.detail}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
