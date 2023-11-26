let numeroTache = 0;
const listeCartes = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "interro"];
let carteSelectionnee = ""; 

function chargerPartie() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const objetEnJSON = urlParams.get('data');

    return JSON.parse(objetEnJSON);
}

function initialiserPartie() {
    //console.log("APPEL partie()");
    let maPartie = chargerPartie();
    let liste = maPartie['listeTaches'];
    
    let divInfo = document.getElementById('info');

    let h1 = document.createElement('h1');
    h1.innerText = 'Planning Poker - ' + maPartie['nomProjet'];

    let p1 = document.createElement('p');
    p1.innerText = "Tâche : " + liste[numeroTache][0];

    let p2 = document.createElement('p');
    p2.innerText = "Détails de la tâche actuelle : " + liste[numeroTache][1];

    divInfo.append(h1, p1, p2);
    
    let divJoueurCartes = document.getElementById('cartes');
    for(let i=0; i<12; i++) {
        let imgCarte = document.createElement('img');
        imgCarte.src = "./ressources/cartes/cartes_" + listeCartes[i]+".svg";
        imgCarte.width = 75;
        imgCarte.height = 75;
        // écouteurs pour gérer le clic sur la carte
        imgCarte.addEventListener('click', function () {
            carteSelectionnee = listeCartes[i];
            imgCarte.classList.add('carteSelectionnee');
        });
        divJoueurCartes.appendChild(imgCarte);
    }
}

function validerChoix() {
    let divApercu = document.getElementById('apercu');
    
    if (carteSelectionnee !== "") {
        let imgApercu = document.createElement('img');
        imgApercu.src = "./ressources/cartes/cartes_" + carteSelectionnee + ".svg";
        imgApercu.width = 75;
        imgApercu.height = 75;

        divApercu.appendChild(imgApercu);
        
        // faudra faire une liste qui se reset à chaque fois ...
        carteSelectionnee = "";
    } else {
        alert("Veuillez sélectionner une carte avant de valider.");
    }
}

if (typeof window == 'object') {
    window.onload = initialiserPartie;
}