import httpStatus from "http-status";
import type from "mongoose";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";

interface UserBody {
  email: string;
  name: string;
  password: string;
  isEmailVerified?: boolean;
}

const createUser = async (userBody: UserBody) => {
  return User.create(userBody);
};

const queryUsers = async (filter: any, options: any) => {
  const users = await (User as any).paginate(filter, options);
  return users;
};

const getUserById = async (id: string) => {
  return User.findById(id);
};

const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

const updateUserById = async (userId: string, updateBody: any) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    updateBody.email &&
    (await (User as any).isEmailTaken(updateBody.email, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.deleteOne();
  return user;
};

const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  return !!user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isEmailTaken,
};
