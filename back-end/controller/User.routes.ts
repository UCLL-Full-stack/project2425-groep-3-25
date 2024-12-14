import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/User.service';
import { UserInput } from '../types';
import { stat } from 'fs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:  [Users]
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


/**
 * @swagger
 * components:
 *   schemas:
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
 */

router.post('/signUp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: UserInput = req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});


router.post('/users/authenticate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password }: UserInput = req.body;
  
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }
  
      const isAuthenticated = await userService.authenticate({ username, password });
      if (!isAuthenticated) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
  
      res.status(200).json({ message: 'Authentication successful' });
    } catch (error) {
      next(error);
    }
  });

router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const updatedData = req.body;
      const updatedUser = await userService.updateUser(userId, updatedData);
  
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

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
