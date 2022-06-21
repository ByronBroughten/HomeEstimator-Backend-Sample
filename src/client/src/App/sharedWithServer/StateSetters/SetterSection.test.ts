import { dbNumObj } from "../SectionsMeta/baseSections/baseValues/NumObj";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

// loadSelfSectionPack
// loadChildPackArrs
// replaceWithDefault, resetToDefault

describe("SetterSection", () => {
  const sectionNames = ["property", "mgmt", "deal"] as const;
  type TestName = typeof sectionNames[number];
  type SnTesterProps<SN extends TestName> = { tester: SetterTesterSection<SN> };
  type FnWithSnProp<SN extends TestName = TestName> = (
    props: SnTesterProps<SN>
  ) => void;
  function runSectionNames(fn: FnWithSnProp) {
    for (const sectionName of sectionNames) {
      fn({
        tester: SetterTesterSection.init(sectionName),
      });
    }
  }
  it("should remove its own section", () => {
    runSectionNames(({ tester }) => {
      const { parent, feInfo, sectionName } = tester;
      const preCounts = parent.childCounts(sectionName);
      tester.setter.removeSelf();
      const postCounts = parent.childCounts(sectionName);

      expect(parent.get.hasChild(feInfo as any)).toBe(false);
      expect(postCounts.childIds).toBe(preCounts.childIds - 1);
      expect(postCounts.childSections).toBe(preCounts.childSections - 1);
    });
  });
  it("should load a sectionPack", () => {
    const sectionName = "property";
    const tester = SetterTesterSection.init(sectionName);
    const mainBuilder = PackBuilderSection.initAsMain();

    const childName = "unit";
    const numChildrenInit = tester.get.childFeIds(childName);
    const numChildrenNext = 3;
    expect(numChildrenInit).not.toBe(numChildrenNext);

    const preChildCounts = tester.childCounts(childName);
    const childCountDifference = numChildrenNext - preChildCounts.childIds;

    const packVarbs = {
      price: dbNumObj(257801),
      title: "New Title",
    } as const;

    const packBuilder = mainBuilder.addAndGetDescendant(
      ["deal", "propertyGeneral", "property"],
      { dbVarbs: packVarbs }
    );
    for (let i = 0; i < numChildrenNext; i++) {
      packBuilder.addChild(childName);
    }

    const sectionPack = packBuilder.makeSectionPack();
    tester.setter.loadSelfSectionPack(sectionPack);

    const { getter } = tester;

    const postChildCounts = tester.childCounts(childName);

    expect(getter.dbId).toBe(sectionPack.dbId);
    expect(postChildCounts.childIds).toBe(numChildrenNext);
    expect(postChildCounts.childSections).toBe(
      preChildCounts.childSections + childCountDifference
    );
    expect(getter.value("title")).toBe(packVarbs["title"]);
    expect(getter.value("price", "numObj").editorText).toBe(
      packVarbs.price.editorText
    );
  });
  describe("operations with children", () => {
    type SectionChildNameProps<SN extends SectionName<"hasChild">> = {
      childName: ChildName<SN>;
      tester: SetterTesterSection<SN>;
    };
    type SectionChildPropsFn<
      SN extends SectionName<"hasChild"> = SectionName<"hasChild">
    > = (props: SectionChildNameProps<SN>) => void;

    function runWithNames(fn: SectionChildPropsFn): void {
      const sectionAndChildNames = [
        ["mgmt", ["upfrontCostList"]],
        ["property", ["unit"]],
      ] as const;
      for (const [sectionName, childNames] of sectionAndChildNames) {
        for (const childName of childNames) {
          fn({
            tester: SetterTesterSection.init(sectionName) as any,
            childName,
          });
        }
      }
    }
    it("should add a child to state", () => {
      runWithNames(({ tester, childName }) => {
        const preCounts = tester.childCounts(childName);
        tester.setter.addChild(childName);
        const postCounts = tester.childCounts(childName);

        expect(postCounts.childIds).toBe(preCounts.childIds + 1);
        expect(postCounts.childSections).toBe(preCounts.childSections + 1);
      });
    });
    it("should get the child it adds", () => {
      runWithNames(({ tester, childName }) => {
        const preChildIds = tester.get.childFeIds(childName);

        const { setter } = tester;
        const child = setter.addAndGetChild(childName);

        expect(preChildIds).not.toContain(child.get.feId);
        expect(child.get.sectionName).toBe(childName);

        const postChildIds = tester.get.childFeIds(childName);
        expect(postChildIds).toContain(child.get.feId);
      });
    });
    it("should remove a child from state", () => {
      runWithNames(({ tester, childName }) => {
        tester.setter.addChild(childName);
        const { feInfo: childInfo } = tester.get.youngestChild(childName);
        expect(tester.get.hasChild(childInfo)).toBe(true);

        const preCounts = tester.childCounts(childName);

        tester.setter.removeChild(childInfo);

        const postCounts = tester.childCounts(childName);
        expect(tester.get.hasChild(childInfo)).toBe(false);
        expect(postCounts.childIds).toBe(preCounts.childIds - 1);
        expect(postCounts.childSections).toBe(preCounts.childSections - 1);
      });
    });
    it("should remove all children of a childName from state", () => {
      runWithNames(({ tester, childName }) => {
        tester.setter.addChild(childName);
        tester.setter.addChild(childName);
        const preCounts = tester.childCounts(childName);

        tester.setter.removeChildren(childName);

        const postCounts = tester.childCounts(childName);
        expect(postCounts.childIds).toBe(0);
        expect(postCounts.childSections).toBe(
          preCounts.childSections - preCounts.childIds
        );
      });
    });
  });
});
