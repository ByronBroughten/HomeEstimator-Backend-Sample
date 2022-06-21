import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultUser() {
  const main = PackBuilderSection.initAsMain();
  const user = main.addAndGetChild("user", {
    dbVarbs: {
      email: "",
      userName: "Guest",
      apiAccessStatus: "readonly",
    },
  });
  return user.makeSectionPack();
}
