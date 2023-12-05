/**
 * Classe Adaptateur qui permet d'adapter les données en fonction de nos besoins
 * En entrée, on aura toutes les données "en vrac" et en sortie, on aura les données prêtes à l'envoi en fonction des
 * besoins que l'on aura dans la page de jeux
 */
class Adaptateur {
    /**
     * Constructeur de la classe Adaptateur
     * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
     */
    constructor(option) {
        if (option == 0) {
            this.adapterNouvellePartie();
        } else if (option == 1) {
            this.adapterAnciennePartie();
        }
    }
    
    /** Méthode qui permet de préparer les données dans le cas d'une partie que l'on veut reprendre
     * asynchrone, car elle attend le chargement du fichier json que l'on récupère.
     * récupère uniquement la position de la tache sur laquelle on s'était arrêté.
     */
    async adapterAnciennePartie() {
        try{
            const position = await this.recupererSituation();
            this.donnees = {
                indice: position,
                fichierJson: get('jsonFileReprendre').value
            };
            const envoie = JSON.stringify(this.donnees);
            window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);
        } catch (e) {
            console.log("erreur : ", e);
        }
    }

    /**
     * Méthode qui récupère la position de la dernière tâche traitée
     * @returns {Promise<unknown>} - promesse (asychrone) qui contient l'indice de la dernière tâche traitée
     */
    async recupererSituation() {
        return new Promise((resolve, reject) => {
            let base = get('jsonFileReprendre');

            if (base.files.length > 0) {
                let fichier = base.files[0];
                let position = 0;
                let lecteur = new FileReader();

                lecteur.onload = function (evt) {
                    let fichierJson = JSON.parse(evt.target.result);
                    let liste = fichierJson["liste_tache"];

                    for(let i=0; i<liste.length; i++) {
                        let maTache = fichierJson["liste_tache"][i];
                        if (maTache['difficulte'] !== "") {
                            position += 1;
                        }
                    }

                    resolve({ position });
                };

                lecteur.onerror = function (evt) {
                    reject("Erreur lors de la lecture du fichier");
                };

                lecteur.readAsText(fichier);
            } else {
                console.log("Aucun fichier sélectionné");
                reject("Aucun fichier sélectionné");
            }
        });
    }

    /** Méthode qui s'occupe d'adapter les données dans le cas où l'on lance une nouvelle partie
     * s'occupe aussi d'envoyer les données vers la page de jeux*/
     adapterNouvellePartie() {
        this.donnees = {
            mode: this.adapterMode(),
            nbJoueurs: this.adapterNbJoueurs(),
            nomJoueurs: this.adapterListeJoueurs(),
            fichierJson: get('jsonFileLancer').value
        };

        const envoie = JSON.stringify(this.donnees);
        window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);
    }

    /**
     * Méthode qui adapte le mode de jeux dans le cas d'une nouvelle partie
     * @returns {*|string} - le mode de jeux sélectionné ou celui par défaut (strict)
     */
    adapterMode() {
        let mode = _('input[name="mode"]:checked').value;
        // On vérifie que le mode est bien correct 
        if ((mode == Modes.Strict) || (mode == Mode.Moyenne)) {
            return mode;
        }
        return Modes.Strict;
    }

    /**
     *  Méthode qui adapte le nombre de joueurs dans le cas d'une nouvelle partie
     * @returns {number|*} - le nombre de joueurs choisi ou celui par défaut (3)
     */
    adapterNbJoueurs() {
        let nbJoueurs = _('input[name="nbJoueurs"]:checked').value;
        if (1 < nbJoueurs && nbJoueurs < 5) {
            return nbJoueurs;
        }
        return 3;
    }

    /**
     * Méthode qui adapte le nombre de joueurs dans le cas d'une nouvelle partie
     * @returns {string[]|*[]} - la liste avec les noms des joueurs choisies ou une liste par défaut
     */
    adapterListeJoueurs() {
        let listeJoueurs = [];
        let tab = document.querySelectorAll('input[name=\"nomJoueurs\"]');
        
        for (let i = 0; i < tab.length; i++) {
            listeJoueurs.push(tab[i].value);
        }

        if (listeJoueurs.length != 0) {
           return listeJoueurs;
        }
        return ['Pedro', 'Sancho', 'Mendoza'];
    }
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

/** Fonction qui va afficher/masquer les menus de jeu, procède aux nettoyages,
 * bon affichage dans le cas du menu pour une nouvelle partie
 * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
*/
function afficherMenu(option) {
    if(option !== 0 && option !== 1){
        console.error("Vous tentez de valider un formulaire avec de mauvais parametres!");
        return;
    }

    const menuLancer = get('0');
    const menuReprendre = get('1');
    
    if (option === 0) {
        nettoyerMenu(get('1'));
        menuLancer.style.display = 'flex';
        menuReprendre.style.display = 'none';
        afficherJoueur(2);
    } else if (option === 1) {
        nettoyerMenu(get('0'));
        menuReprendre.style.display = 'flex';
        menuLancer.style.display = 'none';
    }
}

/** Fonction qui va afficher l'intitulé des règles 
 * en fonction du bouton sur lequel l'utilisateur a cliqué 
*/
function afficherRegleMode(option){
    if(option !== 0 && option !== 1){
        console.error("Vous tentez de valider un formulaire avec de mauvais parametres!");
        return;
    }

    let regleStrict = get("regleStrict");
    let regleMoyenne = get("regleMoyenne");

    if(option === 0){
        regleStrict.style.display = 'flex';
        regleMoyenne.style.display = 'none';
    }else if(option === 1){
        regleMoyenne.style.display = 'flex';
        regleStrict.style.display = 'none';
    }
}

/** Fonction qui va réinitialiser les menus et remettre les valeurs par défaut.
 * On fait appel à cette fonction à chaque fois que l'on change/quitte le menu
 * @param {HTMLElement | null} menu - Menu à réinitialiser
 */
function nettoyerMenu(menu) {
    const listeRadioBoutons = menu.querySelectorAll('input[type="radio"]');
    listeRadioBoutons.forEach((radio) => {
        if ((radio.id != 'j2') && (radio.id != 'r1')) {
            radio.checked = false;
        } else {
            radio.checked = true;
        }
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
 * @param {number} nb - Nombre de joueurs sélectionner
 */
function afficherJoueur(nb) {
    const defauts = ['ex : \"Seiya\"', 'ex : \"Shiryu\"', 'ex : \"Shun\"', 'ex : \"Hyoga\"'];
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
        input.placeholder = defauts[i];
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

/**Fonction qui va lancer le traitement des données afin de pouvoir répondre à la demande de l'utilisateur.
 * Récupère toutes les données et utilise ensuite la classe Adaptateur
 * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
 */
function validerFormulaire(option) {
    let monAdaptateur = new Adaptateur(option);  
}

/** Fonction qui sera appeler au chargement de la page
 * permet juste de nettoyer les menus avant le premier clique de l'utilisateur */
function fInit(){
    nettoyerMenu(get('0'));
    nettoyerMenu(get('1'));
}

if (typeof window == 'object') {
    window.onload = fInit;
}