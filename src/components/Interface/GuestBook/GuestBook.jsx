import { useState, useEffect, useRef, useCallback } from 'react'
import PopupWrapper from '../PopupWrapper/PopupWrapper'
import headerSvg from '../header.svg'
import useGame from '../../../hooks/useGame'
import useDebounce from '../../../hooks/useDebounce'
import AnimatedCloseButton from '../AnimatedCloseButton/AnimatedCloseButton'
import useLocalization from '../../../hooks/useLocalization'
import './GuestBook.css'

const PAGE_SIZE = 10 // or any number you like

async function fetchGuestBookPage(pageNumber = 1, search = '') {
  const res = await fetch(
    `/.netlify/functions/guestbook?page=${pageNumber}&search=${encodeURIComponent(search)}`
  )
  if (!res.ok) throw new Error('Failed to fetch guestbook data')
  return await res.json()
}

function GuestBookContent({ onClose }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const deviceMode = useGame((state) => state.deviceMode)
  const guestBookRef = useRef(null)
  const { t } = useLocalization()
  const debouncedSearch = useDebounce(searchInput, 300)

  const loadPage = useCallback(async (pageNumber = 1, search = '') => {
    try {
      setLoading(true)
      const data = await fetchGuestBookPage(pageNumber, search)
      setEntries(data.entries || [])
      setCurrentPage(data.currentPage || 1)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Error loading guestbook page:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPage(1)
  }, [loadPage])

  useEffect(() => {
    loadPage(1, debouncedSearch)
  }, [debouncedSearch, loadPage])

  const loadNextPage = () => {
    if (currentPage < totalPages) loadPage(currentPage + 1, searchInput)
  }

  const loadPreviousPage = () => {
    if (currentPage > 1) loadPage(currentPage - 1, searchInput)
  }

  return (
    <div className="guestbook-content" ref={guestBookRef}>
      <img src={headerSvg} alt={t('ui.reception.guestBook')} />
      <div className="guestbook-header">
        <AnimatedCloseButton onClick={onClose} size={1} />
      </div>

      <div className="guestbook-header-section">
        <div className="guestbook-title-subtitle">
          <h2>{t('ui.reception.guestBook')}</h2>
          <p className="guestbook-subtitle">{t('ui.reception.guestBookSubtitle')}</p>
        </div>

        <div className="page-indicator">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('ui.reception.searchPlaceholder')}
            className="page-input"
            data-gamepad-skip="true"
          />
        </div>
      </div>

      <>
        <div className="guestbook-entries">
          {loading ? (
            <div className="guestbook-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <table className="guestbook-table">
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id || index} className="guestbook-entry">
                    <td className="guestbook-rank">
                      #{(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="guestbook-name">{entry.playerName}</td>
                    <td className="guestbook-time">{entry.formattedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="guestbook-pagination">
          <span />
          <div className="pagination-button-container">
            <button
              onClick={loadPreviousPage}
              className="pagination-button"
              disabled={currentPage <= 1}
            >
              <svg width="57" height="22" style={{ transform: 'rotate(180deg)' }}>
                <path
                  stroke="#efd89b"
                  strokeWidth={2}
                  fill="none"
                  d="m 1.0389507,10.982586 34.3607143,0.01914 6.598599,-6.5859935 6.588051,6.5828805 -6.529849,6.59752 -6.700832,-6.638602"
                />
              </svg>
            </button>

            <button
              onClick={loadNextPage}
              className="pagination-button"
              disabled={currentPage >= totalPages}
            >
              <svg width="57" height="22">
                <path
                  stroke="#efd89b"
                  strokeWidth={2}
                  fill="none"
                  d="m 1.0389507,10.982586 34.3607143,0.01914 6.598599,-6.5859935 6.588051,6.5828805 -6.529849,6.59752 -6.700832,-6.638602"
                />
              </svg>
            </button>
          </div>

          <div className="page-info">
            {currentPage} / {totalPages}
          </div>
        </div>
      </>
    </div>
  )
}

export default function GuestBook() {
  return (
    <PopupWrapper cursorType="book">
      <GuestBookContent />
    </PopupWrapper>
  )
}
