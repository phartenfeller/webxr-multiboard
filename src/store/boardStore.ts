import BoardBubble from './BoardBubble';
import { baseWait } from '../constants';
import { DataConfig, CompareDim } from '../types/dataConfig';

const ONLY_BOARD_ID = 'b-mid';

export type boardStore = {
  [level: number]: BoardBubble[];
};

const boardMap = new Map<string, boardStore>();

let dataConfigInitial: null | DataConfig = null;

export type CompareDimInfo = {
  id: number;
  name: string;
  bgColor: string;
  textColor: string;
};

const hiddenCompareDims = new Set<number>();
let compareDimMap: Map<number, CompareDimInfo> = null;

// multiple boards is currently not supported
function getBoard(boardId: string): boardStore {
  if (!boardMap.has(boardId)) {
    const msg = `boardId ${boardId} not found`;
    console.error(msg);
    throw new Error(msg);
  }

  return boardMap.get(boardId);
}

function getLevel(
  boardId: string,
  level: number,
  parentId?: string
): BoardBubble[] {
  const board = getBoard(boardId);
  if (!board[level]) {
    const msg = `level ${level} in board ${boardId} not found`;
    console.error(msg);
    throw new Error(msg);
  }

  const bubbles = board[level];

  if (parentId) {
    return bubbles.filter((bubble) => bubble.parentBubble.id === parentId);
  }

  return bubbles;
}

export function initBoard(boardId: string, dataConfig: DataConfig) {
  if (dataConfigInitial === null) dataConfigInitial = dataConfig;

  const dc = dataConfig;

  if (hiddenCompareDims.size > 0) {
    dc.records = dc.records.filter((record) => {
      return !hiddenCompareDims.has(record.id);
    });
  }

  compareDimMap = new Map();
  for (let i = 0; i < dc.records.length; i++) {
    if (
      dc.records[i].compareDimId &&
      !compareDimMap.has(dc.records[i].compareDimId)
    ) {
      compareDimMap.set(dc.records[i].compareDimId, {
        id: dc.records[i].compareDimId,
        name: dc.records[i].compareDim,
        bgColor: dc.records[i].compareDimBgColor,
        textColor: dc.records[i].compareDimTextColor,
      });
    }
  }

  const initBubble = new BoardBubble(boardId, 0, { x: 0, y: 0, z: 0 });
  initBubble.initData(dc);
  boardMap.set(boardId, { 0: [initBubble] });
}

export function getBubble(
  boardId: string,
  level: number,
  bubbleId: string
): BoardBubble {
  const levelBubbles = getLevel(boardId, level);

  const bubble = levelBubbles.find((bubble) => bubble.id === bubbleId);

  return bubble;
}

export function getLevelBubbles(
  boardId: string,
  level: number,
  parentId?: string
): BoardBubble[] {
  return getLevel(boardId, level, parentId);
}

function getMaxLevel(boardId: string) {
  const board = getBoard(boardId);
  const levels = Object.keys(board);
  let max = 0;
  for (const level of levels) {
    max = Math.max(max, parseInt(level, 10));
  }
  return max;
}

export async function addLevel(
  boardId: string,
  currentLevel: number,
  filterId: number,
  bubbleId: string
) {
  const board = getBoard(boardId);

  if (!board[currentLevel]) {
    const msg = `level ${currentLevel} in board ${boardId} not found`;
    console.error(msg);
    throw new Error(msg);
  }

  const bubble = getBubble(boardId, currentLevel, bubbleId);

  const newBubbles: BoardBubble[] = await bubble.applyGroupFilter(filterId);
  console.log('nBubbles', newBubbles);

  if (!board[currentLevel + 1]) {
    board[currentLevel + 1] = newBubbles;
  } else {
    board[currentLevel + 1] = [...board[currentLevel + 1], ...newBubbles];
  }
  boardMap.set(boardId, board);

  setTimeout(() => {
    const boardEl = document.getElementById(boardId);
    boardEl.setAttribute('bubble-board', {
      boardId,
      levelsActive: getMaxLevel(boardId),
      newParentBubble: bubbleId,
      newLevel: currentLevel + 1,
    } as any);
  }, baseWait);
}

export function reset(boardId: string = ONLY_BOARD_ID) {
  boardMap.delete(boardId);
  initBoard(boardId, dataConfigInitial);

  const boardEl = document.getElementById(boardId);
  const parent = boardEl.parentElement;

  const boardCopy = boardEl.cloneNode();
  parent.removeChild(boardEl);
  parent.appendChild(boardCopy);
}

export function hideCompareDim(no: number) {
  hiddenCompareDims.add(no);
  reset();
}

export function showCompareDim(no: number) {
  hiddenCompareDims.delete(no);
  reset();
}

export function getCompareDims() {
  return compareDimMap;
}
