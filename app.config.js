module.exports = {
    apps : [{
      name        : "Application Rapports BRP",
      script      : "C:\\Applications BRP\\Appli-ECO-2.0\\app_serveur\\app.js",
      watch       : true,
      merge_logs  : true,
      cwd         : "C:\\Applications BRP\\Appli-ECO-2.0\\app_serveur\\",
      ignore_watch : ["node_modules", "Bibliotheque", "Indice", "Rapports", "tmp", "Utilisateurs", "Word"]
     }]
  }