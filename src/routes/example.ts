import { Router } from "express";
import { check } from "express-validator";
import {
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/example";
import { validateEnpoint } from "../middlewares/validatorEnpoint";

const routes = Router();

// Optener
routes.get("/", getExample);

// Actulizar 
routes.put(
  "/",
  [check("_id", "example.validate_id").notEmpty(), validateEnpoint],
  updateExample
);

// Create 
routes.post(
  "/",
  [check("_id", "example.validate_id").notEmpty(), validateEnpoint],
  createExample
);

// Eliminar 
routes.delete(
  "/:id",
  [check("id", "example.validate_id").notEmpty(), validateEnpoint],
  deleteExample
);

export default routes;
