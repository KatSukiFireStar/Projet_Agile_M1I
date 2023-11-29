class Partie {
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

function _(sel){
    return document.querySelector(sel);
}

function get(id){
    return document.getElementById(id);
}

function setFichierJson(fichier){
    fichierJson = fichier;
}

function chargerFichierJson(evt, reprendre = false) {
    //console.log("APPEL chargerFichierJson()");
    setFichierJson(JSON.parse(evt.target.result));
        
    let nomProjet = fichierJson["nom_projet"];
    let nombre_joueur;
    let nom_joueur;
    let mode_jeu;

    if(reprendre){
        nombre_joueur = fichierJson['nombre_joueur'];
        nom_joueur = fichierJson['nom_joueur'];
        mode_jeu = fichierJson['mode_jeu'];
    }

    if(!reprendre && fichierJson["liste_tache"][0]["difficulte"]) {
        alert("Attention !! Le fichier n'a pas le bon format ! " +
            "Lancer une partie avec ce fichier réinitialisera les difficultées de celui-ci !");
    }
    _("h1").innerHTML = "Planning Poker - Projet " + nomProjet + " chargé";
    if(!reprendre)
        return [nomProjet, listeTaches()];
    else
        return [nomProjet, listeTaches(), nombre_joueur, nom_joueur, mode_jeu];
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

function loadFichierJson(reprendre = false) {
    //console.log("APPEL loadFichierJson()");
    let objet;
    if(!reprendre)
        objet = get('jsonFile');
    else
        objet = get('jsonFileReprendre')

    if (objet.files.length > 0) {
        const fichier = objet.files[0];
        const lecteur = new FileReader();
        lecteur.onload = function (evt) {
            if(!reprendre){
                const [nomProjet, listeTaches] = chargerFichierJson(evt);

                // Stockez ces informations dans une variable locale
                objet.informations = { nomProjet, listeTaches };
            }else{
                const [nomProjet, listeTaches, nombre_joueur, nom_joueur, mode_jeu] = chargerFichierJson(evt, true);
                objet.informations = { nomProjet, listeTaches, nombre_joueur, nom_joueur, mode_jeu };
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

    if(!reprendre){
        selectMode = _('input[name="mode"]:checked').value;
        selectNbJoueur = get('nbJoueurs').value;

        selectListeJoueurs = []
        for(let i=1; i<=selectNbJoueur; i++) {
            selectListeJoueurs.push(get('n'+i).value);
        }
        // Utilisez les informations stockées dans la variable locale
        nomProjet = get('jsonFile').informations.nomProjet;
        listeTaches = get('jsonFile').informations.listeTaches;
    }else{
        selectMode = get('jsonFileReprendre').informations.mode_jeu;
        selectNbJoueur = get('jsonFileReprendre').informations.nombre_joueur;
        selectListeJoueurs =get('jsonFileReprendre').informations.nom_joueur;
    }

    maPartie = new Partie(selectMode, selectNbJoueur, selectListeJoueurs, nomProjet, listeTaches);
}

function chargerJeu(){
    if(fichierJson == ""){
        alert("Vous n'avez pas entrer de fichier de partie!");
        return;
    }

    let load = true;

    if(!(fichierJson['nombre_joueur'] && fichierJson['nom_joueur'])){
        let div = get("pseudo");
        const listeName = []
        for(let inp of div.children){
            if(inp.type=="text" && inp.value == "")
                load = false;
        }
    }

    if(!load)
        alert("La partie ne peux pas commencer les noms des joueurs n'ont pas été renseigné!")
    else{
        const envoie = JSON.stringify(maPartie);
        window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);;

    }
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