const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const docx = require("docx");
const jwt = require('jsonwebtoken');
const _ = require("lodash");

dotenv.config();

/**
 * Variables de l'application
 */
var app = express();
const port = process.env.SERVER_PORT || '8080';
const cheminRapports = process.env.RAPPORTS_PATH || "./Rapports/";
const cheminIndices = process.env.INDICES_PATH || "./Indice/";
const cheminFichiersWord = process.env.WORD_FILES_PATH || "./Word/";
const cheminFichiersTemp = process.env.TEMP_FILES_PATH || "./tmp/";
const cheminBibliotheque = process.env.BIBLIOTHEQUE_PATH || "./Bibliotheque/bible.json";
const cheminUtilisateurs = process.env.UTILISATEURS_PATH || "./Utilisateurs/utilisateurs.json";
const extRapports = process.env.EXT_RAPPORTS || ".ecorapp";
const extIndices = process.env.EXT_INDICES || ".ecoind"
const nomFicIndices = (process.env.FIC_INDICES || "ind") + extIndices;

/**
* Configuration de l'app
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



fs.mkdir(cheminRapports, (err) => {
    if (err && err.code != "EEXIST") console.log(err);
});


fs.mkdir(cheminIndices, (err) => {
    if (err && err.code != "EEXIST") console.log(err);
});



/**
 * Signature d'un token avec le nom d'utilisateur. Expire dans 12 heures
 * @param {string} user nom d'utilisateur
 * @returns token signé
 */
 function genererTokenAcces(user) {
    return jwt.sign({ user: user }, process.env.TOKEN_SECRET, { expiresIn: process.env.COOKIE_EXP });
}

/**
 * Authentification d'un token envoyé par le client. Cette fonction est utilisée comme un middleware entre la réception
 * de la demande du client et l'envoie de la réponse par le serveur.
 * @param {*} req Demande reçue du client
 * @param {*} res Réponse qui sera envoyée au client. Insertion d'un code d'erreur en cas d'échec d'authentification 
 * @param {*} next Fonction qui sera appelée si le token a été authentifiée, dans le cas d'une erreur par exemple, on
 * envoie directement la réponse contenant le code d'erreur sans passer par la fonction qui construirait la réponse à la
 * demande du client
 * @returns Valeur non utilisée, arrêt de la fonction
 */
function authentifierToken(req, res, next) {
    const enteteAuth = req.headers['authorization'];
    const token = enteteAuth && enteteAuth.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            if (err == 'TokenExpiredError: jwt expired') return res.sendStatus(498);
            else return res.sendStatus(403);
        }

        req.user = data;
        next();
    });
}

/**
 * Démarrage de l'écoute
 */
app.listen(port, () => console.log(`Serveur initialisé. Ecoute sur le port ${port} ... `));

function getUtilisateurs() {
    return new Promise((resolve, reject) => {
        fs.readFile(cheminUtilisateurs, "utf8", (err, donnees) => {
            if (err) {
                console.log(`Erreur lors de la lecture du fichier contenant les données des utilisateurs dans ${cheminUtilisateurs} : `);
                console.log(err.message);
                reject(err);
            } else {
                resolve(JSON.parse(donnees));
            }
        });
    });
}

function authentifierUtilisateur(user, mdp) {
    return new Promise((resolve, reject) => {
        getUtilisateurs().then((utilisateurs) => {
            for (let util of utilisateurs) {
                if (util.utilisateur == user && util.mdp == mdp) {
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        }).catch((err) => {
            console.log("L'authentification a échoué, les données des utilisateurs n'ont pas pu être récupérées.");
            reject(err);
        });
    });
}

function getIndices() {
    return new Promise((resolve, reject) => {
        fs.readFile(`${cheminIndices}${nomFicIndices}`, "utf8", (err, donnees) => {
            if (err) {
                console.log(`Erreur lors de la lecture du fichier d'indices dans ${cheminIndices}${nomFicIndices} :`);
                console.log(err.message);
                console.log("L'application essaye de reconstruire le fichier ... ");
                indexerRapports().then((indices) => {
                    console.log("Le fichier a été reconstruit");
                    resolve(indices);
                }).catch((err) => {
                    console.log("L'application n'a pas réussi à reconstruire le fichier. Vérifiez les paramètres du répertoire");
                    console.log(err.message);
                    reject(err);
                })
            } else {
                resolve(JSON.parse(donnees));
            }
        });
    });
}

function sauvegarderIndices(indices) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${cheminIndices}${nomFicIndices}`, JSON.stringify(indices), (err) => {
            if (err) {
                console.log(`Erreur lors de la sauvegarde du fichier d'indices : `);
                console.log(err.message);
                reject(err);
            }
            else {
                console.log(`Fichier d'indices mis-à-jour`);
                resolve();
            }
        });
    });
}

