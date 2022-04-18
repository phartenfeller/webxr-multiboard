import 'aframe';
import './webcomponents';
import { html, LitElement, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import initAframe from './aframe-components';
import { initBoard } from './store/boardStore';
import 'aframe-event-set-component';
import 'aframe-fps-counter-component';
import 'aframe-haptics-component';
import 'aframe-geometry-merger-component';
import { DataConfig } from './types/dataConfig';
import processInput from './store/processInput';

declare var AFRAME: any;

initAframe(AFRAME);
@customElement('webxr-multiboard')
class MyComponent extends LitElement {
  @property({ attribute: false })
  data: unknown;

  @property({ type: Boolean, attribute: true })
  showDebug: boolean = false;

  @state()
  isXr = AFRAME.utils.device.isMobileVR();

  @state()
  cursor = !AFRAME.utils.device.isMobileVR();

  @state()
  fpsCounter = false;

  @state()
  private dataConfig: DataConfig;

  @state()
  private dataInitialized = false;

  async firstUpdated() {
    this.dataConfig = await processInput(this.data);
    initBoard('b-mid', this.dataConfig);
    console.log({ dataConfig: this.dataConfig });

    this.dataInitialized = true;
  }

  /* Do not create shadow dom */
  createRenderRoot() {
    return this;
  }

  render() {
    return html` <div>
      ${!this.dataInitialized
        ? html` <div>loading...</div> `
        : html`<vr-experience
            ?isXr=${this.isXr}
            ?cursor=${this.cursor}
            ?fpsCounter=${this.fpsCounter}
          ></vr-experience>`}
      ${this.showDebug &&
      html` <details
        style="margin: 1em 0; border: 1px #565759 dashed; padding: 4px;"
      >
        <summary>Debug Info</summary>
        <div>
          <div style="margin: 1em 0;">
            isXR: ${this.isXr} HS conn:
            ${AFRAME.utils.device.checkHeadsetConnected()} - isMobileVR:
            ${AFRAME.utils.device.isMobileVR()}
          </div>

          <div>User Agent: ${window.navigator.userAgent}</div>

          <div>
            <span>Cursor</span>
            <select
              id="cursor-select"
              name="cursor"
              value="${this.cursor.toString()}"
              @change="${() => (this.cursor = !this.cursor)}"
            >
              <option value="true" ?selected=${this.cursor}>Yes</option>
              <option value="false" ?selected=${!this.cursor}>No</option>
            </select>
          </div>

          <div>
            <span>FPS</span>
            <select
              id="fps-select"
              name="fps"
              value="${this.fpsCounter.toString()}"
              @change="${() => (this.fpsCounter = !this.fpsCounter)}"
            >
              <option value="true" ?selected=${this.fpsCounter}>Yes</option>
              <option value="false" ?selected=${!this.fpsCounter}>No</option>
            </select>
          </div>
        </div>
      </details>`}
    </div>`;
  }
}

export default MyComponent;
