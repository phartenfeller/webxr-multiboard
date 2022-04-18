import formatNumber from '../calc/util/formatNumber';
import groupFilterDim from '../calc/util/groupFilterDim';
import { BubbleState } from '../types/bubbleData';
import { bubbleSizeMod } from '../constants';
import { wait } from '../aframe-components/util/wait';
import { Coords } from '../types/coords';
import { DataConfig, DataRecord } from '../types/dataConfig';
import groupCompareDim from '../calc/util/groupCompareDim';

const RADIUS = 3.2;
declare global {
  interface Window {
    THREE: any;
  }
}

const MIN_BUBBLE_SIZE = 0.12;
function getMinBubbleSize(level: number) {
  return Math.pow(MIN_BUBBLE_SIZE, level);
}

export default class BoardBubble {
  public boardId: string;
  public level: number;
  public records: DataRecord[];
  public bubbleState: BubbleState;
  public pageEl: any;
  public parentBubblePageEl: any;
  public parentBubble: BoardBubble | null;
  public center: Coords;
  public position: Coords;
  public id: string;
  public dataConfigState: DataConfig;

  constructor(
    boardId: string,
    level: number,
    center: Coords,
    parentBubble: BoardBubble | null = null,
    id: string = 'b-root'
  ) {
    this.boardId = boardId;
    this.level = level;
    this.bubbleState = {
      header: null,
      footer: null,
      bubbleSize: 1 * bubbleSizeMod,
      data: null,
    };
    this.parentBubble = parentBubble;
    this.center = center;
    this.id = id;

    if (level === 0) {
      this.position = center;
    }
  }

  public getPosStr(zAdd: number = 0) {
    return `${this.position.x.toFixed(3)} ${this.position.y.toFixed(3)} ${(
      this.position.z + zAdd
    ).toFixed(3)}`;
  }

  public initData(dataConfigState: DataConfig, header: string = '') {
    this.dataConfigState = dataConfigState;

    this.bubbleState.header = header;

    this.records = this.dataConfigState.records.sort(
      (a, b) => b.compareDimId - a.compareDimId
    );

    this.bubbleState.data = groupCompareDim(this.dataConfigState);

    this.bubbleState.footer = this.dataConfigState.dimensions.accumulateDim
      .enabled
      ? formatNumber(this.bubbleState.data.accumulateDimSum)
      : formatNumber(this.bubbleState.data.recordCount);
  }

  public calcSize() {
    let relativeSize = 0;

    if (this.dataConfigState.dimensions.accumulateDim.enabled) {
      relativeSize =
        this.bubbleState.data.accumulateDimSum /
        this.parentBubble.bubbleState.data.accumulateDimSum;
    } else {
      relativeSize =
        this.bubbleState.data.recordCount /
        this.parentBubble.bubbleState.data.recordCount;
    }

    const minBubbleSize = getMinBubbleSize(this.level);

    const size = relativeSize < minBubbleSize ? minBubbleSize : relativeSize;
    if (this.parentBubble?.bubbleState?.bubbleSize) {
      // pct of parent node size
      this.bubbleState.bubbleSize =
        size * this.parentBubble.bubbleState.bubbleSize;

      if (this.bubbleState.bubbleSize <= 0.011)
        this.bubbleState.bubbleSize = 0.012;
    } else {
      // for root node only apply size mod
      this.bubbleState.bubbleSize = size * bubbleSizeMod;
    }
  }

  public calcPosition(i: number, levelBubbleCount: number) {
    const pct = levelBubbleCount > 1 ? (i + 1) / levelBubbleCount : 0.75;
    let segment = pct * Math.PI * 2;

    // offset a little so that lines don't overlap with the center
    if (this.level === 2) {
      segment = segment + (1 / 13) * Math.PI * 2;
    }

    let radius =
      this.level <= 1 ? RADIUS : RADIUS * Math.pow(0.7, this.level + 1);

    if (this.level === 2) radius = radius * 0.85;

    let x = radius * Math.cos(segment);
    let y = radius * Math.sin(segment);

    if (this.parentBubble) {
      x = x + this.parentBubble.position.x;
      y = y + this.parentBubble.position.y;
    }

    console.log({ pct, segment, x, y });

    this.position = {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      z: 0,
    };
  }

  public async applyGroupFilter(filterNo: number): Promise<BoardBubble[]> {
    const dataConfigStateTemp = this.dataConfigState;
    dataConfigStateTemp.availableFilters =
      dataConfigStateTemp.availableFilters.filter((f) => f !== filterNo);

    const groups = groupFilterDim(this.dataConfigState, filterNo);

    const newBubbles: BoardBubble[] = [];

    console.log('groups', groups);

    let i = 0;
    const newBubbleCount = Object.keys(groups).length;

    for (const key in groups) {
      const dc = dataConfigStateTemp;
      dc.records = groups[key];

      const temp = new BoardBubble(
        this.boardId,
        this.level + 1,
        this.position,
        this,
        `${this.id}-${i}`
      );
      temp.initData(dc, key);
      temp.parentBubblePageEl = this.pageEl;
      temp.calcSize();
      temp.calcPosition(i, newBubbleCount);

      newBubbles.push(temp);
      i += 1;
      await wait(16);
    }

    return newBubbles;
  }
}
