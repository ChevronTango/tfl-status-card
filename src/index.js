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
  static properties = {
    _entityStates: []
  };

  static styles = style;
  static getConfigElement() {
    return document.createElement(editorName);
  }

  set hass(hass) {
    this._hass = hass;
    this.updateProperties();
  }


  // required
  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define at least one entity');
    }
    this._config = config;
    this.updateProperties();
  }

  updateProperties() {
    if (!this._config || !this._hass) {
      return;
    }
    this._entityStates = this._config.entities.map(entity => {
      const entityIndex = entity?.entity ?? entity;
      const state = this._hass.states[entityIndex]
      const name = entity?.name;
      return { id: entityIndex, name: name, state: state };
    });
  }

  render() {
    const items = this._entityStates.map(entity => {
      const hassentity = entity.state;

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