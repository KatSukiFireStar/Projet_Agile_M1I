/** Classe Adaptateur qui permet d'adapter les données en fonction de nos besoins
 * En entrée, on aura toutes les données 'en vrac', ensuite, la classe va valider les données et les sauvegarder dans
 * le 'Session Storage' ainsi, dans la page 'jeux.html', on pourra récupérer les données et les utiliser comme on le
 * souhaite.
 */
class Adaptateur {
    /** Constructeur de la classe Adaptateur
     * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
     */
    constructor(option) {
        clearStorage();
        if (option === 0) {
            this.adapterMode();
            this.adapterNbJoueurs();
            this.adapterNomJoueurs();
        }
        this.adapterFichierJson(option);
    }

    /** Méthode qui adapte le fichier dans les deux cas.
     * Si l'on lance une nouvelle partie, le fichier est simplement sauvegardé dans le 'session storage'
     * sinon, dans le cas d'une reprise de partie, on va aussi sauvegarder le fichier (qui sera différent) mais
     * on va aussi récupérer la position de la tache sur laquelle les joueurs s'étaient arrêtés.
     */
    adapterFichierJson(option) {
        let base = (option === 0) ? get('jsonFileLancer') : get('jsonFileReprendre');
        if (base.files.length > 0) {
            let fichier = base.files[0];
            let lecteur = new FileReader();

            lecteur.onload = function (evt) {
                let fichierJson = JSON.parse(evt.target.result);
                if (option === 1) {
                    let position = 0;
                    let liste = fichierJson['liste_tache'];

                    for(let i=0; i<liste.length; i++) {
                        let maTache = fichierJson['liste_tache'][i];
                        if (maTache['difficulte'] !== "") {
                            position += 1;
                        }
                    }
                    if(position != 0)
                        saveData('position', position);
                    else
                        saveData('position', null);
                }
                saveData('fichierJson', JSON.stringify(fichierJson));
            };

            lecteur.readAsText(fichier);
        } else {
            console.error("erreur - aucun fichier n'est sélectionné !");
        }
    }

    /** Méthode qui adapte le mode de jeux dans tous les cas. Si le mode sélectionné par les joueurs est invalide
     * alors le mode par défaut est attribué (Strict). Sauvegarde la valeur dans le 'session storage'.
     */
    adapterMode() {
        let mode = _('input[name="mode"]:checked').value;
        // On vérifie que le mode est bien correct
        if ((mode === Modes.Strict) || (mode === Modes.Moyenne)) {
            saveData('mode', mode);
        } else {
            saveData('mode', Modes.Strict);
        }
    }

    /** Méthode qui adapte le nombre de joueurs de la partie. Si le nombre est invalide
     * alors, on sauvegarde 2 joueurs. Sauvegarde la valeur dans le 'session storage'.
     */
    adapterNbJoueurs() {
        let nbJoueurs = _('input[name="nbJoueurs"]:checked').value;
        if (1 < nbJoueurs && nbJoueurs < 5) {
            saveData('nbJoueurs', nbJoueurs);
        } else {
            saveData('nbJoueurs', 2);
        }
    }

    /** Méthode qui adapte la liste avec les noms des joueurs de la partie. Si cette liste est vide, elle est invalide
     * et alors, on attribue une liste avec 2 noms de joueurs. Sauvegarde la valeur dans le 'session storage'.
     */
    adapterNomJoueurs() {
        let nomJoueurs = [];
        let div = document.querySelectorAll('input[name="nomJoueurs"]');

        for (let i = 0; i < div.length; i++) {
            nomJoueurs.push(div[i].value);
        }

        if (nomJoueurs.length !== 0){
            saveData('nomJoueurs', nomJoueurs);
        } else {
            saveData('nomJoueurs', ['Titi', 'Grosminet']);
        }
    }
}

/** Fonction qui s'active quand on clique sur le bouton (i)
 * Cette fonction va afficher les règles si les règles étaient masquées et va les masquer dans le cas contraire
 */
function afficherRegles() {
    let regles = get('regles-overlay');
    regles.style.display = (regles.style.display === 'block') ? 'none' : 'block';
}

/** Fonction qui va masquer les règles du jeu dans tous les cas */
function masquerRegles() {
    let regles = get('regles-overlay');
    regles.style.display = 'none';
}

