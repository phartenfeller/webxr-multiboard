import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';

@customElement('fund-select')
class FundSelect extends LitElement {
  @property({ type: Array })
  funds = [];

  @queryAll('.fund-select-checkbox')
  $checkboxes;

  static get styles() {
    return css`
      input[type='checkbox'] {
        margin: 0;
        outline-offset: 5 px;
        transform-style: preserve-3d;
        cursor: pointer;
      }

      .checkbox-list {
        display: flex;
        margin: 2ch 0;
      }

      .checkbox-div {
        margin-right: 4ch;
        accent-color: #3740ff;
      }

      .checkbox-div:hover {
        accent-color: #5f67ff;
      }

      .fund-label {
        user-select: none;
        padding-left: 0.75ch;
      }
    `;
  }

  handleCheckboxChange() {
    const selected = [];

    this.$checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selected.push(checkbox.name);
      }
    });

    const event = new CustomEvent('update-selected-funds', {
      bubbles: true,
      detail: {
        selected,
      },
    });

    this.dispatchEvent(event);
  }

  updated() {
    this.handleCheckboxChange();
  }

  render() {
    if (!this.funds || this.funds.length === 0) {
      return html`<div>No funds</div>`;
    }
    return html`
      <form>
        <h3>Funds</h3>
        <div class="checkbox-list">
          ${this.funds.map(
            (fund, i) => html`
              <div class="checkbox-div">
                <input
                  type="checkbox"
                  id="fund-select-${fund}"
                  class="fund-select-checkbox"
                  name="${fund}"
                  ?checked=${i < 4}
                  @change=${this.handleCheckboxChange}
                />
                <label for="fund-select-${fund}" class="fund-label">
                  ${fund}
                </label>
              </div>
            `
          )}
        </div>
      </form>
    `;
  }
}

export default FundSelect;
