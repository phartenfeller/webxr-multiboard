import { html, render } from 'lit';
import { initResetListener } from './util/initEventListeners';

export default function s(instance) {
  instance.registerComponent('reset-button', {
    schema: {
      boardId: { type: 'string' },
    },

    init() {
      const { el, data } = this;

      initResetListener(data.boardId, el);

      const ringText = html`
        <a-box
          id="vr-reset-btn"
          mixin="button-mx"
          height=".1"
          width="0.8"
          depth="0.2"
          position="0 .1 -0.5"
          class="collidable"
        >
          <a-text
            value="RESET"
            position="0 .05 0"
            rotation="-90 0 0"
            align="center"
            anchor="center"
            baseline="center"
          ></a-text>
        </a-box>
      `;

      render(ringText, el);
    },
  });
}
