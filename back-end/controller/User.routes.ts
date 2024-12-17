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

      // Call the service to create the user
      const newUser = await userService.createUser(userInput);

      // Return the response with 201 Created
      res.status(201).json({
          message: 'User created successfully',
          user: newUser,
      });
  } catch (error: any) {
      if (error.message.includes('required') || error.message.includes('exists')) {
          res.status(400).json({ error: error.message });
      } else {
          next(error); // Pass to the error handler
      }
  }
});







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



router.post('/users/authenticate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: UserInput = req.body;

    // Check if required fields are provided
    if (!email || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Authenticate the user
    const authResult = await userService.authenticate({ email, password });

    if (!authResult) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Return the JWT token and username
    const { token, email: authenticatedEmail } = authResult;

    res.status(200).json({
      message: 'Authentication successful',
      token, // Send back the JWT token
      username: authenticatedEmail, // Send the username
    });
  } catch (error) {
    next(error); // Pass errors to the error handler
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

/**
 * DELETE /users
 * Deletes all users from the database
 */
router.delete('/deleteAll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteAllUsers();
    res.status(200).json({ message: 'All users have been deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
