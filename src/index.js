import {
  LitElement,
  html,
  css,
} from "lit";

import style from './style.js';

import HelloWorldCardEditor from './index-editor.js';

const colours = {
  Bakerloo: { bg: '#ae6118', colour: 'white' },
  Central: { bg: '#e41f1f', colour: 'white' },
  Circle: { bg: '#f8d42d', colour: '#113b92' },
  District: { bg: '#00a575', colour: 'white' },
  DLR: { bg: '#00bbb4', colour: 'white' },
  "Elizabeth line": { bg: '#6950a1', colour: 'white' },
  "Hammersmith & City": { bg: '#e899a8', colour: '#113b92' },
  Jubilee: { bg: '#8f989e', colour: 'white' },
  Metropolitan: { bg: '#893267', colour: 'white' },
  Northern: { bg: 'black', colour: 'white' },
  Piccadilly: { bg: '#0450a1', colour: 'white' },
  Victoria: { bg: '#009fe0', colour: 'white' },
  "Waterloo & City": { bg: '#70c3ce', colour: '#113b92' }
};

const default_colour = { bg: 'white', colour: 'black' };

const cardName = 'hello-world-card';
const editorName = cardName + '-editor';
customElements.define(editorName, HelloWorldCardEditor);

class HelloWorldCard extends LitElement {

  ctx;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
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
    content.style.height = '480px';
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
      const table = document.createElement('table')
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

      return `
        <tr>
            <td style="background:${background}; color:${colour}; font-weight: bold; padding:10px;">
              <div class="info  pointer text-content "  title="${entity.name ?? hassentity.attributes.friendly_name}">
                ${entity.name ?? hassentity.attributes.friendly_name}
              </div>
            </td>
            <td style="background:${statecolour}; padding:10px;">
              <div class="value  pointer text-content " title="${hassentity.state}">
                ${hassentity.state}
              </div>
            </td>
        </tr>
      `;
    }).join('');
  }
}

customElements.define(cardName, HelloWorldCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: cardName,
  name: 'Hello World Card',
  description: 'My First Card',
});