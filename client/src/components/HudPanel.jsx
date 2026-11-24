import React from 'react';
import PixelPortrait from './PixelPortrait.jsx';

export default function HudPanel({ gameState, selectedSector, onCloseSector }) {
  const { playerName, president, cityName, month, stats, sectors } = gameState;
  const monthlyBalance = stats.monthlyIncome - stats.monthlyExpenses;

  return (
    <>
      {/* Barra superior del HUD */}
      <header className="pixel-box hud-top-bar interactive">
        <div className="hud-president-info">
          <PixelPortrait id={president.id} size={46} />
          <div className="hud-president-meta">
            <span className="hud-president-name">
              PRES. {playerName.toUpperCase()} — {president.title}
            </span>
            <span className="hud-city-date">
              {cityName} • MES {month} • ESTADO: CRISIS
            </span>
          </div>
        </div>

        <div className="hud-metrics">
          <div className="metric-chip">
            <span className="metric-label">TESORERÍA</span>
            <span className="metric-value positive">${stats.treasury}k</span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">BALANCE/MES</span>
            <span className={`metric-value ${monthlyBalance >= 0 ? 'positive' : 'danger'}`}>
              {monthlyBalance >= 0 ? '+' : ''}
              ${monthlyBalance}k
            </span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">ORDEN</span>
            <span className={`metric-value ${stats.order < 45 ? 'danger' : 'warning'}`}>
              {stats.order}%
            </span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">APROBACIÓN</span>
            <span className={`metric-value ${stats.approval < 45 ? 'danger' : 'warning'}`}>
              {stats.approval}%
            </span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">CONGRESO</span>
            <span className="metric-value warning">{stats.congressSupport}%</span>
          </div>
        </div>
      </header>

      {/* Paneles laterales medios */}
      <div className="hud-middle">
        <aside className="pixel-box sectors-panel interactive">
          <div className="sectors-title">SECTORES DE LA CIUDAD</div>
          {sectors.map((sector) => (
            <div key={sector.id} className="sector-row">
              <span>{sector.name}</span>
              <span className={`sector-badge lvl-${sector.level}`}>
                NV.{sector.level} • ${sector.monthlyCost}k
              </span>
            </div>
          ))}
        </aside>

        {selectedSector && (
          <aside className="pixel-box sector-inspector interactive">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="inspector-title">{selectedSector.title}</span>
              <button
                type="button"
                className="pixel-btn pixel-btn--secondary"
                style={{ padding: '4px 8px', fontSize: '9px' }}
                onClick={onCloseSector}
              >
                X
              </button>
            </div>
            <p style={{ fontSize: '19px', color: '#f59e0b' }}>
              Estado actual: {selectedSector.status}
            </p>
            <p style={{ fontSize: '18px', color: '#e8ecf5', lineHeight: 1.2 }}>
              {selectedSector.description}
            </p>
            <div className="pixel-box-dark" style={{ padding: '6px 8px', fontSize: '17px' }}>
              Costo actual: ${selectedSector.monthlyCost}k/mes
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
