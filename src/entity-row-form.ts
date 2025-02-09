import {
  html,
  css,
} from "lit";

import EditorForm from '@marcokreeft/ha-editor-formbuilder';
import { FormControlRow, FormControl, ValueChangedEvent } from '@marcokreeft/ha-editor-formbuilder/dist/interfaces';
import { TemplateResult } from 'lit-html';
import { EntityConfig, fireEvent, HASSDomEvent, } from "custom-card-helpers";

import { state } from "lit/decorators.js";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { loadHaForm } from "./load-ha-form";

type EditDetailElementEvent = any; // HACK
const configElementStyle = css`
  .card-config {
    /* Cancels overlapping Margins for HAForm + Card Config options */
    overflow: auto;
  }
  ha-switch {
    padding: 16px 6px;
  }
  .side-by-side {
    display: flex;
    align-items: flex-end;
  }
  .side-by-side > * {
    flex: 1;
    padding-right: 8px;
    padding-inline-end: 8px;
    padding-inline-start: initial;
  }
  .side-by-side > *:last-child {
    flex: 1;
    padding-right: 0;
    padding-inline-end: 0;
    padding-inline-start: initial;
  }
  .suffix {
    margin: 0 8px;
  }
  hui-action-editor,
  ha-select,
  ha-textfield,
  ha-icon-picker {
    margin-top: 8px;
    display: block;
  }
  ha-expansion-panel {
    display: block;
    --expansion-panel-content-padding: 0;
    border-radius: 6px;
    --ha-card-border-radius: 6px;
  }
  ha-expansion-panel .content {
    padding: 12px;
  }
  ha-expansion-panel > * {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }
  ha-expansion-panel ha-svg-icon {
    color: var(--secondary-text-color);
  }
`;

export function processEditorEntities(
  entities: (any | string)[]
): EntityConfig[] {
  return entities.map((entityConf) => {
    if (typeof entityConf === "string") {
      return { entity: entityConf };
    }
    return entityConf;
  });
}

export default class ImprovedEditorForm extends ScopedRegistryHost(EditorForm) {
  @state() private _subElementEditorConfig?: any;  // HACK: SubElementEditorConfig;

  renderForm(formRows: FormControlRow[]): TemplateResult<1> {

    if (this._subElementEditorConfig) {
      return html`
            <hui-sub-element-editor
              .hass=${this._hass}
              .config=${this._subElementEditorConfig}
              @go-back=${this._goBack}
              @config-changed=${this._handleSubElementChanged}
            >
            </hui-sub-element-editor>
          `;
    }
    return super.renderForm(formRows);
  }

  additionalControlRenderers = {
    ["entities"]: this.renderEntities,
  };
  renderControl(control: FormControl): TemplateResult {
    const renderer = this.additionalControlRenderers[control.type];
    if (!renderer) {
      return super.renderControl(control);
    }
    return renderer(this, control);
  }

  _valueChanged(ev: ValueChangedEvent): void {
    (ev as any).stopPropagation(); // Hack
    if (!this._config || !this._hass) {
      return;
    }
    const detail = ev.detail as any; //hack
    const target = ev.target! as any; //hack
    const configValue =
      target.configValue || this._subElementEditorConfig?.type;
    const value =
      target.checked !== undefined
        ? target.checked
        : target.value || detail.config || detail.value;

    if (configValue === "row" || (detail && detail.entities)) {
      const newConfigEntities =
        detail.entities || this._config!.entities!.concat();
      if (configValue === "row") {
        if (!value) {
          newConfigEntities.splice(this._subElementEditorConfig!.index!, 1);
          this._goBack();
        } else {
          newConfigEntities[this._subElementEditorConfig!.index!] = value;
        }

        this._subElementEditorConfig!.elementConfig = value;
      }

      this._config = { ...this._config!, [configValue]: newConfigEntities };
      this._config![configValue] = processEditorEntities(this._config![configValue]);
    } else if (configValue) {
      if (value === "") {
        this._config = { ...this._config };
        delete this._config[configValue!];
      } else {
        this._config = {
          ...this._config,
          [configValue]: value,
        };
      }
    }

    fireEvent(this, "config-changed", { config: this._config });
  }

  private _handleSubElementChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this._hass) {
      return;
    }

    const configValue = this._subElementEditorConfig?.type;
    const value = ev.detail.config;

    if (configValue === "row") {
      const newConfigEntities = this._config!.entities.concat();
      if (!value) {
        newConfigEntities.splice(this._subElementEditorConfig!.index!, 1);
        this._goBack();
      } else {
        newConfigEntities[this._subElementEditorConfig!.index!] = value;
      }

      this._config = { ...this._config!, entities: newConfigEntities };
      this._config!.entities = processEditorEntities(this._config!.entities);
    } else if (configValue) {
      if (value === "") {
        this._config = { ...this._config };
        delete this._config[configValue!];
      } else {
        this._config = {
          ...this._config,
          [configValue]: value,
        };
      }
    }

    this._subElementEditorConfig = {
      ...this._subElementEditorConfig!,
      elementConfig: value,
    };

    fireEvent(this, "config-changed", { config: this._config });
  }

  private _editDetailElement(ev: HASSDomEvent<EditDetailElementEvent>): void {
    this._subElementEditorConfig = ev.detail.subElementConfig;
  }

  private _goBack(): void {
    this._subElementEditorConfig = undefined;
  }

  static get styles() {
    return css`
        ${configElementStyle}
        .edit-entity-row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
        }

        hui-header-footer-editor {
          padding-top: 4px;
        }

        ha-textfield {
          display: block;
          margin-bottom: 16px;
        }
      `;
  }

  // Render the editor control. Should go in the utils/controls.js
  renderEntities(card: ImprovedEditorForm, control: FormControl) {
    const items = control?.items?.map(entity => (typeof entity === 'string' || entity instanceof String) ? entity : entity.value);
    return html`<div class="form-control">
      <entities-card-row-editor
        label="${control.label}"
        .hass=${card._hass}
        .entities="${card._config[control.configValue!] ?? []}"
        .configValue="${control.configValue}"
        .items="${items}"
        @entities-changed=${card._valueChanged}
        @edit-detail-element=${card._editDetailElement}
      ></entities-card-row-editor>
    </div>`;
  }
}

// This is a hack to allow us to use ha-entity-picker
// the custom component is not loaded when we start, so we need to force it to load
(async () => await loadHaForm())();