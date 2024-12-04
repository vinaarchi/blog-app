import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import responseHandler from "../utils/responseHandler";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // Check user account
    const isExistUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    console.log(isExistUser);
    if (isExistUser) {
      // throw {
      //   rc: 400,
      //   message: `${req.body.email} is exist. Use other email account`,
      // };
      return responseHandler.error(
        res,
        `${req.body.email} is Exist. Use other email account.`,
        400
      );
    }

    const newPassword = await hashPassword(req.body.password);
    await prisma.user.create({
      data: { ...req.body, password: newPassword },
    });

    return responseHandler.success(res, "Your signup is success", 201);
  } catch (error: any) {
    console.log(error);
    return responseHandler.error(res, "Your signup is failed", 500, error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!findUser) {
      throw { rc: 404, message: "Account is not exist" };
    }
    //Checkpassword
    const comparePass = compareSync(req.body.password, findUser.password);
    if (!comparePass) {
      throw { rc: 401, message: "Password is Wrong" };
    }

    //Generate token
    const token = sign(
      { id: findUser.id, email: findUser.email },
      process.env.TOKEN_KEY || "test"
    );
    return res.status(200).send({
      fullname: findUser.fullname,
      username: findUser.username,
      email: findUser.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    next({
      rc: error.rc || 500,
      message: "Your signin is failed",
      success: false,
      error: error.message,
    });
  }
};

export const keepLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    // data from middleware token
    console.log("at keepLogin controller", res.locals.descript);
    const findUser = await prisma.user.findUnique({
      where: { id: res.locals.decript.id },
    });

    if (!findUser) {
      throw { rc: 404, message: "Account is not exist" };
    }

    const token = sign(
      { id: findUser.id, email: findUser.email },
      process.env.TOKEN_KEY || "test"
    );
    return res.status(200).send({
      fullname: findUser.fullname,
      username: findUser.username,
      email: findUser.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(error.rc || 500).send({
      message: "Your keepLogin is failed",
      success: false,
      error: error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const updatedProfile = await prisma.user.update({
      where: { id: res.locals.decript.id },
      data: req.body,
    });

    const token = sign(
      {
        id: updatedProfile.id,
        email: updatedProfile.email,
      },
      process.env.TOKEN_KEY || "test",
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).send({
      fullname: updatedProfile.fullname,
      username: updatedProfile.username,
      email: updatedProfile.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({
      message: "Error Updating Profile",
      success: false,
      error: error.message,
    });
  }
};
