import { dbStoreNames } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeExampleDeal } from "./makeDefaultFeUser/makeExampleDeal";
import { makeExampleStoreProperty } from "./makeDefaultFeUser/makeExampleProperty";
import {
  makeExampleUserOngoingLists,
  makeExampleUserSingleTimeLists,
} from "./makeDefaultFeUser/makeExampleUserOngoingLists";
import { makeExampleUserVarbLists } from "./makeDefaultFeUser/makeExampleUserVarbLists";
import { makeDefaultOutputList } from "./makeDefaultOutputList";

export type DbStoreSeed = {
  authId: string;
  email: string;
  userName: string;
  timeJoined: number;
};

export function makeDefaultDbStoreArrs({
  authId,
  userName,
  email,
  timeJoined,
}: DbStoreSeed) {
  const dbStore = PackBuilderSection.initAsOmniChild("dbStore");
  const userInfo = dbStore.addAndGetChild("userInfo");
  userInfo.updateValues({
    userName,
    email,
    timeJoined,
  });
  const userInfoPrivate = dbStore.addAndGetChild("userInfoPrivate");
  userInfoPrivate.updateValues({ guestSectionsAreLoaded: false });

  const authInfoPrivate = dbStore.addAndGetChild("authInfoPrivate");
  authInfoPrivate.updateValues({ authId });

  const stripeInfoPrivate = dbStore.addAndGetChild("stripeInfoPrivate");
  stripeInfoPrivate.updateValues({ customerId: "" });

  const outputSection = dbStore.addAndGetChild("outputSection");
  outputSection.loadChild({
    childName: "buyAndHoldOutputList",
    sectionPack: makeDefaultOutputList(),
  });

  dbStore.loadChildren({
    childName: "numVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  dbStore.loadChildren({
    childName: "singleTimeListMain",
    sectionPacks: makeExampleUserSingleTimeLists(),
  });
  dbStore.loadChildren({
    childName: "ongoingListMain",
    sectionPacks: makeExampleUserOngoingLists(),
  });
  dbStore.loadChildren({
    childName: "dealMain",
    sectionPacks: [
      makeExampleDeal("Example Property 1"),
      makeExampleDeal("Example Property 2"),
      makeExampleDeal("Example Property 3"),
    ],
  });
  dbStore.loadChildren({
    childName: "propertyMain",
    sectionPacks: [makeExampleStoreProperty()],
  });
  return dbStore.makeChildPackArrs(...dbStoreNames);
}
