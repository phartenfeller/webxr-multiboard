import { resetBoardZoomScroll } from '../util/resetBoardZoomScroll';

declare global {
  interface Window {
    THREE: any;
  }
}

const ACCELERATION_BOOST = 150;
const FRICTION = 2;

export default function boardScroller(instance) {
  instance.registerComponent('board-scroller', {
    schema: {},

    init() {
      const { el } = this;
      this.velocity = new window.THREE.Vector3();
      this.acceleration = new window.THREE.Vector3();

      this.onThumbstickChanged = this.onThumbstickChanged.bind(this);

      //this.tick = AFRAME.utils.throttleTick(this.tick, 15, this);

      el.addEventListener('thumbstickmoved', this.onThumbstickChanged);
      el.addEventListener('thumbstickdown', resetBoardZoomScroll);

      this.boardParentEl = document.getElementById('aframe-scene');
    },

    setBoardEl() {
      this.boardEl = document.getElementById('b-mid');
      return this.boardEl;
    },

    tick: function (time, delta) {
      if (this.actionNeeded) {
        const timeDelta = delta / 1000;
        this.updateVelocity(timeDelta);
        this.updatePosition(timeDelta);
        this.actionNeeded = false;
      }
    },

    updateVelocity: function (delta: number) {
      this.velocity.x += this.acceleration.x * delta;
      this.velocity.y += this.acceleration.y * delta;

      const scaledEasing = Math.pow(1 / FRICTION, delta * 60);
      this.velocity.x = this.velocity.x * scaledEasing;
      this.velocity.y = this.velocity.y * scaledEasing;

      if (Math.abs(this.velocity.x) < 0.0001) {
        this.velocity.x = 0;
      }
      if (Math.abs(this.velocity.y) < 0.0001) {
        this.velocity.y = 0;
      }
    },

    updatePosition: function (delta: number) {
      const board =
        this.boardEl && this.boardParentEl.contains(this.boardEl)
          ? this.boardEl
          : this.setBoardEl();

      let { x, y, z } = board.object3D.position;
      const newX = board.object3D.position.x + this.velocity.x * delta;
      const newY = board.object3D.position.y + this.velocity.y * delta;

      if (Math.abs(newX) < 2500) {
        x = newX;
      }
      if (Math.abs(newY) < 2500) {
        y = newY;
      }

      x = Math.round(x * 1000) / 1000;
      y = Math.round(y * 1000) / 1000;

      board.object3D.position.set(x, y, z);
    },

    onThumbstickChanged: function (e) {
      this.acceleration.x = e.detail.x * ACCELERATION_BOOST;
      this.acceleration.y = -e.detail.y * ACCELERATION_BOOST;
      this.actionNeeded = true;
    },
  });
}
