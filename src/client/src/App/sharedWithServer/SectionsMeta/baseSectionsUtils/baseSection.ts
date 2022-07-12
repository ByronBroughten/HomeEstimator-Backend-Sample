import { omit } from "lodash";
import { Obj } from "../../utils/Obj";
import { BaseVarbSchemas } from "./baseVarbs";

export type BasePropName = keyof GeneralBaseSection;
export type GeneralBaseSection = {
  makeOneOnStartup: boolean;
  varbSchemas: BaseVarbSchemas;
  hasGlobalVarbs: boolean;
  placeholder: boolean;
};

type BaseSectionOptions = Partial<GeneralBaseSection>;
export const baseOptions = {
  alwaysOneFromStart: {
    makeOneOnStartup: true,
  },
  get defaultSection() {
    return {
      ...this.alwaysOneFromStart,
    };
  },
  fallback: {
    makeOneOnStartup: false,
    hasGlobalVarbs: false,
    placeholder: false,
  },
} as const;

type FallbackSchema = typeof baseOptions.fallback;
type ReturnSchema<V extends BaseVarbSchemas, O extends BaseSectionOptions> = {
  varbSchemas: V;
} & Omit<FallbackSchema, keyof O> &
  O;

export function baseSection<
  V extends BaseVarbSchemas,
  O extends BaseSectionOptions = {}
>(varbSchemas: V, options?: O): ReturnSchema<V, O> {
  return {
    varbSchemas,
    ...omit(baseOptions.fallback, Obj.keys(options ?? {})),
    ...options,
  } as ReturnSchema<V, O>;
}

export const baseSectionS = {
  get container() {
    return baseSection({
      _typeUniformity: "string",
    } as const);
  },
};
