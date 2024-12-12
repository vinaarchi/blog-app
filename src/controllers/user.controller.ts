import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import responseHandler from "../utils/responseHandler";
import { NetConnectOpts } from "net";
import { transporter } from "../config/nodemailer";
import { sendEmail } from "../utils/emailSender";
import { RequiredExtensionArgs } from "@prisma/client/runtime/library";
import { cloudinaryUpload } from "../config/cloudinary";

export class UserController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
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
      const user = await prisma.user.create({
        data: { ...req.body, password: newPassword },
      });

      const token = sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_KEY || "test",
        { expiresIn: "1h" }
      );

      await sendEmail(req.body.email, "Registration Info", "register.hbs", {
        username: req.body.username,
        link: `${process.env.FE_URL}/verify?a_t=${token}`,
      });

      // await transporter.sendMail({
      //   from: "Admin",
      //   to: req.body.email,
      //   subject: "Account Verification",
      //   html: `<h1>Thankyou for registering ${req.body.username}!</h1>
      //           <p>Please verify your account by clicking the link below:</p>
      //           <a href="${verificationUrl}">Verify Account</a>`,
      // });

      return responseHandler.success(res, "Your signup is success", 201);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(
        res,
        "Your signup is failed",
        error.rc || 500,
        error
      );
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
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
        isVerified: findUser.isVerified,
        imgprofile: findUser.imgProfile,
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
  }

  async keepLogin(req: Request, res: Response): Promise<any> {
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
        imgprofile: findUser.imgProfile,
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
  }

  async updateProfile(req: Request, res: Response): Promise<any> {
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
  }

  async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      await prisma.user.update({
        where: { id: parseInt(res.locals.decript.id) },
        data: { isVerified: true },
      });

      responseHandler.success(res, "Your Account is verified", 201);
    } catch (error: any) {
      next(error);
    }
  }

  async updatePhotoProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    console.log("File Upload Info :", req.file);
    try {
      if (!req.file) {
        throw { rc: 400, message: "File not uploaded" };
      }

      //nnti setelah bisa upload img, nnti akan muncul di terminalnya, cari yang secureurl
      // const uploadImg = await cloudinaryUpload(req.file);
      //nnti bagian diatasnya itu diganti ke 
      const {secure_url} = await cloudinaryUpload(req.file)
      console.log("RESULT FROM MEMORY", secure_url);

      const update = await prisma.user.update({
        where: {
          id: parseInt(res.locals.decript.id),
        },
        data: {
          imgProfile: `/profile/${req.file?.filename}`,
        },
      });
      responseHandler.success(
        res,
        "Upload profile is success",
        200
        // update.imgProfile
      );
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email } = req.body;

      //cari user berdasarkan email
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw { rc: 404, message: "Email is not exist" };
      }

      const resetToken = sign(
        { userId: user.id },
        process.env.TOKEN_KEY || "test",
        { expiresIn: "30m" }
      );

      await sendEmail(req.body.email, "Forgot Password", "forgot.hbs", {
        username: req.body.username,
        link: `${process.env.FE_URL}/reset-password?a_t=${resetToken}`,
      });

      return responseHandler.success(
        res,
        "Check Your Email To Reset Password",
        201
      );
    } catch (error) {
      return res.status(500).send({
        message: "ini dri controller forgot password. salah",
      });
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const newPassword = await hashPassword(req.body.newPassword);
      const userId = parseInt(res.locals.decript.userId);
      console.log({ newPassword, userId });

      await prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });
      responseHandler.success(
        res,
        " Your New Password has been Successfully Updated ",
        201
      );
    } catch (error) {
      return res.status(500).send({
        message: "Ini dari controller reset password. Jadi salah",
      });
    }
  }
}
