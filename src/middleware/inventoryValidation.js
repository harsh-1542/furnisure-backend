import { check } from "express-validator";

export const validateInventory = [
  check("name", "Name is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("category", "Category is required").not().isEmpty(),
  check("price", "Price is required").isNumeric(),
  check("stock", "Stock is required").isNumeric(),
  check("material", "Material is required").not().isEmpty(),
  check("color", "Color is required").not().isEmpty(),
];
