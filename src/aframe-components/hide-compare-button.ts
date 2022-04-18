import { html, render } from 'lit';
import {
  showCompareDim,
  hideCompareDim,
  getCompareDims,
  CompareDimInfo,
} from '../store/boardStore';

const BTN_SIDE = 0.3;

const COLOR_ON = '#1cff49';
const COLOR_OFF = '#ff1c1c';

let hideCount = 0;

function initEventListeners() {
  function mouseEnterHandler(e: Event) {
    const btn = e.target as any;
    const mat = btn.getAttribute('material');
    mat.color = btn.dataset.hovercolor;

    btn.setAttribute('material', mat);
  }

  function mouseLeaveHandler(e: Event) {
    const btn = e.target as any;
    const mat = btn.getAttribute('material');
    mat.color = btn.dataset.normalcolor;

    btn.setAttribute('material', mat);
  }

  function clickHandler(e: Event) {
    const btn = e.target as any;
    const id = parseInt(btn.dataset.id);

    const child = btn.querySelector('.filter-indicator');
    const mat = child.getAttribute('material');
    if (child.dataset.on == 1) {
      if (hideCount === 3) return;
      child.dataset.on = 0;
      mat.color = COLOR_OFF;
      hideCount++;
      child.setAttribute('material', mat);

      hideCompareDim(id);
    } else {
      child.dataset.on = 1;
      mat.color = COLOR_ON;
      child.setAttribute('material', mat);
      hideCount--;

      showCompareDim(id);
    }
  }

  document.querySelectorAll('a-box.hide-compare-button').forEach((btn) => {
    btn.addEventListener('mouseenter', mouseEnterHandler);
    btn.addEventListener('mouseleave', mouseLeaveHandler);
    btn.addEventListener('click', clickHandler);
  });
}

export default function filterButtons(instance) {
  instance.registerComponent('hide-compare-button', {
    schema: {},

    init() {
      const { el } = this;

      setTimeout(() => {
        const compareDimMap = getCompareDims();
        const compareDims: CompareDimInfo[] = Object.values(compareDimMap);

        const platform = compareDims.map((t, i) => {
          const y = (2 + BTN_SIDE / 2).toFixed(3);
          const z = (i * BTN_SIDE + ((i - 1) * BTN_SIDE) / 3).toFixed(3);
          return html`
            <a-box
              height="${BTN_SIDE}"
              width="${BTN_SIDE}"
              depth="${BTN_SIDE}"
              position="3 ${y} ${z}"
              material="shader: flat; color: ${t.textColor};"
              class="collidable hide-compare-button"
              data-normalcolor="${t.textColor}"
              data-hovercolor="${t.bgColor}"
              data-id="${t.id}"
            >
              <a-plane
                class="filter-indicator"
                data-on="1"
                position="-0.5 0.01 0"
                material="shader: flat; color: ${COLOR_ON};"
                width="${BTN_SIDE / 3}"
                height="${BTN_SIDE / 3}"
                rotation="-90 0 0"
              ></a-plane>
            </a-box>
          `;
        });

        render(platform, el);

        setTimeout(() => {
          initEventListeners();
        }, 250);
      }, 1000);
    },
  });
}
