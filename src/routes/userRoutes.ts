import express from "express";
import UserJobController from "../controllers/UserController";

const router = express.Router();

class UserJobRouter {
	static init(): express.Router {
		router.post("/", (UserJobController.auth));
		router.get("/", (UserJobController.list));
		router.get("/:id", (UserJobController.getById));
		router.put("/:id", (UserJobController.update));
		router.delete("/:id", (UserJobController.delete));
		return router;
	}
}

export default UserJobRouter.init();
