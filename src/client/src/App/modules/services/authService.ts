import Session from "supertokens-auth-react/recipe/session";
import { constants } from "../../Constants";

const userAuthKey = constants.tokenKey.apiUserAuth;
export const auth = {
  setToken(token: string): void {
    localStorage.setItem(constants.tokenKey.apiUserAuth, token);
  },
  setTokenFromHeaders<H extends UserInfoTokenProp>(headers: H): void {
    this.setToken(headers[userAuthKey]);
  },
  getToken(): string | null {
    const token = localStorage.getItem(userAuthKey);
    return token;
  },
  removeToken(): void {
    localStorage.removeItem(userAuthKey);
  },
  get isToken(): boolean {
    const token = this.getToken();
    return !!token;
  },
  async sessionExists(): Promise<boolean> {
    return Session.doesSessionExist();
  },
  getSuperUserId() {
    return Session.getUserId();
  },
};

export type UserInfoTokenProp = { [constants.tokenKey.apiUserAuth]: string };
export function hasAuthHeadersProp(value: any): value is UserInfoTokenProp {
  return (
    typeof value === "object" &&
    typeof value[constants.tokenKey.apiUserAuth] === "string"
  );
}
