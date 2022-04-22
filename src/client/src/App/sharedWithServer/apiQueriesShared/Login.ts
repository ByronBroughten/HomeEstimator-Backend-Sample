import { z } from "zod";
import { config } from "../../Constants";
import {
  SectionName,
  sectionNameS,
} from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw, zRawSectionPack } from "../Analyzer/SectionPackRaw";
import { zodSchema } from "../utils/zod";
import { zRegisterFormData } from "./register";

export type LoginQueryObjects = {
  req: {
    body: LoginFormData;
  };
  res: {
    data: LoginUserNext;
    headers: LoginHeaders;
  };
};

export type LoginUserNext = Omit<
  {
    [SN in SectionName<"initOnLogin">]: SectionPackRaw<"fe", SN>[];
  },
  "row"
>;
export function isLoginUserNext(value: any): value is LoginUserNext {
  // Wait, why am I doing that?
  // I guess to access the user varbs.
  // I would like to just get this working, though.
  // I know that it's rather dangerous not to.
  const zLoginUserSchema = makeZLoginUserSchema();
  zLoginUserSchema.parse(value);
  return true;
}

function makeZLoginUserSchema() {
  return z.object(
    sectionNameS.arrs.fe.initOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zodSchema.array(zRawSectionPack);
      return partial;
    }, {} as Partial<Record<keyof LoginUserNext, any>>) as Record<
      keyof LoginUserNext,
      any
    >
  );
}

// eventually replace this interface with one derived from baseSections
const zLoginFormData = zRegisterFormData.pick({
  email: true,
  password: true,
});
export type LoginFormData = z.infer<typeof zLoginFormData>;

export function isLoginFormData(value: any): value is LoginFormData {
  return zLoginFormData.safeParse(value).success;
}

export type LoginHeaders = { [config.tokenKey.apiUserAuth]: string };
export function isLoginHeaders(value: any): value is LoginHeaders {
  return (
    typeof value === "object" &&
    typeof value[config.tokenKey.apiUserAuth] === "string"
  );
}
