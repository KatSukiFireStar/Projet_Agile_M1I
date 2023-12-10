# Projet - Planning Poker
M1 Informatique - Conception agile de projets informatiques

Auteur : Flavien GONIN et Guillaume HOSTACHE

## Présentation

Application Web qui permet à une équipe en charge du développement d'un logiciel
de faire une partie de Planning Poker pour déterminer la difficulté des différentes 
tâches du projet.

Le Planning Poker se déroulera en fonction des règles de jeu étudiées en cours

## Utilisation de l'application

Tout d'abord, il faut vérifier que node.js est bien présent 
sur votre machine.

Installation de nodejs : [nodejs](https://nodejs.org/en)

Afin d'être bien sûr, on peut vérifier les versions du logiciel
```php
//Version de nodejs
node -v 

//Version de Node Package Manager, installé en même temps que nodejs
npm -v 
```
Ensuite, assurez-vous d'avoir un IDE afin de pouvoir travailler convenablement.  
Dans notre cas, nous avons utilisé :
1. Visual Studio Code : [vscode](https://code.visualstudio.com/)
2. PhpStorms : [PhpStorms](https://www.jetbrains.com/fr-fr/phpstorm/)

Mais d'autres outils fonctionneront tout aussi bien.

Ensuite, il faut faire un clone du projet sur 
son poste de travail avec la commande suivante :
```php
// clone en https, les autres méthodes fonctionnent aussi
git clone [NomProjetGit]
```

Dans le répertoire du projet, il vous faut installer les dépendances avec 
`npm install`.

Puis, une fois que tout est en place, 
on peut démarrer l'application avec `npm start`.  
(l'application démarre en local sur le port 2023)


## GitHub : Commandes utiles

Pour apporter des modifications au projet, travailler en local.
Ensuite, pour ajouter votre travail au projet :
```php
git checkout [NomNouvelleBranche]
```
Cette commande va créer une nouvelle branche et vous allez basculer 
vers celle-ci. Ensuite :
```php
git add .
git status # pour vérifier que la commande précédente a bien marcher

git commit -m "Explications des changements apportés"
git log # pour vérifier que le commit est bien présent
```
et enfin, pour envoyer l'ensemble :
```php
git push origin [NomNouvelleBranche]
```
Une fois que votre travail est définitivement terminé, vous pouvez réaliser une demande de merge avec la 
branche principale `main` et nous nous chargerons de faire la revue et validation.

## NodeJs : Commandes utiles

Si vous souhaitez ajouter une dépendance au projet, il faut faire :  
`npm install [dependance]`  

Vous pouvez aussi l'ajouter en dépendances de développement :   
`npm install [dependance] --save-dev`

Si vous souhaitez lancer la documentation pour l'avoir en local, vous pouvez faire la commande : `npm run docs`

Si vous souhaitez lancer les tests : `npm run test` ou `npm test`

## GitHub Actions

Pour l'intégration continue, tout se passe dans le fichier `main.yml`.  
L'intégration est fonctionnelle et elle permet de déployer la documentation de l'application
sur la branche `gh-pages`

Assurez-vous avant chaque ajout que les tests passent toujours en local ...

