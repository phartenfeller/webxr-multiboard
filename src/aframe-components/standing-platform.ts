import { html, render } from 'lit';

const HEIGHT = 4.2;
const DEPTH = 4;

export default function ringTextComp(instance) {
  instance.registerComponent('standing-platform', {
    schema: {},

    init() {
      const { el } = this;

      const platform = html`
        <a-box
          height="${HEIGHT}"
          width="7"
          depth="${DEPTH}"
          position="0 ${HEIGHT / 2} ${DEPTH / 2 - 1}"
          material="shader: flat; color: #d1d5db;"
        >
          <a-entity
            position="0 ${HEIGHT / 2} -1"
            reset-button="boardId: b-mid;"
          ></a-entity>
          <a-entity hide-compare-button position="0 0 -1.2"> </a-entity>
        </a-box>
      `;

      render(platform, el);
    },
  });
}
