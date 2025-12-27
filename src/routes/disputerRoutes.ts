import express from "express";
import DisputeController from "../controllers/disputesController";

const router = express.Router();

class DisputeRouter {
  static init(): express.Router {
    router.post("/", DisputeController.create);
    router.get("/", DisputeController.list);
    router.get("/:id", DisputeController.getById);
    router.put("/:id/resolve", DisputeController.resolve);
    router.delete("/:id", DisputeController.delete);
    return router;
  }
}

export default DisputeRouter.init();
