const express = require('express');
import authRoutes from "./routes/auth.routes.js"
import userRoutes from './routes/user.routes.js'
const app = express()
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('api/users',userRoutes)
const PORT=process.env.Port || 4000




app.listen(port, () => {
  console.log(`tu tourne sur le port: ${PORT}`)
})
module.exports = app;
