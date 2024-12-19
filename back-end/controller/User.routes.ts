import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/User.service';
import { UserInput } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           example: admin
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: password123
 *         email:
 *           type: string
 *           example: johndoe@example.com
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.getUserById({ id: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/signUp:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post('/signUp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput: UserInput = req.body;
    const newUser = await userService.createUser(userInput);
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: any) {
    if (error.message.includes('required') || error.message.includes('exists')) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       401:
 *         description: Authentication failed
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput: UserInput = req.body;
    const authResult = await userService.authenticate(userInput);

    if (!authResult) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const { token, email } = authResult;
    res.status(200).json({
      message: "Authentication successful",
      token, 
      email, 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
