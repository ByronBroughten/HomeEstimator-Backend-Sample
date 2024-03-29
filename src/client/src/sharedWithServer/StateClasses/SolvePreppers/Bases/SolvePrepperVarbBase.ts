import {
  GetterVarbBase,
  GetterVarbProps,
} from "../../../StateGetters/Bases/GetterVarbBase";
import { SectionName } from "../../../sectionVarbsConfig/SectionName";

import { SolverProps } from "../../Solvers/Solver";
import { SolvePrepperSectionBase } from "./SolvePrepperSectionBase";

interface SolvePrepperSectionProps<SN extends SectionName>
  extends SolverProps,
    GetterVarbProps<SN> {}

export class SolvePrepperVarbBase<
  SN extends SectionName
> extends SolvePrepperSectionBase<SN> {
  readonly getterVarbBase: GetterVarbBase<SN>;
  constructor(props: SolvePrepperSectionProps<SN>) {
    super(props);
    this.getterVarbBase = new GetterVarbBase(props);
  }
  get getterVarbProps(): GetterVarbProps<SN> {
    return this.getterVarbBase.getterVarbProps;
  }
}
