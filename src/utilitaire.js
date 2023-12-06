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

function saveData(name, data){
    localStorage.setItem(name,data);
}

function getData(name){ //retourne l'objet de clé "favoris"
    return localStorage.getItem(name)
}