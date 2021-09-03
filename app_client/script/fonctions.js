/**
 * Fonction permettant de récupérer le cookie dont le nom est passé en paramètre
 * @param {string} nom nom du cookie à récupérer
 * @returns {string} - valeur stockée dans le cookie
 */
 function getCookie(nom) {
    var cookie = document.cookie.split(`${nom}=`);
    if (cookie.length == 2) return cookie.pop().split(';').shift();
}

function listerRapports(rapportASelectionner) {
    return new Promise((resolve, reject) => {
        chargerRapports().then((reponse) => {
            let listeRapportsHtml = ``;
            for (let rapp of reponse.rapports) {
                listeRapportsHtml += `
                <div class="liste-rapport-item" title="Ouvrir ce rapport" data-rapp="${rapp}">
                    <svg class="doc-icn" width="25px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M447.229 67.855h-43.181v-43.18C404.049 11.103 392.944 0 379.379 0H64.771C51.2 0 40.097 11.103 40.097 24.675V419.47c0 13.571 11.103 24.675 24.675 24.675h43.181v43.181c0 13.571 11.098 24.675 24.675 24.675h209.729c13.565 0 32.762-7.612 42.638-16.908l68.929-64.882c9.888-9.296 17.969-28.012 17.969-41.583l.012-296.096c-.001-13.573-11.105-24.677-24.676-24.677zM107.951 92.531v333.108h-43.18c-3.343 0-6.168-2.825-6.168-6.168V24.675c0-3.343 2.825-6.168 6.168-6.168H379.38c3.337 0 6.168 2.825 6.168 6.168v43.181H132.626c-13.577 0-24.675 11.103-24.675 24.675zM441.24 416.737l-68.929 64.877c-1.412 1.327-3.251 2.628-5.281 3.867v-56.758c0-4.238 1.709-8.051 4.528-10.888 2.844-2.819 6.656-4.533 10.894-4.533h61.718c-.957 1.3-1.937 2.497-2.93 3.435zm12.145-28.111c0 1.832-.334 3.954-.839 6.168h-70.095c-18.721.037-33.89 15.206-33.928 33.928v64.024c-2.202.445-4.324.746-6.168.746H132.626v.001c-3.35 0-6.168-2.825-6.168-6.168V92.53c0-3.343 2.819-6.168 6.168-6.168h314.602c3.343 0 6.168 2.825 6.168 6.168l-.011 296.096z"/><path d="M379.379 154.216H200.488a9.248 9.248 0 00-9.253 9.253 9.249 9.249 0 009.253 9.253h178.891c5.108 0 9.253-4.139 9.253-9.253s-4.145-9.253-9.253-9.253zM379.379 277.59H200.488a9.248 9.248 0 00-9.253 9.253 9.249 9.249 0 009.253 9.253h178.891a9.252 9.252 0 009.253-9.253 9.251 9.251 0 00-9.253-9.253zM299.187 339.277h-98.698c-5.114 0-9.253 4.139-9.253 9.253s4.139 9.253 9.253 9.253h98.698c5.108 0 9.247-4.139 9.247-9.253s-4.139-9.253-9.247-9.253zM379.379 215.903H200.488c-5.114 0-9.253 4.139-9.253 9.253s4.14 9.253 9.253 9.253h178.891c5.108 0 9.253-4.139 9.253-9.253s-4.145-9.253-9.253-9.253z"/></svg>
                    <span class="doc-nom">${rapp}</span>
                    <svg class="save-icn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.333 469.333" width="25px"><title>Sauvegarder les modifications</title><path d="M466.208 88.458L380.875 3.125c-2-2-4.708-3.125-7.542-3.125H42.667C19.146 0 0 19.135 0 42.667v384c0 23.531 19.146 42.667 42.667 42.667h384c23.521 0 42.667-19.135 42.667-42.667V96a10.665 10.665 0 00-3.126-7.542zM106.667 21.333h234.667v128c0 11.76-9.563 21.333-21.333 21.333H128c-11.771 0-21.333-9.573-21.333-21.333v-128zM384 448H85.333V256H384v192zm64-21.333c0 11.76-9.563 21.333-21.333 21.333h-21.333V245.333a10.66 10.66 0 00-10.667-10.667h-320A10.66 10.66 0 0064 245.333V448H42.667c-11.771 0-21.333-9.573-21.333-21.333v-384c0-11.76 9.563-21.333 21.333-21.333h42.667v128C85.333 172.865 104.479 192 128 192h192c23.521 0 42.667-19.135 42.667-42.667v-128h6.25L448 100.417v326.25z"/><path d="M266.667 149.333h42.667a10.66 10.66 0 0010.667-10.667V53.333a10.66 10.66 0 00-10.667-10.667h-42.667A10.66 10.66 0 00256 53.333v85.333a10.66 10.66 0 0010.667 10.667zM277.333 64h21.333v64h-21.333V64z"/></svg>
                    <div class='conteneur-loader'><div class="loader"></div></div>
                    <svg class="export-icn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25px"><title>Exporter sous format Word</title><g fill="black"><path d="M294.656 13.014a10.667 10.667 0 00-9.045-2.133l-277.333 64A10.668 10.668 0 000 85.377v362.667a10.667 10.667 0 009.045 10.539l277.333 42.667c5.823.895 11.269-3.099 12.164-8.921.082-.535.124-1.076.124-1.617V21.377a10.661 10.661 0 00-4.01-8.363z"/><path d="M501.334 458.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h202.667V74.71H288c-5.891 0-10.667-4.776-10.667-10.667S282.109 53.377 288 53.377h213.333c5.891 0 10.667 4.776 10.667 10.667v384c0 5.891-4.775 10.666-10.666 10.666z"/></g><path d="M181.334 352.044a10.666 10.666 0 01-10.24-7.723L138.667 230.87 106.24 344.321c-2.342 5.661-8.83 8.352-14.492 6.01a11.092 11.092 0 01-6.01-6.01L43.072 194.988c-1.786-5.614 1.318-11.612 6.932-13.398 5.614-1.786 11.612 1.318 13.398 6.932.063.198.12.398.172.599L96 302.55l32.427-113.45c2.342-5.661 8.83-8.352 14.492-6.01a11.092 11.092 0 016.01 6.01l32.405 113.451 32.427-113.429c1.535-5.614 7.331-8.921 12.945-7.386l.239.068c5.66 1.622 8.935 7.523 7.317 13.184l-42.667 149.333a10.667 10.667 0 01-10.261 7.723z" fill="#fafafa"/><g fill="black"><path d="M458.667 138.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h170.667c5.891 0 10.667 4.776 10.667 10.667 0 5.892-4.776 10.667-10.667 10.667zM458.667 202.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h170.667c5.891 0 10.667 4.776 10.667 10.667s-4.776 10.667-10.667 10.667zM458.667 266.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h170.667c5.891 0 10.667 4.776 10.667 10.667 0 5.892-4.776 10.667-10.667 10.667zM458.667 330.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h170.667c5.891 0 10.667 4.776 10.667 10.667 0 5.892-4.776 10.667-10.667 10.667zM458.667 394.71H288c-5.891 0-10.667-4.776-10.667-10.667s4.776-10.667 10.667-10.667h170.667c5.891 0 10.667 4.776 10.667 10.667 0 5.892-4.776 10.667-10.667 10.667z"/></g></svg>
                    <svg class="copy-icn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368.008 368.008" width="25px"><title>Dupliquer ce rapport</title><path d="M368 88.004a8 8 0 00-.6-2.976c-.152-.376-.416-.664-.624-1.016-.272-.456-.472-.952-.832-1.352l-72.008-80a7.98 7.98 0 00-5.944-2.656h-136c-13.232 0-24 10.768-24 24v40H24c-13.232 0-24 10.768-24 24v256c0 13.232 10.768 24 24 24h192c13.232 0 24-10.768 24-24v-40h104c13.232 0 24-10.768 24-24v-175.96c0-.016.008-.024.008-.04l-.008-16zm-144 256c0 4.408-3.592 8-8 8H24c-4.408 0-8-3.592-8-8v-256c0-4.408 3.592-8 8-8h104v88c0 4.416 3.584 8 8 8h88v168zm0-184h-80v-80h4.688L224 155.324v4.68zm128 120c0 4.416-3.592 8-8 8H240v-119.64c0-.12.008-.24.008-.36l-.008-16v-.024a7.942 7.942 0 00-2.184-5.464c0-.016-.024-.016-.016-.016 0 0-.008-.008-.008-.016a.017.017 0 01-.016-.016l-.112-.112-80-80A8.019 8.019 0 00152 64.004h-8.008v-40c0-4.408 3.592-8 8-8h112v88c0 4.416 3.584 8 8 8H352v168zm0-184h-72.008v-80h4.44L352 91.076v4.928z"/></svg>
                    <svg class="trash-icn" data-doc="${rapp}" viewBox="-40 0 427 427.00131" width="25px" xmlns="http://www.w3.org/2000/svg"><title>Supprimer ce rapport</title><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg>
                </div>
                `;
            }

            $("div.contenu-menu-rapports div.liste-rapports").html(listeRapportsHtml);

            $("div.liste-rapport-item svg.trash-icn").on("click", function (evt) {
                evt.stopPropagation();
                $("div#supprimer-rapport-modal").css("display", "block");
                $("span#supprimer-projet-modal-desc-nom-projet").html($(this).data("doc"));
                $("button#supprimer-rapport-confirmer").off();
                const rappASupprimer = $(this).data("doc");
                $("button#supprimer-rapport-confirmer").on("click", function () {
                    const btn = this;
                    $(btn).parent().hide();
                    $("div#supprimer-rapport-loader").removeClass("masque");
                    supprimerRapport(rappASupprimer).then((valResolue) => {
                        listerRapports();
                        $("div#supprimer-rapport-modal").fadeOut(200, () => {
                            $("div#supprimer-rapport-loader").addClass("masque");
                            $(btn).parent().show();
                        });
                    }).catch((err) => {
                        afficherErreurModal(err);
                    });
                });
            });

            $("div.liste-rapport-item svg.save-icn").on("click", function (evt) {
                evt.stopPropagation();
                //Afficher roue de chargement et fond
                const rapportItem = $(this).parent();
                $(rapportItem).find("svg.save-icn").hide();
                $(rapportItem).find("div.conteneur-loader").show();
                $("div#menu-editeur-sauvegarde").show();

                sauvegarderRapport().then(() => {
                    
                }).catch((err) => {
                    afficherErreurModal(err);
                }).finally(() => {
                    $(rapportItem).find("div.conteneur-loader").hide();
                    $(rapportItem).find("svg.save-icn").show();
                    $("div#menu-editeur-sauvegarde").hide();
                }); 
            });

            $("div.liste-rapport-item svg.export-icn").on("click", function(evt) {
                evt.stopPropagation();
                const nomFichier = $(this).parent().data("rapp");
                genererWord(nomFichier).then((reponse) => {
                    saveAs(new Blob([reponse], {type: "application/octet-stream"}), nomFichier + ".docx");
                }).catch((err) => {
                    afficherErreurModal(err);
                });
            });

            $("div.liste-rapport-item svg.copy-icn").on("click", function(evt) {
                evt.stopPropagation();
                const nomRapportSource = $(this).parent().data("rapp");

                $("div#dupliquer-rapport-modal").css("display", "block");
                $("input#dupliquer-rapport-nom").on("keyup", function() {
                    const mauvaisCaracteres = /[\\/:"*?<>|.]+/;
                    const valeurCourante = $(this).val();
                    $("button#dupliquer-rapport-confirmer").attr("disabled", "");
                    $(this).siblings("span.dupliquer-rapport-erreur").hide();
                    if (mauvaisCaracteres.test(valeurCourante)) $(this).siblings("span#dupliquer-rapport-erreur-char").show();
                    else if (listeRapportsCourante.rapports.includes(valeurCourante)) $(this).siblings("span#dupliquer-rapport-erreur-nom-existe").show();
                    else if (valeurCourante != "") $("button#dupliquer-rapport-confirmer").removeAttr("disabled");
                });

                $("button#dupliquer-rapport-confirmer").on("click", function() {
                    $("div#dupliquer-rapport-modal-boutons").hide();
                    $("div#dupliquer-rapport-loader").show();
                    const nomRapportCopie = $("input#dupliquer-rapport-nom").val(); 
                    dupliquerRapport(nomRapportSource, nomRapportCopie).then(() => {
                        $("div#dupliquer-rapport-modal-boutons").show();
                        $("div#dupliquer-rapport-loader").hide();
                        $("div#dupliquer-rapport-modal span.modal-fermer").trigger("click");
                        listerRapports().catch((err) => {
                            afficherErreurModal(err);
                        });
                    }).catch((err) => {
                        afficherErreurModal(err);
                    });
                });
            });

            $("div.liste-rapport-item").on("click", function (evt) {
                if ($("div.titre").length > 0 && $("div.titre").not(".sauvegarde").length > 0) {
                    afficherModalSauvegarderModifications(this);
                } else {
                    selectionnerRapport(this);
                }
            });

            if (rapportASelectionner) $(`div.liste-rapport-item[data-rapp="${rapportASelectionner}"]`).trigger("click");

            resolve(reponse);
        }).catch((err) => {
            afficherErreurModal(err);
            reject(err);
        });
    });
}

function selectionnerRapport(rapport) {
    $("div.liste-rapport-item.selectionne").removeClass("selectionne");
    $("div.titre").remove();
    genererHtmlRapport($(rapport).data("rapp"));
    $(rapport).addClass("selectionne");
    const btnSauvegarder = $(rapport).find("svg.save-icn");
    btnSauvegarder.css("visibility", "visible");
    $("svg.save-icn").not(btnSauvegarder).css("visibility", "hidden");
}

function afficherModalSauvegarderModifications(rapportClique) {

    //On supprime les anciens écouteurs por en ajouteur des nouveaux conecernant le titre cliqué
    $("button#sauvegarder-modifications-annuler").off();
    $("button#sauvegarder-modifications-confirmer").off();

    //Bouton annuler - Rejette les modifications apportées au rapport courant
    $("button#sauvegarder-modifications-annuler").on("click", function () {
        $("div#sauvegarder-modifications-modal").hide();
        selectionnerRapport(rapportClique);
    });

    //Bouton enregistrer - Enregistre d'abord les modifications apportées au rapport courant et puis ouvre le nouveau rapport
    $("button#sauvegarder-modifications-confirmer").on("click", function () {
        //Affcihe la roue de chargement lors de la sauvegarde du rapport
        $("div#sauvegarder-modifications-modal div.conteneur-loader").removeClass("masque");
        $("div#sauvegarder-modifications-modal div.sauvegarder-modifications-modal-boutons").hide();

        sauvegarderRapport().then((reponse) => {
            $("div#sauvegarder-modifications-modal").hide();
            $("div#sauvegarder-modifications-modal div.conteneur-loader").addClass("masque");
            $("div#sauvegarder-modifications-modal div.sauvegarder-modifications-modal-boutons").show();
            selectionnerRapport(rapportClique);
        }).catch((err) => {
            afficherErreurModal(err);
        });
    });

    //Affiche le popup
    $("div#sauvegarder-modifications-modal").css("display", "block");
}

function getIndexTitre(titre) {
    if (titre.hasClass("titre-1")) return 1;
    else if (titre.hasClass("titre-2")) return 2;
    else if (titre.hasClass("titre-3")) return 3;
    else if (titre.hasClass("titre-4")) return 4;
    else return 0;
}

function convertirEnRoumain(num) {
    var roumain = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    var str = '';

    for (var i of Object.keys(roumain)) {
        var q = Math.floor(num / roumain[i]);
        num -= q * roumain[i];
        str += i.repeat(q);
    }
    return str;
}

function numeroterChapitres() {
    let index1 = 1;
    $("div#editeur-rapport").find(".titre-1").each( function() {
        let texteIndex1 = convertirEnRoumain(index1) + ".";
        $(this).find(".index").html(texteIndex1);
        $(this).data("chapitre",index1);
        let index2 = 1;
        $(this).find(".titre-2").each( function() {
            let texteIndex2 = texteIndex1 + index2 + ".";
            $(this).find(".index").html(texteIndex2);
            $(this).data("chapitre",index2);
            let index3 = 1;
            $(this).find(".titre-3").each( function() {
                let texteIndex3 = index2 + "." + index3 + ".";
                $(this).find(".index").html(texteIndex3);
                $(this).data("chapitre",index3);
                let index4 = 1;
                $(this).find(".titre-4").each( function() {
                    texteIndex4 = texteIndex3 + index4 + ".";
                    $(this).find(".index").html(texteIndex4);
                    $(this).data("chapitre",index4);
                    index4++;
                });
                index3++;
            });
            index2++;
        });
        index1++;
    });
}

function creerTitre(index, titreSource) {

    let dpdwContenuHtml = ``;
    if (index == 1) dpdwContenuHtml = `<a data-index="1">Titre 1</a><a data-index="2">Titre 2</a>`;
    else if (index == 2) dpdwContenuHtml = `<a data-index="2">Titre 2</a><a data-index="3">Titre 3</a>`;
    else if (index == 3) dpdwContenuHtml = `<a data-index="3">Titre 3</a><a data-index="4">Titre 4</a>`;
    else if (index == 4) dpdwContenuHtml = `<a data-index="4">Titre 4</a>`;

    if (!titreSource) titreSource = $("#editeur-rapport");

    const titreHtml = `
    <div class="titre titre-${index}" data-index="${index}">
        <div class="titre-contenu">
            <span class="index"></span>
            <input class="titre-input" placeholder="Titre ${index}"/>
            <div class="ajouter-titre-dpdw">
                <div class="btn-ajouter-titre" title="Ajouter un titre"><svg class="ajouter-titre" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" height="25" width="25"><path d="M64 0a64 64 0 1064 64A64.07 64.07 0 0064 0zm0 122a58 58 0 1158-58 58.07 58.07 0 01-58 58z"/><path d="M90 61H67V38a3 3 0 00-6 0v23H38a3 3 0 000 6h23v23a3 3 0 006 0V67h23a3 3 0 000-6z"/></svg></div>
                <div class="dpdw-contenu masque">${dpdwContenuHtml}</div>
            </div>
            <div class="btn-supprimer-titre" title="Supprimer ce titre et son contenu"><svg class="supprimer-titre" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" height="25" width="25"><path d="M64 0a64 64 0 1064 64A64.07 64.07 0 0064 0zm0 122a58 58 0 1158-58 58.07 58.07 0 01-58 58z"/><path d="M92.12 35.79a3 3 0 00-4.24 0L64 59.75l-23.87-24A3 3 0 0035.88 40l23.88 24-23.88 24a3 3 0 004.25 4.24L64 68.25l23.88 24A3 3 0 0092.13 88L68.24 64l23.89-24a3 3 0 00-.01-4.21z"/></svg></div>
            <div class="texte has-hover" title="Cliquez pour ouvrir l'éditeur">
                <div class="editeur"></div>
            </div>
        </div>
        ${index < 4 ? "<div class='soustitres'></div>" : ""}
    </div>`;

    const indexTitreSource = $(titreSource).data("index");
    var titreInsere = undefined;

    if (indexTitreSource == 0) {
        $(titreSource).append(titreHtml);
        titreInsere = $(titreSource).find(`div.titre`);
    } else if (index == indexTitreSource) {
        $(titreSource).after(titreHtml);
        titreInsere = $(titreSource).next();
    } else {
        $(titreSource).children("div.soustitres").append(titreHtml);
        titreInsere = $(titreSource).children("div.soustitres").children("div.titre").last();
    }

    const conteneurEditeur = $(titreInsere).children("div.titre-contenu").find("div.editeur")[0];
    let quill = new Quill(conteneurEditeur, quillParams);
    conteneurEditeur.__quill = quill;

    //Ajout de la fonction au bouton ajouter un titre - montrer le menu pour choisir l'indice du titre à ajouter
    $(titreInsere).children("div.titre-contenu").find("svg.ajouter-titre").on("click", function() {
        const dpdwContenu = $(this).parent().next();
        if (dpdwContenu.hasClass("masque")) dpdwContenu.removeClass("masque");
        else dpdwContenu.addClass("masque");
    });

    //Ajout de la fonction aux titres disponibles dans le menu ajouter un titre
    $(titreInsere).children("div.titre-contenu").find("div.dpdw-contenu a").on("click", function() {
        const indiceClique = $(this).data("index");
        creerTitre(indiceClique, titreInsere);
    });

    //Ajout de la fonction au bouton supprimer titre
    $(titreInsere).children("div.titre-contenu").find("svg.supprimer-titre").on("click", function() {
        titreInsere.remove();
        if ($("div#editeur-rapport div.titre").length == 0) {
            $("div#editeur-rapport div.aucun-titre").css("display","flex");
        }
        else numeroterChapitres();
    });

    //Ajout du bouton sauvegarder à la barre d'outils de l'éditeur et sa fonction
    const editeurTitreInsere = $(titreInsere).children("div.titre-contenu").find("div.texte");
    editeurTitreInsere.removeAttr("title");
    editeurTitreInsere.find("div.ql-toolbar").append(`<span class="btn-sauvegarder-texte">Sauvegarder</span>`);
    editeurTitreInsere.find("span.btn-sauvegarder-texte").on("click", function() {
        $(this).parent().hide();
        $(this).parent().siblings("div.editeur").css("border", "none");
        $(this).parent().parent().attr("title", "Cliquez pour ouvrir l'éditeur");
        $(titreInsere).data("contenu", JSON.stringify(quill.getContents()));
        $(titreInsere).addClass("sauvegarde");
        sauvegarderRapport();
    });

    //Ajout de la fonction qui montre l'éditeur lorsque l'utilisateur clique sur son texte
    $(titreInsere).children("div.titre-contenu").find("div.editeur").on("click", function() {
        if (quill.hasFocus()) {
            $(this).siblings("div.ql-toolbar").show();
            $(this).css("border","");
            $(this).parent().removeAttr("title");
            $(titreInsere).removeClass("sauvegarde");
        }
    });

    $(titreInsere).children("div.titre-contenu").children("input.titre-input").on("focus", function() {
        $(this).data("titre", $(this).val());
    });
    $(titreInsere).children("div.titre-contenu").children("input.titre-input").on("blur", function() {
        if ($(this).val() != $(this).data("titre")) $(this).parent().parent().removeClass("sauvegarde");
    });


    //Ajout de la fonction drop pour ajouter le contenu des articles de la bibliothèque
    $(conteneurEditeur).on("dragover", function (evt) {
        evt.preventDefault();
        $(this).siblings("div.ql-toolbar").show();
        $(this).css("border", "");
        $(this).parent().removeAttr("title");
        $(titreInsere).removeClass("sauvegarde");

    });
    $(conteneurEditeur).on("drop", function (evt) {
        evt.preventDefault();
        const contenu = JSON.parse(evt.originalEvent.dataTransfer.getData("text/plain"));
        const delta = new Delta(contenu);
        quill.setContents(delta, "api");

    });



    numeroterChapitres();

    return {
        quill: quill,
        titreInsere: titreInsere
    };
}

function sauvegarderRapport() {
    return new Promise((resolve, reject) => {
        //Sauvegarder tous les titres qui ne le sont pas encore
        $("div.titre").each(function() {
            const quill = $(this).children("div.titre-contenu").children("div.texte").children("div.editeur")[0].__quill;
            const editeurTitre = $(this).children("div.titre-contenu").find("div.texte");
            $(editeurTitre).find("div.ql-toolbar").hide();
            $(editeurTitre).find("div.editeur").css("border", "none");
            $(editeurTitre).attr("title", "Cliquez pour ouvrir l'éditeur");
            $(this).data("contenu", JSON.stringify(quill.getContents()));
            $(this).addClass("sauvegarde");   
        });

        const nom = $("input#infos-projet-nom").val();
        const ref = $("input#infos-projet-ref").val();
        const client = $("input#infos-projet-client").val();
        const infosLivrable = {
            nom: $("input#infos-livrable-nom").val(),
            phase: $("input#infos-livrable-phase").val(),
            version: $("input#infos-livrable-version").val(),
            date: $("input#infos-livrable-date").val()
        }
        var docJson = {
            nom: nom,
            ref: ref,
            client: client,
            infosLivrable: infosLivrable,
            titres: []
        };


        $("div.titre-1").each(function() {
            const titre1Courant = this;
            let objTitre1 = {
                titre: $(titre1Courant).children("div.titre-contenu").find("input.titre-input").first().val() || "Titre 1",
                contenu: $(titre1Courant).data("contenu"),
                index: $(titre1Courant).data("index"),
                titre2: []
            };

            $(titre1Courant).children("div.soustitres").find("div.titre-2").each( function() {
                const titre2Courant = this;
                let objTitre2 = {
                    titre: $(titre2Courant).children("div.titre-contenu").find("input.titre-input").first().val() || "Titre 2",
                    contenu: $(titre2Courant).data("contenu"),
                    index: $(titre2Courant).data("index"),
                    titre3: []
                };

                $(titre2Courant).children("div.soustitres").find("div.titre-3").each( function() {
                    const titre3Courant = this;
                    let objTitre3 = {
                        titre: $(titre3Courant).children("div.titre-contenu").find("input.titre-input").first().val() || "Titre 3",
                        contenu: $(titre3Courant).data("contenu"),
                        index: $(titre3Courant).data("index"),
                        titre4: []
                    };

                    $(titre3Courant).children("div.soustitres").find("div.titre-4").each( function() {
                        const titre4Courant = this;
                        let objTitre4 = {
                            titre: $(titre4Courant).children("div.titre-contenu").find("input.titre-input").first().val() || "Titre 4",
                            contenu: $(titre4Courant).data("contenu"),
                            index: $(titre4Courant).data("index")
                        };

                        objTitre3.titre4.push(objTitre4);
                    });

                    objTitre2.titre3.push(objTitre3);
                });

                objTitre1.titre2.push(objTitre2);
            });

            docJson.titres.push(objTitre1);
        });


        sauvegarderRapportServeur(docJson).then((reponse) => {
            resolve();
        }).catch((err) => {
            afficherErreurModal(err);
            reject(err);
        });
    });
}

function genererHtmlRapport(nomRapport) {
    $("div#menu-editeur-ouverture").css("display","flex");
    ouvrirRapport(nomRapport).then((rapport) => { 
        $("div#editeur-rapport div.aucun-rapport").addClass("masque");
        $("input#titre-rapport").val(rapport.nom);
        if (rapport.titres.length == 0) {
            $("div#editeur-rapport div.aucun-titre").css("display","flex");
            $("div#editeur-rapport div.aucun-titre").removeClass("masque");
        }
        else $("div#editeur-rapport div.aucun-titre").hide();

        let titreInsere = undefined;
        let quill = undefined;
        let delta = undefined;

        for (let titre1 of rapport.titres) {
            ({quill, titreInsere} = creerTitre(1, titreInsere));
            if (titre1.contenu) {
                titre1.contenu = JSON.parse(titre1.contenu);
                delta = new Delta(titre1.contenu);
                quill.setContents(delta, "api");
            }
            $(titreInsere).children("div.titre-contenu").children("input.titre-input").val(titre1.titre);
            $(titreInsere).children("div.titre-contenu").children("input.titre-input").data("titre", titre1.titre);

            let titre1Courant = titreInsere;

            for (let titre2 of titre1.titre2) {
                ({quill, titreInsere} = creerTitre(2, titre1Courant));
                if (titre2.contenu) {
                    titre2.contenu = JSON.parse(titre2.contenu);
                    delta = new Delta(titre2.contenu);
                    quill.setContents(delta, "api");
                }
                $(titreInsere).children("div.titre-contenu").children("input.titre-input").val(titre2.titre);
                $(titreInsere).children("div.titre-contenu").children("input.titre-input").data("titre", titre2.titre);
                let titre2Courant = titreInsere;

                for (let titre3 of titre2.titre3) {
                    ({quill, titreInsere} = creerTitre(3, titre2Courant));
                    if (titre3.contenu) {
                        titre3.contenu = JSON.parse(titre3.contenu);
                        delta = new Delta(titre3.contenu);
                        quill.setContents(delta, "api");
                    }
                    $(titreInsere).children("div.titre-contenu").children("input.titre-input").val(titre3.titre);
                    $(titreInsere).children("div.titre-contenu").children("input.titre-input").data("titre", titre3.titre);
                    let titre3Courant = titreInsere;

                    for (let titre4 of titre3.titre4) {
                        ({quill, titreInsere} = creerTitre(4, titre3Courant));
                        if (titre4.contenu) {
                            titre4.contenu = JSON.parse(titre4.contenu);
                            delta = new Delta(titre4.contenu);
                            quill.setContents(delta, "api");
                        }
                        $(titreInsere).children("div.titre-contenu").children("input.titre-input").val(titre3.titre);
                        $(titreInsere).children("div.titre-contenu").children("input.titre-input").data("titre", titre3.titre);
                    }
                }
            }
        }

        $("div#menu-editeur div.titre div.ql-toolbar.ql-snow").hide();
        $("div#menu-editeur div.titre div.editeur").css("border","none");
        $("div#menu-editeur div.titre div.texte").attr("title","Cliquez pour ouvrir l'éditeur");
        $("div#menu-editeur div.titre").addClass("sauvegarde");
        $("input#titre-rapport").removeAttr("disabled");
        $("div#menu-editeur-ouverture").hide();

        $("div.contenu-menu-infos > div.conteneur-infos").show();
        $("div.contenu-menu-infos > div.aucun-rapport").hide();
        $("input#infos-projet-nom").val(rapport.nom);
        $("input#infos-projet-ref").val(rapport.ref);
        $("input#infos-projet-client").val(rapport.client);
        $("input#infos-livrable-nom").val(rapport.infosLivrable.nom);
        $("input#infos-livrable-phase").val(rapport.infosLivrable.phase);
        $("input#infos-livrable-version").val(rapport.infosLivrable.version);
        $("input#infos-livrable-date").val(rapport.infosLivrable.date);
       
        

    }).catch((err) => {
        afficherErreurModal(err);
    });
}

function insererHtmlArticle(articles, niveau) {
    
    for (let article of articles) {
        if (article.contenu) {
            const html = `<div class="conteneur-item-bibliotheque" title="Cliquez pour modifier cet article. Glissez-le pour l'ajouter dans le rapport." draggable="true"><span class="item-bibliotheque-bullet">&bull;</span><span class="item-bibliotheque">${article.titre}</span><svg class="supprimer-article" height="20px" viewBox="-40 0 427 427.00131" width="20px" xmlns="http://www.w3.org/2000/svg"><title>Supprimer cet article</title><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg></div>`;
            $(niveau).children("div.liste-articles").append(html);
            let conteneurItemBibliotheque = $(niveau).children("div.liste-articles").find("div.conteneur-item-bibliotheque").last();
            conteneurItemBibliotheque.data("contenu", article.contenu);
            conteneurItemBibliotheque.data("titre", article.titre);
            conteneurItemBibliotheque.children("svg.supprimer-article").on("click", function(evt) {
                evt.stopPropagation();
                supprimerItemModal($(this).parent());
            });
            conteneurItemBibliotheque.on("dragstart", function (evt) {
                const contenu = $(this).data("contenu");
                evt.originalEvent.dataTransfer.setData("text/plain", contenu);
            });

            conteneurItemBibliotheque.on("click", function (evt) {
                afficherModifierArticle($(this));
            });

        } else {
            const html = `<h3>${article.titre}<span class="item-bibliotheque-boutons"><svg class="creer-article-icn" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><title>Créer un nouvel article dans ce niveau</title><path d="M64 0a64 64 0 1064 64A64.07 64.07 0 0064 0zm0 122a58 58 0 1158-58 58.07 58.07 0 01-58 58z"/><path d="M90 61H67V38a3 3 0 00-6 0v23H38a3 3 0 000 6h23v23a3 3 0 006 0V67h23a3 3 0 000-6z"/></svg><svg class="supprimer-item-arborescence" height="20px" viewBox="-40 0 427 427.00131" width="20px" xmlns="http://www.w3.org/2000/svg"><title>Supprimer cet item et son contenu</title><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg></span></h3><div class="niveau"><div class="liste-articles"></div><div class="accordion"></div></div>`;
            $(niveau).children("div.accordion").append(html);
            let conteneurItemArborescence = $(niveau).children("div.accordion").find("h3").last();
            conteneurItemArborescence.data("titre", article.titre);
            $(niveau).children("div.accordion").children("h3").last().append(`<input class="item-arborescence-rennomage"/>`);

            let niveauCourant = $(niveau).children(`div.accordion`).children("h3").last().next();
            insererHtmlArticle(article.articles, niveauCourant);
        }
    }
}

function genererHtmlBibliotheque() {
    return new Promise((resolve, reject) => {
        recupererBibliotheque().then((bibliotheque) => {
            $("div#arborescence-articles").html(`<div class="niveau"><div class="liste-articles"></div><div class="accordion"></div></div>`);
            let niveauCourant = $("div#arborescence-articles div.niveau").first();
            insererHtmlArticle(bibliotheque.articles, niveauCourant);

            //Ajout des evenements
            const accordionEvents = "blur click dblclick focus focusin focusout keydown mousedown mouseout mouseover mouseup remove selectionchange";
            $("svg.creer-article-icn, svg.supprimer-item-arborescence, input.item-arborescence-rennomage").bind(accordionEvents, function(evt) {
                evt.stopPropagation();
            });
            $("span.item-bibliotheque-boutons > svg.creer-article-icn").on("click", function() {
                parentCreerArticle = $(this).parent().parent();
                $("input#creer-article-type-groupe").trigger("click");
                $("#contenu-menu").children().hide();
                $("input#creer-article-titre").val("");
                $("#contenu-menu .contenu-menu-bibliotheque-creer-article").show();
            });

            $("span.item-bibliotheque-boutons > svg.supprimer-item-arborescence").on("click", function() {
                item = $(this).parent().parent();
                supprimerItemModal(item);
            });

            $("input.item-arborescence-rennomage").on("focus", function() {
                this.select();
            });
            $("input.item-arborescence-rennomage").on("blur", function() {
                const ancienTitre = $(this).parent().data("titre");
                const titre = $(this).val();
    
                if (ancienTitre != titre) {
                    $("body").css("cursor","progress");
                    $(this).parent().data("titre", titre);
                    sauvegarderBibliotheque().then(() => {
                        $(this).parent().contents()[1].textContent = titre;
                    }).catch((err) => {
                        $(this).parent().contents()[1].textContent = ancienTitre;
                        $(this).parent().data("titre", ancienTitre);
                        afficherErreurModal(err);
                    }).finally(() => {
                        $(this).hide();
                        $("body").css("cursor","default");
                    });
                } else {
                    $(this).parent().contents()[1].textContent = ancienTitre;
                    $(this).hide();
                }
            });

            $("div.accordion > h3").on("dblclick", function () {
                const titre = $(this).data("titre");
                $(this).children("input.item-arborescence-rennomage").css("display", "inline-block");
                $(this).children("input.item-arborescence-rennomage").val(titre);
                $(this).children("input.item-arborescence-rennomage").focus();
                $(this).contents()[1].textContent = "";
            });
            
            
            $("div#arborescence-articles .accordion").accordion({
                collapsible: true,
                heightStyle: "content",
                active: false
            });
            
            resolve();

        }).catch((err) => {
            afficherErreurModal(err);
            reject(err);
        });
    });
}

function sauvegarderArticles(articles) {
    var listeArticles = [];

    $(articles).children("div.liste-articles").find("div.conteneur-item-bibliotheque").each(function() {
        listeArticles.push({
            titre: $(this).data("titre"),
            contenu: $(this).data("contenu")
        });
    });

    $(articles).children("div.accordion").children("h3").each(function() {
        let articleCourant = {
            titre: $(this).data("titre"),
            articles: []
        }
        articleCourant.articles = sauvegarderArticles($(this).next());
        listeArticles.push(articleCourant);
    });

    return listeArticles;
}

function creerArticle(parent, type, titre, contenu) {
    return new Promise((resolve, reject) => {
        $("div.ui-accordion").accordion("destroy");
        if (type =="groupe") {
            const html = `<h3 data-titre="${titre}">${titre}<span class="item-bibliotheque-boutons"><svg class="creer-article-icn" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><title>Créer un nouvel article dans ce niveau</title><path d="M64 0a64 64 0 1064 64A64.07 64.07 0 0064 0zm0 122a58 58 0 1158-58 58.07 58.07 0 01-58 58z"/><path d="M90 61H67V38a3 3 0 00-6 0v23H38a3 3 0 000 6h23v23a3 3 0 006 0V67h23a3 3 0 000-6z"/></svg></span></h3><div class="niveau"><div class="liste-articles"></div><div class="accordion"></div></div>`;
            if (parent) $(parent).next().children("div.accordion").append(html);
            else $("div#arborescence-articles > div.niveau > div.accordion").append(html);
        } else if (type == "article") {
            const html = `<div class="conteneur-item-bibliotheque" data-titre="${titre}"><span class="item-bibliotheque-bullet">&bull;</span><span class="item-bibliotheque">${titre}</span><svg class="supprimer-item-arborescence" height="25px" viewBox="-40 0 427 427.00131" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg></div>`;
            if (parent) {
                $(parent).next().children("div.liste-articles").append(html);
                $(parent).next().children("div.liste-articles").find("div.conteneur-item-bibliotheque").last().data("contenu",contenu);
            }
            else {
                $("div#arborescence-articles > div.niveau > div.liste-articles").append(html);
                $("div#arborescence-articles > div.niveau > div.liste-articles > div.conteneur-item-bibliotheque").last().data("contenu", contenu);
            } 
        }
        
        sauvegarderBibliotheque().then(() => {
            genererHtmlBibliotheque().then(() => {
                resolve();
            }).catch((err) => {
                afficherErreurModal(err);
                reject();
            });
        }).catch((err) => {
            afficherErreurModal(err);
            reject();
        });
        
    });    
}


function afficherModifierArticle(conteneurItemBibliotheque) {
    $("input#creer-article-type-article").trigger("click");
    const quillEditeur = $("div.editeur-creer-article")[0].__quill;
    $("button#creer-article-confirmer").hide();
    $("button#sauvegarder-modifications-article").show();
    $("button#sauvegarder-modifications-article").off();
    $("button#sauvegarder-modifications-article").on("click", function () {
        sauvegarderModificationsArticle(conteneurItemBibliotheque, quillEditeur).then(() => {
            genererHtmlBibliotheque().then(() => {
                $("#contenu-menu").children().hide();
                $("#contenu-menu .contenu-menu-bibliotheque").show();  
            }).catch((err) => afficherErreurModal(err));
        }).catch((err) => afficherErreurModal(err));
    });
    $("input#creer-article-type-groupe").attr("disabled", "");
    $("input#creer-article-titre").val($(conteneurItemBibliotheque).data("titre"));
    const delta = new Delta(JSON.parse($(conteneurItemBibliotheque).data("contenu")));
    quillEditeur.setContents(delta);
    $("#contenu-menu").children().hide();
    $("#contenu-menu .contenu-menu-bibliotheque-creer-article").show();
}

function sauvegarderModificationsArticle(conteneurItemBibliotheque, quillEditeur) {
    return new Promise((resolve, reject) => {
        $("div.creer-article-conteneur-boutons").hide();
        $("div#creer-article-loader").show();
        const contenuModifie = JSON.stringify(quillEditeur.getContents());
        const titreModifie = $("input#creer-article-titre").val();
        $(conteneurItemBibliotheque).data("contenu", contenuModifie);
        $(conteneurItemBibliotheque).data("titre", titreModifie);
        sauvegarderBibliotheque()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                afficherErreurModal(err);
                reject(err);
            })
            .finally(() => {
                $("div#creer-article-loader").hide();
                $("div.creer-article-conteneur-boutons").show();
                $("input#creer-article-type-groupe").removeAttr("disabled");
                $("button#sauvegarder-modifications-article").hide();
            });
    });
}

