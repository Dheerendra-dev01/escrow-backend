import express from "express";
import SubmissionController from "../controllers/submissionController";

const router = express.Router();

class SubmissionRouter {
  static init(): express.Router {
    router.post("/", SubmissionController.create);
    router.get("/", SubmissionController.list);
    router.get("/:id", SubmissionController.getById);
    router.delete("/:id", SubmissionController.delete);
    return router;
  }
}

export default SubmissionRouter.init();
