import { registerUser } from "../controllers/user.controller.js";
import prisma from "../config/prisma.js"; // Import de prisma



//  POUR CRÉER UN CENTRE
export const newCenter= async (req, res) => {
  try {
    const center = await prisma.center.create({
      data: { name: "Centre de Yaoundé 5", type: "PRINCIPAL" }
    });
    res.json({ success: true, message: "Centre créé !", centerId: center.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};