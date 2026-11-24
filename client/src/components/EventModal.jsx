import React from 'react';

export default function EventModal({ event, onResolve }) {
  if (!event) return null;

  return (
    <div className="modal-backdrop interactive" role="dialog" aria-modal="true">
      <div className="pixel-box modal-card">
        <div className="modal-header">
          <span className="setup-badge" style={{ marginBottom: 0 }}>
            ALERTA NACIONAL // EVENTO ALEATORIO
          </span>
        </div>

        <h2 className="modal-title">{event.title}</h2>
        <p className="modal-desc">{event.description}</p>

        <div className="modal-options">
          {event.options.map((option, idx) => (
            <button
              key={option.label}
              type="button"
              className="pixel-btn modal-option-btn"
              onClick={() => onResolve(idx)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
