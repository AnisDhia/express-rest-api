import express from "express";

import authentication from "./authentication.route";
import users from "./users.route";

const router = express.Router();

export default (): express.Router => {
  router.get
  authentication(router);
  users(router);

  return router;
};
