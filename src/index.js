import {
  LitElement,
  html,
} from "lit";

import style from './style.js';

import TflStatusCardEditor from './index-editor.js';

const cardName = 'tfl-status-card';
const editorName = cardName + '-editor';
customElements.define(editorName, TflStatusCardEditor);

class TFlStatusCard extends LitElement {

  static styles = style;
  static getConfigElement() {
    return document.createElement(editorName);
  }
  // required
  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define at least one entity');
    }
    this._config = config;
  }

  render() {
    const config = this._config;
    const items = config.entities.map(entity => {
      const entityIndex = entity?.entity ?? entity;
      if (!entityIndex) {
        return;
      }
      const hassentity = this.hass.states[entityIndex]

      let statecolour = 'transparent';
      if (hassentity.state !== 'Good Service') {
        statecolour = 'brown';
      }

      const className = hassentity.attributes.friendly_name.toLowerCase().replaceAll(" &", "").replaceAll(" ", "-");
      const warning = hassentity.state === "Good Service" ? "" : "warning";

      return html`
          <div class="row" style="cursor: pointer;" @click=${() => this._handleClick(hassentity)}>
            <div class="column line ${className}">
              <div class=""  title="${entity.name ?? hassentity.attributes.friendly_name}">
                ${entity.name ?? hassentity.attributes.friendly_name}
              </div>
            </div>
            <div class="column status ${warning}">
              <div class="" title="${hassentity.state}">
                ${hassentity.state}
              </div>
            </div>
          </div>
      `;
    });


    return html`<ha-card>
      <div id="content">
      <div id="tfl-status">
      ${items}
      </div>
      </div>
    </ha-card>`
  }

  async _handleClick(entity) {
    if (entity?.attributes?.Description) {
      const helpers = await (window).loadCardHelpers?.();
      await helpers.showAlertDialog(this, {
        title: entity?.attributes?.friendly_name,
        text: entity?.attributes?.Description
      });
    }
  }

}



customElements.define(cardName, TFlStatusCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: cardName,
  name: 'TFL Status Card',
  description: 'Card showing the status of the London Underground lines',
});