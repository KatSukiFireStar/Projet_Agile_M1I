// TODO Guillaume - finir le css de la partie du milieu, rapport
const listeCartes = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "interro", "cafe"];
let timer = {time:31, option:'choix'};
let maPartie, iterateur, joueurCourant, numeroTache = -1;
let tourCourant = 1;
let tacheCourrante = ""
let carteSelectionnee = {};

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
            if (indexTache < fichierJson['liste_tache'].length) {
                tache = {value: fichierJson['liste_tache'][indexTache], done: false};
                indexTache++;
                return tache;
            }
            return {value: "", done: true};
        }
    };
}

/**
 * Gere l'affichage et les actions du timer.
 * Selon la situation, soit il change de joueurs, soit
 * il change de tours en prenant en compte si le joueur a pu jouer.
 */
function gestionTimer(){
    timer.time--;
    let p_timer = get("timer");
    let icone = '';
    if (timer.option === 'choix') {
        if (20 <= timer.time) {
            icone = "<i class='fa-solid fa-hourglass-start'</i>";
        } else if (6 <= timer.time) {
            icone = "<i class='fa-solid fa-hourglass-half'</i>";
        } else if (0 < timer.time) {
            icone = "<i class='fa-solid fa-hourglass-end'</i>";
        } else {
            let carteBool = false;
            let indice = 0;
            for (let j = 0; j < listeCartes.length; j++) {
                if (get("carte_" + j).classList.contains(".carteSelectionnee")) {
                    carteBool = true;
                    indice = j;
                }
            }
            if (!carteBool) {
                get("carte_" + (listeCartes.length - 2).toString()).classList.add(".carteSelectionnee");
                indice = listeCartes.length - 2;
            }
            carteSelectionnee[joueurCourant] = listeCartes[indice];
            validerChoix();
        }
    } else {
        if (40 <= timer.time) {
            icone = "<i class='fa-solid fa-hourglass-start'</i>";
        } else if (10 <= timer.time) {
            icone = "<i class='fa-solid fa-hourglass-half'</i>";
        } else if (0 !== timer.time) {
            icone = "<i class='fa-solid fa-hourglass-end'</i>";
        } else {
            console.log("timer à 0 !");
            nextTurn();
        }
    }
    p_timer.innerHTML = "Horloge : " + timer.time.toString() + " " + icone;
}

/**
 * Permet de retourner toutes les données dont on a besoin pour notre partie.
 * Initialise également la sauvegarde, avec les premières informations simples
 * @returns {any} - retourne un objet qui sera notre partie.
 */
function chargerPartie() {
    console.log("chargerPartie");
    let partie = {};
    partie.position = getData('position');
    if (partie.position === null) {
        partie.position = 0;
        partie.fichierJson = JSON.parse(getData('fichierJson'));

        partie.mode = getData('mode');
        partie.nbJoueurs = getData('nbJoueurs');
        partie.nomJoueurs = getData('nomJoueurs').split(',');

    } else {
        partie.position = getData('position');
        partie.fichierJson = JSON.parse(getData('fichierJson'));

        partie.mode = partie.fichierJson['mode'];
        partie.nbJoueurs = partie.fichierJson['nb_joueurs'];
        partie.nomJoueurs = [];
        for(let i = 0; i< partie.fichierJson['liste_joueurs'].length; i++) {
            partie.nomJoueurs.push(partie.fichierJson['liste_joueurs'][i]);
        }
    }

    sauvegarde.mode = partie.mode;
    sauvegarde.nb_joueurs = partie.nbJoueurs;
    sauvegarde.liste_joueurs = partie.nomJoueurs;
    sauvegarde.nom_projet = partie.fichierJson['nom_projet'];

    return partie;
}

/**
 * Définit toutes les valeurs de la page qui doivent être changé selon
 * les informations de partie. Cette fonction est appelé en début de partie
 */
function initialiserPartie() {
    console.log("init partie");
    maPartie = chargerPartie();
    console.log(maPartie);

    iterateur = listeTaches(maPartie.fichierJson);

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

    setInterval(gestionTimer, 1000);

    let titreH4 = get('table_titre');
    titreH4.innerHTML = "Table des cartes - Tour n° " + tourCourant;

    joueurCourant = 0;
    numeroTache = 0;
    if (maPartie.position !== 0) {
        while (numeroTache < maPartie.position) {
            nextTask();
            sauvegarderDifficulte(maPartie.fichierJson['liste_tache'][numeroTache-1]['difficulte']);
        }
    }
    nextTask();

    let nameH4 = get('name');
    nameH4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];

    let boutonValider = get("validerBouton");
    boutonValider.disabled = true;

    let divJoueurCartes = get('cartes');
    loadCartes(divJoueurCartes);
}

