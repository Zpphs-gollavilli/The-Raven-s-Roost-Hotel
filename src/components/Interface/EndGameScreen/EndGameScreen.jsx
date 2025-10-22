import { useRef } from 'react';
import useLocalization from '../../../hooks/useLocalization';
import { getAudioInstance } from '../../../utils/audio';
import './EndGameScreen.css';

export default function EndGameScene({ onClose }) {
  const lastMenuSoundTime = useRef(0);
  const { t } = useLocalization();

  // Throttled menu sound
  const playMenuSound = () => {
    const now = Date.now();
    if (now - lastMenuSoundTime.current < 150) return;

    const menuSound = getAudioInstance('menu');
    if (menuSound) {
      menuSound.play().catch(() => {});
      lastMenuSoundTime.current = now;
    }
  };

  // Overlay click closes modal safely
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('endgame-overlay')) {
      playMenuSound();
      if (typeof onClose === 'function') onClose();
    }
  };

  return (
    <div className="endgame-overlay" onMouseDown={handleOverlayClick}>
      <div className="endgame-container" onMouseDown={(e) => e.stopPropagation()}>
        <h2>{t('ui.endGame.title') || 'Game Over'}</h2>

        {/* Close / Cancel Button */}
        <div className="button-group">
          <button
            type="button"
            onClick={() => {
              playMenuSound();
              if (typeof onClose === 'function') onClose();
            }}
            className="close-button"
          >
            {t('ui.endGame.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
