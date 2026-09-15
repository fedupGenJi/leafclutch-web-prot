import { useEffect, useMemo, useState } from 'react';
import brand from '../brand.js';

// Grid density is measured against the SHORT edge of the viewport, not the
// width. Sizing off width alone made cells noticeably non-square in landscape
// and on ultra-wide monitors, because rows were derived from a width-based
// cell size and then stretched with 1fr to fill a much shorter height.
const CELLS_ACROSS_SHORT_EDGE = 14;
const CELL_MIN = 28;
const CELL_MAX = 56;

// Hard ceiling on animated DOM nodes. A 4K viewport at CELL_MAX would otherwise
// produce ~2700 independently animating elements, which is where this kind of
// grid starts dropping frames.
const MAX_CELLS = 900;

export const CYCLE_MS = 4200;
// The wave now crosses the grid in a fixed wall-clock time on every screen.
// Previously the delay was distance-in-cells x 42ms, so the sweep took ~1.1s on
// a phone and ~2.9s on a 4K display — same animation, very different pace.
const RIPPLE_SWEEP_MS = 1400;
const START_DELAY_MS = 200;

// Kept as ratios so the wave starts from the same relative point everywhere.
const ORIGIN_X_RATIO = 0.12;
const ORIGIN_Y_RATIO = 0.58;

function clampNum(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function computeGrid(width, height) {
  const shortEdge = Math.min(width, height);
  let cellSize = clampNum(shortEdge / CELLS_ACROSS_SHORT_EDGE, CELL_MIN, CELL_MAX);

  let cols = Math.max(1, Math.ceil(width / cellSize));
  let rows = Math.max(1, Math.ceil(height / cellSize));

  // Grow the cells until the grid fits under the node budget.
  while (cols * rows > MAX_CELLS) {
    cellSize += 4;
    cols = Math.max(1, Math.ceil(width / cellSize));
    rows = Math.max(1, Math.ceil(height / cellSize));
  }

  return { cols, rows };
}

function buildCells(cols, rows) {
  const originCol = Math.round((cols - 1) * ORIGIN_X_RATIO);
  const originRow = Math.round((rows - 1) * ORIGIN_Y_RATIO);

  // Furthest cell from the origin — used to normalise the sweep duration.
  const maxDistance =
    Math.hypot(
      Math.max(originRow, rows - 1 - originRow),
      Math.max(originCol, cols - 1 - originCol)
    ) || 1;

  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const distance = Math.hypot(row - originRow, col - originCol);
      cells.push({
        key: `${row}-${col}`,
        isOrigin: row === originRow && col === originCol,
        delay: Math.round(START_DELAY_MS + (distance / maxDistance) * RIPPLE_SWEEP_MS),
      });
    }
  }
  return cells;
}

function useViewportGrid() {
  const [grid, setGrid] = useState(() => {
    if (typeof window === 'undefined') return { cols: 14, rows: 24 };
    return computeGrid(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    let frame = null;

    const handleResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = computeGrid(window.innerWidth, window.innerHeight);
        // Bail out when the grid shape is unchanged, so dragging a window edge
        // doesn't rebuild hundreds of cells on every frame.
        setGrid((prev) =>
          prev.cols === next.cols && prev.rows === next.rows ? prev : next
        );
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return grid;
}

export default function LoadingScreen({ leaving }) {
  const { cols, rows } = useViewportGrid();
  const cells = useMemo(() => buildCells(cols, rows), [cols, rows]);

  return (
    <div
      className={`loading-screen ${leaving ? 'is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      style={{ '--ripple-cycle': `${CYCLE_MS}ms` }}
    >
      <div
        className="ripple-grid"
        aria-hidden="true"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells.map(({ key, isOrigin, delay }) => (
          <div
            key={key}
            className={`ripple-cell ${isOrigin ? 'is-origin' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

      <div className="loading-center">
        <div className="logo-pop">
          <div className="logo-shadow" aria-hidden="true" />
          <img src={brand.logo} alt="" className="loading-logo" />
        </div>

        <div className="brand-name">
          <span className="brand-name-primary">{brand.siteName}</span>
          <span className="brand-name-secondary">{brand.legalSuffix}</span>
        </div>
      </div>

      <p className="loading-motto">{brand.motto}</p>
    </div>
  );
}
