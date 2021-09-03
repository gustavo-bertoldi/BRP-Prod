const urlServeur = "http://brpetude2.ddns.net:8085";

function chargerRapports() {
    return new Promise ((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        $.ajax({
            url: urlServeur + "/recuperer-liste-rapports",
            method: "GET",
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject(reponse.erreur);
            else resolve(reponse);
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    });
}


function supprimerRapport(doc) {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        $.ajax({
            url: urlServeur + "/supprimer-rapport/" + doc,
            method: "DELETE",
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject (reponse.erreur);
            else resolve(reponse);
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    });
}

function ouvrirRapport(nom) {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        $.ajax({
            url: urlServeur + "/ouvrir-rapport/" + nom,
            method: "GET",
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) {
                reject(reponse.erreur);
            } else {
                resolve(reponse);
            }
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    });
}

function creerRapport(rapport) {
    return new Promise ((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const rappStr = JSON.stringify(rapport);
        $.ajax({
            url: urlServeur + "/sauvegarder-rapport",
            method: "POST",
            contentType: "application/json",
            data: rappStr,
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject(reponse.erreur);
            else resolve();
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        }); 
    });
}

function modifierNomRapport(ancienNom, nouveauNom) {
    return new Promise ((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const donnees = JSON.stringify({
            ancienTitre: ancienNom,
            nouveauTitre: nouveauNom
        });
        $.ajax({
            url: urlServeur + "/modifier-nom-rapport",
            method: "PUT",
            contentType: "application/json",
            data: donnees,
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject(reponse.erreur);
            else resolve();
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        }); 
    });
}

function sauvegarderRapportServeur(rapport) {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const rapportStringfied = JSON.stringify(rapport);
        $.ajax({
            url: urlServeur + "/sauvegarder-rapport",
            method: "POST",
            DataType: "json",
            contentType: "application/json",
            data: rapportStringfied,
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            resolve();
        }).fail((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    });
}

function genererWord(nomRapport) {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `${urlServeur}/generer-word/${nomRapport}`);
        xhttp.responseType = "blob";
        xhttp.setRequestHeader("Authorization", `Bearer ${cookie.token}`);
        xhttp.onload = function (e) {
            if (this.status == 200) {
                if (this.response.erreur) reject(this.reponse.erreur);
                else resolve(this.response);
            } else {
                let message = "Erreur de communication avec le serveur."
                if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
                let erreur = {
                    message: message,
                    xhr: xhr
                }
                reject(erreur);
            }
        }
        xhttp.send();
    });
}

function dupliquerRapport(nomRapportSource, nomRapportCopie) {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const donnees = JSON.stringify({
            nomRapportSource: nomRapportSource,
            nomRapportCopie: nomRapportCopie
        });

        $.ajax({
            url: urlServeur + "/dupliquer-rapport",
            method: "POST",
            DataType: "json",
            contentType: "application/json",
            data: donnees,
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            resolve();
        }).catch((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        })
    });
}

function recupererBibliotheque() {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        $.ajax({
            url: urlServeur + "/recuperer-bibliotheque",
            method: "GET",
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject(reponse.erreur);
            else resolve(reponse.bibliotheque);
        }).catch((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    });
}

function sauvegarderBibliotheque() {
    return new Promise((resolve, reject) => {
        const cookie = JSON.parse(getCookie('acces')); //Le cookie contient le token d'accès aux routes du serveur
        const listeArticles = $("div#arborescence-articles > div.niveau");
        const bib = {
            bibliotheque: {
                articles: sauvegarderArticles(listeArticles)
            }
        };
        $.ajax({
            url: urlServeur + "/sauvegarder-bibliotheque",
            method: "POST",
            DataType: "json",
            contentType: "application/json",
            data: JSON.stringify(bib),
            headers: { Authorization: `Bearer ${cookie.token}` } //Nécessaire pour l'authentification de l'utilisateur
        }).done((reponse) => {
            if (reponse.erreur) reject(reponse.erreur);
            else resolve();
        }).catch((xhr) => {
            let message = "Erreur de communication avec le serveur."
            if (xhr.status == 498) message += " Le token d'authentification a expiré, veuillez vous reconnecter.";
            let erreur = {
                message: message,
                xhr: xhr
            }
            reject(erreur);
        });
    })
}
