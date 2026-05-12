# 🧪 Test de Liaison Frontend-Backend

Ce document décrit les étapes pour vérifier que votre application React Native communique correctement avec votre backend Express/MongoDB.

## 1. Préparation du Backend
Assurez-vous que votre backend est lancé et accessible :
- Serveur Express sur le port **3000**.
- MongoDB est en cours d'exécution.
- Vérifiez votre IP locale (ex: `192.168.1.8`) si vous testez sur un appareil physique.

## 2. Vérification de la Configuration Frontend
Dans `lib/api/client.ts`, l'URL de base est configurée :
- **Android Emulator** : `http://10.0.2.2:3000`
- **iOS Simulator / Web** : `http://localhost:3000`
- **Appareil Physique** : Modifiez manuellement l'IP dans `client.ts` par votre IP machine.

## 3. Scénarios de Test

### ✅ Test 1 : Connexion (Login)
1. Ouvrez l'application sur la page de connexion.
2. Entrez un email et un mot de passe valides présents dans votre base MongoDB.
3. **Résultat attendu** : Redirection vers le tableau de bord. L'appel effectué est `GET /users?email=...&password=...`.

### ✅ Test 2 : Gestion des Erreurs
1. Entrez un mauvais mot de passe.
2. **Résultat attendu** : Une alerte ou un message d'erreur "Email ou mot de passe invalide" (Status 401).

### ✅ Test 3 : Chargement des Données (Departments/Users)
1. Accédez à la liste des départements ou des utilisateurs.
2. **Résultat attendu** : La liste s'affiche correctement. L'intercepteur axios a extrait automatiquement `result.data`.

### ✅ Test 4 : Création (Signup/Add Department)
1. Créez un nouvel utilisateur ou département.
2. **Résultat attendu** : L'élément est ajouté en base et s'affiche instantanément dans la liste.

## 4. Debugging
Si rien ne s'affiche :
1. Vérifiez la console de Metro Bundler (React Native).
2. Vérifiez les logs de votre terminal backend (Express).
3. Utilisez `console.log(error)` dans les fonctions `api.ts` pour voir le message exact retourné.

---
*Note : Si les départements affichent "Chargement...", c'est que le backend ne popule pas encore l'objet department dans le modèle User. C'est normal selon votre configuration actuelle.*
