import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //descript token from request header
    console.log("from request header", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      throw { rc: 400, status: false, message: "Token not exist" };
    }

    const checkToken = verify(token, process.env.TOKEN_KEY || "test");
    console.log("INI DRI VERIFY TOKEN", checkToken);

    res.locals.decript = checkToken;
    // meneruskan proses ke controller selanjutnya
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(401).send({
      message: "Unauthorized token, is invalid",
      success: false,
    });
  }
};
