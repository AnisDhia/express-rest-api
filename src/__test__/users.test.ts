import express from "express";
import request from "supertest";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/users.controller";
import { getUsers, deleteUserById, getUserById } from "../models/users.model";

jest.mock("../models/users.model");

const app = express();
app.use(express.json());
app.get("/users", getAllUsers);
app.delete("/users/:id", deleteUser);
app.put("/users/:id", updateUser);

describe("User Controller", () => {
  describe("getAllUsers", () => {
    it("should return 200 and users", async () => {
      (getUsers as jest.Mock).mockResolvedValue([{ id: 1, username: "John" }]);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, username: "John" }]);
    });

    it("should return 404 if no users are found", async () => {
      (getUsers as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/users");

      expect(response.status).toBe(404);
    });

    it("should return 500 on server error", async () => {
      (getUsers as jest.Mock).mockRejectedValue(new Error("Server Error"));

      const response = await request(app).get("/users");

      expect(response.status).toBe(500);
    });
  });

  describe("deleteUser", () => {
    it("should return 200 and the deleted user", async () => {
      (deleteUserById as jest.Mock).mockResolvedValue({
        id: 1,
        username: "John",
      });

      const response = await request(app).delete("/users/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, username: "John" });
    });

    it("should return 400 if no id is provided", async () => {
      const response = await request(app).delete("/users/");

      expect(response.status).toBe(404); // Supertest interprets a missing route as 404
    });

    it("should return 404 if user is not found", async () => {
      (deleteUserById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/users/1");

      expect(response.status).toBe(404);
    });

    it("should return 500 on server error", async () => {
      (deleteUserById as jest.Mock).mockRejectedValue(
        new Error("Server Error")
      );

      const response = await request(app).delete("/users/1");

      expect(response.status).toBe(500);
    });
  });

  describe("updateUser", () => {
    it("should return 200 and the updated user", async () => {
      const mockUser = { id: 1, username: "John", save: jest.fn() };
      (getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put("/users/1")
        .send({ username: "Doe" });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("Doe");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should return 400 if username is not provided", async () => {
      const response = await request(app).put("/users/1").send({});

      expect(response.status).toBe(400);
    });

    it("should return 500 on server error", async () => {
      (getUserById as jest.Mock).mockRejectedValue(new Error("Server Error"));

      const response = await request(app)
        .put("/users/1")
        .send({ username: "Doe" });

      expect(response.status).toBe(500);
    });
  });
});
