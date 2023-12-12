const assert = require('assert');
const { describe, it } = require('mocha');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('src/index.html', 'utf-8');
const { window } = new JSDOM(html, { runScripts: 'dangerously' });

const utilsScript = fs.readFileSync('src/utils.js', 'utf-8');
eval(utilsScript);

const mainScript = fs.readFileSync('src/main.js', 'utf-8');
eval(mainScript);

global.document = window.document;
global.window = window;

describe('Tests Unitaires Bidon - vérification basique', function () {
  it('devrait réussir sans aucun soucis', () => {
    const condition = true;
    assert.equal(6*6, 36);
    assert.notStrictEqual(condition, false);
  });
});

describe('Tests Unitaires - Affichage Règles Jeu Complète dans l\'overlay', () => {
  it('On affiche les règles puis on masque', () => {
    afficherRegles();
    let overlay = document.getElementById('regles-overlay');
    assert.strictEqual(overlay.style.display, 'block');

    masquerRegles();
    overlay = document.getElementById('regles-overlay');
    assert.strictEqual(overlay.style.display, 'none');
  });
});

describe('Tests Unitaires - Affichage des menus', function () {
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

describe('Tests Unitaires - Affichage des règles de jeu dans le menu', function () {
  it('afficherRegleMode(0) devrait afficher les règles strictes', () => {
    let regleStrict = document.getElementById('regleStrict');
    let regleMoyenne = document.getElementById('regleMoyenne');

    afficherReglesMode(0);

    assert.strictEqual(regleStrict.style.display, 'flex');
    assert.strictEqual(regleMoyenne.style.display, 'none');
  });

  it('afficherRegleMode(1) devrait afficher les règles moyennes', () => {
    let regleStrict = document.getElementById('regleStrict');
    let regleMoyenne = document.getElementById('regleMoyenne');

    afficherReglesMode(1);

    assert.strictEqual(regleStrict.style.display, 'none');
    assert.strictEqual(regleMoyenne.style.display, 'flex');
  });
});

describe('Tests Unitaires - Nettoyage des menus', function () {
  it('nettoyerMenu(menu) devrait nettoyer le menu', () => {
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

    nettoyerMenu(0);

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

describe('Tests Unitaires - Affichage des zones de saisie en fonction du nombre de joueur voulu', function () {
  it('devrait créer les champs de texte appropriés et les remplir avec les valeurs données', () => {
    let divTest = document.createElement('div');
    divTest.id = 'selection-nom-joueurs-test';

    let nbJoueursTest = 3;

    afficherJoueur(nbJoueursTest);
    const listePlaceHolder =  ['ex : "Seiya"', 'ex : "Shiryu"', 'ex : "Shun"', 'ex : "Hyoga"'];
    for (let i = 0; i < nbJoueursTest; i++) {
      let inputJoueur = document.getElementById('jt' + (i + 1));
      assert.notStrictEqual(inputJoueur, null);
      assert.strictEqual(inputJoueur.type, 'text');
      assert.strictEqual(inputJoueur.name, 'nomJoueurs');
      assert.strictEqual(inputJoueur.placeholder, listePlaceHolder[i]);
    }
  });
});