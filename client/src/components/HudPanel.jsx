import React from 'react';
import PixelPortrait from './PixelPortrait.jsx';
import { SECTOR_LEVELS } from '../data/gameCatalog.js';

export default function HudPanel({
  gameState,
  selectedSector,
  sectorError,
  onSelectSectorById,
  onCloseSector,
  onChangeSectorLevel,
  onAdvanceMonth,
  onOpenEconomy,
  onOpenCongress,
  onOpenProjects,
  onOpenDiplomacy,
  onPressConference,
}) {
  const { playerName, president, cityName, month, stats, sectors, weather, newsHeadline } = gameState;
  const monthlyBalance = stats.monthlyIncome - stats.monthlyExpenses;

  const liveSector = selectedSector
    ? sectors.find((s) => s.id === selectedSector.id) || null
    : null;
  const sectorLevels = liveSector ? SECTOR_LEVELS[liveSector.id] : null;
  const nextLevelCfg =
    liveSector && sectorLevels && liveSector.level < sectorLevels.length - 1
      ? sectorLevels[liveSector.level + 1]
      : null;
  let discount = president.id === 'tecnocrata' ? 0.85 : 1;
  if (gameState.completedProjects?.includes('polo_uba')) discount *= 0.8;
  const nextUpgradeCost = nextLevelCfg ? Math.round(nextLevelCfg.upgradeCost * discount) : 0;

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
              {cityName} • MES {month}
              {gameState.gameMode !== 'infinito' ? '/36' : ''} • CLIMA:{' '}
              <strong style={{ color: '#38bdf8' }}>{weather?.name || 'Nublado'}</strong>
            </span>
          </div>
        </div>

        <div className="hud-metrics">
          <div className="metric-chip">
            <span className="metric-label">TESORERÍA</span>
            <span className={`metric-value ${stats.treasury >= 0 ? 'positive' : 'danger'}`}>
              ${stats.treasury}k
            </span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">BALANCE/MES</span>
            <span className={`metric-value ${monthlyBalance >= 0 ? 'positive' : 'danger'}`}>
              {monthlyBalance >= 0 ? '+' : ''}${monthlyBalance}k
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

        <div className="hud-top-actions">
          <button type="button" className="pixel-btn pixel-btn--secondary" onClick={onOpenEconomy}>
            ECONOMÍA
          </button>
          <button type="button" className="pixel-btn pixel-btn--secondary" onClick={onOpenCongress}>
            CONGRESO
          </button>
          <button type="button" className="pixel-btn pixel-btn--secondary" onClick={onOpenProjects}>
            OBRAS
          </button>
          <button type="button" className="pixel-btn pixel-btn--secondary" onClick={onOpenDiplomacy}>
            POTENCIAS
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn--secondary"
            disabled={gameState.pressUsedThisMonth}
            onClick={onPressConference}
            title="Cadena Nacional (-$60k): +8% Aprobación, +5% Orden"
          >
            PRENSA (-$60k)
          </button>
          <button type="button" className="pixel-btn" onClick={onAdvanceMonth}>
            AVANZAR MES ▶
          </button>
        </div>
      </header>

      {/* Teletipo de El Cronista de Ceniza */}
      {newsHeadline && (
        <div
          className="pixel-box-dark interactive"
          style={{
            marginTop: '6px',
            padding: '4px 12px',
            fontSize: '18px',
            color: '#fde68a',
            borderColor: '#b45309',
          }}
        >
          📰 {newsHeadline}
        </div>
      )}

      {/* Paneles laterales medios */}
      <div className="hud-middle">
        <aside className="pixel-box sectors-panel interactive">
          <div className="sectors-title">SECTORES (CLIC PARA GESTIONAR)</div>
          {sectors.map((sector) => (
            <button
              type="button"
              key={sector.id}
              className={`sector-row sector-row-btn ${
                selectedSector?.id === sector.id ? 'is-active' : ''
              }`}
              onClick={() => onSelectSectorById(sector.id)}
            >
              <span>{sector.name}</span>
              <span className={`sector-badge lvl-${sector.level}`}>
                NV.{sector.level} • ${sector.monthlyCost}k
              </span>
            </button>
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
              Estado:{' '}
              {liveSector
                ? `Nivel ${liveSector.level} — ${liveSector.status}`
                : selectedSector.status}
            </p>
            <p style={{ fontSize: '18px', color: '#e8ecf5', lineHeight: 1.2 }}>
              {selectedSector.description}
            </p>

            {liveSector && (
              <>
                <div className="pixel-box-dark" style={{ padding: '6px 8px', fontSize: '17px' }}>
                  Mantenimiento actual: ${liveSector.monthlyCost}k/mes
                  {nextLevelCfg && (
                    <div style={{ color: '#38bdf8', marginTop: '2px' }}>
                      Próx. nivel ({nextLevelCfg.status}): ${nextUpgradeCost}k obra • $
                      {nextLevelCfg.monthlyCost}k/mes
                    </div>
                  )}
                </div>

                {sectorError && (
                  <div style={{ color: '#ef4444', fontSize: '17px' }}>{sectorError}</div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    className="pixel-btn"
                    style={{ flex: 1, fontSize: '9px', padding: '8px 6px' }}
                    disabled={!nextLevelCfg}
                    onClick={() => onChangeSectorLevel(liveSector.id, 'up')}
                  >
                    {nextLevelCfg ? `SUBIR ▲ ($${nextUpgradeCost}k)` : 'NIVEL MÁXIMO'}
                  </button>
                  <button
                    type="button"
                    className="pixel-btn pixel-btn--secondary"
                    style={{ flex: 1, fontSize: '9px', padding: '8px 6px' }}
                    disabled={liveSector.level <= 0}
                    onClick={() => onChangeSectorLevel(liveSector.id, 'down')}
                  >
                    BAJAR ▼ (-Gasto)
                  </button>
                </div>
              </>
            )}
          </aside>
        )}
      </div>
    </>
  );
}
