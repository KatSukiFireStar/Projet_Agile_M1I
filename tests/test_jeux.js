const assert = require('assert');
const { describe, it } = require('mocha');
const fs = require("fs");
const { listeTaches, chargerPartie } = require('../src/jeux.js');

describe('Tests Unitaires - fonction itérateur listesTaches', function () {
    it('Devrait avoir le meme nombre d\'objet', function () {
        fs.readFile("src/ressources/backlog_test.json", (err, data) => {
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
        fs.readFile("src/ressources/backlog_test.json", (err, data) => {
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
        fs.readFile("src/ressources/backlog_test.json", (err, data) => {
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
});