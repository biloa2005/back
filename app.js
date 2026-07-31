import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from './src/routes/user.routes.js'
import centerRoutes from './src/routes/center.routes.js'

const app = express()
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/center',centerRoutes);
app.use((req, res, next) => {
   console.log(`Requête reçue : ${req.method} ${req.url}`);
   next();
 });
const PORT=process.env.Port || 4000




app.listen(PORT, () => {
  console.log(`tu tourne sur le port: ${PORT}`)
})
export default app;

