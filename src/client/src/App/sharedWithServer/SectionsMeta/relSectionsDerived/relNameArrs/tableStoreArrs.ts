import { Obj } from "../../../utils/Obj";
import { relSections } from "../../relSections";
import { getRelParams } from "./getRelParams";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  relSections,
  "feTableIndexStoreName",
  "string"
);

const tableStoreParams = getRelParams(
  tableSourceNames,
  "feTableIndexStoreName"
);
export const tableSourceParams = Obj.swapKeysAndValues(tableStoreParams);
const tableStoreNamesNext = Obj.values(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
  tableStore: tableStoreNamesNext,
};
