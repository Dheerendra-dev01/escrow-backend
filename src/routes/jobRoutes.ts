import express from "express";
import JobController from "../controllers/jobController";

const router = express.Router();

class JobRouter {
  static init(): express.Router {
    router.post("/", JobController.create);
    router.get("/", JobController.list);
    router.get("/:id", JobController.getById);
    router.put("/:id", JobController.update);
    router.delete("/:id", JobController.delete);
    return router;
  }
}

export default JobRouter.init();
