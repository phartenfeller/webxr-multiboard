import { html, render } from 'lit';
import { ringData } from '../types/ringData';
import getRingText from './util/getRingText';
import { getBubble } from '../store/boardStore';
import { GroupInfo } from '../types/bubbleData';
import { baseWait } from '../constants';

type calcRingArgs = {
  data: GroupInfo;
  offset?: number;
};

const calcRing = ({ data, offset = 0 }: calcRingArgs): ringData => {
  console.log('calcRing', data);
  const thetaLength = 360 * (data.percent / 100);

  return {
    thetaLength: Math.round(thetaLength * 100) / 100,
    thetaStart: Math.round(offset * 100) / 100,
    bgColor: data.bgColor,
    textColor: data.textColor,
    percent: data.percent.toFixed(3),
    formatted: data.accumulateDimSumFormatted,
    recordCount: data.recordCount,
  };
};

export default function singleBubble(instance) {
  instance.registerComponent('single-bubble', {
    schema: {
      level: { type: 'number' },
      size: { type: 'number', default: 1 },
      boardId: { type: 'string' },
      bubbleId: { type: 'string' },
    },

    init() {
      const { el } = this;
      const { level, size, boardId, bubbleId } = this.data;

      const bubbleData = getBubble(boardId, level, bubbleId);

      const keys = Array.from(bubbleData.bubbleState.data.groupData.keys());
      const rings = [];

      for (let i = 0; i < keys.length; i++) {
        rings.push(
          calcRing({
            data: bubbleData.bubbleState.data.groupData.get(keys[i]),
            offset:
              i > 0 ? rings[i - 1].thetaStart + rings[i - 1].thetaLength : null,
          })
        );
      }

      const plane = html`
        <a-circle
          mixin="board-bg-mx"
          position="0 0 .01"
          radius="${size}"
          geometry-merger="preserveOriginal: false"
        >
          <a-entity
            ring-contents="level: ${level}; scaledSize: ${size}; boardId: ${boardId}; bubbleId: ${bubbleId};"
          ></a-entity>
          ${rings.map(
            (r: ringData) => html`
              <a-ring
                position="0 0 .012"
                radius-outer="${size}"
                radius-inner="${size * 0.875}"
                theta-length=${r.thetaLength}
                theta-start=${r.thetaStart}
                color=${r.bgColor}
                material="shader: flat;"
                segments-theta="10"
                segmentsPhi="2"
              >
                ${parseFloat(r.percent) > 1 &&
                html` <a-entity
                  ring-text="color: ${r.textColor}; text: ${getRingText(
                    r,
                    bubbleData.dataConfigState.dimensions.accumulateDim.enabled
                  )}; scaledSize: ${size}; thetaStart: ${r.thetaStart}; thetaLength: ${r.thetaLength}; level: ${level};"
                ></a-entity>`}
              </a-ring>
            `
          )}
        </a-circle>
      `;

      setTimeout(() => {
        render(plane, el);
      }, baseWait);
    },
  });
}
