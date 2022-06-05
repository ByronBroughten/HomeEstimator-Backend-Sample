import { valueMeta } from "../../../SectionsMeta/baseSections/baseValues";
import { ValueTypes } from "../../../SectionsMeta/relSections/rel/valueMetaTypes";
import { Obj } from "../../../utils/Obj";

const editorUpdateNames = ["calcVarbs", "string", "stringArray"] as const;
type EditorUpdateName = typeof editorUpdateNames[number];
export function isEditorUpdateFnName(value: string): value is EditorUpdateName {
  return editorUpdateNames.includes(value as any);
}

export type StateValue = ValueTypes[keyof ValueTypes];

// basic updateFnNames simply return editorText upon user input
const directUpdateFnNames = ["number", "boolean", "string"] as const;
type DirectUpdateFnName = typeof directUpdateFnNames[number];
export function isBasicUpdateFnName(
  value: string
): value is DirectUpdateFnName {
  return directUpdateFnNames.includes(value as any);
}
export type DirectUpdateFnValue =
  ValueTypes[typeof directUpdateFnNames[number]];

// basic values don't have to change form before going into the database
const basicValueNames = ["number", "boolean", "string", "stringArray"] as const;
type BasicValues = {
  [Property in typeof basicValueNames[number]]: ValueTypes[Property];
};
export type BasicValue = BasicValues[keyof BasicValues];
export function isBasicValue(value: any): value is BasicValue {
  return basicValueNames.includes(value as any);
}

export function isStateValue(value: any): value is StateValue {
  for (const valueType of Obj.keys(valueMeta)) {
    if (valueMeta[valueType].is(value)) return true;
  }
  return false;
}
