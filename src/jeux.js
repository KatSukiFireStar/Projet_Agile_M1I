const listeCartes = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "?"];

let maPartie, iterateur, joueurCourant, numeroTache = -1;
let tourCourant = 1;

let carteSelectionnee = {};
//let valeurCarte = {};

// Formats du fichier de sauvegarde Json ...
let sauvegarde = {
    mode: '',
    nb_joueurs: 0,
    liste_joueurs: [
        ''
    ],
    nom_projet: "",
    liste_tache: []
};

/** Itérateur de la liste de tâche d'un fichier json
 * @param fichierJson - fichier json contenant les tâches
 * @returns {{next: ((function(): ({value: *, done: boolean}))|*)}}
 */
function listeTaches(fichierJson) {
    let indexTache = 0;
    return {
        next: function () {
            let tache;
            if (indexTache < fichierJson['liste_tache'].length) {
                tache = {value: fichierJson['liste_tache'][indexTache], done: false};
                indexTache++;
                return tache;
            }
            return {value: "", done: true};
        }
    };
}

/** Permet de retourner toutes les données dont on a besoin pour notre partie.
 * Initialise également la sauvegarde, avec les premières informations simples
 * @returns {any} - retourne un objet qui sera notre partie.
 */
function chargerPartie() {
    // tiens compte de position ...
    let partie = {};
    let position = getData('position');
    if (position === null) {
        partie.position = 0;
        partie.mode = getData('mode');
        partie.nbJoueurs = getData('nbJoueurs');
        let donnees = getData('nomJoueurs');
        partie.nomJoueurs = donnees.split(',');

        partie.fichierJson = JSON.parse(getData('fichierJson'));
    } else {
        let fichierJson = JSON.parse(getData('fichierJson'));
        partie.position = getData('position');
        partie.mode = fichierJson['mode'];
        partie.nbJoueurs = fichierJson['nb_joueurs'];
        partie.nomJoueurs = [];
        for(let i = 0; i< fichierJson['liste_joueurs'].length; i++) {
            partie.nomJoueurs.push(fichierJson['liste_joueurs'][i]);
        }
        partie.fichierJson = fichierJson;
    }

    sauvegarde.mode = partie.mode;
    sauvegarde.nb_joueurs = partie.nbJoueurs;
    sauvegarde.liste_joueurs = partie.nomJoueurs;
    sauvegarde.nom_projet = partie.fichierJson['nom_projet'];

    return partie;
}

/** Définit toutes les valeurs de la page qui doivent être changé selon
 * les informations de partie. Cette fonction est appelé en début de partie
 */
function initialiserPartie() {
    maPartie = chargerPartie();
    console.log(maPartie);

    let boutonValider = get("validerBouton");
    boutonValider.disabled = true;

    iterateur = listeTaches(maPartie.fichierJson);

    // On gère l'affichage des infos au-dessus ...
    let divInfo = get('info');

    let h1 = create('h1');
    h1.innerText = 'Planning Poker : ' + maPartie.fichierJson['nom_projet'];
    divInfo.append(h1);

    let h_tache = create("h3");
    h_tache.id = "titre_tache";
    divInfo.append(h_tache);

    let p_details = create("p");
    p_details.id = "details_tache";
    divInfo.append(p_details);

    // On lance le tour
    joueurCourant = 0;
    numeroTache = 0;
    if(maPartie.position !== 0){
        while(numeroTache < maPartie.position){
            nextTask();
            sauvegarderDifficulte(maPartie.fichierJson['liste_tache'][numeroTache-1]['difficulte']);
        }
    }
    nextTask();


    let h4 = get('name');
    h4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];

    let divJoueurCartes = get('cartes');
    loadCartes(divJoueurCartes);
}

/** Permet de charger toutes les cartes dans la divJoueurCartes
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
            carteSelectionnee[joueurCourant] = listeCartes[i];
            imgCarte.classList.add('.carteSelectionnee');
            imgCarte.style.marginBottom = "20px";
            for (let j = 0; j < listeCartes.length; j++){
                if(j !== indiceCarte && get("carte_"+j).classList.contains(".carteSelectionnee")){
                    get("carte_"+j).classList.remove(".carteSelectionnee");
                    get("carte_"+j).style.marginBottom = "0px";
                }
            }
        });
        divJoueurCartes.appendChild(imgCarte);
    }
}

/** Fonction qui valide la carte que le joueur à sélectionner.
 * Si c'est le dernier joueur qui a joué, marque la fin du tour en révélant les cartes et en changeant de bouton.
 */
function validerChoix() {
    let divApercu = get('apercu');

    if (carteSelectionnee[joueurCourant] !== "") {
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
        if(joueurCourant !== maPartie.nbJoueurs-1){
            // le tour n'est pas fini, classique ...
            joueurCourant++;
            h4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];
        }else {
            // le tour semble être terminé
            joueurCourant = 0;
            h4.style.display = 'none';
            get("cartes").style.display = 'none';
            printCarte(); // On révèle les cartes
            changeButton('finTour'); // On adapte le bouton
        }
    }
}

/** Vérifie qu'aucune carte n'est sélectionnée et enlève la selection sinon
 */
function reloadCartes() {
    for (let i = 0; i < listeCartes.length; i++) {
        if (get("carte_" + i).classList.contains(".carteSelectionnee")) {
            get("carte_" + i).classList.remove(".carteSelectionnee");
            get("carte_" + i).style.marginBottom = "0px";
        }
    }
}

/** Fonction qui à chaque fin de tour, révèle les cartes que les joueurs ont sélectionnées
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

/** Fonction qui change le bouton de validation de carte en fonction de la situation.
 * Si l'on est au début d'un tour, on garde le comportement simple (valider le choix)
 * Sinon, on marque la fin du tour ou de la tâche
 */
