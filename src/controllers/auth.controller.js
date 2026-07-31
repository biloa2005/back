import prisma from "../config/prisma.js"; // Extension .js indispensable en Node moderne
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const browser = req.headers["user-agent"] || "Unknown";

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Nom d'utilisateur et mot de passe sont requis." });
  }

  try {
    // 1. RECHERCHER L'UTILISATEUR
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Identifiants incorrects." }); // Sécurité : message générique
    }

    // 2. VERIFIER SI LE COMPTE EST ACTIF
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Connexion refusée : Compte désactivé." });
    }

    // 3. GESTION DU BLOCAGE TEMPORAIRE (MAX 15 MINUTES)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const failedAttempts = await prisma.loginLog.count({
      where: {
        userId: user.id,
        status: "FAILED",
        loginAt: { gte: fifteenMinutesAgo }
      }
    });

    if (failedAttempts >= 5) {
      return res.status(403).json({ success: false, message: "Connexion refusée : Trop de tentative échouées. Réessayez plus tard." });
    }

    // 4. VERIFICATION DU MOT DE PASSE VIA ARGON2
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      // Enregistrer le Log d'échec
      await prisma.loginLog.create({
        data: { userId: user.id, ipAddress, browser, status: 'FAILED' }
      });
      return res.status(401).json({ success: false, message: "Identifiants incorrects." });
    }

    // 5. CONNEXION REUSSIE -> Enregistrer le Log de succès
    await prisma.loginLog.create({
      data: { userId: user.id, ipAddress, browser, status: 'SUCCESS' }
    });

    // 6. GENERATION DES TOKENS JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 7. SAUVEGARDER LE REFRESH TOKEN EN BASE DE DONNÉES
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // 8. NETTOYAGE ASYNCHRONE DES VIEUX TOKENS EXPIRÉS
    prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    }).catch(err => console.error("Erreur nettoyage tokens:", err));

    // 9. RENVOI DU FORMAT JSON CONTENANT LES INFOS
    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role.name
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur lors de la connexion.", error: error.message });
  }
};
/**
 * changePassword - Permet à un utilisateur authentifié de changer son mot de passe.
 * @param {} req 
 * @param {*} res 
 * @returns 
 */
export const changePassword =async (req,res)=>{
  const{oldPassword,newPassword,confirmPassword}=req.body;
  const userId=req.user?.id;
  if(!oldPassword||!newPassword||!confirmPassword){
return res.statut(400).json({
  success:false,
  message:"Veuillez remplir tous les champs: Ancien mot de passe,nouveau et confirmation"
});
  }
    // VÉRIFICATION DE LA CORRESPONDANCE DU NOUVEAU MOT DE PASSE
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Le nouveau mot de passe et la confirmation ne correspondent pas."
    });
  }
  //VERIFIONS QUE LE MOT DE PASSE ENTRER NE CORRESPOND PAS A LANCIEN
if(oldPassword===newPassword){
  return res.status(400).json({
    success:false,
    message:"le nouveau mot de passe doit etres different de l'ancien"
  });
}
try{
  const user=await prisma.user.findUnique({
    where:{id:userId}
  });
  if(!user){
    return res.status(404).json({success:false,message:"utilisateur non trouver"})
  }
  //verifion l'ancien mot de passe
  const isPasswordValid=await argon2.verify(user.password,oldPassword)
  if (!isPasswordValid){
    return res.statut(401).json({success:false,message:"l'ancien mot de passe est incorrect"})

  }
  //chiffrons le nouveau mot de passe valide
  const hashedNewPassword=await argon2.hash(newPassword);
  //enregistrons la modification dans la BD
  await prisma.user.update({
    where:{id:userId},
    data:{password:hashedNewPassword}
  });
  //Deconnexion globale en revoquant les refresh tokens existants
await prisma.refreshToken.deleteMany({
  where:{userId:userId}
});
return res.status(200).json({
  success:true,
  message:"Mot de passe modifier avec success veuiller vous reconnecter"
})
}catch(error){
  return res.status(500).json({
    success:false,
    message:"Erreur lors du changement de mot de passe"
    ,error:error.message
  })
}

}