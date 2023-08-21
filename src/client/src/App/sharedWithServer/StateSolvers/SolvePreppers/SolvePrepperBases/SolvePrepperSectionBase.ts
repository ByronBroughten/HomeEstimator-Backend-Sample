import { SectionName } from "../../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../StateGetters/Bases/GetterSectionBase";
import { SolverProps } from "../../Solver";
import { SolvePrepperBase } from "./SolvePrepperBase";

interface SolvePrepperSectionProps<SN extends SectionName>
  extends SolverProps,
    GetterSectionProps<SN> {}

export class SolvePrepperSectionBase<
  SN extends SectionName
> extends SolvePrepperBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  constructor(props: SolvePrepperSectionProps<SN>) {
    super(props);
    this.getterSectionBase = new GetterSectionBase(props);
  }
  get getterSectionProps(): GetterSectionProps<SN> {
    return this.getterSectionBase.getterSectionProps;
  }
}
