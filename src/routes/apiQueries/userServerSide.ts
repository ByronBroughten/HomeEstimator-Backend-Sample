import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  GuestAccessSectionsNext,
  RegisterFormData,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/SectionMetas/baseSectionTypes";
import { savableNameS } from "../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/SectionMetas/relSections/rel/valueMetaTypes";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { StrictPick } from "../../client/src/App/sharedWithServer/utils/types";
import { initDbSectionPack, UserDbRaw } from "../ServerUser";
import { modelPath, UserModel } from "../UserModel";

export const userServerSide = {
  userEmailLowerPath: modelPath.firstSectionPackSectionVarb(
    "user",
    "user",
    "email"
  ),
  findByEmailFilter(emailLower: string) {
    return { [this.userEmailLowerPath]: emailLower };
  },
  prepEmail(rawEmail: string): PreppedEmails {
    return {
      emailAsSubmitted: rawEmail.trim(),
      get email() {
        return this.emailAsSubmitted.toLowerCase();
      },
    } as const;
  },
  async makeNewUser(registerFormData: RegisterFormData): Promise<NewDbUser> {
    const { userName, email, password } = registerFormData;
    return {
      userName,
      apiAccessStatus: "basicStorage",
      encryptedPassword: await encryptPassword(password),
      ...this.prepEmail(email),
    };
  },
  makeDbUser({ newUser, guestAccessSections }: MakeDbUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      ...guestAccessSections,
      user: [initDbSectionPack("user", newUser)],
    };

    for (const storeName of savableNameS.arrs.all) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as UserDbRaw;
  },
  makeMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    return new UserModel({
      _id: _id ?? makeMongooseObjectId(),
      ...this.makeDbUser(makeUserProps),
    });
  },
  makeDbAndMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    const dbUser = this.makeDbUser(makeUserProps);
    const mongoUser = new UserModel({
      _id: _id ?? makeMongooseObjectId(),
      ...dbUser,
    });
    return {
      dbUser,
      mongoUser,
    };
  },
  async entireMakeUserProcess({
    _id,
    registerFormData,
    guestAccessSections,
  }: RegisterReqBody & { _id?: mongoose.Types.ObjectId }): Promise<
    UserDbRaw & mongoose.Document<any, UserDbRaw>
  > {
    const newUser = await this.makeNewUser(registerFormData);
    const userDoc = this.makeMongoUser({
      newUser,
      guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

type PreppedEmails = StrictPick<NewDbUser, "emailAsSubmitted" | "email">;
export type NewDbUser = SchemaVarbsToDbValues<UserVarbs>;

type MakeDbUserProps = {
  newUser: NewDbUser;
  guestAccessSections: GuestAccessSectionsNext;
};
type UserVarbs = BaseSectionsDb["user"]["varbSchemas"];

type MakeMongoUserProps = MakeDbUserProps & {
  _id?: mongoose.Types.ObjectId;
};

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}