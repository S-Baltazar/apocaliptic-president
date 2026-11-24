import React from 'react';
import { CONGRESS_LAWS } from '../data/gameCatalog.js';

export default function CongressModal({
  isOpen,
  gameState,
  feedback,
  onProposeLaw,
  onBoostCongress,
  onClose,
}) {
  if (!isOpen) return null;

  const agendaIds = gameState.congressAgenda || CONGRESS_LAWS.slice(0, 3).map((l) => l.id);
  const activeAgendaLaws = agendaIds
    .map((id) => CONGRESS_LAWS.find((l) => l.id === id))
    .filter(Boolean);

  const passedLawObjects = (gameState.passedLaws || [])
    .map((id) => CONGRESS_LAWS.find((l) => l.id === id))
    .filter(Boolean);

  const nextRotation = gameState.congressNextRotationMonth || gameState.month + 3;
  const boostUsed = Boolean(gameState.congressBoostUsedThisMonth);

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            CONGRESO DE LA NACIÓN // AGENDA TRIMESTRAL
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
          <h2 className="modal-title">
            APOYO LEGISLATIVO ACTUAL: {gameState.stats.congressSupport}%
          </h2>
          <span className="sector-badge lvl-3" style={{ fontSize: '9px', padding: '4px 8px' }}>
            PRÓXIMA RENOVACIÓN: MES {nextRotation}
          </span>
        </div>

        <p className="modal-desc">
          Las propuestas del Congreso se renuevan automáticamente cada 3 meses. Si tu apoyo cayó
          incluso a 0%, puedes usar la gestión parlamentaria (1 por mes) para recuperar bancas.
        </p>

        {/* Gestión para subir apoyo del Congreso */}
        <div className="pixel-box-dark" style={{ padding: '10px 12px' }}>
          <div className="sectors-title" style={{ marginBottom: '8px' }}>
            RECUPERAR APOYO PARLAMENTARIO {boostUsed ? '(YA USADO ESTE MES)' : '(1 POR MES)'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              className="pixel-btn"
              style={{ fontSize: '9px', flex: 1, minWidth: '180px' }}
              disabled={boostUsed}
              onClick={() => onBoostCongress('dialogo')}
            >
              DIÁLOGO (-$50k → +12%)
            </button>
            <button
              type="button"
              className="pixel-btn"
              style={{ fontSize: '9px', flex: 1, minWidth: '180px' }}
              disabled={boostUsed}
              onClick={() => onBoostCongress('pacto')}
            >
              PACTO (-$110k → +25%, +3% Orden)
            </button>
            <button
              type="button"
              className="pixel-btn pixel-btn--secondary"
              style={{ fontSize: '9px', flex: 1, minWidth: '180px' }}
              disabled={boostUsed}
              onClick={() => onBoostCongress('concesion')}
            >
              CONCESIÓN ($0k / -4% Aprob → +10%)
            </button>
          </div>
        </div>

        {feedback && <div className="pixel-box-dark feedback-banner">{feedback}</div>}

        <div className="powers-grid">
          {activeAgendaLaws.length === 0 ? (
            <div className="pixel-box-dark" style={{ padding: '14px', fontSize: '19px' }}>
              ¡Has aprobado todas las leyes disponibles en la República!
            </div>
          ) : (
            activeAgendaLaws.map((law) => {
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
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginTop: 'auto',
                      }}
                    >
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
            })
          )}
        </div>

        {passedLawObjects.length > 0 && (
          <div className="pixel-box-dark" style={{ padding: '10px 12px' }}>
            <div className="sectors-title" style={{ marginBottom: '6px' }}>
              LEYES VIGENTES APROBADAS ({passedLawObjects.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {passedLawObjects.map((l) => (
                <span key={l.id} className="sector-badge lvl-2" style={{ fontSize: '8px' }}>
                  ✓ {l.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
