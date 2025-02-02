import EditorForm from '@marcokreeft/ha-editor-formbuilder';
import { FormControlRow, FormControl, ValueChangedEvent } from '@marcokreeft/ha-editor-formbuilder/dist/interfaces';
import { TemplateResult } from 'lit-html';
import { EntityConfig } from "custom-card-helpers";
export declare function processEditorEntities(entities: (any | string)[]): EntityConfig[];
declare const ImprovedEditorForm_base: typeof EditorForm;
export default class ImprovedEditorForm extends ImprovedEditorForm_base {
    private _subElementEditorConfig?;
    renderForm(formRows: FormControlRow[]): TemplateResult<1>;
    additionalControlRenderers: {
        entities: (card: ImprovedEditorForm, control: FormControl) => import("lit").TemplateResult<1>;
    };
    renderControl(control: FormControl): TemplateResult;
    _valueChanged(ev: ValueChangedEvent): void;
    private _handleSubElementChanged;
    private _editDetailElement;
    private _goBack;
    static get styles(): import("lit").CSSResult;
    renderEntities(card: ImprovedEditorForm, control: FormControl): import("lit").TemplateResult<1>;
}
export {};