/**
 * Permet de charger toutes les cartes dans la divJoueurCartes
 * @param divJoueurCartes
 */
function loadCartes(divJoueurCartes) {
    console.log("loadcartes");
    for (let i = 0; i < listeCartes.length; i++) {
        let imgCarte = create('img');
        imgCarte.src = "./ressources/cartes/cartes_" + listeCartes[i] + ".svg";
        imgCarte.width = 55;
        imgCarte.height = 85;
        imgCarte.id = "carte_" + i;

        imgCarte.classList.add('carteNonSelectionnee');

        // Écouteurs pour gérer le clic sur la carte
        imgCarte.addEventListener('click', function () {
            let validate_button = get("validerBouton");
            let indiceCarte = i;

            // Vérifie si la carte est déjà sélectionnée
            if (imgCarte.classList.contains('carteSelectionnee')) {
                delete carteSelectionnee[joueurCourant];
            } else {
                carteSelectionnee[joueurCourant] = listeCartes[i];
            }

            // Ajoute/retire les classes pour gérer le surlignage
            imgCarte.classList.toggle('carteSelectionnee');
            imgCarte.classList.toggle('carteNonSelectionnee');

            for (let j = 0; j < listeCartes.length; j++) {
                if (j !== indiceCarte && get("carte_" + j).classList.contains("carteSelectionnee")) {
                    get("carte_" + j).classList.toggle('carteSelectionnee');
                    get("carte_" + j).classList.toggle('carteNonSelectionnee');
                }
            }

            // Vérifie si au moins une carte est sélectionnée pour activer ou désactiver le bouton
            validate_button.disabled = Object.keys(carteSelectionnee).length === 0;
        });

        divJoueurCartes.appendChild(imgCarte);
    }
}

/**
 * Fonction qui valide la carte que le joueur à sélectionner.
 * Si c'est le dernier joueur qui a joué, marque la fin du tour en révélant les cartes et en changeant de bouton.
 */
function validerChoix() {
    console.log("validerChoix");
    let divApercu = get('table');

    if (carteSelectionnee[joueurCourant] !== "") {
        let validate_button = get("validerBouton");
        validate_button.disabled = true;

        let imgApercu = create('img');
        imgApercu.src = "./ressources/cartes/cartes_.svg";
        imgApercu.classList.add('.invisible');
        imgApercu.width = 175;
        imgApercu.height = 175;

        divApercu.appendChild(imgApercu);
        reloadCartes(); // On recharge les cartes -> permet d'enlever la sélection
        let h4 = get('name');
        if(joueurCourant !== maPartie.nbJoueurs-1){
            joueurCourant++;
            h4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];
            timer.time = 30;
            timer.option = 'choix';
        }else {
            // le tour semble être terminé
            joueurCourant = 0;
            timer.time = 60;
            timer.option = 'debat';
            printCarte(); // On révèle les cartes
            changeButton('finTour'); // On adapte le bouton
        }
    }
}

/**
 * Vérifie qu'aucune carte n'est sélectionnée et enlève la selection sinon
 */
function reloadCartes() {
    console.log("reloadcartes");
    for (let i = 0; i < listeCartes.length; i++) {
        let carte = get("carte_" + i);
        if (carte.classList.contains("carteSelectionnee")) {
            carte.classList.remove("carteSelectionnee");
            carte.classList.add("carteNonSelectionnee");
        }
    }
}

/**
 * Fonction qui à chaque fin de tour, révèle les cartes que les joueurs ont sélectionnées
 */
function printCarte() {
    console.log("printcartes");
    let div_apercu = get("table");

    let imgElements = div_apercu.querySelectorAll('img');
    let i = 0;
    imgElements.forEach((imgElement) => {
        imgElement.src = "./ressources/cartes/cartes_" + carteSelectionnee[i] + ".svg";
        i++;
    });
}


/**
 * Fonction qui change le bouton de validation de carte en fonction de la situation.
 * Si l'on est au début d'un tour, on garde le comportement simple (valider le choix)
 * Sinon, on marque la fin du tour ou de la tâche
 */
function changeButton(situation) {
    console.log("changeBouton");
    // Avant de changer de bouton, on vérifie si l'on passe à la tâche suivante ou si l'on doit relancer un tour
    let bouton = get("validerBouton");

    if (situation === "debut") {
        bouton.onclick = validerChoix;
        bouton.innerHTML = "Valider votre carte";
        bouton.disabled = true;
    } else if (situation === "finTour") {
        let h4 = get('name');
        h4.style.display = 'none';
        let cartes = get('cartes');
        cartes.style.display = 'none';

        bouton.onclick = nextTurn;
        if (endTask()) {
            if (validerCafe()) {
                bouton.innerHTML = 'Pause Café !';
            } else {
                bouton.innerHTML = 'Prochaine Tâche';
            }

        } else {
            bouton.innerHTML = "Prochain Tour";
        }
        bouton.disabled = false;
    }
}


