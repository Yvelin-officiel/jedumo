[https://github.com/Yvelin-officiel/jedumo](https://github.com/Yvelin-officiel/jedumo)

Jedumo est un jeu similaire à Motus, un joueur voit un nombre de lettres dissimulées, et doit trouver le mot caché derrière, pour cela il a plusieurs tentatives qui peuvent lui donner des indices sur le mot s’il trouve les bonnes lettres.

les 6 cases

## 01 Layouts Imbriqués

Au moins deux zones distinctes. public \+ privé.

### **Layout public**

* navbar simple  
* accès rapide au jeu  
* pas d’auth obligatoire

### **Layout privé**

* session utilisateur  
* menu profil/stats  
* protection via middleware

02  
Data fetching serveur  
Quelles pages affichent des données ? D'où viennent-elles ?

### **`/jouer`**

Récupère :

* le mot du jour  
* la longueur du mot  
* éventuellement les indices

### **`/classement`**

Récupère :

* top scores  
* streaks  
* temps moyen

### **`/stats`**

Récupère :

* stats du joueur connecté

03  
Server Action  
Un formulaire de création ou modification.

### **Création de défi personnalisé**

Exemple :

* un utilisateur crée un mot  
* choisit une difficulté  
* partage le défi

04  
Route Handler  
Une API interne · webhook,  
endpoint public.

05  
Auth next-auth  
Une feature user-specific · profil,  
favoris, notes.

### **Historique personnel**

* parties jouées  
* winrate  
* streak

### **Profil**

* avatar  
* pseudo  
* statistiques

06  
Optimisations mesurables  
Images, polices, streaming.

MVP : 

1\. Lancer une partie

- Génération d’un mot mystère aléatoire.  
- Initialisation du nombre d’essais.

2\. Saisie d’un mot

- Champ permettant au joueur d’entrer un mot.  
- Validation de la longueur du mot.

3\. Vérification de la proposition

- Comparaison entre le mot proposé et le mot mystère.  
- Détection :  
  * lettres bien placées,  
  * lettres présentes mais mal placées,  
  * lettres absentes.

4\. Affichage des indices

- Mise en couleur des lettres :  
  * vert \= bonne position,  
  * jaune/orange \= mauvaise position,  
  * gris \= absente.

5\. Gestion des tentatives

- Limitation du nombre d’essais.  
- Affichage du nombre de tentatives restantes.

6\. Fin de partie

- Victoire si le mot est trouvé.  
- Défaite si toutes les tentatives sont utilisées.  
- Affichage du mot correct.

7\. Rejouer

- Bouton pour recommencer une nouvelle partie.

**US1 — Démarrer une nouvelle partie**

**En tant que** joueur  
**Je veux** lancer une nouvelle partie  
**Afin de** commencer à jouer immédiatement.

**Critères d’acceptation**

- Un mot mystère est généré aléatoirement.  
- Le compteur de tentatives est réinitialisé.  
- L’interface de jeu est vide au démarrage.

**Priorité**

Très haute

**US2 — Voir le nombre de tentatives restantes**

**En tant que** joueur  
**Je veux** voir combien de tentatives il me reste  
**Afin de** gérer ma progression dans la partie.

Critères d’acceptation

- Le nombre de tentatives restantes est visible à l’écran.  
- Le compteur diminue après chaque proposition validée.  
- Le compteur atteint zéro lorsque la partie est perdue.

Priorité

Très haute

**US3 — Saisir un mot**

**En tant que** joueur  
**Je veux** entrer un mot dans un champ de saisie  
**Afin de** proposer une réponse au jeu.

**Critères d’acceptation**

- Le joueur peut écrire un mot avec le clavier.  
- Le mot peut être validé avec un bouton ou la touche Entrée.  
- Le champ est vidé après validation.

**Priorité**

Très haute

**US4 — Vérifier la longueur du mot**

**En tant que** joueur  
**Je veux** être averti si mon mot ne respecte pas la longueur demandée  
**Afin de** proposer une réponse valide.

**Critères d’acceptation**

- Le jeu vérifie le nombre de lettres du mot.  
- Un message d’erreur apparaît si la longueur est incorrecte.  
- La tentative n’est pas comptabilisée si le mot est invalide.

**Priorité**

Haute

**US5 — Obtenir des indices visuels**

**En tant que** joueur  
**Je veux** voir quelles lettres sont correctes, mal placées ou absentes  
**Afin de** déduire progressivement le mot mystère.

**Critères d’acceptation**

- Une lettre correcte et bien placée apparaît en vert.  
- Une lettre présente mais mal placée apparaît en jaune.  
- Une lettre absente apparaît en gris.  
- Les indices apparaissent après validation du mot.

**Priorité**

Très haute

**US6 — Gagner une partie**

**En tant que** joueur  
**Je veux** être informé lorsque je trouve le mot mystère  
**Afin de** savoir que j’ai gagné la partie.

**Critères d’acceptation**

- Un message de victoire s’affiche lorsque le mot est trouvé.  
- La partie se termine automatiquement après la victoire.  
- Le joueur ne peut plus saisir de nouveaux mots après la victoire.

**Priorité**

Haute

**US7 — Perdre une partie**

**En tant que** joueur  
**Je veux** être informé lorsque je n’ai plus de tentatives  
**Afin de** connaître la fin de la partie.

**Critères d’acceptation**

- La partie se termine lorsque toutes les tentatives sont utilisées.  
- Un message de défaite apparaît.  
- Le joueur ne peut plus proposer de mots après la défaite.

**Priorité**

Haute

**US8 — Afficher le mot correct en fin de partie**

**En tant que** joueur  
**Je veux** voir le mot mystère après une défaite  
**Afin de** connaître la bonne réponse.

**Critères d’acceptation**

- Le mot mystère s’affiche à la fin de la partie.  
- Le mot apparaît uniquement après une défaite.  
- Le mot reste visible jusqu’au redémarrage d’une nouvelle partie.

**Priorité**

Moyenne

**US9 — Voir l’historique des essais**

**En tant que** joueur  
**Je veux** consulter mes précédentes propositions  
**Afin de** suivre ma progression dans la partie.

**Critères d’acceptation**

- Les anciens mots proposés restent affichés.  
- Les couleurs des indices restent visibles.  
- Les essais sont affichés dans l’ordre chronologique.

**Priorité**

Moyenne

Répartitions :   
