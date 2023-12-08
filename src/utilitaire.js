/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function get(id){
    return document.getElementById(id);
}

/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function _(sel){
    return document.querySelector(sel);
}

/**
 * Créer un element de nom element et le retourne
 * @param element
 * @returns {*}
 */
function create(element){
    return document.createElement(element);
}

/**
 * Classe enumeration des modes de jeu
 * @type {{Strict: string, Moyenne: string}}
 */
const Modes = {
    Strict: "strict",
    Moyenne: "moyenne"
}

/**
 * Sauvegarde l'attribut data dans le sessionStorage avec le nom name
 * @param name - Nom d'enregistrement dans le sessionStorage
 * @param data - Données enregistré dans le sessionStorage
 */
function saveData(name, data){
    sessionStorage.setItem(name,data);
}

/**
 * Recupere la valeur de l'objet de nom name dans le sessionStorage
 * @param name - Nom de l'objet dans le sessionStorage
 * @returns {string}
 */
function getData(name){
    return sessionStorage.getItem(name);
}

/**
 *Recupere la taille de l'objet arr et la retourne
 * @param arr - Objet dont on veut la taille
 * @returns {number}
 */
Object.size = function(arr)
{
    var size = 0;
    for (var key in arr)
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};