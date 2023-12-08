let numeroTache = -1;
const listeCartes = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "interro"];
let carteSelectionnee = {};
let maPartie, iterator, current_player;
let current_turn = 1;

let valeur_carte = {};

/**
 * Itérateur de la liste de tâche d'un fichier json
 * @param fichierJson - fichier json contenant les tâches
 * @returns {{next: ((function(): ({value: *, done: boolean}))|*)}}
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

/**
 * Recupere la partie depuis le chemin
 * @returns {any}
 */
function chargerPartie() {
    let queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const objetEnJSON = urlParams.get('data');

    return JSON.parse(objetEnJSON);
}

/**
 * Définit toutes les valeurs de la page qui doivent être changé selon
 * les informations de partie. Cette fonction est appelé en debut de partie
 */
function initialiserPartie() {
    //console.log("APPEL partie()");
    maPartie = chargerPartie();

    let validate_button = get("validerBouton");
    validate_button.disabled = true;

    let fichierJson = JSON.parse(getData("fichier"));

    iterator = listeTaches(fichierJson);

    let divInfo = get('info');

    let h1 = create('h1');
    h1.innerText = 'Planning Poker - ' + fichierJson['nom_projet'];
    divInfo.append(h1);

    let h_tache = create("h2");
    h_tache.id = "titre_tache";
    divInfo.append(h_tache);

    let p_details = create("p");
    p_details.id = "details_tache";
    divInfo.append(p_details);

    nextTask();
    current_player = 0;

    let h4 = get('name');
    h4.innerHTML = "C'est à ton tour : " + maPartie['nomJoueurs'][current_player];

    let divJoueurCartes = get('cartes');
    loadCartes(divJoueurCartes);
}

/**
 * Permet de charger les cartes dans la divJoueurCartes
 * @param divJoueurCartes
 */
function loadCartes(divJoueurCartes){
    for (let i = 0; i < listeCartes.length; i++) {
        let imgCarte = create('img');
        imgCarte.src = "./ressources/cartes/cartes_" + listeCartes[i] + ".svg";
        imgCarte.width = 75;
        imgCarte.height = 75;
        imgCarte.id = "carte_"+i;
        // écouteurs pour gérer le clic sur la carte
        imgCarte.addEventListener('click', function () {
            let validate_button = get("validerBouton");
            validate_button.disabled = false;
            let indiceCarte = i;
            carteSelectionnee[current_player] = listeCartes[i];
            imgCarte.classList.add('.carteSelectionnee');
            imgCarte.style.marginBottom = "20px";
            let divCarte = get("cartes");
            for (let j = 0; j < listeCartes.length; j++){
                if(j != indiceCarte && get("carte_"+j).classList.contains(".carteSelectionnee")){
                    get("carte_"+j).classList.remove(".carteSelectionnee");
                    get("carte_"+j).style.marginBottom = "0px";
                }
            }
        });
        divJoueurCartes.appendChild(imgCarte);
    }
}

/**
 * Permet de valider la carte selectionner et de changer de joueur
 */
function validerChoix() {
    let divApercu = get('apercu');

    if (carteSelectionnee[current_player] !== "") {
        let validate_button = get("validerBouton");
        validate_button.disabled = true;

        let imgApercu = create('img');
        imgApercu.src = "./ressources/cartes/cartes_.svg";
        imgApercu.classList.add('.invisible');
        imgApercu.width = 75;
        imgApercu.height = 75;

        divApercu.appendChild(imgApercu);
        reloadCartes();
        let h4 = get('name');
        if(current_player !== maPartie.nbJoueurs-1){
            current_player++;
            h4.innerHTML = "C'est à ton tour : " + maPartie['nomJoueurs'][current_player];
        }else {
            current_player = 0;
            printCarte();
            changeButton();
            h4.innerHTML = "";
        }
    }
}

/**
 * Affiche les cartes masquées à la fin du tour avant le début d'un nouveau tour
 */
