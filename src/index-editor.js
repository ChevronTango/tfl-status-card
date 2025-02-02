import {
  LitElement,
  html,
  css,
} from "lit-element";
import { FormControlType, FormulaOneCardType } from '@marcokreeft/ha-editor-formbuilder/dist/interfaces'
import { getEntitiesByDomain, getEntitiesByDeviceClass, getDropdownOptionsFromEnum, formatList } from "@marcokreeft/ha-editor-formbuilder/dist/utils/entities";
// import { EntitiesRowEditor } from './EntitiesRowEditor.ts';
import './entities-row-editor.ts';
import ImprovedEditorForm from './entity-row-form.ts';

import style from './style-editor.js';

const defaultConfig = {}

export default class HelloWorldCardEditor extends ImprovedEditorForm {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  static get properties() {
    return { _hass: {}, _config: {} };
  }

  setConfig(config) {
    this._configEntities = config.entities;
    this._config = config;
  }

  render() {
    if (!this._hass || !this._config) {
      return html``;
    }

    return this.renderForm([
      { controls: [{ label: "Title", configValue: "title", type: FormControlType.Textbox }] },
      {
        label: "Entity",
        controls: [{
          configValue: "entity",
          type: FormControlType.EntityDropdown,
          items: Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === 'sensor' &&
              this._hass.states[eid].attributes.attribution === "Powered by TfL Open Data")
            .map((item) => formatList(item, this._hass)),
        }]
      },
      {
        controls: [{
          label: "Entities",
          configValue: "entities",
          type: "entities",
          items: Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === 'sensor' &&
              this._hass.states[eid].attributes.attribution === "Powered by TfL Open Data")
            .map((item) => formatList(item, this._hass)),
        }]
      },
    ])
  };
}