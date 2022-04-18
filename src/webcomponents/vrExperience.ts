import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { BTN_COLOR } from '../constants/buttonColors';

@customElement('vr-experience')
class VrExperience extends LitElement {
  @property({ type: Boolean })
  cursor = false;

  @property({ type: Boolean })
  isXr = false;

  @property({ type: Boolean })
  fpsCounter = false;

  /* Do not create shadow dom */
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
       <div style="min-height: 500px; border: 1px solid #919191;">
        <a-scene id="aframe-scene" embedded style="height: 800px;  width: 100%;">
          <a-assets>
            <a-mixin id="board-bg-mx" material="color: #0f1115; shader: flat; opacity: 1;"></a-mixin>
            <a-mixin id="board-text-bg-mx" material="color: #0f1115; shader: flat; opacity: 0.5;"></a-mixin>
            <a-mixin id="controls-raycaster-mx" raycaster="objects: .collidable; far: 15;"></a-mixin>
            <a-mixin id="vr-controler-mx"  haptics="events: mouseenter; dur: 100; force: 0.05" haptics="events: triggerdown; dur: 200; force: 0.2"></a-mixin>

            <a-mixin  id="button-mx"  
                      material="shader: flat; color: ${BTN_COLOR};"
                      >
            </a-mixin>
                    
          </a-assets>

          <a-entity id="rig" position="0 4 0" >
            <a-camera>
              ${
                this.cursor
                  ? html` <a-entity
                      cursor
                      position="0 0 -0.1"
                      geometry="primitive: sphere; radius: 0.0005"
                      material="color: #00FF00; shader: flat; opacity: 0.6"
                      mixin="controls-raycaster-mx"
                    ></a-entity>`
                  : null
              }
            </a-camera>
             <!-- Hands -->
            ${
              this.isXr
                ? html`
                    <a-entity
                      id="left-hand"
                      laser-controls="hand: left;"
                      mixin="vr-controler-mx controls-raycaster-mx"
                      board-drag-scroller
                    >
                      <a-entity
                        ?fps-counter=${this.fpsCounter}
                        position="0 .1 0"
                      ></a-entity>
                    </a-entity>
                    <a-entity
                      laser-controls="hand: right;"
                      mixin="vr-controler-mx controls-raycaster-mx"
                      board-zoomer
                    ></a-entity>
                  `
                : null
            }
          </a-entity>

          <a-entity
            environment="preset: forest; lightning: point;"
            geometry-merger="preserveOriginal: false"
          ></a-entity>
          <a-entity
            id="b-mid"
            bubble-board="boardId: b-mid; levelsActive: 1;"
            scale="1 1 1"
          >
          </a-entity>
          </a-entity>
          <a-entity standing-platform>
            ${
              this.cursor &&
              html`<a-entity ?fps-counter=${this.fpsCounter}> </a-entity>`
            }
          </a-entity>
          <!-- <a-plane height="60" width="100" position="-60 30 -4.2" color="#9ca3af" shader="flat"></a-plane>
          <a-plane height="60" width="100" position="60 30 -4.2" color="#9ca3af" shader="flat"></a-plane>
          <a-plane height="45" width="30" position="0 33.7 -4.2" color="#9ca3af" shader="flat"></a-plane> -->
        </a-scene>

        </div>

    `;
  }
}

export default VrExperience;
