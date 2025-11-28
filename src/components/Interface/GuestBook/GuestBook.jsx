import { useState, useEffect, useRef, useCallback } from 'react';
import PopupWrapper from '../PopupWrapper/PopupWrapper';
import headerSvg from '../header.svg';
import useGame from '../../../hooks/useGame';
import useDebounce from '../../../hooks/useDebounce';
import AnimatedCloseButton from '../AnimatedCloseButton/AnimatedCloseButton';
import useLocalization from '../../../hooks/useLocalization';
import './GuestBook.css';

// ---------------------------
// Mock Data (replace later if needed)
// ---------------------------
const PAGE_SIZE = 100;

// Create 50 mock entries
const mockEntries = Array.from({ length: 50 }, (_, i) => ({
	id: `mock-${i + 1}`,
	playerName: `Player_${i + 1}`,
	formattedTime: `00:${(i + 10).toString().padStart(2, '0')}:${(Math.random() * 60)
		.toFixed(0)
		.padStart(2, '0')}`,
}));

const getMockPage = async (pageNumber) => {
	const totalPages = Math.ceil(mockEntries.length / PAGE_SIZE);
	const startIndex = (pageNumber - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const entries = mockEntries.slice(startIndex, endIndex);
	return {
		entries,
		currentPage: pageNumber,
		totalPages,
	};
};

// ---------------------------
// Component
// ---------------------------
function GuestBookContent({ onClose }) {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const deviceMode = useGame((state) => state.deviceMode);
	const guestBookRef = useRef(null);
	const { t } = useLocalization();

	const debouncedSearch = useDebounce(searchInput, 300);

	// ---------------------------
	// Load mock data pages
	// ---------------------------
	const loadPage = useCallback(async (pageNumber) => {
		setLoading(true);
		try {
			const result = await getMockPage(pageNumber);
			setEntries(result.entries);
			setCurrentPage(result.currentPage);
			setTotalPages(result.totalPages);
		} catch (err) {
			console.error('Error loading page:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadInitialData = useCallback(() => {
		loadPage(1);
	}, [loadPage]);

	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	// ---------------------------
	// Search Handler
	// ---------------------------
	useEffect(() => {
		if (!debouncedSearch.trim()) {
			loadInitialData();
			return;
		}

		const search = debouncedSearch.toLowerCase();
		const filtered = mockEntries.filter((entry) =>
			entry.playerName.toLowerCase().includes(search)
		);

		const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
		const entries = filtered.slice(0, PAGE_SIZE);

		setEntries(entries);
		setTotalPages(totalPages || 1);
		setCurrentPage(1);
	}, [debouncedSearch, loadInitialData]);

	// ---------------------------
	// Pagination
	// ---------------------------
	const loadNextPage = async () => {
		if (currentPage >= totalPages || loading) return;
		await loadPage(currentPage + 1);
	};

	const loadPreviousPage = async () => {
		if (currentPage <= 1 || loading) return;
		await loadPage(currentPage - 1);
	};

	// ---------------------------
	// Gamepad Focus (unchanged)
	// ---------------------------
	useEffect(() => {
		if (deviceMode === 'gamepad' && guestBookRef.current) {
			setTimeout(() => {
				const lastButton = guestBookRef.current.querySelector(
					'.pagination-button:last-child'
				);
				if (lastButton && !lastButton.disabled) {
					const focusedElements = document.querySelectorAll('.gamepad-focus');
					focusedElements.forEach((el) => el.classList.remove('gamepad-focus'));
					lastButton.classList.add('gamepad-focus');
				}
			}, 100);
		}
	}, [deviceMode]);

	// ---------------------------
	// Render
	// ---------------------------
	return (
		<div className="guestbook-content" ref={guestBookRef}>
			<img src={headerSvg} alt={t('ui.reception.guestBook')} />
			<div className="guestbook-header">
				<AnimatedCloseButton onClick={onClose} size={1} />
			</div>

			<div className="guestbook-header-section">
				<div className="guestbook-title-subtitle">
					<h2>{t('ui.reception.guestBook')}</h2>
					<p className="guestbook-subtitle">
						{t('ui.reception.guestBookSubtitle')}
					</p>
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
									<tr key={entry.id} className="guestbook-entry">
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
							◀ Prev
						</button>
						<button
							onClick={loadNextPage}
							className="pagination-button"
							disabled={currentPage >= totalPages}
						>
							Next ▶
						</button>
					</div>

					<div className="page-info">
						Page {currentPage} / {totalPages}
					</div>
				</div>
			</>
		</div>
	);
}

export default function GuestBook() {
	const handleClose = () => console.log('GuestBook closed');
	return (
		<PopupWrapper cursorType="book">
			<GuestBookContent onClose={handleClose} />
		</PopupWrapper>
	);
}
