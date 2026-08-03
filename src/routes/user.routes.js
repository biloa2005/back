import { Router } from "express";
import {
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
  getUserInfo,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

// router.post('/register', verifyJwt,requireRole(['ADMIN'],registerUser));
router.post("/register", registerUser);
router.get("/", getAllUsers);
router.delete("/delete/:id", deleteUser);
/**
 * @swagger
 * /api/users/update/{id}:
 *   patch:
 *     summary: Modifier un utilisateur existant
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               username:
 *                 type: string
 *                 example: "j.dupont"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Le nouveau mot de passe (sera haché avec Argon2, min 6 caractères)
 *                 example: "NouveauPassword123!"
 *               phone:
 *                 type: string
 *                 example: "+237655555555"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               centerId:
 *                 type: string
 *                 description: L'ID du centre associé (clé étrangère)
 *                 example: "clw_center_id_xyz"
 *               roleId:
 *                 type: string
 *                 description: L'ID du rôle associé (Seul un ADMIN peut le modifier)
 *                 example: "clw_role_id_abc"
 *           example:
 *             firstName: "NouveauPrénom"
 *             phone: "+237677777777"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "L'utilisateur a été modifié avec succès."
 *                 data:
 *                   type: object
 *                   description: Les informations de l'utilisateur mis à jour (sans le mot de passe)
 *       400:
 *         description: Requête invalide (champs vides, doublons d'email/username, mot de passe trop court, IDs de relations inexistants)
 *       403:
 *         description: Accès refusé (Tentative de modification du rôle ou du centre sans être Admin)
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch("/update/:id", updateUser);
router.get("/access/:id", getUserById);
router.get("/show", verifyJwt, getUserInfo);
export default router;
