import express from "express";

import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await getUsers();

    return res.status(200).json(user); // OK
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Bad Request
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.sendStatus(400); // Bad Request
    }

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.sendStatus(404); // Not Found
    }

    return res.status(200).json(deletedUser); // OK
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Bad Request
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400); // Bad Request
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json(user).end(); // OK
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};
