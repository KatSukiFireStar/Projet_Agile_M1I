/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function get(id){
    return document.getElementById(id);
}

/** Fonction "raccourci" pour une opération que l'on va utiliser très souvent dans le code */
function _(sel){
    return document.querySelector(sel);
}

const Modes = {
    Strict: "strict",
    Moyenne: "moyenne"
}

/**
 * Sauvegarde l'attribut data dans le local storage avec le nom name
 * @param name - Nom d'enregistrement dans le local storage
 * @param data - Données enregistré dans le local storage
 */
function saveData(name, data){
    sessionStorage.setItem(name,data);
}

function getData(name){ //retourne l'objet de clé "favoris"
    return sessionStorage.getItem(name)
}