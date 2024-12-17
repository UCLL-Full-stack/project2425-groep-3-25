import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import companyRoutes from './controller/Company.routes';
import projectRoutes from './controller/Project.routes';
import userRoutes from './controller/User.routes';
import { expressjwt } from 'express-jwt';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

app.use(expressjwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
}).unless({
    path: [
        '/api-docs',
        /^\/api-docs\/.*/, // Includes all Swagger UI paths
        '/users/login',
        '/users/signUp', // Make sure this matches the exact route
        '/status',
    ],
}));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the service',
        },
    },
    apis: ['controller/*.routes.ts'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/companies', companyRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ status: "application error", message: "Unauthorized access: " + err.message });
    } else {
        res.status(400).json({ status: "application error", message: err.message });
    }
});


app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});
