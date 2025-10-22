import { useState, useRef } from 'react';
import useLocalization from '../../../hooks/useLocalization';
import { getAudioInstance } from '../../../utils/audio';
import './BugReport.css';

export default function BugReport({ onClose }) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const lastMenuSoundTime = useRef(0);
  const { t } = useLocalization();

  // Play menu click sound, throttled
  const playMenuSound = () => {
    const now = Date.now();
    if (now - lastMenuSoundTime.current < 150) return;

    const menuSound = getAudioInstance('menu');
    if (menuSound) {
      menuSound.play().catch(() => {});
      lastMenuSoundTime.current = now;
    }
  };

  // Submit bug report locally
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Bug report submitted locally:', description);
      setSubmitSuccess(true);
      playMenuSound();

      // Auto-close after 2 seconds
      setTimeout(() => {
        if (typeof onClose === 'function') onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting bug report:', err);
      setError(t('ui.bugReport.submitError') || 'Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('bug-report-overlay')) {
      playMenuSound();
      if (typeof onClose === 'function') onClose();
    }
  };

  return (
    <div className="bug-report-overlay" onMouseDown={handleOverlayClick}>
      <div className="bug-report-container" onMouseDown={(e) => e.stopPropagation()}>
        <h2>{t('ui.bugReport.title')}</h2>

        {!submitSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">{t('ui.bugReport.description')}</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder={t('ui.bugReport.placeholder')}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                type="button"
                onClick={() => {
                  playMenuSound();
                  if (typeof onClose === 'function') onClose();
                }}
                className="cancel-button"
              >
                {t('ui.bugReport.cancel')}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="submit-button"
              >
                {isSubmitting
                  ? t('ui.bugReport.submitting')
                  : t('ui.bugReport.submit')}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-message">{t('ui.bugReport.success')}</div>
        )}
      </div>
    </div>
  );
}
