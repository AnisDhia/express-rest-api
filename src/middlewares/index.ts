import express from "express";
import { get, identity, merge } from "lodash";

import { getUserBySessionToken } from "../models/users.model";

export const isOnwer = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(401); // Unauthorized
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403); // Forbidden
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["sessionToken"];

    if (!sessionToken) {
      return res.sendStatus(401); // Unauthorized
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(401); // Unauthorized
    }

    // Attach the user to the request object
    merge(req, { identity: existingUser });

    return next(); // Continue
  } catch (error) {
    console.log(error);
    return res.sendStatus(401); // Unauthorized
  }
};
