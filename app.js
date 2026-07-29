import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from './src/routes/user.routes.js'
const app = express()
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('api/users',userRoutes)
const PORT=process.env.Port || 4000




app.listen(PORT, () => {
  console.log(`tu tourne sur le port: ${PORT}`)
})
export default app;