function changeButton(situation){
    // Avant de changer de bouton, on vérifie si l'on passe à la tâche suivante ou si l'on doit relancer un tour
    let bouton = get("validerBouton");
    if (situation === "debut") {
        bouton.onclick = validerChoix;
        bouton.innerHTML = "Valider votre carte";
        bouton.disabled = true;
    } else if (situation ==="finTour") {
        bouton.onclick = nextTurn;
        if (endTask()) {
            bouton.innerHTML = 'Prochaine Tâche';
        } else {
            bouton.innerHTML = "Prochain Tour";
        }
        bouton.disabled = false;
    }
}

function sauvegarderDifficulte(difficulte = ""){
    sauvegarde.liste_tache.push({
        nom_tache: maPartie.fichierJson['liste_tache'][numeroTache-1]['nom_tache'],
        details: maPartie.fichierJson['liste_tache'][numeroTache-1]['details'],
        difficulte: difficulte
    });
}

/** Vérifie toutes les informations et agit en consequences.
 * Cette fonction peut changer de tour, recommencer le tour en cours
 * ou sauvegarder la partie
 */
function nextTurn(){
    if (endTask()) {
        tourCourant = 1;
        if (maPartie.mode === Modes.Strict){
            if(carteSelectionnee[0] !== "cafe"){
                sauvegarderDifficulte(carteSelectionnee[0]);
            }else{
                sauvegarderDifficulte();
                sauvegarderPartie();
            }
        }else if (maPartie.mode === Modes.Moyenne){
            let counter_coffee = 0;
            let counter_interro = 0;
            let moyenne = 0;
            let nbCartes = 0;
            for(let i = 0; i < Object.size(carteSelectionnee); i++){
                if (carteSelectionnee[i] !== "cafe" && carteSelectionnee[i] !== "?") {
                    moyenne += parseInt(carteSelectionnee[i]);
                    nbCartes++;
                } else if(carteSelectionnee[i] === "cafe") {
                    counter_coffee++;
                } else if(carteSelectionnee[i] === "?") {
                    counter_interro++;
                }
            }
            if (counter_coffee !== parseInt(maPartie.nbJoueurs) && counter_interro !== parseInt(maPartie.nbJoueurs)) {
                moyenne /= nbCartes;
                sauvegarderDifficulte(moyenne.toString());
            } else if(counter_coffee === parseInt(maPartie.nbJoueurs)){
                sauvegarderDifficulte();
                sauvegarderPartie();
            } else if(counter_interro === parseInt(maPartie.nbJoueurs)){
                sauvegarderDifficulte(carteSelectionnee[0]);
            }
        }
        nextTask();
    }else{
        tourCourant++;
    }
    carteSelectionnee = {};
    joueurCourant = 0;
    let div_apercu = get("apercu");
    while(div_apercu.firstChild)
        div_apercu.removeChild(div_apercu.firstChild);

    changeButton("debut");
    let h4 = get('name');
    h4.style.display = 'flex';
    get("cartes").style.display = 'block';
    h4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];
}

/** Change l'affichage de la tâche courante, on passe à la tâche suivante.
 * Si l'on était sûr la dernière tâche, alors, on sauvegarde la partie.
 */
function nextTask(){
    numeroTache++;

    let it = iterateur.next();
    let tache = it.value;

    if (it.done) {
        console.log("On a fini !");
        numeroTache--;
        sauvegarderPartie();
    }

    let div_info = get("info");

    let h_tache = get("titre_tache");
    h_tache.innerHTML = "Tâche actuelle : " + tache['nom_tache'];
    div_info.appendChild(h_tache);

    let p_details = get("details_tache");
    p_details.innerHTML = "Détails : " + tache['details'];
    div_info.appendChild(p_details);
}



/** Test les conditions pour valider une tâche ou non en fonction du mode de jeux de la partie
 * et des cartes sélectionnées.
 * @returns {boolean} - true si un accord est trouvée, false sinon
 */
function endTask(){
    if (tourCourant === 1) {
        for (let i = 0; i < Object.size(carteSelectionnee)-1; i++) {
            if (carteSelectionnee[i] !== carteSelectionnee[i+1]) {
                return false;
            }
        }
        return true;
    } else if (maPartie.mode === Modes.Strict) {
        for (let i = 0; i < Object.size(carteSelectionnee)-1; i++) {
            if (carteSelectionnee[i] !== carteSelectionnee[i+1]) {
                return false;
            }
        }
        return true;
    } else if(maPartie.mode === Modes.Moyenne) {
        return true;
    }
}

/** Fonction qui sauvegarde la partie et retourne à la page d'accueil index.html
 * écrit le contenu de sauvegarde dans un fichier .json et lance le téléchargement de celui-ci.
 */
function sauvegarderPartie(){
    // Penses à sauvegarder toutes les tâches non traitées ...
    if (numeroTache < maPartie.fichierJson['liste_tache'].length) {
        for (let i = numeroTache; i < maPartie.fichierJson['liste_tache'].length; i++) {
            nextTask();
            sauvegarderDifficulte("");
        }
    }
    const jsonContenu = JSON.stringify(sauvegarde, null, 2);

    const blob = new Blob([jsonContenu], { type: 'application/json' });

    const blobURL = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = 'backlog_sauvegarde.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobURL);

    clearStorage();

    window.location.href = "index.html";
}

if (typeof window == 'object') {
    window.onload = initialiserPartie;
}

// Provoque une erreur - logique, on est dans un fichier text/javascript et non un module...
module.exports = {
  listeTaches, chargerPartie
};