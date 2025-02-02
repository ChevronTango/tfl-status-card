import {
  LitElement,
  html,
  css,
} from "lit-element";

import style from './style-editor.js';

const defaultConfig = {}

export default class HelloWorldCardEditor extends LitElement {
  static get elementDefinitions() {
    return buildElementDefinitions([
      globalElementLoader('ha-checkbox'),
      globalElementLoader('ha-formfield'),
      globalElementLoader('ha-form-string'),
      globalElementLoader('ha-select'),
      globalElementLoader('mwc-list-item'),
    ], HelloWorldCardEditor);
  }

  static get styles() {
    return style;
  }

  static get properties() {
    return { hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = {
      ...defaultConfig,
      ...config,
    };
  }

  get entityOptions() {
    console.log(this.hass);
    const allEntities = Object.keys(this.hass.states).filter(eid => ['sensor'].includes(eid.substr(0, eid.indexOf('.'))));

    allEntities.sort();
    return allEntities;
  }

  firstUpdated() {
    this._firstRendered = true;
  }

  render() {
    console.log('rendering');
    if (!this.hass) {
      return html``;
    }

    // get header name
    let { header } = this._config;
    if (!header && this._config.entity) {
      let name = this._config.entity.split('.')[1] || '';
      if (name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        header = name;
      }
    }

    // eslint-disable-next-line arrow-body-style
    // eslint-disable-next-line arrow-parens
    const options = this.entityOptions.map(entity => html`<mwc-list-item value="${entity}" ?selected=${entity === this._config.entity}>${entity}</mwc-list-item>`);

    return html`
      <div class="card-config">

        <div class=overall-config'>
          <ha-form-string
            .schema=${{ name: 'header', type: 'string' }}
            label="Header"
            .data="${header}"
            .configValue="${'header'}"
            @changed="${this.configChanged}"
          ></ha-form-string>
        </div>

        <div class='entities'>
          <ha-select
            label="Entity"
            @selected="${this.configChanged}" 
            @closed="${e => e.stopPropagation()}" 
            .configValue="${'entity'}"
          >
            ${options}
          </ha-select>
          <ha-form-string
            .schema=${{ name: 'brightness_icon', type: 'string' }}
            label="Brightness Icon"
            .data="${this._config.brightness_icon}"
            .configValue="${'brightness_icon'}"
            @changed="${this.configChanged}"
          ></ha-form-string>
        </div>

        <div class='entities'>
         <ha-form-string
           .schema=${{ name: 'white_icon', type: 'string' }}
           label="White Icon"
            .data="${this._config.white_icon}"
            .configValue="${'white_icon'}"
            @changed="${this.configChanged}"
          ></ha-form-string>
          <ha-form-string
            .schema=${{ name: 'temperature_icon', type: 'string' }}
            label="Temperature Icon"
            .data="${this._config.temperature_icon}"
            .configValue="${'temperature_icon'}"
            @changed="${this.configChanged}"
          ></ha-form-string>
        </div>

        <div class='overall-config'>
          <div class='checkbox-options'>
            <ha-formfield label="Show Color Wheel">
              <ha-checkbox
                @change="${this.checkboxConfigChanged}" 
                .checked=${this._config.color_wheel}
                .value="${'color_wheel'}"
              ></ha-checkbox>
            </ha-formfield>
            <ha-formfield label="Shorten Cards">
              <ha-checkbox
                @change="${this.checkboxConfigChanged}"
                .checked=${this._config.shorten_cards}
                .value="${'shorten_cards'}"
              ></ha-checkbox>
            </ha-formfield>
            </div>
          </div>
      </div>
    `;
  }

  configChanged(ev) {
    if (!this._config || !this.hass || !this._firstRendered) return;
    const {
      target: { configValue, value },
      detail: { value: checkedValue },
    } = ev;

    if (checkedValue !== undefined && checkedValue !== null) {
      this._config = { ...this._config, [configValue]: checkedValue };
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    fireEvent(this, 'config-changed', { config: this._config });
  }

  checkboxConfigChanged(ev) {
    if (!this._config || !this.hass || !this._firstRendered) return;
    const {
      target: { value, checked },
    } = ev;

    this._config = { ...this._config, [value]: checked };

    fireEvent(this, 'config-changed', { config: this._config });
  }
}