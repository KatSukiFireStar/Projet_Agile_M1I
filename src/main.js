// variable globale, obligé de la garder pour le moment
let cheminFichierJson = '';

/**
 * Implémentation d'un patron de conception (1/3)
 * Classe Adaptateur qui permet d'adapter les données en fonction de nos besoins
 * En entrée, on aura toutes les données "en vrac" eten sortie, on aura les données prêtes à l'envoi 
 */class Adaptateur {
    constructor(option, mode = '', nbJoueurs = 0, listeNomJoueurs = []) {
        if (option == 0) {
            // On est dans une nouvelle partie
            this.adapterNouvellePartie(mode, nbJoueurs, listeNomJoueurs);
        } else if (option == 1) {
            // On est dans une ancienne partie
            this.adapterAnciennePartie();
        }
    }

    adapterNouvellePartie(mode, nbJoueurs, listeNomJoueurs) {
        if (mode != 'Strict' && mode != 'Moyenne') {
            this.difficulte = mode;
        }

        if (1 < nbJoueurs && nbJoueurs < 5) {
            this.nbJoueurs = nbJoueurs;
        }

        if (listeNomJoueurs.length !== 0) {
            this.listeNomJoueurs = listeNomJoueurs;
        }
    }

    adapterAnciennePartie(chemin) {
        console.log("APPEL adapterAnciennePartie()");
        if (cheminFichierJson != '') {
            let fichier = new File([""], "filename");
            let lecteur = new FileReader();
            let data = lecteur.readAsText(fichier, 'UTF-8');
            
        } else {
            console.log('erreur, pas de fichier');
        }
    }

    envoyerNouvellePartie() {
        // Implementation de la méthode
    }

    envoyerAnciennePartie() {
        // Implementation de la méthode
    }
}


/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function get(id){
    return document.getElementById(id);
}

/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function _(sel){
    return document.querySelector(sel);
}

/** Fonction qui s'active quand on clique sur le bouton (i) 
 * Cette fonction va afficher les règles si les règles étaient masquées et va les masquer dans le cas contraire*/ 
function afficherRegles() {
    let regles = get('regles-overlay');
    regles.style.display = (regles.style.display === 'block') ? 'none' : 'block';
}

/** Fonction qui va masquer les règles du jeu */
function masquerRegles() {
    let regles = get('regles-overlay');
    regles.style.display = 'none';
}

/** Fonction qui va afficher/masquer les menus de jeu 
 * @param {integer} option - permet la différence entre les deux choix possibles 
 * 0 -> menu Lancer une nouvelle partie
 * 1 -> menu Reprendre une partie
*/
function afficherMenu(option) {
    const menuLancer = get('0');
    const menuReprendre = get('1');

    if (option === 0) {
        menuLancer.style.display = 'flex';
        menuReprendre.style.display = 'none';
        nettoyerMenu(menuLancer);
    } else if (option === 1) {
        menuReprendre.style.display = 'flex';
        menuLancer.style.display = 'none';
        nettoyerMenu(menuReprendre);
    }
}

/** Fonction qui va réinitialiser les menu, remettre les valeurs par défaut
 * On fait appel à cette fonction à chaque fois que l'on change/quitte le menu
 * @param {HTMLElement | null} menu - le menu que l'on va réinitialiser
 */
function nettoyerMenu(menu) {
    const listeRadioBoutons = menu.querySelectorAll('input[type="radio"]');
    listeRadioBoutons.forEach((radio) => {
        /*if ((radio.id != 'j2') && (radio.id != 'r1')) {
            radio.checked = false;
        } else {
            radio.checked = true;
        }*/
        radio.checked = false;
    });

    let div = get('selection-nom-joueurs');
    for (let i = div.children.length - 1; i >= 0; i--) {
        if (div.children[i].type === 'text') {
            div.removeChild(div.children[i]);
        }
    }

    const saisieFichier = _('input[type="file"]');
    saisieFichier.value = '';
}

/** Fonction qui va afficher les entrées text pour saisir les noms des joueurs
 * @param {integer} nb - le nombre de joueur que l'on a sélectionné
 */
function afficherJoueur(nb) {
    let div = get('selection-nom-joueurs');
    const listeNomJoueurs = [];

    for(let saisie of div.children){
        if(saisie.type==="text")
            listeNomJoueurs.push(saisie.value);
    }

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i=0; i<nb; i++) {
        let input = document.createElement('input');
        input.type = "text";
        input.name = "nomJoueurs";
        input.id = "j"+(i+1);
        input.placeholder = "Pseudo du Joueur" + (i+1)
        div.appendChild(input);
    }

    let index = 0;
    for(let i = 0; i < div.childElementCount; i++){
        if(div.childNodes[i].type === "text" && index < listeNomJoueurs.length){
            div.childNodes[i].value = listeNomJoueurs[index];
            index++;
        }
    }
}

function sauvegarderChemin(chemin) {
    cheminFichierJson = chemin;
}

/** Fonction qui va lancer le traitement des données afin de pouvoir répondre à la demande de l'utilisateur
 * Récupère toutes les données et utilise ensuite la classe Adaptateur
 */
function validerFormulaire(option) {
    console.log("APPEL validerFormulaire + option= " + option)
    if (option === 0) {
        console.log("a venir ...");
    } else if (option === 1) {
        console.log("ancienne partie");
        console.log(cheminFichierJson);
        let monAdaptateur = new Adaptateur(1);
    }

    //window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);;
}


if (typeof window == 'object') {
    window.onload;
}