/** Fonction qui va afficher/masquer les menus de jeu, procède aux nettoyages avant d'afficher les menus,
 * Veille à afficher les menus avec les valeurs par défauts
 * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
*/
function afficherMenu(option) {
    const menuLancer = get('0');
    const menuReprendre = get('1');

    nettoyerMenu(option);
    if (option === 0) {
        menuLancer.style.display = 'flex';
        menuReprendre.style.display = 'none';
        afficherJoueur(2);
    } else if (option === 1) {
        menuReprendre.style.display = 'flex';
        menuLancer.style.display = 'none';
    } else {
        console.error("erreur - le paramètre est invalide !");
    }
}

/** Fonction qui va afficher l'intitulé des règles dans le menu pour une nouvelle partie
 * Les règles affichées sont différentes en fonction du bouton sur lequel l'utilisateur a cliqué
 * @param {0 | 1} option - Type de règles à afficher (0 : Strict | 1 : Moyenne)
 */
function afficherReglesMode(option){
    let regleStrict = get('regleStrict');
    let regleMoyenne = get('regleMoyenne');

    if (option === 0) {
        regleStrict.style.display = 'flex';
        regleMoyenne.style.display = 'none';
    } else if (option === 1) {
        regleMoyenne.style.display = 'flex';
        regleStrict.style.display = 'none';
    } else {
        console.error("erreur - le paramètre est invalide !");
    }
}

/** Fonction qui va réinitialiser les menus et remettre les valeurs par défaut.
 * On fait appel à cette fonction à chaque fois que l'on change/quitte le menu
 * @param option - Type de menu que l'on va nettoyer (0 : nouvelle partie | 1 : reprendre partie)
 */
function nettoyerMenu(option) {
    const menu = get(option);
    let saisieFichier;
    if (option === 0) {
        let radioBoutons = menu.querySelectorAll('input[type="radio"]');
        radioBoutons.forEach((radio) => {
            radio.checked = !((radio.id !== 'j2') && (radio.id !== 'r1'));
        });
        afficherReglesMode(0);
        let saisies = get('selection-nom-joueurs');
        for (let i = saisies.children.length - 1; i >= 0; i--) {
            if (saisies.children[i].type === 'text') {
                saisies.removeChild(saisies.children[i]);
            }
        }
        saisieFichier = get('jsonFileLancer');
    } else if (option === 1) {
        saisieFichier = get('jsonFileReprendre');
    } else {
        console.error("erreur - le paramètre est invalide !");
    }

    saisieFichier.value = '';
}


/** Fonction qui va afficher les entrées de type 'text' pour saisir les noms des joueurs
 * @param {number} nbJoueur - le nombre de joueurs
 */
function afficherJoueur(nbJoueur) {
    const nomJoueursDefauts = ['ex : "Seiya"', 'ex : "Shiryu"', 'ex : "Shun"', 'ex : "Hyoga"'];

    const nomJoueurs = [];
    let div = get('selection-nom-joueurs');
    for (let nomJoueur of div.children) {
        if (nomJoueur.type === 'text') {
            nomJoueurs.push(nomJoueur.value);
        }
    }

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i=0; i<nbJoueur; i++) {
        let input = create('input');
        input.type = 'text';
        input.name = 'nomJoueurs';
        input.id = 'jt'+(i+1);
        input.placeholder = nomJoueursDefauts[i];
        input.value = '';
        div.appendChild(input);
    }

    let i = 0;
    for (let j = 0; j < div.childElementCount; j++){
        let enfant = div.children[j];
        if (enfant.type === 'text' && i < nomJoueurs.length) {
            enfant.value = nomJoueurs[i];
            i++;
        }
    }
}

/** Fonction qui va lancer le traitement des données afin de pouvoir répondre à la demande de l'utilisateur.
 * Récupère toutes les données et utilise ensuite la classe Adaptateur qui va se charger du traitement
 * @param {0 | 1} option - Type de partie à lancer (0 pour une nouvelle partie | 1 pour reprendre une partie)
 */
function validerFormulaire(option) {
    new Adaptateur(option);
    window.location.href = 'jeux.html';
}

if (typeof window == 'object') {
    window.onload
}