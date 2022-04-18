import { getLevelBubbles } from '../store/boardStore';
import { wait } from './util/wait';
import { levelColors } from '../constants/levelColors';

export default function boardLevel(instance) {
  instance.registerComponent('board-level', {
    schema: {
      level: { type: 'number' },
      boardId: { type: 'string' },
      parentId: { type: 'string' },
    },

    // getX(i: number, levelBubbleCount: number) {
    //   if (levelBubbleCount === 1) return 0;

    //   const margin = 0.7;
    //   const degrees = 360 * ((i + 1) / levelBubbleCount);
    //   console.log('degrees', degrees);
    //   const radiant = (degrees * Math.PI) / 180;

    //   return margin * Math.sin(radiant);
    // },

    // getY(i: number, levelBubbleCount: number) {
    //   if (levelBubbleCount === 1) return 0;

    //   const margin = 0.7;
    //   const degrees = 360 * (i + 1 / levelBubbleCount);
    //   //console.log('degrees', degrees);
    //   const radiant = (degrees * Math.PI) / 180;

    //   return margin * Math.cos(radiant);
    // },

    async init() {
      const { el, data } = this;
      const { boardId, level, parentId } = data;

      const levelBubbles = getLevelBubbles(boardId, level, parentId);

      const ids = [];

      for (let i = 0; i < levelBubbles.length; i++) {
        if (levelBubbles[i].parentBubble) {
          const lineEl = document.createElement('a-entity');
          lineEl.setAttribute('line', {
            start: levelBubbles[i].getPosStr(0.005),
            end: levelBubbles[i].parentBubble.getPosStr(0.005),
            color: levelColors(level),
          });

          el.appendChild(lineEl);
        }

        const bubbleEl = document.createElement('a-entity');
        bubbleEl.setAttribute('single-bubble', {
          level,
          boardId,
          size: levelBubbles[i].bubbleState.bubbleSize.toFixed(3),
          bubbleId: levelBubbles[i].id,
        });
        bubbleEl.setAttribute('position', levelBubbles[i].position);
        bubbleEl.setAttribute('geometry-merger', { preserveOriginal: false });
        bubbleEl.id = levelBubbles[i].id;
        ids.push(bubbleEl.id);

        await wait(256);
        el.appendChild(bubbleEl);
      }

      // // somehow timeout is necessary
      // setTimeout(async () => {
      //   for (let i = 0; i < levelBubbles.length; i++) {
      //     levelBubbles[i].setPageElement(ids[i]);

      //     await wait(100);

      //     if (levelBubbles[i].bubbleState.vec3Start) {
      //       console.log('add line', levelBubbles[i].bubbleState.vec3Start);
      //       const lineEl = document.createElement('a-entity');
      //       lineEl.setAttribute('line', {
      //         start: levelBubbles[i].bubbleState.vec3Start,
      //         end: levelBubbles[i].bubbleState.vec3End,
      //         color: 'red',
      //       });
      //       el.appendChild(lineEl);
      //     }
      //   }
      // }, 500);
    },
  });
}
