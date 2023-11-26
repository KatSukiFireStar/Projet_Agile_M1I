const assert = require('assert');
const { describe, it } = require('mocha');
const { JSDOM } = require('jsdom');
const {chargerFichierJson, validerFormulaire} = require('../src/main');

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><h1></h1><input type="file" id="jsonFile" accept=".json"></body></html>');

global.window = dom.window;
global.document = dom.window.document;

describe('Test Bidon', function () {
  it('devrait fonctionner sans aucun problème particulier', function () {
    const conditionTrue = true;

    // assertions bidon
    assert.notEqual(conditionTrue, 0==1);
    assert.equal(conditionTrue, true);
  });
});

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
    assert.deepEqual(resultat[1], [['Tâche1', 'Détails1']]);
    
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