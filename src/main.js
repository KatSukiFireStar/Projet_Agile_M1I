const NomCarte = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "interro"];

let fichierJson = "";
const NomJoueur = []

function _(sel){
    return document.querySelector(sel);
}

function get(id){
    return document.getElementById(id);
}

function chargerFichierJson(evt) {
    console.log("chargerFichierJson");

    fichierJson = JSON.parse(evt.target.result);

    if(fichierJson["liste_tache"][0]["difficulte"])
        alert("Attention! Le fichier que vous charger a déjà des difficultés établies! " +
            "Lancer une partie avec ce fichier reinitialisera les difficultés de celui-ci!");

    _("h1").innerHTML = "Planning Poker - " + fichierJson["nom_projet"];

    console.log(fichierJson);
}

function* listeTaches(){
    let indexTache = 0;
    return {
        next: function () {
            let tache;
            if (indexTache < fichierJson.length - 1) {
                tache = {value: fichierJson.liste_tache[indexTache], done: false};
                indexTache++;
                return tache;
            }
            return {value: fichierJson.liste_tache[indexTache], done: true};
        }
    };
}


function selectionnerFichierJson() {
    console.log("chargerFichier");
    const saisie = document.getElementById('jsonFile');
    
    // Vérifie si un fichier a été sélectionné
    if (saisie.files.length > 0) {
        const fichier = saisie.files[0];

        // Vérifie si le fichier est au format JSON
        if (fichier.type === 'application/json') {
            // Lecture du fichier JSON
            const lecteur = new FileReader();

            lecteur.onload = chargerFichierJson;
            lecteur.readAsText(fichier);
        } else {
            alert('Veuillez sélectionner un fichier JSON valide.');
        }
    } else {
        alert('Veuillez sélectionner un fichier.');
    }
}

function loadPseudo(nb){
    let div = get("pseudo");

    const listeName = []
    for(let inp of div.children){
        if(inp.type=="text")
            listeName.push(inp.value);
    }

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for(let i = 0; i < nb; i++){
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

function fInit(){
    let select = get("nbJoueurs");
    loadPseudo(select.value);
    if(fichierJson == ""){
        _("h1").innerHTML = "Planning Poker - Pas de projet chargé"
    }
}

if (typeof window == 'object') {
    window.onload = fInit;
}