function ajouterIndice(nomRapport) {
    return new Promise((resolve, reject) => {
        getIndices().then((indices) => {
            let indicesMaj = indices;
            indicesMaj.rapports.push(nomRapport);
            indicesMaj.rapports.sort((a, b) => { return a - b });
            sauvegarderIndices(indicesMaj).then(() => {
                console.log(`Rapport ${nomRapport} ajouté aux indices`);
                resolve();
            }).catch((err) => {
                console.log(`Erreur lors de l'ajout du rapport ${nomRapport} aux indices`);
                reject(err);
            });
        });
    });
}

function supprimerIndice(nomRapport) {
    return new Promise((resolve, reject) => {
        getIndices().then((indices) => {
            let indicesMaj = indices.rapports.filter((rapp) => rapp != nomRapport);
            sauvegarderIndices({rapports: indicesMaj}).then(() => {
                console.log(`Rapport ${nomRapport} supprimé des indices`);
                resolve();
            }).catch((err) => {
                console.log(`Le rapport ${nomRapport} n'a pas pu être supprimé des indices. Une suppression manuelle peut être requise.`);
                reject(err);
            })
        });
    });
}

function getRapport(nomRapport) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${cheminRapports}${nomRapport}${extRapports}`, "utf8", (err, donnees) => {
            if (err) {
                console.log(`Erreur lors de la lecture du fichier contenant le rapport ${nomRapport} dans ${cheminRapports}${nomRapport}${extRapports}`);
                console.log(err.message);
                reject(err);
            } else resolve(JSON.parse(donnees));
        })
    });
}

function sauvegarderRapport(rapport) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${cheminRapports}${rapport.nom}${extRapports}`, JSON.stringify(rapport), (err) => {
            if (err) {
                console.log(`Erreur lors de l'écriture du rapport ${rapport.nom} : `);
                console.log(err.message);
                reject(err);
            }
            else {
                console.log(`Rapport ${rapport.nom} sauvegardé dans ${cheminRapports}${rapport.nom}${extRapports}`);
                getIndices().then((indices) => {
                    if (!indices.rapports.includes(rapport.nom)) {
                        console.log(`Ajout du nouveau rapport ${rapport.nom} aux indices ... `);
                        ajouterIndice(rapport.nom).then(() => {
                            console.log(`Rapport ${rapport.nom} créé`);
                            resolve();
                        }).catch((erreur) => {
                            console.log(`Suppression du rapport ${rapport.nom} ... `);
                            supprimerRapport(rapport.nom).then(() => {
                                console.log(`Rapport ${rapport.nom} supprimé`);
                                reject(erreur);
                            }).catch((erreur) => {
                                console.log(`Erreur lors de la suppression du rapport. Le fichier a été créé mais le rapport n'a pas été ajouté aux indices, il n'apparaîtra pas dans l'application.`);
                                reject(erreur);
                            }).finally(() => {
                                console.log(`Le rapport ${rapport.nom} n'a pas été créé, veuillez ressayer.`);
                            });
                        });
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

function copierRapport(nomRapportSource, nomRapportCopie) {
    return new Promise((resolve, reject) => {
        getRapport(nomRapportSource).then((rapport) => {
            let rapportModifie = rapport;
            rapportModifie.nom = nomRapportCopie;
            sauvegarderRapport(rapportModifie).then(() => {
                resolve();
            }).catch((err) => {
                console.log(`Erreur lors de la dupplication du rapport ${nomRapportSource}`);
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

function supprimerRapport(nomRapport) {
    return new Promise((resolve, reject) => {
        const chemin = `${cheminRapports}${nomRapport}${extRapports}`;
        fs.unlink(chemin, (err) => {
            if (err && err.code != "ENOENT") {
                console.log(`Erreur lors de la suppression du rapport ${nomRapport}`);
                console.log(err.message);
                reject(err);
            }
            else {
                if (err && err.code == "ENOENT") {
                    console.log(`Le fichier ${nomRapport}${extRapports} n'a pas été trouvé. S'il a été renommé une suppression manuelle est requise.`);
                    console.log(`L'application supprimera néanmoins le rapport ${nomRapport} de l'indice, il n'aparaîtra plus dans l'application`);
                }

                supprimerIndice(nomRapport).then(() => {
                    console.log(`Rapport ${nomRapport} supprimé`);
                    resolve();
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });

            }
        });
    });
}

function indexerRapports() {
    return new Promise((resolve, reject) => {
        var indice = { rapports: [] };
        fs.readdir(cheminRapports, (err, fichiers) => {
            if (err) {
                console.log(`Erreur lors de la lecture du répertoire  : ` + err.message);
                reject(err);
            }
            else {
                for (let fic of fichiers) {
                    if (fic.includes(extRapports)) {
                        const nomRapp = fic.substring(0, fic.lastIndexOf(extRapports));
                        indice.rapports.push(nomRapp);
                    } else {
                        console.log(`Le fichier intrus ${fic} trouvé dans le répertoire destiné aux rapports sera supprimé`);
                        fs.unlink(cheminRapports + fic, (err) => {
                            if (err) console.log("Erreur lors de la suppression du fichier inconnu " + fic);
                        });
                    }
                }

                fs.writeFile(`${cheminIndices}${nomFicIndices}`, JSON.stringify(indice), (err) => {
                    if (err) {
                        console.log("Erreur lors de l'écriture des fichiers : " + err.message);
                        reject(err);
                    }
                    else {
                        console.log("Rapports indexés");
                        resolve(indice);
                    }
                });
            }
        });
    });
}

function modifierNomRapport(ancienTitre, nouveauTitre) {
    return new Promise((resolve, reject) => {
        const cheminAncienNom = `${cheminRapports}${ancienTitre}${extRapports}`;
        const cheminNouveauNom = `${cheminRapports}${nouveauTitre}${extRapports}`;
        fs.rename(cheminAncienNom, cheminNouveauNom, (err) => {
            if (err) {
                console.log(`Erreur lors du renommage du fichier ${ancienTitre}${extRapports} :`);
                console.log(err.message);
                reject(err);
            } else {
                getRapport(nouveauTitre).then((rapport) => {
                    let rappModifie = rapport;
                    rappModifie.nom = nouveauTitre;

                    sauvegarderRapport(rappModifie).then(() => {
                        supprimerIndice(ancienTitre).then(() => {
                            console.log(`Rapport ${ancienTitre} renommé à ${nouveauTitre}`);
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((errSauvegarde) => {
                        fs.rename(cheminNouveauNom, cheminAncienNom, (err) => {
                            if (err) {
                                console.log("Les modifications n'ont pas pu être annulées : ");
                                console.log(err.message);
                                reject(err);
                            } else {
                                console.log("Les modifications ont été annulées");
                                reject(errSauvegarde);
                            }
                        });
                    });
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
}

function getBibliotheque() {
    return new Promise((resolve, reject) => {
        fs.readFile(cheminBibliotheque, "utf8", (err, donnees) => {
            if (err) {
                console.log("Erreur lors de la lecture de la bibliothèque : ");
                console.log(err.message);
                reject(err);
            } else resolve(JSON.parse(donnees));
        });
    });
}

function sauvegarderBibliotheque(bibliotheque) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${cheminBibliotheque}`, JSON.stringify(bibliotheque), (err) => {
            if (err) {
                console.log("Erreur lors de la sauvegarde de la bibliothèque : ");
                console.log(err.message);
                reject(err);
            } else resolve();
        });
    });
}

/**
 * Fonctions de démarrage de l'application
 */
indexerRapports();

/**
 * Fonctions génération du document Word
 */
const proprietesPage = {
    page: {
        margin: {
            top: docx.convertMillimetersToTwip(13),
            bottom: docx.convertMillimetersToTwip(13),
            right: docx.convertMillimetersToTwip(13),
            left: docx.convertMillimetersToTwip(13),
        }
    }
};

const docFeatures = {
    updateFields: true
};

const piedPageGarde = {
    default: new docx.Footer({
        children: [
            new docx.Table({
                rows: [
                    new docx.TableRow({
                        children: [
                            new docx.TableCell({
                                margins: {
                                    right: docx.convertMillimetersToTwip(1),
                                    top: docx.convertMillimetersToTwip(1),
                                    bottom: docx.convertMillimetersToTwip(1)
                                },
                                width: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(62)
                                },
                                height: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(11.9)
                                },
                                children: [
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "PARIS",
                                                font: "Cambria",
                                                size: 16,
                                                color: "0070c0"
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "1 bis, boulevard Cotte",
                                                font: "Cambria",
                                                size: 16,
                                                color: "0070c0"
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "95880 ENGHIEN LES BAINS",
                                                font: "Cambria",
                                                size: 16,
                                                color: "0070c0"
                                            })
                                        ]
                                    })
                                ],
                                verticalAlign: docx.VerticalAlign.CENTER
                            }),
                            new docx.TableCell({
                                margins: {
                                    right: docx.convertMillimetersToTwip(1),
                                    top: docx.convertMillimetersToTwip(1),
                                    bottom: docx.convertMillimetersToTwip(1)
                                },
                                width: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(62)
                                },
                                height: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(11.9)
                                },
                                children: [
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "LYON",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "6, rue Simone de Beauvoir",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "69007 LYON",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    })
                                ],
                                verticalAlign: docx.VerticalAlign.CENTER
                            }),
                            new docx.TableCell({
                                margins: {
                                    right: docx.convertMillimetersToTwip(1),
                                    top: docx.convertMillimetersToTwip(1),
                                    bottom: docx.convertMillimetersToTwip(1)
                                },
                                width: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(62)
                                },
                                height: {
                                    type: docx.WidthType.DXA,
                                    size: docx.convertMillimetersToTwip(11.9)
                                },
                                children: [
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "CHALON SUR SAONE",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "14, route de Gigny",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    }),
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new docx.TextRun({
                                                text: "71240 SENNECEY LE GRAND",
                                                font: "Cambria",
                                                size: 16
                                            })
                                        ]
                                    })
                                ],
                                verticalAlign: docx.VerticalAlign.CENTER
                            }),
                        ]
                    })
                ]
            }),

        ]
    })
};


const sectionTableMatieres = {
    properties: proprietesPage,
    children: [
        new docx.Paragraph({
            alignment: docx.AlignmentType.RIGHT,
            children: [
                new docx.TextRun({
                    text: "Sommaire",
                    font: "Cambria",
                    size: 32,
                    color: "0070c0"
                }),
                new docx.TextRun({
                    break: 2
                })
            ]
        }),
        new docx.TableOfContents("Sommaire", {
            hyperlink: true,
            headingStyleRange: "1-5"
        })
    ]
};

const numbering = {
    config: [{
        reference: "BRP",
        levels: [{
            level: 0,
            format: docx.LevelFormat.UPPER_ROMAN,
            text: "%1.",
            alignment: docx.AlignmentType.START,
            style: {
                paragraph: {
                    indent: {
                        left: docx.convertMillimetersToTwip(4),
                        hanging: docx.convertMillimetersToTwip(0)
                    }
                },
                run: {
                    size: 36,
                    font: "Cambria",
                    color: "0070c0"
                }
            }
        },
        {
            level: 1,
            format: docx.LevelFormat.DECIMAL,
            text: "%1.%2.",
            alignment: docx.AlignmentType.START,
            style: {
                paragraph: {
                    indent: {
                        left: docx.convertMillimetersToTwip(8),
                        hanging: docx.convertMillimetersToTwip(0)
                    }
                },
                run: {
                    size: 28,
                    font: "Cambria",
                    color: "0070c0"
                }
            }
        },
        {
            level: 2,
            format: docx.LevelFormat.DECIMAL,
            text: "%2.%3.",
            alignment: docx.AlignmentType.START,
            style: {
                paragraph: {
                    indent: {
                        left: docx.convertMillimetersToTwip(12),
                        hanging: docx.convertMillimetersToTwip(0)
                    }
                },
                run: {
                    size: 26,
                    font: "Cambria",
                    color: "0070c0",
                    italics: true
                }
            }
        },
        {
            level: 3,
            format: docx.LevelFormat.DECIMAL,
            text: "%2.%3.%4.",
            alignment: docx.AlignmentType.START,
            style: {
                paragraph: {
                    indent: {
                        left: docx.convertMillimetersToTwip(16),
                        hanging: docx.convertMillimetersToTwip(0)
                    }
                },
                run: {
                    size: 24,
                    font: "Cambria",
                    color: "0070c0",
                    italics: false
                }
            }
        }]
    }]
};

const headingLevels = [
    undefined,
    docx.HeadingLevel.HEADING_1,
    docx.HeadingLevel.HEADING_2,
    docx.HeadingLevel.HEADING_3,
    docx.HeadingLevel.HEADING_4
]

const indent = [
    undefined,
    { left: docx.convertMillimetersToTwip(4) },
    { left: docx.convertMillimetersToTwip(8) },
    { left: docx.convertMillimetersToTwip(12) },
    { left: docx.convertMillimetersToTwip(16) }
];

const highlight = {
    '#ffff00': 'yellow',
    '#00ff00': 'green',
    '#00ffff': 'cyan',
    '#ff00ff': 'magenta',
    '#0000ff': 'blue',
    '#ff0000': 'red',
    '#008080': 'darkCyan',
    '#008000': 'darkGreen',
    '#800080': 'darkMagenta',
    '#800000': 'darkRed',
    '#808000': 'darkYellow',
    '#808080': "darkGray",
    '#c0c0c0': "lightGray",
    "#000000": "black",
    '#ffffff': "none"
};

const alignmentTypes = {
    justify: docx.AlignmentType.JUSTIFIED,
    center: docx.AlignmentType.CENTER,
    right: docx.AlignmentType.RIGHT,
    left: docx.AlignmentType.LEFT
}

const defaut = {
    font: "Arial",
    size: 20,
    color: "000000",
    italics: false,
    bold: false,
    underline: false,
    highlight: "none",
}

function genererContenuPageGarde(nomProjet, version, date, nomLivrable) {
    return [
        new docx.Paragraph({
            children: [
                new docx.ImageRun({
                    data: fs.readFileSync(`${cheminFichiersWord}logo.jpg`),
                    transformation: {
                        height: 113,
                        width: 300
                    },
                    floating: {
                        horizontalPosition: {
                            offset: -144000,
                            relative: docx.HorizontalPositionRelativeFrom.COLUMN
                        },
                        verticalPosition: {
                            offset: -39600,
                            relative: docx.VerticalPositionRelativeFrom.PARAGRAPH
                        },
                        wrap: {
                            type: docx.TextWrappingType.TOP_AND_BOTTOM
                        }
                    }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `Bureau d’étude`,
                            font: "BankGothic Lt BT",
                            size: 20
                        })
                    ]
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `Diagnostic et ingénierie`,
                            font: "BankGothic Lt BT",
                            size: 20
                        })
                    ]
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `Maîtrise d’œuvre - O.P.C.`,
                            font: "BankGothic Lt BT",
                            size: 20
                        })
                    ]
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `Assistance à maîtrise d’ouvrage`,
                            font: "BankGothic Lt BT",
                            size: 20
                        })
                    ]
                })
            ]
        }),
        new docx.Paragraph({
            alignment: docx.AlignmentType.RIGHT,
            children: [
                new docx.TextRun({
                    text: `Rapport ${nomProjet}`,
                    font: "Cambria",
                    color: "595959",
                    size: 40,
                    bold: true,
                    break: 5
                }),
                new docx.TextRun({
                    text: `Version ${version} du ${date}`,
                    font: "Cambria",
                    color: "0070c0",
                    size: 24,
                    break: 1
                }),
                new docx.TextRun({
                    text: `${nomLivrable}`,
                    font: "Cambria",
                    color: "595959",
                    size: 36,
                    break: 2
                }),
            ]
        }),
        new docx.Paragraph({
            children: [
                new docx.ImageRun({
                    data: fs.readFileSync(`${cheminFichiersWord}ing.jpg`),
                    transformation: {
                        height: 150,
                        width: 204
                    },
                    floating: {
                        horizontalPosition: {
                            offset: 360000,
                            relative: docx.HorizontalPositionRelativeFrom.PAGE
                        },
                        verticalPosition: {
                            offset: 7257600,
                            relative: docx.VerticalPositionRelativeFrom.MARGIN
                        }
                    }
                }),
                new docx.Paragraph({
                    alignment: docx.AlignmentType.RIGHT,
                    children: [
                        new docx.TextRun({
                            text: `Le bon maître d'œuvre est celui qui ne livre rien au hasard, qui `,
                            font: "Freestyle Script",
                            color: "595959",
                            size: 40,
                            break: 11
                        }),
                        new docx.TextRun({
                            text: `n'ajourne aucune solution et qui sait donner à chaque fonction sa place `,
                            font: "Freestyle Script",
                            color: "595959",
                            size: 40,
                            break: 1
                        }),
                        new docx.TextRun({
                            text: `et sa valeur par rapport à l'ensemble et cela au moment opportun`,
                            font: "Freestyle Script",
                            color: "595959",
                            size: 40,
                            break: 1
                        }),
                        new docx.TextRun({
                            text: `Eugène VIOLLET-LE-DUC, (1814-1879) : Architecte Français`,
                            font: "Cambria",
                            color: "595959",
                            italics: true,
                            size: 18,
                            break: 2
                        })
                    ]
                })
            ]
        })
    ];
}

function genererHeadingText(index, text) {
    const fontSize = [0, 36, 28, 26, 24];
    const italic = [false, false, false, true, false];
    return new docx.TextRun({
        color: "0070c0",
        size: fontSize[index],
        font: "Cambria",
        text: text,
        italics: italic[index]
    });
}

function genererPiedPage(client, nomProjet, nomLivrable) {
    return {
        default: new docx.Footer({
            children: [
                new docx.Paragraph({
                    alignment: docx.AlignmentType.LEFT,
                    children: [
                        new docx.TextRun({
                            text: `${client.toUpperCase()} | BRP ETUDE CONSEIL`,
                            font: "Cambria",
                            size: 16
                        }),
                        new docx.TextRun({
                            text: `\t${nomProjet}`,
                            font: "Cambria",
                            color: "c00000",
                            size: 16,
                            break: 1
                        }),
                        new docx.TextRun({
                            text: " | ",
                            font: "Cambria",
                            color: "000000",
                            size: 16
                        }),
                        new docx.TextRun({
                            text: nomLivrable,
                            font: "Cambria",
                            color: "0070c0",
                            size: 16,
                            underline: {
                                type: docx.UnderlineType.SINGLE,
                                color: "0070c0"
                            }
                        }),
                        new docx.TextRun({
                            text: "                                                                                                                                               "
                        }),
                        new docx.TextRun({
                            children: [docx.PageNumber.CURRENT, " / ", docx.PageNumber.TOTAL_PAGES],
                            font: "Cambria",
                            color: "000000",
                            size: 18,
                        })
                    ]
                })
            ]
        })
    }
}

function creerParagraphes(titre) {
    let paragraphes = [];
    if (titre.contenu) {
        const index = titre.index;

        let heading = new docx.Paragraph({
            numbering: {
                reference: "BRP",
                level: index - 1
            },
            heading: headingLevels[index],
            children: [genererHeadingText(index, titre.titre)],
            spacing: { before: 250, after: 250 }
        });
        paragraphes.push(heading);

        var contenuCourant = {
            children: [],
            indent: indent[index]
        }
        const texte = JSON.parse(titre.contenu);

        for (let ligne of texte.ops) {
            let creerParagraphe = false;
            if (ligne.attributes && ligne.attributes.align) {
                contenuCourant.alignment = alignmentTypes[ligne.attributes.align];
                creerParagraphe = true;
            }

            if (ligne.attributes && ligne.attributes.list) {
                contenuCourant.bullet = { level: 0 };
                creerParagraphe = true;
            }

            if (ligne.insert) {
                let parametresTextRun = {};

                if (ligne.attributes) {
                    parametresTextRun.font = (ligne.attributes.font || defaut.police);
                    parametresTextRun.size = (ligne.attributes.size ? parseInt(ligne.attributes.size) * 2 : defaut.taille);
                    parametresTextRun.color = (ligne.attributes.color ? ligne.attributes.color : defaut.couleur);
                    parametresTextRun.highlight = (ligne.attributes.background ? highlight[ligne.attributes.background] : defaut.couleurSoulig);
                    parametresTextRun.bold = (ligne.attributes.bold ? true : defaut.gras);
                    parametresTextRun.italics = (ligne.attributes.italic ? true : defaut.italique);
                    parametresTextRun.underline = (ligne.attributes.souligne ? docx.UnderlineType.SINGLE : defaut.souligne);
                } else parametresTextRun = defaut;

                var lignes = ligne.insert.split("\n");
                for (var i = 0; i < lignes.length; i++) {
                    if (lignes[i] == "") {
                        if (contenuCourant.children.length > 0) {
                            paragraphes.push(new docx.Paragraph(_.cloneDeep(contenuCourant)));
                            contenuCourant = {children: [], indent: indent[index]};
                            creerParagraphe = false;
                        } else paragraphes.push(new docx.Paragraph({children: []}));
                    } else {
                        parametresTextRun.text = lignes[i];
                        contenuCourant.children.push(new docx.TextRun(parametresTextRun));
                    }
                }
            }

            if (creerParagraphe) {
                paragraphes.push(new docx.Paragraph(_.cloneDeep(contenuCourant)));
                contenuCourant = {children: [], indent: indent[index]};
            }
        }

        if (contenuCourant.children.length > 0) paragraphes.push(new docx.Paragraph(contenuCourant));
    }
    return paragraphes;
}

function genererWord(nomRapport) {
    return new Promise((resolve, reject) => {
        getRapport(nomRapport).then((rapport) => {
            const sectionPageGarde = {
                properties: proprietesPage,
                footers: piedPageGarde,
                children: genererContenuPageGarde(rapport.nom, rapport.infosLivrable.version, rapport.infosLivrable.date, rapport.infosLivrable.nom)
            };

            sectionTableMatieres.footers = genererPiedPage(rapport.client, rapport.nom, rapport.infosLivrable.nom);
            let doc = {
                features: docFeatures,
                numbering: numbering,
                sections: [sectionPageGarde, sectionTableMatieres]
            };

            let sectionTitres = {
                footers: genererPiedPage(rapport.client, rapport.nom, rapport.infosLivrable.nom),
                properties: proprietesPage,
                children: []
            };

            let paragraphes = [];

            for (let titre1 of rapport.titres) {
                paragraphes = paragraphes.concat(creerParagraphes(titre1));
                for (let titre2 of titre1.titre2) {
                    paragraphes = paragraphes.concat(creerParagraphes(titre2));
                    for (let titre3 of titre2.titre3) {
                        paragraphes = paragraphes.concat(creerParagraphes(titre3));
                        for (let titre4 of titre3.titre4) {
                            paragraphes = paragraphes.concat(creerParagraphes(titre4));
                        }
                    }
                }
            }

            sectionTitres.children = paragraphes;
            doc.sections.push(sectionTitres);


            docx.Packer.toBuffer(new docx.Document(doc)).then((buffer) => {
                fs.writeFile(`${cheminFichiersTemp}${nomRapport}.docx`, buffer, (err) => {
                    if (err) {
                        console.log("Erreur lors de l'écriture du fichier Word généré : ");
                        console.log(err.message);
                        reject(err);
                    } else {
                        fs.readFile(`${cheminFichiersTemp}${nomRapport}.docx`, "utf8", (err, donnees) => {
                            if (err) {
                                console.log(`Erreur lors de la lecture du fichier généré ${nomRapport}.docx : `);
                                console.log(err.message);
                                reject(err);
                            } else resolve(donnees);
                        })
                    }
                });
            });

        }).catch((erreur) => {
            reject(erreur);
        });
    });
}

/**
 * Routes serveur
 */
app.post("/login", (req, res) => {
    console.log(" ========== Login ========== ");
    const user = req.body.user;
    const mdp = req.body.mdp;

    authentifierUtilisateur(user, mdp).then((rep) => {
        if (rep) {
            console.log(`Utilisateur ${user} connecté`);
            const exp = parseInt(process.env.COOKIE_EXP);
            res.send({
                token: genererTokenAcces(user),
                user: user,
                cookieExp: exp
            });
        } else res.send({erreur: "Utilisateur ou mot de passe incorrects"});
    });
});

app.post("/login-cookie", (req, res) => {
    const enteteAuth = req.headers['authorization'];
    const token = enteteAuth && enteteAuth.split(' ')[1];

    if (!token) return res.send({ erreur: "Le token d'authentification est manquant" });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err.message);
            res.send({ erruer: "Le token envoyé n'est pas valide" });
        } else {
            res.send({user: user});
        }
    });
});

app.get("/recuperer-liste-rapports", authentifierToken, (req, res) => {
    console.log(" ========== Récupérer liste rapports ========== ");
    getIndices().then((indices) => {
        res.send(indices);
    }).catch((erreur) => {
        res.send({ erreur: erreur });
    });
});

app.post("/sauvegarder-rapport", authentifierToken, (req, res) => {
    console.log(" ========== Sauvegarder rapport ========== ");
    sauvegarderRapport(req.body).then(() => {
        res.send();
    }).catch((err) => {
        res.send({ erreur: err });
    })
});

app.delete("/supprimer-rapport/:rapport", authentifierToken, (req, res) => {
    console.log(" ========== Supprimer rapport ========== ");
    supprimerRapport(req.params.rapport).then(() => {
        res.send();
    }).catch((err) => {
        res.send({ erreur: err });
    })
});

app.get("/ouvrir-rapport/:nom", authentifierToken, (req, res) => {
    console.log(" ========== Ouvrir rapport ========== ");
    getRapport(req.params.nom).then((rapport) => {
        res.send(rapport);
    }).catch((err) => {
        if (err.code == "ENOENT") {
            supprimerRapport(req.params.nom).then(() => {
                res.send({erreur: err});
            }).catch((err) => {
                res.send({erreur: err});
            })
        } else res.send({erreur: err});
    });
});

app.put("/modifier-nom-rapport", authentifierToken, (req, res) => {
    console.log(" ========== Modifier nom rapport ========== ");
    modifierNomRapport(req.body.ancienTitre, req.body.nouveauTitre).then(() => {
        res.send();
    }).catch((err) => {
        res.send({ erreur: err });
    });
});

app.get("/generer-word/:nom", authentifierToken, (req, res) => {
    console.log(" ========== Générer document Word ========== ");
    const cheminFichier = `${cheminFichiersTemp}${req.params.nom}.docx`;
    genererWord(req.params.nom).then((fichier) => {
        res.download(cheminFichier, `${req.params.nom}.docx`, (err) => {
            if (err) console.log(err);
            fs.unlink(cheminFichier, (err) => {
                if (err) {
                    console.log(`Erreur lors de la suppression du fichier temporaire ${cheminFichier}`);
                }
            });
        });
    }).catch((err) => {
        console.log(err)
    })
});

app.post("/dupliquer-rapport/", authentifierToken, (req, res) => {
    console.log(" ========== Dupliquer Rapport ========== ");
    const nomRapportSource = req.body.nomRapportSource;
    const nomRapportDestination = req.body.nomRapportCopie;
    copierRapport(nomRapportSource, nomRapportDestination).then(() => {
        res.send();
    }).catch((err) => {
        res.send({erreur: err});
    })
});

app.get("/recuperer-bibliotheque", authentifierToken, (req, res) => {
    console.log(" ========== Récupérer Bibliothèque ========== ");
    getBibliotheque().then((bibliotheque) => {
        res.send({bibliotheque: bibliotheque});
    }).catch((err) => {
        res.send({erreur: err});
    })
});

app.post("/sauvegarder-bibliotheque", authentifierToken, (req, res) => {
    console.log(" ========== Sauvegarder Bilbiothèque ========== ");
    const bibliotheque = req.body.bibliotheque;
    sauvegarderBibliotheque(bibliotheque).then(() => {
        res.send();
    }).catch((err) => {
        res.send({erreur: err});
    })
});


