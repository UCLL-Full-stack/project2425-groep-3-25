import { Router, Request, Response, NextFunction } from "express";
import categoryService from "../service/Category.service";

const router = Router();

// Create a new category
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { naam, beschrijving } = req.body;
    const newCategory = await categoryService.createCategory({ naam, beschrijving });
    res.status(201).json(newCategory);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

// Get all categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// Get a category by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategoryById(parseInt(req.params.id));
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// Update a category
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCategory = await categoryService.updateCategory(parseInt(req.params.id), req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// Delete a category
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
