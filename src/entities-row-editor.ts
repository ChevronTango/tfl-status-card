import { mdiClose, mdiDrag } from "@mdi/js";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { HomeAssistant, EntityConfig, fireEvent } from "custom-card-helpers";

type LovelaceRowConfig = EntityConfig;

declare global {
  interface HASSDomEvents {
    "entities-changed": {
      entities: LovelaceRowConfig[];
    };

    "edit-detail-element": any; // HACK couldn't find a reference for type EditDetailElementEvent
  }
}

@customElement("entities-card-row-editor")
export class EntitiesCardRowEditor extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @property({ attribute: false })
  public entities?: LovelaceRowConfig[];

  @property()
  public label?: string;

  @property()
  public items?: string[];

  private _entityKeys = new WeakMap<LovelaceRowConfig, string>();

  private _getKey(action: LovelaceRowConfig) {
    if (!this._entityKeys.has(action)) {
      this._entityKeys.set(action, Math.random().toString());
    }

    return this._entityKeys.get(action)!;
  }

  render() {
    if (!this.entities || !this.hass) {
      return nothing;
    }
    console.log(this.items);

    return html`
      <h3>
        ${this.label ||
      `${this.hass!.localize(
        "ui.panel.lovelace.editor.card.generic.entities"
      )} (${this.hass!.localize(
        "ui.panel.lovelace.editor.card.config.required"
      )})`}
      </h3>
      <ha-sortable handle-selector=".handle" @item-moved=${this._rowMoved}>
        <div class="entities">
          ${repeat(
        this.entities.map(entity => (typeof entity === 'string' || entity instanceof String) ? { entity } : entity),
        (entityConf: LovelaceRowConfig) => this._getKey(entityConf),
        (entityConf: LovelaceRowConfig, index) => html`
              <div class="entity">
                <div class="handle">
                  <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                </div>
                ${entityConf.type
            ? html`
                      <div class="special-row">
                        <div>
                          <span>
                            ${this.hass!.localize(
              `ui.panel.lovelace.editor.card.entities.entity_row.${entityConf.type}`
            )}
                          </span>
                          <span class="secondary"
                            >${this.hass!.localize(
              "ui.panel.lovelace.editor.card.entities.edit_special_row"
            )}</span>
                        </div>
                      </div>
                    `
            : html`
                      <ha-entity-picker
                        allow-custom-entity
                        hide-clear-icon
                        .hass=${this.hass}
                        .value=${(entityConf as EntityConfig).entity}
                        .index=${index}
                        .includeEntities=${this.items}
                        @value-changed=${this._valueChanged}
                      ></ha-entity-picker>
                    `}
                <ha-icon-button
                  .label=${this.hass!.localize(
              "ui.components.entity.entity-picker.clear"
            )}
                  .path=${mdiClose}
                  class="remove-icon"
                  .index=${index}
                  @click=${this._removeRow}
                ></ha-icon-button>
                ${
          // HACK
          // Until we can preload the hui-sub-element-editor its best we don't offer editing to users
          // They can still edit via YAML if needed
          //     `<ha-icon-button
          //       .label=${this.hass!.localize(
          //   "ui.components.entity.entity-picker.edit"
          // )}
          //       .path=${mdiPencil}
          //       class="edit-icon"
          //       .index=${index}
          //       @click=${this._editRow}
          //     ></ha-icon-button>
          //     `+
          ""}
              </div>
            `
      )}
        </div>
      </ha-sortable>
      <ha-entity-picker
        class="add-entity"
        .hass=${this.hass}
        .includeEntities=${this.items}
        @value-changed=${this._addEntity}
      ></ha-entity-picker>
    `;
  }

  private async _addEntity(ev: CustomEvent): Promise<void> {
    const value = ev.detail.value;
    if (value === "") {
      return;
    }
    const newConfigEntities = this.entities!.concat({
      entity: value as string,
    });
    (ev.target as any).value = "";
    fireEvent(this, "entities-changed", { entities: newConfigEntities });
  }

  private _rowMoved(ev: CustomEvent): void {
    ev.stopPropagation();
    const { oldIndex, newIndex } = ev.detail;

    const newEntities = this.entities!.concat();

    newEntities.splice(newIndex, 0, newEntities.splice(oldIndex, 1)[0]);

    fireEvent(this, "entities-changed", { entities: newEntities });
  }

  private _removeRow(ev: CustomEvent): void {
    const index = (ev.currentTarget as any).index;
    const newConfigEntities = this.entities!.concat();

    newConfigEntities.splice(index, 1);

    fireEvent(this, "entities-changed", { entities: newConfigEntities });
  }

  private _valueChanged(ev: CustomEvent): void {
    const value = ev.detail.value;
    const index = (ev.target as any).index;
    const newConfigEntities = this.entities!.concat();

    if (value === "" || value === undefined) {
      newConfigEntities.splice(index, 1);
    } else {
      newConfigEntities[index] = {
        ...newConfigEntities[index],
        entity: value!,
      };
    }

    fireEvent(this, "entities-changed", { entities: newConfigEntities });
  }

  private _editRow(ev: CustomEvent): void {
    const index = (ev.currentTarget as any).index;
    fireEvent(this, "edit-detail-element", {
      subElementConfig: {
        index,
        type: "row",
        elementConfig: this.entities![index],
      },
    });
  }

  static styles = css`
    ha-entity-picker {
      margin-top: 8px;
    }
    .add-entity {
      display: block;
      margin-left: 31px;
      margin-right: 71px;
      margin-inline-start: 31px;
      margin-inline-end: 71px;
      direction: var(--direction);
    }
    .entity {
      display: flex;
      align-items: center;
    }

    .entity .handle {
      padding-right: 8px;
      cursor: move; /* fallback if grab cursor is unsupported */
      cursor: grab;
      padding-inline-end: 8px;
      padding-inline-start: initial;
      direction: var(--direction);
    }
    .entity .handle > * {
      pointer-events: none;
    }

    .entity ha-entity-picker {
      flex-grow: 1;
    }

    .special-row {
      height: 60px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
    }

    .special-row div {
      display: flex;
      flex-direction: column;
    }

    .remove-icon,
    .edit-icon {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }

    .secondary {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "entities-card-row-editor": EntitiesCardRowEditor;
  }
}