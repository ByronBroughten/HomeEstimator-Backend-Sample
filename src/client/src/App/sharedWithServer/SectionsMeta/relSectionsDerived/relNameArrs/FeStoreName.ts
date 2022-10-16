import { Arr } from "../../../utils/Arr";
import { Obj } from "../../../utils/Obj";
import { ChildName, getChildNames } from "../../childSectionsDerived/ChildName";
import { dbStoreNameS } from "../../childSectionsDerived/DbStoreName";
import { tableRowDbSources } from "../../relChildSections";
import { allSectionTraits, getSomeSectionTraits } from "../../sectionsTraits";

export const hasStoreNameArrs = {
  hasFeDisplayIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "displayIndexName",
    "string"
  ),
  hasFullIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "feFullIndexStoreName",
    "string"
  ),
  get hasIndexStore() {
    return [...this.hasFeDisplayIndex, ...this.hasFullIndex] as const;
  },
  hasCompareTable: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "compareTableName",
    "string"
  ),
} as const;

// both of these pertain to feStoreNames
const hasToStoreNames = {
  displayIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasFeDisplayIndex,
    "displayIndexName"
  ),
  fullIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasFullIndex,
    "feFullIndexStoreName"
  ),
  get indexStore() {
    return {
      ...this.displayIndex,
      ...this.fullIndex,
    } as const;
  },
} as const;

const indexStoreNames = makeNestedValueArrs(hasToStoreNames);

export type FeStoreName = ChildName<"feUser">;
export type FeStoreType = keyof StoreNameArrs;
export type FeStoreNameByType<SN extends FeStoreType = "all"> =
  StoreNameArrs[SN][number];

const feUserChildNames = getChildNames("feUser");
const feStoreNameArrs = {
  ...indexStoreNames,
  all: feUserChildNames,
  dbIndexName: tableRowDbSources,
  get fullIndexWithArrStore() {
    return Arr.extractStrict(
      indexStoreNames.fullIndex,
      dbStoreNameS.arrs.arrQuery
    );
  },
  get mainStoreName() {
    return Arr.extractStrict(indexStoreNames.fullIndex, [
      "dealMain",
      "propertyMain",
      "loanMain",
      "mgmtMain",
    ]);
  },
  displayNameDbSource: tableRowDbSources,
  displayStoreName: Obj.values(hasToStoreNames.displayIndex),
  mainTableName: Arr.extractStrict(feUserChildNames, [
    "propertyMainTable",
    "loanMainTable",
    "mgmtMainTable",
    "dealMainTable",
  ] as const),
} as const;
type StoreNameArrs = typeof feStoreNameArrs;

export const feStoreNameS = {
  arrs: feStoreNameArrs,
  is<T extends FeStoreType = "all">(
    value: any,
    type?: T
  ): value is FeStoreNameByType<T> {
    return (this.arrs[(type ?? "all") as T] as any).includes(value);
  },
} as const;

type NestedValueArr<T extends HasNestedValues> = {
  [K in keyof T]: T[K][keyof T[K]][];
};

type HasNestedValues = { [key: string]: { [key: string]: any } };
function makeNestedValueArrs<T extends HasNestedValues>(
  obj: T
): NestedValueArr<T> {
  return Obj.keys(obj).reduce((nestedValueArr, propName) => {
    nestedValueArr[propName] = Obj.values(obj[propName]);
    return nestedValueArr;
  }, {} as NestedValueArr<T>);
}