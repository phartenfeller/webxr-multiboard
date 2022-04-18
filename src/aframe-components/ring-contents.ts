import { html, render } from 'lit';
import { getBubble } from '../store/boardStore';
import { initEventListeners } from './util/initEventListeners';
import { baseWait } from '../constants';

const ICON_COLOR = '#ffd9d9';

function getWrapCount(text: string) {
  const len = text.length;

  if (len < 11) {
    return Math.max(text.length, 8);
  }
  return Math.ceil(len / 2);
}

export default function ringContents(instance) {
  instance.registerComponent('ring-contents', {
    schema: {
      level: { type: 'number' },
      scaledSize: { type: 'number' },
      boardId: { type: 'string' },
      bubbleId: { type: 'string' },
    },

    listenersInit: false,

    init() {
      const { el, data } = this;
      const { level, scaledSize, boardId, bubbleId } = data;

      this.listenersInit = false;

      const bubbleData = getBubble(boardId, level, bubbleId);

      const { header, footer } = bubbleData.bubbleState;
      const { availableFilters, dimensions } = bubbleData.dataConfigState;

      const sideLen = scaledSize * 0.275;
      const margin = scaledSize * 0.075;

      const fullLen =
        sideLen * availableFilters.length +
        margin * (availableFilters.length - 1);

      const xPositions = availableFilters.map((_, i) => {
        return (i * (margin + sideLen) + sideLen / 2 - fullLen / 2).toFixed(3);
      });

      const tooltipY = (scaledSize * 0.4).toFixed(3);

      const textTooSmall =
        level > 0 ? scaledSize < Math.pow(0.5, level) : false;
      const textSize = textTooSmall ? Math.pow(0.5, level) : scaledSize;

      // if textsize manually overridden, place it over bubble so it does not overlap
      const textY = textTooSmall
        ? (scaledSize * 0.5 + textSize * Math.pow(0.8, level)).toFixed(3)
        : (scaledSize * 0.5).toFixed(3);

      const ringHeaderEl = document.createElement('a-text');
      ringHeaderEl.setAttribute('mixin', 'board-text-bg-mx');
      ringHeaderEl.setAttribute('position', `0 ${textY} .02`);
      ringHeaderEl.setAttribute('value', header);
      ringHeaderEl.setAttribute('width', textSize.toFixed(3));
      ringHeaderEl.setAttribute('wrap-count', getWrapCount(header));
      ringHeaderEl.setAttribute(
        'geometry',
        'primitive: plane; width: auto; height: auto;'
      );
      ringHeaderEl.setAttribute('align', 'center');
      ringHeaderEl.setAttribute('anchor', 'center');
      ringHeaderEl.setAttribute('baseline', 'center');
      setTimeout(() => {
        el.appendChild(ringHeaderEl);
      }, baseWait);

      const buttons =
        level < 2
          ? availableFilters.map((f, i) => {
              const btnId = `${boardId}-${level}-${bubbleId}-${i}`;
              const filterDim = dimensions.filterDims.find((fd) => fd.id === f);

              return html`
                <a-box
                  id="${btnId}"
                  mixin="button-mx"
                  depth=".04"
                  width="${sideLen.toFixed(3)}"
                  height="${sideLen.toFixed(3)}"
                  position="${xPositions[i]} 0 0"
                  class="collidable vr-btn board-${boardId} level-${level} bubble-${bubbleId}"
                  data-filter="${f}"
                  geometry-merger="preserveOriginal: false"
                >
                  <a-text
                    width="${sideLen}"
                    height="${sideLen}"
                    position="0 0 0.0255"
                    material="opacity: 0.00;"
                    color="${ICON_COLOR}"
                    value="${filterDim.abbr}"
                    wrap-count="${filterDim.abbr.length}"
                    align="center"
                    anchor="center"
                    baseline="center"
                    geometry="primitive:
                    plane; width: auto; height: auto;"
                  ></a-text>
                  <a-text
                    id="${btnId}-helptext"
                    material="color: #383a3f; shader: flat; opacity: 0.9;"
                    visible="false"
                    position="0 ${tooltipY} .03"
                    value="${filterDim.name}"
                    width="${scaledSize.toFixed(3)}"
                    wrap-count="${filterDim.name.length < 8
                      ? 10
                      : filterDim.name.length + 2}"
                    align="center"
                    anchor="center"
                    baseline="center"
                    geometry="primitive: plane; width: auto; height: auto;"
                  >
                  </a-text>
                </a-box>
              `;
            })
          : null;

      if (buttons) {
        setTimeout(() => {
          render(buttons, el);
        }, baseWait * 2);
      }

      const bTextWidth = scaledSize === 0 ? 0.001 : scaledSize;

      const ringFooterEl = document.createElement('a-text');
      ringFooterEl.setAttribute('mixin', 'board-text-bg-mx');
      ringFooterEl.setAttribute(
        'position',
        `0 ${(scaledSize * -0.5).toFixed(3)} .02`
      );
      ringFooterEl.setAttribute('value', footer);
      ringFooterEl.setAttribute('width', bTextWidth.toFixed(3));
      ringFooterEl.setAttribute('wrap-count', getWrapCount(footer));
      ringFooterEl.setAttribute(
        'geometry',
        'primitive: plane; width: auto; height: auto;'
      );
      ringFooterEl.setAttribute('align', 'center');
      ringFooterEl.setAttribute('anchor', 'center');
      ringFooterEl.setAttribute('baseline', 'center');

      setTimeout(() => {
        el.appendChild(ringFooterEl);
      }, baseWait * 4);

      setTimeout(() => {
        initEventListeners(boardId, level, bubbleId);
      }, 250);
    },
  });
}
