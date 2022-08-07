import { z } from "zod";
import { config } from "../../Constants";
import { AuthHeadersProp } from "../../modules/services/authService";
import {
  SectionPack,
  zRawSectionPack,
} from "../SectionsMeta/childSectionsDerived/SectionPack";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { zS } from "../utils/zod";
import { zRegisterFormData } from "./register";

export type LoginQueryObjects = {
  req: {
    body: LoginFormData;
  };
  res: {
    data: LoginData;
    headers: AuthHeadersProp;
  };
};

export type LoginData = {
  [SN in SectionName<"loadOnLogin">]: SectionPack<SN>[];
};

export function isLoginData(value: any): value is LoginData {
  const zLoginUserSchema = makeZLoginUserSchema();
  zLoginUserSchema.parse(value);
  return true;
}

function makeZLoginUserSchema() {
  return z.object(
    sectionNameS.arrs.loadOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zS.array(zRawSectionPack);
      return partial;
    }, {} as Record<keyof LoginData, any>) as Record<keyof LoginData, any>
  );
}

// eventually replace this interface with one derived from baseSections
const zLoginFormData = zRegisterFormData.pick({
  email: true,
  password: true,
});
export type LoginFormData = z.infer<typeof zLoginFormData>;

export function isLoginFormData(value: any): value is LoginFormData {
  const test = zLoginFormData.safeParse(value);
  return test.success;
}

export function isLoginHeaders(value: any): value is AuthHeadersProp {
  return (
    typeof value === "object" &&
    typeof value[config.tokenKey.apiUserAuth] === "string"
  );
}
