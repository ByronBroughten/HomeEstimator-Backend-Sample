import { SimpleSectionName, simpleSectionNames } from "./baseSections";
import {
  childrenSections,
  GeneralChildrenSections,
} from "./childSectionsUtils/childrenSections";
import {
  childSection,
  GeneralChildSection,
} from "./childSectionsUtils/childSection";
import { relOmniParentChildren } from "./childSectionsUtils/omniParentChildren";

type Defaults = {
  [SN in SimpleSectionName]: {};
};
const defaults = simpleSectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = {};
  return defaults;
}, {} as Defaults);

type GenericChildSections = {
  [SN in SimpleSectionName]: GeneralChildrenSections;
};

function checkChildSections<CS extends GenericChildSections>(
  childSections: CS
) {
  return childSections;
}

export const childSections = checkChildSections({
  ...defaults,
  root: childrenSections({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,
  main: childrenSections({
    // main includes everything that is visible to the user on the front-end.
    login: ["login"],
    register: ["register"],
    updateUser: ["user"],
    deal: ["deal"],
    feStore: ["feStore"],
    userVarbList: ["userVarbList"],
    userOutputList: ["outputList"],
    userSingleList: ["singleTimeList"],
    userOngoingList: ["ongoingList"],
    singleTimeList: ["singleTimeList"],
    ongoingList: ["ongoingList"],
    outputList: ["outputList"],
  }),
  dbStore: childrenSections({
    user: ["user"],
    serverOnlyUser: ["serverOnlyUser"],
    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    dealMain: ["deal"],
    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  feStore: childrenSections({
    // feStore includes everything that has a corresponding child in dbStore
    // and that has any intermediary sections used to edit and add to them.
    user: ["user"],
    propertyTable: ["table"],
    loanTable: ["table"],
    mgmtTable: ["table"],
    dealTable: ["table"],
    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  table: childrenSections({
    column: ["column"],
    tableRow: ["tableRow"],
  }),
  tableRow: { cell: childSection("cell") },
  outputList: { output: childSection("output") },
  singleTimeList: { singleTimeItem: childSection("singleTimeItem") },
  ongoingList: {
    ongoingItem: childSection("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: childSection("userVarbItem") },
  userVarbItem: { conditionalRow: childSection("conditionalRow") },
  deal: childrenSections({
    propertyGeneral: ["propertyGeneral"],
    financing: ["financing"],
    mgmtGeneral: ["mgmtGeneral"],
    dealOutputList: ["outputList"],
  }),

  financing: { loan: childSection("loan") },
  loan: childrenSections({
    closingCostList: ["singleTimeList"],
    wrappedInLoanList: ["singleTimeList"],
  }),
  propertyGeneral: { property: childSection("property") },
  property: childrenSections({
    upfrontCostList: ["singleTimeList"],
    upfrontRevenueList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
    ongoingRevenueList: ["ongoingList"],
    unit: ["unit"],
  }),
  mgmtGeneral: { mgmt: childSection("mgmt") },
  mgmt: childrenSections({
    upfrontCostList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
  }),
});

// base and relSections for that matter?

// organize the types
// make the child types simpler
// make two versions of ChildType
// fix the lists
// get rid of the tableStore sections
// make a store section on the frontEnd with children analogous to the db sections

export type ChildSections = typeof childSections;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof ChildSections]: {
    [CN in keyof ChildSections[SN]]: ChildSections[SN][CN][PN &
      keyof ChildSections[SN][CN]];
  };
};