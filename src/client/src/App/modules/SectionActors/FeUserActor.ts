import Session from "supertokens-auth-react/recipe/session";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs
} from "../../sharedWithServer/apiQueriesShared/register";
import {
  AuthStatus,
  UserPlan
} from "../../sharedWithServer/SectionsMeta/baseSections";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { auth } from "../services/authService";
import { makeReq } from "./../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";
import { LoginSetter } from "./shared/LoginSetter";

type FeUserProps = StrictOmit<SectionActorBaseProps<"feStore">, "sectionName">;
export class FeUserActor extends SectionActorBase<"feStore"> {
  constructor(props: FeUserProps) {
    super({
      ...props,
      sectionName: "feStore",
    });
  }
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.sectionActorBaseProps);
  }
  get loginSetter() {
    return new LoginSetter(this.sectionActorBaseProps);
  }
  private get guestAccessSectionPacks(): GuestAccessSectionPackArrs {
    const { sections } = this.get;
    const { getterSectionsProps } = sections;
    const feStore = sections.oneAndOnly("feStore");
    const feStorePackMaker = new PackMakerSection({
      ...getterSectionsProps,
      ...feStore.feInfo,
    });
    return feStorePackMaker.makeChildTypePackArrs(
      guestAccessNames
    ) as GuestAccessSectionPackArrs;
  }
  async loadUserData() {
    const res = await this.apiQueries.getUserData(
      makeReq({
        guestAccessSections: this.guestAccessSectionPacks,
      })
    );
    this.loginSetter.setLogin(res);
  }
  get userPlan(): UserPlan {
    const subInfo = this.get.onlyChild("subscriptionInfo");
    return subInfo.value("plan", "string") as UserPlan;
  }
  get isPro(): boolean {
    return this.userPlan === "fullPlan";
  }
  get isBasic(): boolean {
    return this.userPlan === "basicPlan";
  }
  get sessionExists() {
    return Session.doesSessionExist();
  }
  get isLoggedIn() {
    return auth.isToken;
  }
  get authStatus() {
    const authInfo = this.get.onlyChild("authInfo");
    return authInfo.value("authStatus", "string") as AuthStatus;
  }
  get isGuest() {
    return this.authStatus === "guest";
  }
}
