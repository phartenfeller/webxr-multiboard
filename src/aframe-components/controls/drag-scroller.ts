import { resetBoardZoomScroll } from '../util/resetBoardZoomScroll';

declare global {
  interface Window {
    THREE: any;
  }
}

const ACCELERATION_BOOST = 150;
const FRICTION = 2;

export default function dragScroller(instance) {
  instance.registerComponent('board-drag-scroller', {
    schema: {},

    init() {
      console.log('board-drag-scroller init');
      const { el } = this;

      //this.onThumbstickChanged = this.onThumbstickChanged.bind(this);
      el.addEventListener('thumbstickdown', resetBoardZoomScroll);

      this.tick = instance.utils.throttleTick(this.tick, 15, this);

      this.boardEl = document.getElementById('b-mid');

      this.dragStarted = false;

      this.onTriggerDown = this.onTriggerDown.bind(this);
      el.addEventListener('triggerdown', this.onTriggerDown);

      this.onTriggerUp = this.onTriggerUp.bind(this);
      el.addEventListener('triggerup', this.onTriggerUp);

      this.updateBoardPos = this.updateBoardPos.bind(this);

      this.boardParentEl = document.getElementById('aframe-scene');

      this.currentX = null;
      this.currentY = null;
      this.lastX = null;
      this.lastY = null;
    },

    setBoardEl() {
      this.boardEl = document.getElementById('b-mid');
      return this.boardEl;
    },

    tick: function (time, delta) {
      if (this.dragStarted) {
        this.updateBoardPos();
      }
    },

    getIntersectData() {
      const { els, intersections } =
        this.el.components.raycaster.intersectionDetail;

      if (els.length > 0 && els[0].id === 'b-mid-plane') {
        console.log('isect', intersections[0]);
        const { x, y } = intersections[0].point;

        return { isBoard: true, x, y };
      } else {
        return { isBoard: false, x: null, y: null };
      }
    },

    onTriggerDown(e) {
      console.log(this.el.components.raycaster);

      const { isBoard, x, y } = this.getIntersectData();

      if (isBoard) {
        this.dragStarted = true;

        this.currentX = x;
        this.currentY = y;
      }
    },

    onTriggerUp() {
      this.dragStarted = false;
    },

    updateBoardPos() {
      console.log('updateBoardPos');
      const { isBoard, x, y } = this.getIntersectData();
      if (!isBoard || !x || !y) return;

      const board =
        this.boardEl && this.boardParentEl.contains(this.boardEl)
          ? this.boardEl
          : this.setBoardEl();

      const pos = board.object3D.position;

      this.lastX = this.currentX;
      this.lastY = this.currentY;

      this.currentX = x;
      this.currentY = y;

      console.log({ lastX: this.lastX, lastY: this.lastY, x, y });

      const changeX = this.lastX - this.currentX;
      const changeY = this.lastY - this.currentY;

      console.log({ changeX, changeY });

      board.object3D.position.set(pos.x - changeX, pos.y - changeY, pos.z);
    },
  });
}
