import React, { useEffect, useState } from 'react';
import PixelPortrait from './PixelPortrait.jsx';

export default function SecretaryBriefing({ lines, onFinish }) {
  const [step, setStep] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);

  const currentLine = lines[step] || '';
  const isLineComplete = displayedChars >= currentLine.length;
  const isLastStep = step >= lines.length - 1;

  useEffect(() => {
    setDisplayedChars(0);
    const interval = setInterval(() => {
      setDisplayedChars((prev) => {
        if (prev >= currentLine.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 22);

    return () => clearInterval(interval);
  }, [step, currentLine]);

  const handleNext = () => {
    if (!isLineComplete) {
      setDisplayedChars(currentLine.length);
      return;
    }
    if (isLastStep) {
      onFinish();
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <section className="pixel-box secretary-box interactive" aria-label="Informe de la Secretaria">
      <div className="secretary-portrait-col">
        <PixelPortrait id="secretaria" size={76} />
        <span className="secretary-tag">
          CLARA VANCE
          <br />
          SECRETARIA
        </span>
      </div>

      <div className="secretary-content">
        <p className="secretary-text">{currentLine.slice(0, displayedChars)}</p>

        <div className="secretary-actions">
          <span className="secretary-step">
            INFORME {step + 1} / {lines.length}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="pixel-btn pixel-btn--secondary"
              onClick={onFinish}
            >
              OMITIR
            </button>
            <button type="button" className="pixel-btn" onClick={handleNext}>
              {!isLineComplete
                ? 'COMPLETAR'
                : isLastStep
                  ? 'ENTENDIDO ▶'
                  : 'SIGUIENTE ▶'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
