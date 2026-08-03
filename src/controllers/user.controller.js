import prisma from "../config/prisma.js";
import argon2 from "argon2";

export const registerUser = async (req, res) => {
  // On extrait TOUS les champs envoyés 
  const { firstName, lastName, email, username, password, phone, centerId, roleId } = req.body;

  // Validation : On vérifie que TOUS les champs requis sont présents
  if (!firstName || !lastName || !email || !username || !password || !centerId || !roleId) {
    return res.status(400).json({ 
      success: false, 
      message: "Tous les champs (firstName, lastName, email, username, password, centerId, roleId) sont requis." 
    });
  }

  try {
    // 1. Règle métier : Vérifier si l'email ou le username existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "L'identifiant ou l'adresse email existe déjà." });
    }

    // 2. Règle métier : Chiffrer le mot de passe avec Argon2
    const hashedPassword = await argon2.hash(password);

    // 3. Enregistrement dans MySQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        phone,
        centerId,
        roleId,
        isActive: true
      }
    });

    // 4. Format de réponse de succès
    return res.status(201).json({
      success: true,
      message: "Utilisateur enregistré",
      userId: newUser.id
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de l'inscription.", 
      error: error.message 
    });
  }
};
/**
 * 
 * @param {liste users} req 
 * @param {*} res 
 */
export const getAllUsers=async(req,res)=>{
  try{
    const users=await prisma.user.findMany();
    res.status(200).json({
      success:true,
      data:users,
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}
//SUPRIMER USER
export const deleteUser=async(req,res)=>{
  try{
    const{id}=req.params
  const remove= await prisma.user.delete({
    where:{
      id:Number(id)
    }
  })
  if(!user){
    throw new Error("utilisateur non trouver")
  }
   res.status(200).json({
      success:true,
    message:"utilisateur supprimer"})
}catch(error){
   res.status(500).json({
      success:false,
      message:error.message,
    })
}
}
