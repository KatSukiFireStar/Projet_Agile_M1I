const assert = require('assert');
const { describe, it } = require('mocha');
const { JSDOM } = require('jsdom');
//const { addition, soustraction, multiplication } = require('../src/main');


describe('Test bidon', function () {
  it('devrait échouer délibérément', function () {
    // Créez une condition qui est toujours fausse
    const conditionFausse = false;

    // Utilisez une assertion qui échoue si la condition est vraie
    assert.notEqual(conditionFausse, true);
  });
});
