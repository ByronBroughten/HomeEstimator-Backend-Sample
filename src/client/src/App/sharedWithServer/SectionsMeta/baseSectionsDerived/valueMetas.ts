import { z } from "zod";
import { reqMonNumber, reqMonString } from "../../utils/mongoose";
import { inEntityInfoValueSchema } from "../allBaseSectionVarbs/baseValues/InEntityIdInfoValue";
import {
  isNumObj,
  mDbNumObj,
  NumObj,
  zNumObj,
} from "../allBaseSectionVarbs/baseValues/NumObj";
import {
  initDefaultStringObj,
  isStringObj,
  mStringObj,
  zStringObj,
} from "../allBaseSectionVarbs/baseValues/StringObj";
import { ValueName } from "../allBaseSectionVarbs/ValueName";
import { varbInfoValueSchema } from "../sectionChildrenDerived/VarbInfoValue";

export const valueMetas = {
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
  stringObj: {
    is: isStringObj,
    initDefault: initDefaultStringObj,
    zod: zStringObj,
    mon: mStringObj,
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    initDefault: () => [] as string[],
    zod: z.array(z.string()),
    mon: [reqMonString],
  },
  numObj: {
    is: isNumObj,
    initDefault: ({
      mainText = "",
      entities = [],
      solvableText = mainText,
    }: Partial<NumObj> = {}) => ({
      mainText,
      entities,
      solvableText,
    }),
    zod: zNumObj,
    mon: mDbNumObj,
  },
  inEntityInfo: inEntityInfoValueSchema,
  varbInfo: varbInfoValueSchema,
} as const;

type ValueMeta = typeof valueMetas;

type RelValueTest = Record<ValueName, ValueMeta[keyof ValueMeta]>;
function testValues<T extends RelValueTest>(test: T): T {
  return test;
}
const _ = testValues(valueMetas);

const zValueArr = Object.values(valueMetas).map((schema) => schema.zod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];
export const zValue = z.union(zValueArr);
