/**
 * Keyboard movement inside a read-only spreadsheet grid, the way Sheets does
 * it: the grid is one Tab stop (the selected cell), and the arrow keys move
 * the selection. Before this, every cell was its own Tab stop, so a keyboard
 * learner pressed Tab dozens of times to get past a small sheet (Story Mode
 * Audit finding #19).
 *
 * Pure, so it can be tested without React. Rows and columns are listed in the
 * order they are drawn; a key that would leave the grid returns null, so the
 * caller does nothing (and the browser keeps its default behavior).
 */
export interface GridCell<C extends string = string> {
  row: number;
  col: C;
}

export function moveGridCell<C extends string>(
  cell: GridCell<C>,
  key: string,
  rows: readonly number[],
  cols: readonly C[],
): GridCell<C> | null {
  const r = rows.indexOf(cell.row);
  const c = cols.indexOf(cell.col);
  if (r < 0 || c < 0) return null;
  let nextRow = r;
  let nextCol = c;
  if (key === "ArrowUp") nextRow = r - 1;
  else if (key === "ArrowDown") nextRow = r + 1;
  else if (key === "ArrowLeft") nextCol = c - 1;
  else if (key === "ArrowRight") nextCol = c + 1;
  else if (key === "Home") nextCol = 0;
  else if (key === "End") nextCol = cols.length - 1;
  else return null;
  if (nextRow < 0 || nextRow >= rows.length || nextCol < 0 || nextCol >= cols.length) return null;
  if (nextRow === r && nextCol === c) return null;
  return { row: rows[nextRow], col: cols[nextCol] };
}

/** The `data-grid-cell` value for a cell, so the caller can find and focus it. */
export function gridCellId(cell: GridCell): string {
  return `${cell.row}:${cell.col}`;
}

/**
 * The shared key handler: move the selection, then move focus to the newly
 * selected cell once it is drawn. Only one cell is a Tab stop, so focus must
 * follow the selection or the next Tab would jump back to the old cell.
 */
export function handleGridKey<C extends string>(
  e: { key: string; altKey: boolean; ctrlKey: boolean; metaKey: boolean; preventDefault: () => void; currentTarget: HTMLElement },
  selected: GridCell<C>,
  rows: readonly number[],
  cols: readonly C[],
  select: (cell: GridCell<C>) => void,
): void {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const next = moveGridCell(selected, e.key, rows, cols);
  if (!next) return;
  e.preventDefault();
  select(next);
  const grid = e.currentTarget;
  requestAnimationFrame(() => {
    grid.querySelector<HTMLElement>(`[data-grid-cell="${gridCellId(next)}"]`)?.focus();
  });
}
