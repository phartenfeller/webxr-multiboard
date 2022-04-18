import { html, render } from 'lit';
import { boardDistance } from '../constants';

export default function bubbleBoard(instance) {
  instance.registerComponent('bubble-board', {
    schema: {
      boardId: { type: 'string' },
      levelsActive: { type: 'number', default: 1 },
      newParentBubble: { type: 'string' },
      newLevel: { type: 'number' },
    },

    planeId: '',

    init() {
      const { el, data } = this;
      const { boardId, levelsActive } = data;

      console.log('levelsActive', levelsActive);

      this.planeId = `${boardId}-plane`;

      const plane = html`
        <a-plane
          id="${this.planeId}"
          geometry="height: 13; width: 25;"
          position="0 5.5 ${boardDistance}"
          mixin="board-bg-mx"
          class="collidable"
        >
          <a-entity board-level="level: 0; boardId: ${boardId};"> </a-entity>
        </a-plane>
      `;

      render(plane, el);
    },

    update(oldData) {
      if (!oldData.levelsActive) return;

      console.log('update123', oldData);

      const { data } = this;
      const { boardId, levelsActive, newParentBubble, newLevel } = data;

      if (
        oldData.levelsActive < levelsActive ||
        oldData.newParentBubble != newParentBubble ||
        oldData.newLevel != data.newLevel
      ) {
        console.log(
          `Adding new level / cluster: level ${levelsActive}, newParentBubble ${newParentBubble}`
        );

        const newLvl = document.createElement('a-entity');

        const attributes = {
          level: newLevel,
          boardId,
        } as any;

        if (newParentBubble) {
          attributes.parentId = newParentBubble;
        }

        console.log('new b attr', attributes);

        newLvl.setAttribute('board-level', attributes);
        const planeEl = document.getElementById(this.planeId);
        planeEl.appendChild(newLvl);
      } else {
        console.warn(
          `Unhandeled case: ${oldData.levelsActive} - ${levelsActive} | ${oldData.newParentBubble} - ${newParentBubble}`
        );
      }
    },
  });
}
