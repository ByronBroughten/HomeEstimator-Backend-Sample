import { QueryReq } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { GetterVarbs } from "../../sharedWithServer/StateGetters/GetterVarbs";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";
import { LoginSetter } from "./shared/LoginSetter";

interface LoginActorInitProps
  extends StrictOmit<SectionActorBaseProps<"login">, "sectionName"> {}

export class LoginActor extends SectionActorBase<"login"> {
  constructor(props: LoginActorInitProps) {
    super({
      ...props,
      sectionName: "login",
    });
  }
  varb(varbName: string): SetterVarb<"login"> {
    return new SetterVarb({
      ...this.sectionActorBaseProps,
      varbName,
    });
  }
  get section() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get varbs() {
    return new GetterVarbs(this.sectionActorBaseProps);
  }
  get loginSetter() {
    return new LoginSetter(this.sectionActorBaseProps);
  }
  get loginReq(): QueryReq<"login"> {
    return makeReq(
      this.varbs.values({
        email: "string",
        password: "string",
      })
    );
  }
  async login() {
    const res = await this.apiQueries.login(this.loginReq);
    this.loginSetter.setLogin(res);
    this.section.resetToDefault();
  }
}
