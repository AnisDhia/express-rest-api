import express from "express";

import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOnwer } from "../middlewares";

export default (router: express.Router): express.Router => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOnwer, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOnwer, updateUser);

  return router;
};
