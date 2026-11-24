import React, { useEffect, useState } from 'react';
import { SOCIAL_PLANS } from '../data/gameCatalog.js';

export default function EconomyModal({
  isOpen,
  gameState,
  onSaveTaxes,
  onTogglePlan,
  onClose,
}) {
  const [national, setNational] = useState(gameState.taxes.national);
  const [customs, setCustoms] = useState(gameState.taxes.customs);

  useEffect(() => {
    setNational(gameState.taxes.national);
    setCustoms(gameState.taxes.customs);
  }, [gameState.taxes.national, gameState.taxes.customs, isOpen]);

  if (!isOpen) return null;

  const planDiscount = gameState.president.id === 'reformista' ? 0.8 : 1;

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card modal-card--wide">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            MINISTERIO DE ECONOMÍA // IMPUESTOS Y PLANES SOCIALES
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

        <h2 className="modal-title">IMPUESTOS NACIONALES, ADUANEROS Y ASISTENCIA</h2>

        <div className="pixel-box-dark" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '20px' }}>
            <span>
              Impuestos Nacionales: <strong style={{ color: '#f59e0b' }}>{national}%</strong>
            </span>
            <span>
              Impuestos Aduaneros (Puerto): <strong style={{ color: '#38bdf8' }}>{customs}%</strong>
            </span>
            <span>
              Mercado Negro / Contrabando:{' '}
              <strong style={{ color: gameState.blackMarket > 25 ? '#ef4444' : '#22c55e' }}>
                {gameState.blackMarket}%
              </strong>
            </span>
          </div>

          <label style={{ fontSize: '18px' }}>
            Tasa Nacional (5% a 40%):
            <input
              type="range"
              min="5"
              max="40"
              value={national}
              onChange={(e) => setNational(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ fontSize: '18px' }}>
            Arancel Aduanero (0% a 40%):
            <input
              type="range"
              min="0"
              max="40"
              value={customs}
              onChange={(e) => setCustoms(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <button
            type="button"
            className="pixel-btn"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => onSaveTaxes(national, customs)}
          >
            APLICAR TASAS IMPOSITIVAS
          </button>
        </div>

        <h3 className="power-name" style={{ marginTop: '6px' }}>
          PLANES SOCIALES ACTIVOS ({gameState.activePlans.length} / {SOCIAL_PLANS.length})
        </h3>

        <div className="powers-grid">
          {SOCIAL_PLANS.map((plan) => {
            const isActive = gameState.activePlans.includes(plan.id);
            const cost = Math.round(plan.monthlyCost * planDiscount);
            return (
              <div key={plan.id} className="pixel-box-dark power-card">
                <div className="power-top">
                  <span className="power-name">{plan.name}</span>
                  <span
                    className="power-relation"
                    style={{ background: isActive ? '#14532d' : '#374151', color: '#fff' }}
                  >
                    {isActive ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <p className="power-desc">{plan.detail}</p>
                <div style={{ fontSize: '18px', color: '#f59e0b' }}>Costo: ${cost}k/mes</div>
                <button
                  type="button"
                  className={`pixel-btn ${isActive ? 'pixel-btn--secondary' : ''}`}
                  style={{ fontSize: '9px' }}
                  onClick={() => onTogglePlan(plan.id)}
                >
                  {isActive ? 'SUSPENDER PLAN' : 'ACTIVAR PLAN'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
