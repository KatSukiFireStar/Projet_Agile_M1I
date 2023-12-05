const assert = require('assert');
const { describe, it } = require('mocha');
const { JSDOM } = require('jsdom');
const fs = require("fs");

// Charger le contenu HTML du fichier
const html = fs.readFileSync('src/index.html', 'utf-8');

// Configuration de jsdom
const { window } = new JSDOM(html, { runScripts: 'dangerously' });

// Charger le script
const scriptContent = fs.readFileSync('src/main.js', 'utf-8');
eval(scriptContent);

describe('Test Unitaire - Bidon', function () {
  it('devrait fonctionner sans aucun problème particulier', function () {
    const conditionTrue = true;

    // assertions bidon
    assert.notEqual(conditionTrue, 0==1);
    assert.equal(conditionTrue, true);
  });
});

// Exemple de test Mocha
describe('Test Unitaire - Affichage Règles Jeu', () => {
  beforeEach(function () {
    global.document = window.document;
    global.window = window;
  });

  it('toggleCharter() devrait alterner l\'affichage de l\'overlay', () => {
    afficherRegles(); // Affiche l'overlay
    let charterOverlay = document.getElementById('regles-overlay');
    assert.strictEqual(charterOverlay.style.display, 'block');

    masquerRegles(); // Masque l'overlay
    charterOverlay = document.getElementById('regles-overlay');
    assert.strictEqual(charterOverlay.style.display, 'none');
  });

  it('closeCharter() devrait masquer l\'overlay', () => {
    afficherRegles(); // Affiche l'overlay
    masquerRegles(); // Masque l'overlay
    const charterOverlay = document.getElementById('regles-overlay');
    assert.strictEqual(charterOverlay.style.display, 'none');
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