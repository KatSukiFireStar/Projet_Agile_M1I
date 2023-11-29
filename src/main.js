class Partie {
    constructor(mode, nbJoueur, listeJoueurs, nomProjet, listeTaches) {
        this.mode = mode;
        this.nbJoueur = nbJoueur;
        this.listeJoueurs = listeJoueurs;
        this.nomProjet = nomProjet;
        this.listeTaches = listeTaches;
    }
}

let fichierJson;

function _(sel){
    return document.querySelector(sel);
}

function get(id){
    return document.getElementById(id);
}

function setFichierJson(fichier){
    fichierJson = fichier;
}

function chargerFichierJson(evt) {
    //console.log("APPEL chargerFichierJson()");
    setFichierJson(JSON.parse(evt.target.result));
        
    let nomProjet = fichierJson["nom_projet"];

    let listeTaches = [];
    for(let i=0; i<fichierJson['liste_tache'].length; i++) {
        listeTaches.push([fichierJson['liste_tache'][i]['nom_tache'], fichierJson['liste_tache'][i]['details']]);
    }

    //listeTaches = traitement(contenu["liste_tache"]);

    if(fichierJson["liste_tache"][0]["difficulte"]) {
        alert("Attention !! Le fichier n'a pas le bon format ! " +
            "Lancer une partie avec ce fichier réinitialisera les difficultées de celui-ci !");
    }
    _("h1").innerHTML = "Planning Poker - Projet " + nomProjet + " chargé";
    return [nomProjet, listeTaches];
}


function listeTaches(){
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

function loadJoueur(nbJoueur){
    //console.log("APPEL loadJoueur()");
    let div = get("pseudo");

    const listeName = []
    for(let inp of div.children){
        if(inp.type=="text")
            listeName.push(inp.value);
    }

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for(let i = 0; i < nbJoueur; i++){
        let input = document.createElement('input');
        input.type = "text";
        input.name = "n"+(i+1);
        input.id = input.name;
        let label = document.createElement('label');
        label.for = input.id;
        label.innerHTML = "Pseudo joueur " + (i+1) + ": ";
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(document.createElement('br'));
    }

    let index = 0;
    for(let i = 0; i < div.childElementCount; i++){
        if(div.childNodes[i].type == "text" && index < listeName.length){
            div.childNodes[i].value = listeName[index];
            index++;
        }
    }
}

function loadFichierJson() {
    //console.log("APPEL loadFichierJson()");
    let objet = get('jsonFile');

    if (objet.files.length > 0) {
        const fichier = objet.files[0];
        const lecteur = new FileReader();
        lecteur.onload = function (evt) {
            const [nomProjet, listeTaches] = chargerFichierJson(evt);

            // Stockez ces informations dans une variable locale
            objet.informations = { nomProjet, listeTaches };
        };
        //lecteur.onload = chargerFichierJson;
        lecteur.readAsText(fichier);
    } else {
        _("h1").innerHTML = "Planning Poker - Pas de projet chargé";
    }
}

function validerFormulaire() {
    //console.log("APPEL validerFormulaire()");
    // On récupère toutes les informations nécessaires pour lancer la partie
    const selectMode = _('input[name="mode"]:checked').value;
    const selectNbJoueur = get('nbJoueurs').value;
    
    let selectListeJoueurs = []
    for(let i=1; i<=selectNbJoueur; i++) {
        selectListeJoueurs.push(get('n'+i).value);
    }
    // Utilisez les informations stockées dans la variable locale
    let { nomProjet, listeTaches } = get('jsonFile').informations;
   
    let maPartie = new Partie(selectMode, selectNbJoueur, selectListeJoueurs, nomProjet, listeTaches);
    const envoie = JSON.stringify(maPartie);
    //window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);;
}

function fInit(){
    //console.log("APPEL fInit()");
    let nbJoueur = get("nbJoueurs").value;

    loadJoueur(nbJoueur);
    loadFichierJson();
}

if (typeof window == 'object') {
    window.onload = fInit;
}

// pas trouvé le "soucis" ici
module.exports = {
    chargerFichierJson,
    setFichierJson,
    listeTaches
};