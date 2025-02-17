import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).json({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

//   const refreshTokens = catchAsync(async (req, res) => {
//     const tokens = await authService.refreshAuth(req.body.refreshToken);
//     res.send({ ...tokens });
//   });

export default {
  register,
  login,
  logout,
};
