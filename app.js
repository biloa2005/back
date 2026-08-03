import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from './src/routes/user.routes.js'
import centerRoutes from './src/routes/center.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const app = express()
// Configuration de base de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion des Anniversaires',
      version: '1.0.0',
      description: 'Documentation de mon API Express avec Prisma',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Serveur Local',
      },
    ],
  },
  // Chemin vers les fichiers contenant les commentaires Swagger (vos fichiers de routes)
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Route pour afficher l'interface Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/center',centerRoutes);
app.use((req, res, next) => {
   console.log(`Requête reçue : ${req.method} ${req.url}`);
   next();
 });
 app.use(cookieParser())
 app.use(cors({
  origin:"http://localhost:3000",
  credentials:true

 }))
const PORT=process.env.Port || 4000




app.listen(PORT, () => {
  console.log(`tu tourne sur le port: ${PORT}`)
})
export default app;

