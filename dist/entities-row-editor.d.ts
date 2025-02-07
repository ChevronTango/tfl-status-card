import { LitElement, nothing } from "lit";
import { HomeAssistant, EntityConfig } from "custom-card-helpers";
type LovelaceRowConfig = EntityConfig;
declare global {
    interface HASSDomEvents {
        "entities-changed": {
            entities: LovelaceRowConfig[];
        };
        "edit-detail-element": any;
    }
}
export declare class EntitiesCardRowEditor extends LitElement {
    hass?: HomeAssistant;
    entities?: LovelaceRowConfig[];
    label?: string;
    private _entityKeys;
    private _getKey;
    render(): import("lit").TemplateResult<1> | typeof nothing;
    private _addEntity;
    private _rowMoved;
    private _removeRow;
    private _valueChanged;
    private _editRow;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "entities-card-row-editor": EntitiesCardRowEditor;
    }
}
export {};
