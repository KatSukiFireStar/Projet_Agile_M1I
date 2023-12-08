## Projet - Planning Poker
*M1 Informatique - Conception agile de projets informatiques*

*Auteur :*
- *Flavien Gonin* 
- *Guillaume Hostache*

### Présentation

*Application Web qui permet à une équipe en charge du développement d'un logiciel
de faire une partie de Planning Poker pour déterminer la difficulté des différentes 
tâches du projet.*

*Le Planning Poker se déroulera en fonction des règles de jeu étudiées en cours*

### Utilisation de l'application

*Tout d'abord, il faut vérifier que node.js est bien présent 
sur votre machine.*

*Installation de node.js : [lien](https://nodejs.org/en)*

*Afin d'être bien sûr, on peut vérifier les versions du logiciel*
```php
//Version de node.js
node -v 

//Version de Node Package Manager, installé en même temps que node.js
npm -v 
```
*Ensuite, il faut faire un clone du projet sur 
son poste de travail avec la commande suivante :*
```php
// clone en https, les autres méthodes fonctionnent aussi
git clone [NomProjetGit]
```

*Dans le répertoire du projet, il vous faut installer les dépendances avec la commande :*
```php
npm install
```

*Enfin, ouvrez simplement `index.html` dans un navigateur web.*


### Commandes utiles

Pour apporter des modifications au projet, travailler en local.
Ensuite, pour ajouter votre travail au projet :
```
git checkout [NomNouvelleBranche]
```
Cette commande va créer une nouvelle branche et vous allez basculer vers celle-ci.
Ensuite :
```
git add .
git status # pour vérifier que la commande précédente a bien marcher

git commit -m "Explications des changements apportés"
git log # pour vérifier que le commit est bien présent
```
et enfin, pour envoyer l'ensemble :
```
git push origin [NomNouvelleBranche]
```
Une fois que votre travail est définitivement terminé, vous pouvez réalisé une demande de merge avec la 
branche principale ``main``

### Node.js : commandes utiles

Si vous souhaitez ajouter une dépen

explications npm
npm install

npm run docs, run test...

 - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        publish_dir: ./docs  # Update this with the actual path to your documentation folder
        publish_branch: gh-pages
