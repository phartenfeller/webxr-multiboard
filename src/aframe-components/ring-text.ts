import { html, render } from 'lit';
import { baseWait } from '../constants';

function getLongestLine(text: string): number {
  const lines = text.split('\n');
  let max = 0;
  for (const line of lines) {
    max = Math.max(max, line.replace(' ', '').length);
  }
  return max;
}

export default function ringTextComp(instance) {
  instance.registerComponent('ring-text', {
    schema: {
      color: { type: 'string' },
      text: { type: 'string' },
      scaledSize: { type: 'number' },
      thetaStart: { type: 'number' },
      thetaLength: { type: 'number' },
      level: { type: 'number' },
    },

    init() {
      const { el, data } = this;
      const { text, color, scaledSize, thetaStart, thetaLength, level } = data;

      const RADIUS = scaledSize * 1.35;

      const seg = ((thetaStart + thetaLength / 2) / 360) * Math.PI * 2;

      const x2 = RADIUS * Math.cos(seg);
      const y2 = RADIUS * Math.sin(seg);
      const z2 = level < 2 ? 0.05 : 0.005;

      const pos = `${x2.toFixed(3)} ${y2.toFixed(3)} ${z2}`;

      const ringText = html`
        <a-text
          mixin="board-text-bg-mx"
          value="${text}"
          wrap-count="${getLongestLine(text)}"
          color="${color}"
          width="${scaledSize / 2}"
          position="${pos}"
          geometry="primitive: plane; width: auto; height: auto;"
        ></a-text>
      `;

      setTimeout(() => {
        render(ringText, el);
      }, baseWait * 2);
    },
  });
}
