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
//Modifier user
export const updateUser=async(req,res)=>{
  try{
   const userId=req.params.id;
   //verifions que l'utilisateur existe
   const existingUser=await prisma.user.findUnique({
    where:{
      id:userId
  }
})
if(!existingUser){
    return res.status(404).json({
      message:"utilisateur introuvable"
    })

  }
  const updates={...req.body};
  // supprimons les champ qui ne doivent pas etre modifier
  delete updates.id;
  delete updates.createdAt;
 //traitons le mot de passe s'il est present
 if(updates.password){
  if(updates.password.trim().length<6){
    return res.status(400).json({
      message:"le mot de passe doit contenir au moins 6 caracteres"
    })
  }
//Hashage de securite
 updates.password=await argon2.hash(updates.password.trim()); 
}
 
 //verification qu'on a pas de champs vides ou supprimer
 if(Object.keys(updates).length===0){
  return res.status(400).json({
    message:"aucun champs a modifier"
  })
 }
  const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates,
            include: {
                role: { select: { name: true } },
                center: { select: { name: true } }
            }
        });
        //supprimer le mot de passe avan de renvoyer
         delete updatedUser.password;

        //  Réponse de succès
        return res.status(200).json({
            status: "success",
            message: "L'utilisateur a été modifié avec succès.",
            data: updatedUser
        });

}catch (error) {
        console.error("Erreur Prisma lors de la modification :", error);

        //  Gestion professionnelle des erreurs de base de données restant possibles
        
        // P2002 : Violation d'unicité (ex: modification de l'email/username par un déjà pris)
        if (error.code === 'P2002') {
            const duplicateField = error.meta?.target;
            return res.status(400).json({ 
                message: `La valeur entrée pour le champ '${duplicateField}' est déjà utilisée.` 
            });
        }

        // P2003 : Erreur de clé étrangère (si centerId ou roleId fourni n'existe pas)
        if (error.code === 'P2003') {
            return res.status(400).json({ message: "Le rôle (roleId) ou le centre (centerId) spécifié n'existe pas." });
        }

        return res.status(500).json({ message: "Une erreur interne du serveur est survenue." });
    }
};
 