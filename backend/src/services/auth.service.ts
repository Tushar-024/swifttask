import status from "http-status";
import tokenTypes from "../config/tokens";
import Token from "../models/token.model";
import ApiError from "../utils/ApiError";
import userService from "./user.service";

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(status.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const register = async (userBody: any) => {
  if (await userService.isEmailTaken(userBody.email)) {
    throw new ApiError(status.BAD_REQUEST, "Email already taken");
  }
  const user = await userService.createUser({
    ...userBody,
  });
  return user;
};

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(status.NOT_FOUND, "Not found");
  }
  await Token.findOneAndUpdate({ token: refreshToken }, { blacklisted: true });
};

// const refreshAuth = async (refreshToken: string) => {
//   try {
//     const refreshTokenDoc = await tokenService.verifyToken(
//       refreshToken,
//       tokenTypes.REFRESH
//     );
//     const user = await userService.getUserById(refreshTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await Token.findOneAndUpdate(
//       { token: refreshToken },
//       { blacklisted: true }
//     );
//     return tokenService.generateAuthTokens(user);
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
//   }
// };

// const resetPassword = async (
//   resetPasswordToken: string,
//   newPassword: string
// ) => {
//   try {
//     const resetPasswordTokenDoc = await tokenService.verifyToken(
//       resetPasswordToken,
//       tokenTypes.RESET_PASSWORD
//     );
//     const user = await userService.getUserById(resetPasswordTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await userService.updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
//   }
// };

// const verifyEmail = async (verifyEmailToken: string) => {
//   try {
//     const verifyEmailTokenDoc = await tokenService.verifyToken(
//       verifyEmailToken,
//       tokenTypes.VERIFY_EMAIL
//     );
//     const user = await userService.getUserById(verifyEmailTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
//     await userService.updateUserById(user.id, { isEmailVerified: true });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
//   }
// };

export default {
  loginUserWithEmailAndPassword,
  register,
  logout,
  //   refreshAuth,
  //   resetPassword,
  //   verifyEmail,
};