/*class Partie {
    constructor(mode, nbJoueur, listeJoueurs, nomProjet, listeTaches) {
        this.mode = mode;
        this.nbJoueur = nbJoueur;
        this.listeJoueurs = listeJoueurs;
        this.nomProjet = nomProjet;
        this.listeTaches = listeTaches;
    }
}

let fichierJson = "";
let maPartie;

function _(sel) {
    return document.querySelector(sel);
}

function get(id) {
    return document.getElementById(id);
}

function setFichierJson(fichier) {
    fichierJson = fichier;
}

function chargerFichierJson(evt, reprendre = false) {
    //console.log("APPEL chargerFichierJson()");
    setFichierJson(JSON.parse(evt.target.result));

    let nomProjet = fichierJson["nom_projet"];
    let nombre_joueur;
    let nom_joueur;
    let mode_jeu;

    if (reprendre) {
        nombre_joueur = fichierJson['nombre_joueur'];
        nom_joueur = fichierJson['nom_joueur'];
        mode_jeu = fichierJson['mode_jeu'];
    }

    if (!reprendre && fichierJson["liste_tache"][0]["difficulte"]) {
        alert("Attention !! Le fichier n'a pas le bon format ! " +
            "Lancer une partie avec ce fichier réinitialisera les difficultées de celui-ci !");
    }
    _("h1").innerHTML = "Planning Poker - Projet " + nomProjet + " chargé";
    if (!reprendre)
        return [nomProjet, listeTaches()];
    else
        return [nomProjet, listeTaches(), nombre_joueur, nom_joueur, mode_jeu];
}


function listeTaches() {
    //console.log("APPEL listeTaches()");
    let indexTache = 0;
    return {
        next: function () {
            let tache;
            if (indexTache < fichierJson['liste_tache'].length - 1) {
                tache = {value: fichierJson['liste_tache'][indexTache], done: false};
                indexTache++;
                return tache;
            }
            return {value: fichierJson['liste_tache'][indexTache], done: true};
        }
    };
}

function loadJoueur(nbJoueur) {
    //console.log("APPEL loadJoueur()");
    let div = get("pseudo");

    const listeName = []
    for (let inp of div.children) {
        if (inp.type == "text")
            listeName.push(inp.value);
    }

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i = 0; i < nbJoueur; i++) {
        let input = document.createElement('input');
        input.type = "text";
        input.name = "n" + (i + 1);
        input.id = input.name;
        let label = document.createElement('label');
        label.for = input.id;
        label.innerHTML = "Pseudo joueur " + (i + 1) + ": ";
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(document.createElement('br'));
    }

    let index = 0;
    for (let i = 0; i < div.childElementCount; i++) {
        if (div.childNodes[i].type == "text" && index < listeName.length) {
            div.childNodes[i].value = listeName[index];
            index++;
        }
    }
}

function loadFichierJson(reprendre = false) {
    //console.log("APPEL loadFichierJson()");
    let objet;
    if (!reprendre)
        objet = get('jsonFile');
    else
        objet = get('jsonFileReprendre')

    if (objet.files.length > 0) {
        const fichier = objet.files[0];
        const lecteur = new FileReader();
        lecteur.onload = function (evt) {
            if (!reprendre) {
                const [nomProjet, listeTaches] = chargerFichierJson(evt);

                // Stockez ces informations dans une variable locale
                objet.informations = {nomProjet, listeTaches};
            } else {
                const [nomProjet, listeTaches, nombre_joueur, nom_joueur, mode_jeu] = chargerFichierJson(evt, true);
                objet.informations = {nomProjet, listeTaches, nombre_joueur, nom_joueur, mode_jeu};
            }
        };
        //lecteur.onload = chargerFichierJson;
        lecteur.readAsText(fichier);
    } else {
        _("h1").innerHTML = "Planning Poker - Pas de projet chargé";
    }
}

function validerFormulaire(reprendre = false) {
    //console.log("APPEL validerFormulaire()");
    // On récupère toutes les informations nécessaires pour lancer la partie
    let selectMode, selectNbJoueur, selectListeJoueurs, nomProjet, listeTaches;

    if (!reprendre) {
        selectMode = _('input[name="mode"]:checked').value;
        selectNbJoueur = get('nbJoueurs').value;

        selectListeJoueurs = []
        for (let i = 1; i <= selectNbJoueur; i++) {
            selectListeJoueurs.push(get('n' + i).value);
        }
        // Utilisez les informations stockées dans la variable locale
        nomProjet = get('jsonFile').informations.nomProjet;
        listeTaches = get('jsonFile').informations.listeTaches;
    } else {
        selectMode = get('jsonFileReprendre').informations.mode_jeu;
        selectNbJoueur = get('jsonFileReprendre').informations.nombre_joueur;
        selectListeJoueurs = get('jsonFileReprendre').informations.nom_joueur;
    }

    maPartie = new Partie(selectMode, selectNbJoueur, selectListeJoueurs, nomProjet, listeTaches);
}

function chargerJeu() {
    if (fichierJson == "") {
        alert("Vous n'avez pas entrer de fichier de partie!");
        return;
    }

    let load = true;

    if (!(fichierJson['nombre_joueur'] && fichierJson['nom_joueur'])) {
        let div = get("pseudo");
        const listeName = []
        for (let inp of div.children) {
            if (inp.type == "text" && inp.value == "")
                load = false;
        }
    }

    if (!load)
        alert("La partie ne peux pas commencer les noms des joueurs n'ont pas été renseigné!")
    else {
        const envoie = JSON.stringify(maPartie);
        window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);

    }
}*/