function supprimerItemModal(item) {
    
    const titre = $(item).data("titre");
    $("span#supprimer-item-bibliotheque-titre").html(titre);
    $("div#supprimer-item-bibliotheque-modal").css("display","block");
    $("button#supprimer-item-confirmer").off();

    $("button#supprimer-item-confirmer").on("click", {itemClique: item}, function(evt) {
        $("div.supprimer-item-bibliotheque-modal-boutons").hide();
        $("div#supprimer-item-loader").show();

        if ($(evt.data.itemClique).hasClass("conteneur-item-bibliotheque")) {
            $(evt.data.itemClique).remove();
        } else {
            $(evt.data.itemClique).next().remove();
            $(evt.data.itemClique).remove();
        }

        sauvegarderBibliotheque().then(() => {
            genererHtmlBibliotheque().then(() => {
                $("div#supprimer-item-loader").hide();
                $("div.supprimer-item-bibliotheque-modal-boutons").show();
                $("button#supprimer-item-annuler").trigger("click");
            }).catch((err) => {
                afficherErreurModal(err);
            });
        }).catch((err) => {
            afficherErreurModal(err);
        });
    });
}

function afficherErreurModal(err) {
    console.log(err);
    $("span#erreur-modal-description").html(err.message);
    $("div#erreur-modal").fadeIn(200);
}


