import { Router, Request, Response, NextFunction } from "express";
import categoryService from "../service/Category.service";

const router = Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *                 description: The name of the category
 *                 example: "Tech"
 *               beschrijving:
 *                 type: string
 *                 description: The description of the category
 *                 example: "Technology-related topics"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 naam:
 *                   type: string
 *                 beschrijving:
 *                   type: string
 *       400:
 *         description: Invalid input or category already exists
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   naam:
 *                     type: string
 *                   beschrijving:
 *                     type: string
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: The requested category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 naam:
 *                   type: string
 *                 beschrijving:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategoryById(parseInt(req.params.id));
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *               beschrijving:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCategory = await categoryService.updateCategory(parseInt(req.params.id), req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
