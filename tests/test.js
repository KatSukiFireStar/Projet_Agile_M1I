const assert = require('assert');
const { describe, it } = require('mocha');
const { JSDOM } = require('jsdom');
const fs = require("fs");

// Charger le contenu HTML du fichier
const html = fs.readFileSync('src/index.html', 'utf-8');

// Configuration de jsdom
const { window } = new JSDOM(html, { runScripts: 'dangerously' });

// Charger le contenu de utils.js
const utilsScriptContent = fs.readFileSync('src/utilitaire.js', 'utf-8');
eval(utilsScriptContent);

// charger le contenu de main.js
const MainScriptContent = fs.readFileSync('src/main.js', 'utf-8');
eval(MainScriptContent);

global.document = window.document;
global.window = window;

describe('Test Unitaire - Bidon', function () {
  it('devrait fonctionner sans aucun problème particulier', function () {
    const conditionTrue = true;

    // assertions bidon
    assert.notEqual(conditionTrue, 0===1);
    assert.equal(conditionTrue, true);
  });
});

describe('Test Unitaire - Affichage Règles Jeu Complète dans l\'overlay', () => {
  it('toggleCharter() devrait alterner l\'affichage de l\'overlay', () => {
    afficherRegles(); // Affiche l'overlay
    let overlay = document.getElementById('regles-overlay');
    assert.strictEqual(overlay.style.display, 'block');

    masquerRegles(); // Masque l'overlay
    overlay = document.getElementById('regles-overlay');
    assert.strictEqual(overlay.style.display, 'none');
  });

  it('closeCharter() devrait masquer l\'overlay', () => {
    afficherRegles(); // Affiche l'overlay
    masquerRegles(); // Masque l'overlay
    const overlay = document.getElementById('regles-overlay');
    assert.strictEqual(overlay.style.display, 'none');
  });
});

describe('Test Unitaire - Affichage des menus', function () {
  it('afficherMenu(0) devrait afficher le menu de lancement', () => {
    let menuLancer = document.getElementById('0');
    let menuReprendre = document.getElementById('1');

    afficherMenu(0);

    assert.strictEqual(menuLancer.style.display, 'flex');
    assert.strictEqual(menuReprendre.style.display, 'none');
  });

  it('afficherMenu(1) devrait afficher le menu de reprise', () => {
    let menuLancer = document.getElementById('0');
    let menuReprendre = document.getElementById('1');

    afficherMenu(1);

    assert.strictEqual(menuLancer.style.display, 'none');
    assert.strictEqual(menuReprendre.style.display, 'flex');
  });
});

// Vous pouvez appliquer une approche similaire pour tester afficherRegleMode
describe('Test Unitaire - Affichage des règles de jeu dans le menu', function () {
  it('afficherRegleMode(0) devrait afficher les règles strictes', () => {
    let regleStrict = document.getElementById('regleStrict');
    let regleMoyenne = document.getElementById('regleMoyenne');

    afficherRegleMode(0);

    assert.strictEqual(regleStrict.style.display, 'flex');
    assert.strictEqual(regleMoyenne.style.display, 'none');
  });

  it('afficherRegleMode(1) devrait afficher les règles moyennes', () => {
    let regleStrict = document.getElementById('regleStrict');
    let regleMoyenne = document.getElementById('regleMoyenne');

    afficherRegleMode(1);

    assert.strictEqual(regleStrict.style.display, 'none');
    assert.strictEqual(regleMoyenne.style.display, 'flex');
  });
});

describe('Test Unitaire - Nettoyage des menus', function () {
  it('nettoyerMenu(menu) devrait nettoyer le menu', () => {
    console.log("appel test nettoyerMenu()");
    let menuLancerTest = document.getElementById('0');
    afficherMenu(0);

    let boutonRegleTest = document.getElementById('r2');
    boutonRegleTest.checked = true;

    let boutonJoueursTest = document.getElementById('j3');
    boutonJoueursTest.checked = true;

    afficherJoueur(3);

    let listeJoueurs = document.getElementById('selection-nom-joueurs');
    listeJoueurs.children[0].value = 'Riri';
    listeJoueurs.children[1].value = 'Fifi';
    listeJoueurs.children[2].value = 'Loulou';

    nettoyerMenu(menuLancerTest);

    assert.strictEqual(boutonRegleTest.checked, false);
    assert.strictEqual(boutonJoueursTest.checked, false);
    assert.strictEqual(document.getElementById('r1').checked, true);
    assert.strictEqual(document.getElementById('j2').checked, true);

    afficherJoueur(2);
    listeJoueurs = document.getElementById('selection-nom-joueurs');
    assert.strictEqual(listeJoueurs.children[0].value, '');
    assert.strictEqual(listeJoueurs.children[1].value, '');

    const saisieFichier = document.querySelector('input[type="file"]');
    assert.strictEqual(saisieFichier.value, '');
  });
});

