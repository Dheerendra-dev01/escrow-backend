import express from "express";
import TransactionController from "../controllers/transations";

const router = express.Router();

class TransactionRouter {
  static init(): express.Router {
    router.post("/", TransactionController.create);
    router.get("/", TransactionController.list);
    router.get("/:id", TransactionController.getById);
    router.delete("/:id", TransactionController.delete);
    return router;
  }
}

export default TransactionRouter.init();
