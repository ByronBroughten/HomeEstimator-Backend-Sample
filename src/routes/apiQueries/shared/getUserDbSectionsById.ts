import { Response } from "express";
import { handleResAndMakeError } from "../../../resErrorUtils";
import { UserModel } from "../../UserModel";

const options = {
  new: true,
  lean: true,
  useFindAndModify: false,
};

type FindUserByIdProps = { userId: string; res: Response };
export async function getUserSectionsById({ userId, res }: FindUserByIdProps) {
  const user = await UserModel.findById(userId, undefined, options);
  if (user) return user;
  else throw handleResAndMakeError(res, 404, "You are not logged in.");
}

export async function getUserByIdNoRes(userId: string) {
  const user = await UserModel.findById(userId, undefined, options);
  if (user) return user;
  else throw new Error("No user found.");
}