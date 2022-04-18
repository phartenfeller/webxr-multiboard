import bubbleBoard from './bubble-board';
import singleBubble from './single-bubble';
import ringTextComp from './ring-text';
import ringContents from './ring-contents';
import environment from './from-npm/environment';
import boardLevel from './board-level';
import boardScroller from './controls/board-scroller';
import boardZoomer from './controls/board-zoomer';
import resetButton from './reset-button';
import standingPlatfrom from './standing-platform';
import dragScroller from './controls/drag-scroller';
import hideCompareButton from './hide-compare-button';
declare global {
  interface Window {
    AFRAME: any;
  }
}

function initAframe(AFRAME) {
  window.AFRAME = AFRAME;
  environment(AFRAME);
  bubbleBoard(AFRAME);
  standingPlatfrom(AFRAME);

  boardLevel(AFRAME);

  singleBubble(AFRAME);

  ringTextComp(AFRAME);
  ringContents(AFRAME);
  resetButton(AFRAME);
  hideCompareButton(AFRAME);

  boardScroller(AFRAME);
  boardZoomer(AFRAME);
  dragScroller(AFRAME);
  console.log('initialized aframe components...', AFRAME);
}

export default initAframe;
