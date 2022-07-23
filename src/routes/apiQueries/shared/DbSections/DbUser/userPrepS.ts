import bcrypt from "bcrypt";
import { RegisterFormData } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { PackBuilderSection } from "../../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { makeMongooseObjectId } from "../../../../../client/src/App/sharedWithServer/utils/mongoose";
import { ResStatusError } from "../../../../../resErrorUtils";
import { DbSectionsModel } from "../../../../DbSectionsModel";
import { DbSectionsQuerier } from "../DbSectionsQuerier";
import { DbSectionsRaw } from "../DbSectionsQuerierTypes";
import {
  initEmptyNames,
  InitEmptyPackArrs,
  MakeDbUserProps,
  PreppedEmails,
  UserSectionPackArrs,
} from "./userPrepSTypes";

export const userPrepS = {
  async encryptPassword(unencrypted: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unencrypted, salt);
  },
  processEmail(rawEmail: string): PreppedEmails {
    const emailAsSubmitted = rawEmail.trim();
    const email = emailAsSubmitted.toLowerCase();
    return {
      emailAsSubmitted,
      email,
    };
  },
  async checkThatEmailIsUnique(email: string): Promise<void> {
    if (await DbSectionsQuerier.existsByEmail(email)) {
      throw new ResStatusError({
        errorMessage: `An account with the email ${email} already exists.`,
        resMessage: "An account with that email already exists",
        status: 400,
      });
    }
  },
  async initUserSectionPacks(
    registerFormData: RegisterFormData
  ): Promise<UserSectionPackArrs> {
    const { email, emailAsSubmitted } = userPrepS.processEmail(
      registerFormData.email
    );
    await userPrepS.checkThatEmailIsUnique(email);
    return {
      user: [
        PackBuilderSection.initSectionPack("user", {
          dbVarbs: {
            userName: registerFormData.userName,
            email,
            apiStorageAuth: "basicStorage",
          },
        }),
      ],
      serverOnlyUser: [
        PackBuilderSection.initSectionPack("serverOnlyUser", {
          dbVarbs: {
            emailAsSubmitted,
            encryptedPassword: await userPrepS.encryptPassword(
              registerFormData.password
            ),
          },
        }),
      ],
    };
  },
  makeDbSectionsRaw({
    _id = makeMongooseObjectId(),
    ...sections
  }: MakeDbUserProps): DbSectionsRaw {
    const emptySectionArrs = initEmptyNames.reduce((packArrs, sectionName) => {
      packArrs[sectionName] = [];
      return packArrs;
    }, {} as InitEmptyPackArrs);

    return new DbSectionsModel({
      _id,
      ...sections,
      ...emptySectionArrs,
    });
  },
};
