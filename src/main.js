/**
 * Classe Adaptateur qui permet d'adapter les données en fonction de nos besoins
 * En entrée, on aura toutes les données "en vrac" et en sortie, on aura les données prêtes à l'envoi
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
     * asynchrone car elle attend le chargement complet du fichier Json que l'on récupère
     * charge les données et les envois sur la page de jeux
     */
    async adapterAnciennePartie() {
        try {
            const objet = await this.adapterSauvegardeBacklog(); 
            this.donnees = {
                mode: objet.mode,
                nbJoueurs: objet.nbJoueurs,
                nomJoueurs: objet.listeJoueurs,
                nomProjet: objet.nomProjet, 
                taches: objet.liste
            };
            const envoie = JSON.stringify(this.donnees);
            window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);
        
        } catch (error) {
            console.log("erreur ... ", error);
        }
    }
    /** Méthode qui adapte le fichierJson dans le cas d'une ancienne partie 
     * retourne une promesse
    */
    async adapterSauvegardeBacklog() {
        return new Promise((resolve, reject) => {
            let base = get('jsonFileReprendre');

            if (base.files.length > 0) {
                let fichier = base.files[0];
                let lecteur = new FileReader();

                lecteur.onload = function (evt) {
                    let fichierJson = JSON.parse(evt.target.result);
                    let mode = fichierJson["mode"];
                    let nbJoueurs = fichierJson["nbJoueurs"];
                    let listeJoueurs = fichierJson["liste_joueurs"];
                    let nomProjet = fichierJson["nom_projet"];
                    let liste = listeTaches(fichierJson);
                    resolve({ mode, nbJoueurs, listeJoueurs, nomProjet, liste });
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

    /** Méthode qui permet de préparer les données dans le cas d'une nouvelle partie
     * asynchrone car elle attend le chargement complet du fichier Json que l'on récupère
     * charge les données et les envois sur la page de jeux
     */
    async adapterNouvellePartie() {
        try {
            const objet = await this.adapterBacklog(); 
            this.donnees = {
                mode: this.adapterMode(),
                nbJoueurs: this.adapterNbJoueurs(),
                nomJoueurs: this.adapterListeJoueurs(),
                nomProjet: objet.nomProjet,
                taches: objet.liste
            };

            //console.log("paquet nouveau prêt : ", this.donnees);
            const envoie = JSON.stringify(this.donnees);
            window.location.href = "./jeux.html?data=" + encodeURIComponent(envoie);
        } catch (error) {
            console.log("erreur ... ", error);
        }
    }

    /** Méthode qui adapte le mode de jeux dans le cas d'une nouvelle partie
     * 
     */
    adapterMode() {
        let mode = _('input[name="mode"]:checked').value;
        // On vérifie que le mode est bien correct 
        if ((mode == 'strict') || (mode == 'moyenne')) {
            return mode;
        }
        return 'strict';
    }

    adapterNbJoueurs() {
        let nbJoueurs = _('input[name="nbJoueurs"]:checked').value;
        if (1 < nbJoueurs && nbJoueurs < 5) {
            return nbJoueurs;
        }
        return 2;
    }

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
   
    async adapterBacklog() {
        return new Promise((resolve, reject) => {
            let base = get('jsonFileLancer');

            if (base.files.length > 0) {
                let fichier = base.files[0];
                let lecteur = new FileReader();

                lecteur.onload = function (evt) {
                    let fichierJson = JSON.parse(evt.target.result);

                    let nomProjet = fichierJson["nom_projet"];
                    let liste = listeTaches(fichierJson);
                    resolve({ nomProjet, liste });
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
}

/**
 * Itérateur de la liste de tâche d'un fichier Json
 * @param fichierJson - Fichier contenant les tâches
 * @returns {{next: (function(): ({value: ({nom_tache: string, details: string}), done: boolean}))}}
 */
function listeTaches(fichierJson) {
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
        menuLancer.style.display = 'flex';
        menuReprendre.style.display = 'none';
        afficherJoueur(2);
    } else if (option === 1) {
        menuReprendre.style.display = 'flex';
        menuLancer.style.display = 'none';
    }
}

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
        //radio.checked = false;
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

/**Fonction qui va lancer le traitement des données afin de pouvoir répondre à la demande de l'utilisateur.
 * Récupère toutes les données et utilise ensuite la classe Adaptateur
 * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
 */
function validerFormulaire(option) {
    let monAdaptateur = new Adaptateur(option);  
}

/** Fonction qui sera appeler au chargement de la page */
function fInit(){
    nettoyerMenu(get('0'));
    nettoyerMenu(get('1'));
}

if (typeof window == 'object') {
    window.onload = fInit;
}
