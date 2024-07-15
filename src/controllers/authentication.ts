import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400); // Bad Request
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt + authentication.password"
    );

    if (!user) {
      return res.sendStatus(404); // Not Found
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(401); // Unauthorized
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    res.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      secure: false,
      path: "/", // root path
      httpOnly: true,
    });

    return res.status(200).json(user).end(); // OK
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad Request
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(409); // Conflict
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: { password: authentication(salt, password), salt },
    });

    return res.status(201).json(user).end(); // Created
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};
