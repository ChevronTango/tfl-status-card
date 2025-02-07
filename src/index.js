import {
  LitElement,
  html,
  css,
} from "lit";

import style from './style.js';

import TflStatusCardEditor from './index-editor.js';

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
    this.attachShadow({ mode: 'open' });
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

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');

    card.id = 'ha-card';
    content.id = 'content';
    card.appendChild(content);
    card.appendChild(style);
    root.appendChild(card);
    this._config = config;
  }

  render() {
    const config = this._config;
    const hassEntities = config.entities.map(x => this.hass.states[x.entity]);
    const root = this.shadowRoot;
    const content = root.getElementById("content");


    // done once
    if (!this.ctx) {
      const table = document.createElement('div')
      table.id = 'tfl-status';
      content.appendChild(table);
      this.ctx = table;
      // user makes sense here as every login gets it's own instance
      // this.innerHTML = ctx;
      // this.content = this.querySelector('div');
    }
    else {
      this.ctx.innerHTML = '';
    }
    this.ctx.innerHTML = config.entities.map(entity => {
      const hassentity = this.hass.states[entity.entity]
      let background = colours[hassentity.attributes.friendly_name]?.bg || default_colour.bg;
      let colour = colours[hassentity.attributes.friendly_name]?.colour || default_colour.colour;

      let statecolour = 'transparent';
      if (hassentity.state !== 'Good Service') {
        statecolour = 'brown';
      }

      const className = hassentity.attributes.friendly_name.toLowerCase().replaceAll(" &", "").replaceAll(" ", "-");
      const warning = hassentity.state === "Good Service" ? "" : "warning";

      return `
        <div class="row">
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
    }).join('');
  }
}

customElements.define(cardName, TFlStatusCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: cardName,
  name: 'TFL Status World Card',
  description: 'Card showing the status of the London Underground lines',
});