function printCarte(){
    let div_apercu = get("apercu");
    while (div_apercu.firstChild) {
        div_apercu.removeChild(div_apercu.firstChild);
    }
    for(let i=0; i< Object.size(carteSelectionnee); i++) {
        let carte = create("img");
        carte.src = "./ressources/cartes/cartes_"+carteSelectionnee[i]+".svg";
        carte.width = 75;
        carte.height = 75;
        div_apercu.append(carte);
    }
}

/**
 * Change le bouton de validation de carte par un bouton de debut de nouveau tour
 * ou inversemment
 */
function changeButton(){
    let div_button = get("bouton");
    let div_carte = get("cartes");

    if(div_button.firstChild.textContent == "\n        ")
        div_button.removeChild(div_button.firstChild);

    if(div_button.firstChild.id === "validerBouton"){
        while(div_carte.firstChild)
            div_carte.removeChild(div_carte.firstChild);

        div_carte.style.borderColor = "white";

        while(div_button.firstChild)
            div_button.removeChild(div_button.firstChild);

        let button_turn = create("button");
        button_turn.id = "nextButton";
        button_turn.setAttribute("onclick", "nextTurn()");
        button_turn.innerHTML = "Prochain tour";
        div_button.append(button_turn);
    }else if(div_button.firstChild.id === "nextButton"){
        loadCartes(div_carte);
        div_carte.style.borderColor = "";
        while(div_button.firstChild)
            div_button.removeChild(div_button.firstChild);

        let button_validate = create("button");
        button_validate.id = "validerBouton";
        button_validate.setAttribute("onclick", "validerChoix()");
        button_validate.innerHTML = "Valider le choix";
        div_button.append(button_validate);
    }
}

/**
 * Verifie toutes les informations et agit en consequences.
 * Cette fonction peut changer de tour, recommencer le tour en cours
 * ou sauvegarder la partie
 */
function nextTurn(){
    if(endTask()){
        current_turn = 1;
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
    }else{
        current_turn++;
    }
    let div_apercu = get("apercu");
    while(div_apercu.firstChild)
        div_apercu.removeChild(div_apercu.firstChild);

    changeButton();
    let h4 = get('name');
    h4.innerHTML = "C'est à ton tour : " + maPartie['nomJoueurs'][current_player];
}

/**
 * Change l'affichage de la tache en cours
 */
function nextTask(){
    numeroTache++;
    if(iterator.done)
        saveGame();

    let tache = iterator.next().value;
    let div_info = get("info");
    let h_tache = get("titre_tache");
    h_tache.innerHTML = tache['nom_tache'];
    let p_details = get("details_tache");
    p_details.innerHTML = tache['details'];
    div_info.appendChild(p_details);
}

/**
 * Verifie qu'aucune carte n'est selectionne et enleve la selection sinon
 */
function reloadCartes(){
    for (let i = 0; i < listeCartes.length; i++)
        if(get("carte_"+i).classList.contains(".carteSelectionnee")){
            get("carte_"+i).classList.remove(".carteSelectionnee");
            get("carte_"+i).style.marginBottom = "0px";
        }
}

/**
 * Teste les conditions de validations en fonction du mode de jeu et des
 * cartes sélectionnées
 * @returns {boolean}
 */
function endTask(){
    if(current_turn == 1){
        for(let i = 0; i < Object.size(carteSelectionnee)-1; i++){
            if(carteSelectionnee[i] != carteSelectionnee[i+1]){
                return false;
            }
        }
        return true;
    }
    else if(maPartie.mode === Modes.Strict){
        for(let i = 0; i < Object.size(carteSelectionnee)-1; i++){
            if(carteSelectionnee[i] != carteSelectionnee[i+1]){
                return false;
            }
        }
        return true;
    }else if(maPartie.mode === Modes.Moyenne){
        return true;
    }
}

/**
 * Sauvegarde la partie actuel
 */
function saveGame(){
    window.location.href = "./index.html";
}

if (typeof window == 'object') {
    window.onload = initialiserPartie;
}

module.exports = {
  listeTaches
};