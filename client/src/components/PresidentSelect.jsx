import React, { useState } from 'react';
import PixelPortrait from './PixelPortrait.jsx';

export default function PresidentSelect({ presidents, onStartGame, isSubmitting }) {
  const [playerName, setPlayerName] = useState('');
  const [selectedId, setSelectedId] = useState(presidents[0]?.id || 'tecnocrata');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Ingresa tu nombre para asumir la presidencia.');
      return;
    }
    setError('');
    onStartGame(playerName.trim(), selectedId);
  };

  return (
    <div className="setup-screen">
      <form className="setup-container" onSubmit={handleSubmit}>
        <header className="pixel-box setup-header">
          <span className="setup-badge">PROTOCOLO DE EMERGENCIA // BUENOS AIRES</span>
          <h1 className="setup-title">PRESIDENCIA APOCALÍPTICA</h1>
          <p className="setup-subtitle">
            La ciudad está en ruinas. Ingresa tu nombre y elige qué presidente serás.
          </p>
        </header>

        <section className="pixel-box name-bar">
          <label htmlFor="president-name" className="name-label">
            TU NOMBRE:
          </label>
          <input
            id="president-name"
            type="text"
            className="pixel-input"
            placeholder="Ej: Baltazar / Valeria..."
            maxLength={28}
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (error) setError('');
            }}
            autoFocus
          />
        </section>

        <section className="presidents-grid" aria-label="Selección de presidente">
          {presidents.map((pres) => {
            const isSelected = pres.id === selectedId;
            return (
              <button
                type="button"
                key={pres.id}
                onClick={() => setSelectedId(pres.id)}
                className={`pixel-box president-card ${isSelected ? 'is-selected' : ''}`}
              >
                <div className="president-card-top">
                  <PixelPortrait id={pres.id} size={60} />
                  <div className="president-name-block">
                    <h3>{pres.title}</h3>
                    <span className="president-archetype">{pres.archetype}</span>
                  </div>
                </div>

                <p className="president-quote">{pres.quote}</p>
                <p className="president-desc">{pres.description}</p>

                <ul className="president-bonuses">
                  {pres.bonuses.map((bonus) => (
                    <li key={bonus}>+ {bonus}</li>
                  ))}
                </ul>

                <div className="president-stats-mini">
                  <span>Caja: ${pres.startingStats.treasury}k</span>
                  <span>Orden: {pres.startingStats.order}%</span>
                  <span>Aprob: {pres.startingStats.approval}%</span>
                </div>
              </button>
            );
          })}
        </section>

        <footer className="pixel-box setup-footer">
          <div>
            {error ? (
              <span className="error-text">{error}</span>
            ) : (
              <span className="setup-subtitle">
                Perfil elegido:{' '}
                <strong style={{ color: '#f59e0b' }}>
                  {presidents.find((p) => p.id === selectedId)?.title}
                </strong>
              </span>
            )}
          </div>
          <button type="submit" className="pixel-btn" disabled={isSubmitting}>
            {isSubmitting ? 'CARGANDO...' : 'ASUMIR LA PRESIDENCIA ▶'}
          </button>
        </footer>
      </form>
    </div>
  );
}
