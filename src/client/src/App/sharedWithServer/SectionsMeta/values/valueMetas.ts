import { z } from "zod";
import { reqMonNumber, reqMonString } from "../../utils/mongoose";
import { StateValue } from "./StateValue";
import { inEntityInfoValueSchema } from "./StateValue/InEntityValue";
import { numObjMeta } from "./StateValue/NumObj";
import { sectionUpdateSchemas } from "./StateValue/SectionUpdates";
import { stringObjMeta } from "./StateValue/StringObj";
import { varbInfoValueMeta } from "./StateValue/VarbInfoValue";
import { checkValueMetas } from "./valueMetaGeneric";
import { unionMetas } from "./valueMetaUnions";
import { valueNames } from "./ValueName";

export const valueMetas = checkValueMetas({
  number: {
    is: (v: any): v is number => typeof v === "number",
    initDefault: () => 0,
    zod: z.number(),
    mon: reqMonNumber,
  },
  dateTime: {
    is: (v: any): v is number => typeof v === "number",
    initDefault: () => 0,
    zod: z.number(),
    mon: reqMonNumber,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    initDefault: () => true,
    zod: z.boolean(),
    mon: { type: Boolean, required: true },
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    initDefault: () => "",
    zod: z.string(),
    mon: reqMonString,
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    initDefault: () => [] as string[],
    zod: z.array(z.string()),
    mon: [reqMonString],
  },
  stringObj: stringObjMeta,
  numObj: numObjMeta,
  inEntityValue: inEntityInfoValueSchema,
  varbInfo: varbInfoValueMeta,
  ...sectionUpdateSchemas,
  ...unionMetas,
});

export function isStateValue(value: any): value is StateValue {
  for (const valueName of valueNames) {
    if (valueMetas[valueName].is(value)) return true;
  }
  return false;
}
const zValueArr = Object.values(valueMetas).map((schema) => schema.zod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];
export const zValue = z.union(zValueArr);

export function isObjValue(
  value: any
): value is StateValue<"numObj"> | StateValue<"stringObj"> {
  return valueMetas.numObj.is(value) || valueMetas.stringObj.is(value);
}
