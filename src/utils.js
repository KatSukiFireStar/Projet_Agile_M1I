/**
 * Classe énumeration des modes de jeu
 * @type {{Strict: string, Moyenne: string}}
 */
const Modes = {
    Strict: "strict",
    Moyenne: "moyenne"
}

/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code
 * Permet de récupérer un élément du DOM en fonction de son id
 * @param id - l'id de l'élément que l'on cherche
 * */
function get(id){
    return document.getElementById(id);
}

/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code
 * Permet de récupérer le premier élément du DOM en fonction du sélecteur donnée en paramètre
 * @param sel - le sélecteur
 */
function _(sel){
    return document.querySelector(sel);
}

/**
 * Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code
 * Créer un élément dont le nom est passé en paramètre
 * @param element - le nom du nouvel élément
 * @returns {*} - l'élément que l'on a créé
 */
function create(element){
    return document.createElement(element);
}

/**
 * Sauvegarde l'attribut 'data' dans le sessionStorage avec pour nom 'name'
 * @param name - Nom d'enregistrement dans le sessionStorage
 * @param data - Données enregistré dans le sessionStorage
 */
function saveData(name, data){
    sessionStorage.setItem(name,data);
}

/**
 * Récupère la valeur de l'objet de nom 'name' dans le sessionStorage
 * @param name - Nom de l'objet dans le sessionStorage
 * @returns {string}
 */
function getData(name){
    return sessionStorage.getItem(name);
}

function clearStorage(){
    sessionStorage.clear();
}

/**
 * Récupère la taille de l'objet 'arr' et la retourne
 * @param arr - Objet dont on veut la taille
 * @returns {number}
 */
Object.size = function(arr)
{
    let size = 0;
    for (let key in arr) {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};