let numeroTache = -1;
const listeCartes = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "interro"];
let carteSelectionnee = {};
let maPartie, iterator, current_player;
let current_turn = 0;

let fichierJson;

let valeur_carte = {};

/**
 * Itérateur de la liste de tâche d'un fichier json
 * @param fichierJson - fichier json contenant les tâches
 * @returns liste - liste avec les objets représentant les tâches
 */
function listeTaches(fichierJson) {
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

function chargerPartie() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const objetEnJSON = urlParams.get('data');

    return JSON.parse(objetEnJSON);
}

function initialiserPartie() {
    //console.log("APPEL partie()");
    maPartie = chargerPartie();
    console.log(maPartie);

    let fichier = new File([""], maPartie.fichierJson);
    let lecteur = new FileReader();

    console.log(fichier);

    lecteur.onload = function (evt) {
        fichierJson = JSON.parse(evt.target.result);
        console.log(fichierJson);
    };

    lecteur.readAsText(fichier);

    iterator = listeTaches(maPartie.fichierJson);

    let divInfo = get('info');

    let h1 = document.createElement('h1');
    h1.innerText = 'Planning Poker - ' + maPartie['nomProjet'];

    nextTask();

    divInfo.append(h1);
    current_player = 0;
    let divJoueurCartes = get('cartes');
    for (let i = 0; i < listeCartes.length; i++) {
        let imgCarte = document.createElement('img');
        imgCarte.src = "./ressources/cartes/cartes_" + listeCartes[i] + ".svg";
        imgCarte.width = 75;
        imgCarte.height = 75;
        imgCarte.id = "carte_"+i;
        // écouteurs pour gérer le clic sur la carte
        imgCarte.addEventListener('click', function () {
            carteSelectionnee[current_player] = listeCartes[i];
            imgCarte.classList.add('carteSelectionnee');
            let divCarte = get("cartes");
            for (let i = 0; i < listeCartes.length; i++){
                if(get("cartes"+i).classList.contains("carteSelectionnee"))
                    get("cartes"+i).classList.remove("carteSelectionnee")
            }
        });
        divJoueurCartes.appendChild(imgCarte);
    }
}

function validerChoix() {
    let divApercu = get('apercu');

    if (carteSelectionnee[current_player] !== "") {
        let imgApercu = document.createElement('img');
        imgApercu.src = "./ressources/cartes/cartes_" + carteSelectionnee + ".svg";
        imgApercu.width = 75;
        imgApercu.height = 75;

        divApercu.appendChild(imgApercu);
        reloadCartes();
        if(current_player != maPartie.nbJoueurs-1){
            current_player++;
        }else{
            current_player = 0;
            if(endTask()){
                if(maPartie.mode === Modes.Strict){
                    if(carteSelectionnee[0] !== "cafe"){
                        valeur_carte[numeroTache] = carteSelectionnee[0];
                        carteSelectionnee = {};
                    }else{
                        saveGame();
                    }
                }else{
                    let counter_coffee = 0;
                    let moyenne = 0;
                    for(let i = 0; i < carteSelectionnee.length; i++){
                        if(carteSelectionnee[i] !== "cafe" && carteSelectionnee[i] !== "interro"){
                            moyenne += parseInt(carteSelectionnee[i]);
                        }

                        if(carteSelectionnee[i] !== "cafe"){
                            counter_coffee++;
                        }
                    }
                    if(counter_coffee !== parseInt(maPartie.nbJoueurs)){
                        moyenne /= parseInt(maPartie.nbJoueurs);
                        valeur_carte[numeroTache] = moyenne;
                    }else
                        saveGame();
                }
                nextTask();
            }
        }
    } else {
        alert("Veuillez sélectionner une carte avant de valider.");
    }
}

function nextTask(){
    numeroTache++;
    let tache = iterator.next();
    let div_info = get("info");
    let h_tache = document.createElement("h2");
    h_tache.innerHTML = tache['nom_tache'];
    let p_details = document.createElement("p");
    p_details.innerHTML = tache['details'];
    div_info.appendChild(p_details);
}

function reloadCartes(){
    for (let i = 0; i < listeCartes.length; i++)
        if(get("cartes"+i).classList.contains("carteSelectionnee"))
            get("cartes"+i).classList.remove("carteSelectionnee");
}

function endTask(){
    if(current_turn === 1){
        for(let i = 0; i < carteSelectionnee.length-1; i++){
            if(carteSelectionnee[i] !== carteSelectionnee[i+1]){
                return false;
            }
        }
        return true;
    }
    else if(maPartie.mode === Modes.Strict){
        for(let i = 0; i < carteSelectionnee.length-1; i++){
            if(carteSelectionnee[i] !== carteSelectionnee[i+1]){
                return false;
            }
        }
        return true;
    }else if(maPartie.mode === Modes.Moyenne){
        return true;
    }
}

function saveGame(){
    window.location.href = "./index.html";
}

if (typeof window == 'object') {
    window.onload = initialiserPartie;
}