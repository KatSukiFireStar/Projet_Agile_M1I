const NomCarte = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "cafe", "interro"];

function chargerFichierJson(evt) {
    console.log("chargerFichierJson");

    const fichierJson = JSON.parse(evt.target.result);
    console.log(fichierJson);
}

function selectionnerFichierJson() {
    console.log("chargerFichier");
    const saisie = document.getElementById('jsonFile');
    
    // Vérifie si un fichier a été sélectionné
    if (saisie.files.length > 0) {
        const fichier = saisie.files[0];

        // Vérifie si le fichier est au format JSON
        if (fichier.type === 'application/json') {
            // Lecture du fichier JSON
            const lecteur = new FileReader();

            lecteur.onload = chargerFichierJson;

            lecteur.readAsText(fichier);
        } else {
            alert('Veuillez sélectionner un fichier JSON valide.');
        }
    } else {
        alert('Veuillez sélectionner un fichier.');
    }
}

window.onload;