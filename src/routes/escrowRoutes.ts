import express from "express";
import EscrowContractController from "../controllers/EscrowController";

const router = express.Router();

class EscrowContractRouter {
  static init(): express.Router {
    router.post("/", EscrowContractController.create);
    router.get("/", EscrowContractController.list);
    router.get("/:id", EscrowContractController.getById);
    router.put("/:id", EscrowContractController.update);
    router.delete("/:id", EscrowContractController.delete);
    return router;
  }
}

export default EscrowContractRouter.init();