/**
 * Sauvegarde la difficulté pour la tache courrante dans une liste
 * @param difficulte - Difficulté à sauvegarder
 */
function sauvegarderDifficulte(difficulte = ""){
    console.log("sauvegarderDifficulte");
    if(difficulte==="interro")
        difficulte = "?"
    sauvegarde.liste_tache.push({
        nom_tache: tacheCourrante['nom_tache'],
        details: tacheCourrante['details'],
        difficulte: difficulte
    });
}


function calculerMoyenne() {
    let moyenne = 0;
    let nbCartes = 0;
    for(let i = 0; i < Object.size(carteSelectionnee); i++){
        if (carteSelectionnee[i] !== "cafe" && carteSelectionnee[i] !== "interro") {
            moyenne += parseInt(carteSelectionnee[i]);
            nbCartes++;
        }
    }
    return moyenne/nbCartes;
}

function validerInterro() {
    // On refait une vérification pour détecter la pause café ...
    let cptInterro = 0;
    for(let i = 0; i < Object.size(carteSelectionnee); i++){
        if (carteSelectionnee[i] === "interro") {
            cptInterro += 1;
        }
    }
    return (cptInterro === parseInt(maPartie.nbJoueurs));
}

function validerCafe() {
    // On refait une vérification pour détecter la pause café ...
    let cptCafe = 0;
    for(let i = 0; i < Object.size(carteSelectionnee); i++){
        if (carteSelectionnee[i] === "cafe") {
            cptCafe += 1;
        }
    }
    return (cptCafe === parseInt(maPartie.nbJoueurs));
}

/**
 * Vérifie toutes les informations et agit en consequences.
 * Cette fonction peut changer de tour, recommencer le tour en cours
 * ou sauvegarder la partie
 */
function nextTurn(){
    console.log("nextTurn");
    if (endTask()) {
        tourCourant = 1;
        if (maPartie.mode === Modes.Strict){
            if(carteSelectionnee[0] !== "cafe"){
                sauvegarderDifficulte(carteSelectionnee[0]);
            }else{
                sauvegarderDifficulte();
                console.log("appel 1 dans nextturn");
                sauvegarderPartie();
            }
        }else if (maPartie.mode === Modes.Moyenne){
            if (!validerCafe()) {
                if (!validerInterro()) {
                    let moyenne =  calculerMoyenne();
                    sauvegarderDifficulte(moyenne.toString());
                } else {
                    sauvegarderDifficulte("?");
                }
            } else {
                sauvegarderDifficulte();
            }
        }
        nextTask();
    }else{
        tourCourant++;
    }
    carteSelectionnee = {};
    joueurCourant = 0;

    let div_apercu = get("table");
    let imgElements = div_apercu.querySelectorAll('img');

    // Supprimez chaque balise img
    imgElements.forEach((imgElement) => {
        imgElement.remove();
    });

    changeButton("debut");
    let h4 = get('name');
    h4.style.display = 'flex';
    timer.time = 30;
    timer.option = 'choix';
    get("cartes").style.display = 'block';
    h4.innerHTML = "C'est à ton tour : " + maPartie.nomJoueurs[joueurCourant];
    let titreH4 = get('table_titre');
    titreH4.innerHTML = "Table des cartes - Tour n° " + tourCourant;
}

/**
 * Change l'affichage de la tâche courante, on passe à la tâche suivante.
 * Si l'on était sûr la dernière tâche, alors, on sauvegarde la partie.
 */
function nextTask(){
    console.log("tachenext");
    numeroTache++;

    let it = iterateur.next();
    tacheCourrante = it.value;

    if (it.done) {
        // On re-vérifie le cas "cafe" pour éviter le double téléchargement
        numeroTache--;
        if (!validerCafe()) {
            sauvegarderPartie();
        }

    }

    let div_info = get("info");

    let h_tache = get("titre_tache");
    h_tache.innerHTML = "Tâche actuelle : " + tacheCourrante['nom_tache'];
    div_info.appendChild(h_tache);

    let p_details = get("details_tache");
    p_details.innerHTML = "Détails : " + tacheCourrante['details'];
    div_info.appendChild(p_details);
}



/**
 * Test les conditions pour valider une tâche ou non en fonction du mode de jeux de la partie
 * et des cartes sélectionnées.
 * @returns {boolean} - true si un accord est trouvée, false sinon
 */
function endTask(){
    console.log("endtask");
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

/**
 * Fonction qui sauvegarde la partie et retourne à la page d'accueil index.html
 * écrit le contenu de sauvegarde dans un fichier .json et lance le téléchargement de celui-ci.
 */
function sauvegarderPartie(){
    console.log("savepartie et quitte");
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