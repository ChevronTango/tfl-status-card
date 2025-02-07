import {
  LitElement,
  html,
  css,
} from "lit";

import style from './style.js';

import TflStatusCardEditor from './index-editor.js';
import { fireEvent } from "custom-card-helpers";

const colours = {

};

const default_colour = { bg: 'white', colour: 'black' };

const cardName = 'tfl-status-card';
const editorName = cardName + '-editor';
customElements.define(editorName, TflStatusCardEditor);

class TFlStatusCard extends LitElement {

  ctx;

  constructor() {
    super();
  }

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
      const hassentity = this.hass.states[entity.entity]
      let background = colours[hassentity.attributes.friendly_name]?.bg || default_colour.bg;
      let colour = colours[hassentity.attributes.friendly_name]?.colour || default_colour.colour;

      let statecolour = 'transparent';
      if (hassentity.state !== 'Good Service') {
        statecolour = 'brown';
      }

      const className = hassentity.attributes.friendly_name.toLowerCase().replaceAll(" &", "").replaceAll(" ", "-");
      const warning = hassentity.state === "Good Service" ? "" : "warning";

      return html`
          <div class="row" @click=${warning ? () => this._handleClick(hassentity) : ""}>
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
      const name = await helpers.showAlertDialog(this, {
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
  name: 'TFL Status World Card',
  description: 'Card showing the status of the London Underground lines',
});