describe('Test Unitaire - Affichage des zones de saisie en fonction du nombre de joueur voulu', function () {
  it('devrait créer les champs de texte appropriés et les remplir avec les valeurs données', () => {
    let divTest = document.createElement('div');
    divTest.id = 'selection-nom-joueurs-test';

    let nbJoueursTest = 3;

    // Appeler la fonction avec des valeurs de test
    afficherJoueur(nbJoueursTest);
    const listePlaceHolder =  ['ex : "Seiya"', 'ex : "Shiryu"', 'ex : "Shun"', 'ex : "Hyoga"'];
    // Vérifier que les champs de texte ont été créés correctement
    for (let i = 0; i < nbJoueursTest; i++) {
      let inputJoueur = document.getElementById('jt' + (i + 1));
      assert.notStrictEqual(inputJoueur, null);
      assert.strictEqual(inputJoueur.type, 'text');
      assert.strictEqual(inputJoueur.name, 'nomJoueurs');
      assert.strictEqual(inputJoueur.placeholder, listePlaceHolder[i]);
    }
  });
});







/*
describe('Tests unitaires - iterateur listeTaches', function () {
  let err, data;
  it('Devrait avoir le meme nombre d\'objet', function () {
    fs.readFile("src/ressources/backlog_1.json", (err, data) => {
      let fichierJson = JSON.parse(data.toString());
      let iterator = listeTaches(fichierJson);
      let resultat = iterator.next();
      let nb = 1;
      while (!resultat.done) {
        resultat = iterator.next();
        nb++;
      }
      assert.equal(nb, 5);
    });
  });

  it('Devrait avoir les memes noms et details de taches', function () {
    fs.readFile("src/ressources/backlog_1.json", (err, data) => {
      let fichierJson = JSON.parse(data.toString());
      let iterator = listeTaches(fichierJson);
      for (let i = 0; i < fichierJson['liste_tache'].length; i++) {
        let resultat = iterator.next();
        assert.equal(resultat.value['nom_tache'], "tache n°" + (i + 1));
        assert.equal(resultat.value['details'], "..." + (i + 1))
      }
    });
  });

  it('Devrait avoir done == false sauf pour le dernier', function () {
    fs.readFile("src/ressources/backlog_1.json", (err, data) => {
      let fichierJson = JSON.parse(data.toString());
      let iterator = listeTaches(fichierJson);
      for (let i = 0; i < fichierJson['liste_tache'].length; i++) {
        let resultat = iterator.next();
        if (i < fichierJson['liste_tache'].length - 1) {
          assert.equal(resultat.done, false);
        } else {
          assert.equal(resultat.done, true);
        }
      }
    });
  });
});*/

/*
const evtValideMock = {
    target: {
        result: '{"nom_projet": "TestProjet", "liste_tache": [{"nom_tache": "Tâche1", "details": "Détails1"}]}',
    },
};
const evtInvalideMock = {
    target: {
        result: '{"nom_projet": "TestProjet", "liste_tache": [{"nom_tache": "Tâche1", "details": "Détails1", "difficulte": 5}]}',
    },
};

describe('Tests unitaires - chargerFichierJson()', function () {
    it('devrait fonctionner sans problème', function () {
        const resultat = chargerFichierJson(evtValideMock);

        assert.equal(resultat.length, 2);
        assert.equal(resultat[0], 'TestProjet');
        assert.deepEqual(resultat[1].next().value, {details: 'Détails1', nom_tache: 'Tâche1'});

        const h1Content = document.querySelector('h1').innerHTML;
        assert.strictEqual(h1Content, 'Planning Poker - Projet TestProjet chargé');
    });

    it('devrait afficher une alerte', function () {
        let alertMessage;
        // Redéfinition de la fonction alert pour capturer le message
        global.alert = function (message) {
            alertMessage = message;
        };

        chargerFichierJson(evtInvalideMock); // pas besoin de récupérer les infos ici ...

        assert.strictEqual(alertMessage, "Attention !! Le fichier n'a pas le bon format ! " +
            "Lancer une partie avec ce fichier réinitialisera les difficultées de celui-ci !");
    });
});

describe('Tests unitaires - iterateur listeTaches', function () {
    let err, data;
    it('Devrait avoir le meme nombre d\'objet', function () {
        fs.readFile("src/ressources/backlog_1.json", (err, data) => {
            let fichierJson = JSON.parse(data.toString());
            setFichierJson(fichierJson);
            let iterator = listeTaches();
            let resultat = iterator.next();
            let nb = 1;
            while (!resultat.done) {
                resultat = iterator.next();
                nb++;
            }
            assert.equal(nb, 5);
        });
    });

    it('Devrait avoir les memes noms et details de taches', function () {
        fs.readFile("src/ressources/backlog_1.json", (err, data) => {
            let fichierJson = JSON.parse(data.toString());
            setFichierJson(fichierJson);
            let iterator = listeTaches();
            for (let i = 0; i < fichierJson['liste_tache'].length; i++) {
                let resultat = iterator.next();
                assert.equal(resultat.value['nom_tache'], "tache n°" + (i + 1));
                assert.equal(resultat.value['details'], "..." + (i + 1))
            }
        });
    });

    it('Devrait avoir done == false sauf pour le dernier', function () {
        fs.readFile("src/ressources/backlog_1.json", (err, data) => {
            let fichierJson = JSON.parse(data.toString());
            setFichierJson(fichierJson);
            let iterator = listeTaches();
            for (let i = 0; i < fichierJson['liste_tache'].length; i++) {
                let resultat = iterator.next();
                if (i < fichierJson['liste_tache'].length - 1) {
                    assert.equal(resultat.done, false);
                } else {
                    assert.equal(resultat.done, true);
                }
            }
        });
    });
});*/