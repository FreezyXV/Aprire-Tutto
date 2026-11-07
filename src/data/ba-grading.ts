import type { Criterion, PromptCheck } from "@/lib/types";

/*
 * Automatic correction for the built-in Business Analysis course.
 * Patterns run on normalized text: lowercase, no accents, straight apostrophes.
 * They detect expected ideas; they do not judge style or prove mastery.
 */

const c = (label: string, patterns: string[], hint: string): Criterion => ({
  label,
  patterns,
  hint,
});

const OPEN_QUESTION =
  "\\b(pourquoi|comment|qu'est-ce qui|que se passe|quels?|quelles?|quand|racontez|decrivez|expliquez|dans quels?|a quel)\\b";
const CLOSED_START = {
  patterns: [
    "^[«\"' ]*(est-ce que|etes-vous|avez-vous|trouvez-vous|voulez-vous|pensez-vous)",
  ],
  message:
    "Question fermée (réponse oui/non) : préfère une question qui fait raconter ou décrire.",
};

export const baGrading: Record<
  string,
  { checks: PromptCheck[]; keyIdeas: Criterion[] }
> = {
  "ba-besoin": {
    checks: [
      {
        model:
          "« Pour quelles raisons vos clients appellent-ils, et à quel moment de leur commande ? »",
        criteria: [
          c(
            "Question ouverte",
            [OPEN_QUESTION],
            "Commence par « Pourquoi », « Comment » ou « Quelles… » pour obtenir des faits.",
          ),
          c(
            "Elle porte sur le problème vécu",
            [
              "appel|client|probleme|raison|motif|cause|situation|moment|frequen",
            ],
            "Interroge la situation des clients (raisons des appels, moment, fréquence), pas l’outil.",
          ),
        ],
        avoid: [
          CLOSED_START,
          {
            patterns: [
              "(logiciel|application|appli|outil|crm)[^.?]{0,40}(voulez|preferez|souhaitez|aimeriez)",
            ],
            message:
              "Tu demandes quel outil le client veut : c’est encore une solution. Explore d’abord le problème.",
          },
        ],
      },
      {
        model:
          "Le nombre d’appels par semaine liés au statut de livraison, et leur part dans le total des appels.",
        criteria: [
          c(
            "Une grandeur mesurable",
            [
              "nombre|combien|taux|pourcentage|%|duree|temps|frequen|volume|par (jour|semaine|mois)|moyenne|part de",
            ],
            "Donne une quantité observable : un nombre, un taux, une durée…",
          ),
          c(
            "Liée au problème annoncé",
            ["appel|reclamation|client|retard|livraison|statut|attente"],
            "Rattache ta mesure au problème : les appels des clients et leur motif.",
          ),
        ],
      },
      {
        model:
          "Permettre au client de connaître la date de livraison de sa commande sans avoir à contacter l’équipe.",
        criteria: [
          c(
            "Un résultat attendu",
            [
              "permettre|pouvoir|savoir|connaitre|reduire|diminuer|eviter|etre inform|suivre|acceder|obtenir",
            ],
            "Formule un résultat : « permettre à… de… », « réduire… ».",
          ),
          c(
            "Un bénéficiaire identifié",
            ["client|equipe|utilisateur|responsable|livreur|service"],
            "Précise pour qui : le client, l’équipe…",
          ),
        ],
        avoid: [
          {
            patterns: [
              "\\b(application|appli|logiciel|outil|crm|chatbot|site|plateforme|refaire|developper|sms|portail)\\b",
            ],
            message:
              "Tu nommes une solution (outil, application, SMS…). Un besoin décrit le résultat attendu, pas le moyen.",
          },
        ],
      },
    ],
    keyIdeas: [
      c(
        "Problème, besoin et solution sont différents",
        ["solution|moyen"],
        "Explique la différence entre le besoin (résultat) et la solution (moyen).",
      ),
      c(
        "Commencer par « Pourquoi ? » et « Pour qui ? »",
        ["pourquoi|pour qui|comprendre|question"],
        "Rappelle qu’on interroge d’abord le pourquoi et les personnes concernées.",
      ),
      c(
        "Viser un résultat mesurable",
        ["mesur|resultat|chiffre|indicateur|impact|objectif"],
        "Mentionne l’importance d’un résultat observable ou mesurable.",
      ),
    ],
  },
  "ba-acteurs": {
    checks: [
      {
        model:
          "Le directeur (il décide et arbitre), un vendeur (il reçoit les retours en boutique) et un conseiller du service client (il traite les réclamations).",
        criteria: [
          c(
            "Un décideur",
            [
              "directeur|direction|responsable|manager|decideur|sponsor|gerant|patron",
            ],
            "Invite la personne qui décide et arbitre.",
          ),
          c(
            "Des personnes du terrain",
            [
              "vendeur|service client|conseiller|client|utilisateur|logisti|magasin|terrain|employe",
            ],
            "Ajoute ceux qui vivent les retours au quotidien (vendeurs, service client).",
          ),
          c(
            "Une raison pour chacun",
            [
              "parce|car |pour |afin|qui (decide|vit|traite|gere|connait|recoit)|connait|traite|gere",
            ],
            "Explique pourquoi chaque acteur est utile à l’atelier.",
          ),
        ],
      },
      {
        model:
          "« Racontez-moi le dernier retour difficile que vous avez traité : que s’est-il passé, étape par étape ? »",
        criteria: [
          c(
            "Question ouverte",
            [OPEN_QUESTION],
            "Utilise « Racontez… », « Comment… », « Que se passe-t-il quand… ».",
          ),
          c(
            "Une expérience concrète",
            [
              "dernier|derniere|exemple|recemment|concret|situation|cas|etape|racontez|vecu|au quotidien",
            ],
            "Fais décrire un cas réel et récent plutôt qu’une opinion générale.",
          ),
        ],
        avoid: [CLOSED_START],
      },
      {
        model:
          "Envoyer sous 48 h une synthèse des constats, décisions et questions ouvertes, et demander à chaque participant de la valider ou de la corriger.",
        criteria: [
          c(
            "Une synthèse écrite partagée",
            [
              "synthese|compte[- ]rendu|\\bcr\\b|resume|recapitul|mail|e-mail|email|document|envoy|partag|diffus",
            ],
            "Prévois une trace écrite envoyée aux participants.",
          ),
          c(
            "Une validation par les participants",
            [
              "valid|confirm|relire|relecture|retour|corrig|accord|approuv|reformul",
            ],
            "Demande-leur de confirmer ou corriger ce que tu as compris.",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Commanditaire, décideur et utilisateur peuvent différer",
        [
          "decid|commanditaire|sponsor|utilisat|terrain|differ|pas (toujours )?la meme",
        ],
        "Rappelle que celui qui commande n’est pas forcément celui qui utilise.",
      ),
      c(
        "Faire raconter des situations vécues",
        ["racont|vecu|concret|exemple|situation"],
        "Mentionne l’intérêt des exemples concrets en entretien.",
      ),
      c(
        "Valider ce qui a été compris",
        ["valid|confirm|synthese|reformul"],
        "Ajoute l’étape de validation après l’atelier.",
      ),
    ],
  },
  "ba-roles": {
    checks: [
      {
        model:
          "Plutôt technico-fonctionnelle : SQL, spécifications d’interfaces et échanges quotidiens avec les développeurs, à confirmer en entretien.",
        criteria: [
          c(
            "Orientation technico-fonctionnelle",
            ["technico|techni|\\bit\\b|\\bsi\\b|moe"],
            "Les activités (SQL, interfaces, développeurs) pointent vers une orientation technico-fonctionnelle.",
          ),
          c(
            "Appuyée sur les activités citées",
            ["sql|interface|recette|developpeur|specification|atelier"],
            "Justifie avec les activités de l’offre, pas avec l’intitulé.",
          ),
        ],
      },
      {
        model:
          "« Le poste est-il rattaché à une direction métier ou à la DSI, et à qui reporterai-je au quotidien ? »",
        criteria: [
          c(
            "Porte sur le rattachement",
            [
              "rattach|hierarch|report|manager|equipe|metier|\\bmoa\\b|\\bmoe\\b|dsi|direction|qui (est|sera)",
            ],
            "Demande à quelle direction (métier ou DSI) et à quel responsable le poste est rattaché.",
          ),
          c(
            "Formulée comme une question",
            ["\\?|\\bqui\\b|\\bquel|est-ce|a qui"],
            "Écris la question telle que tu la poserais.",
          ),
        ],
      },
      {
        model:
          "Qui valide les besoins et arbitre les changements ? Le poste inclut-il du développement ou seulement la spécification et la recette ?",
        criteria: [
          c(
            "Les décisions attendues",
            ["valid|decid|decision|arbitr|signe|approuv|prior"],
            "Clarifie qui valide et qui arbitre.",
          ),
          c(
            "Le périmètre du poste",
            [
              "develop|code|coder|specifi|perimetre|jusqu'ou|limite|responsab|recette|test",
            ],
            "Précise jusqu’où va le poste (spécifier, tester, développer ?).",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Le titre ne suffit pas : regarder les activités",
        ["activit|mission|tache|intitule|titre"],
        "Rappelle qu’on lit les activités réelles, pas seulement l’intitulé.",
      ),
      c(
        "Distinguer MOA et MOE",
        ["\\bmoa\\b|\\bmoe\\b|maitrise|metier.*(technique|\\bit\\b|dsi)"],
        "Situe le rôle côté métier (MOA) ou côté réalisation (MOE).",
      ),
      c(
        "Clarifier décisions, livrables et limites",
        ["decision|livrable|limite|responsab|valid"],
        "Mentionne les décisions, livrables et limites à clarifier.",
      ),
    ],
  },
  "ba-exigences": {
    checks: [
      {
        model:
          "Ce qu’on appelle « retard » (seuil en minutes), le délai d’alerte avant le créneau, et le canal d’information (SMS, e-mail…).",
        criteria: [
          c(
            "La définition du retard",
            [
              "retard|definition|definir|seuil|a partir de|combien de (minutes|temps)",
            ],
            "Demande à partir de quand on parle de retard.",
          ),
          c(
            "Le délai ou le canal d’alerte",
            [
              "delai|quand|moment|\\btot\\b|avance|canal|sms|mail|notification|appel|telephone",
            ],
            "Précise combien de temps avant et par quel moyen prévenir.",
          ),
        ],
      },
      {
        model:
          "Hypothèse à confirmer : si l’heure estimée dépasse la fin du créneau confirmé de plus de 30 minutes, alors le client reçoit un SMS au plus tard 60 minutes avant le créneau initial.",
        criteria: [
          c(
            "Hypothèse signalée",
            ["hypothese|a confirmer|suppos|provisoire|a valider|propos"],
            "Indique que tes valeurs sont des hypothèses à faire valider.",
          ),
          c(
            "Condition et résultat observables",
            [
              "(si|quand|lorsque|etant donne|des que)[^.]{0,160}(alors|envoi|recoi|notifi|averti|affich|prevenu)",
            ],
            "Écris « si/quand… alors… » avec un résultat vérifiable.",
          ),
          c(
            "Une valeur précise",
            ["\\d"],
            "Remplace « suffisamment tôt » par un chiffre (minutes, heures).",
          ),
        ],
        avoid: [
          {
            patterns: [
              "suffisamment|rapidement|assez tot|des que possible|rapide",
            ],
            message:
              "Mot vague (« suffisamment », « rapidement »…) : remplace-le par une valeur testable.",
          },
        ],
      },
      {
        model:
          "Numéro de téléphone invalide : le SMS échoue, l’échec est tracé et un e-mail est envoyé à la place. Autre cas : livraison annulée entre-temps, aucune alerte de retard.",
        criteria: [
          c(
            "Une exception concrète",
            [
              "invalide|errone|faux|absent|manquant|injoignable|annul|echec|panne|indisponible|pas de numero|non (remis|recu)|bloque",
            ],
            "Cite un cas réel qui peut mal tourner (numéro invalide, annulation…).",
          ),
          c(
            "Le comportement attendu",
            [
              "alors|prevoir|il faut|doit|renvoy|alert|signal|bascul|journal|trac|relanc|autre canal|a la place|aucun",
            ],
            "Dis ce que le système doit faire dans ce cas.",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Une exigence doit être testable",
        ["testable|tester|verifi|mesurable|observable"],
        "Rappelle que deux personnes doivent pouvoir tester la phrase et conclure pareil.",
      ),
      c(
        "Remplacer les mots vagues par des valeurs",
        ["vague|precis|valeur|chiffre|seuil|ambig"],
        "Mentionne la chasse aux termes ambigus.",
      ),
      c(
        "Expliciter hypothèses et exceptions",
        ["hypothese|exception|erreur|cas particulier|limite"],
        "Ajoute les hypothèses et les cas d’erreur.",
      ),
    ],
  },
  "ba-processus": {
    checks: [
      {
        model:
          "Déclencheur : la demande de retour est acceptée. Résultat attendu : le client est remboursé et informé de chaque étape.",
        criteria: [
          c(
            "Le déclencheur",
            [
              "declench|debut|commence|demande de retour|retour (accepte|recu|demande)|reception|quand le client",
            ],
            "Indique l’événement qui lance le processus.",
          ),
          c(
            "Le résultat attendu",
            ["rembours|resultat|\\bfin\\b|inform|termin|clotur"],
            "Indique ce qui marque la fin réussie du processus.",
          ),
        ],
      },
      {
        model:
          "Le passage du magasin (contrôle du produit) à la comptabilité : comment le résultat du contrôle est-il transmis, et qui informe le client ?",
        criteria: [
          c(
            "Deux acteurs qui se passent le relais",
            [
              "(magasin|support|comptab)[^.]{0,120}(magasin|support|comptab|client)",
            ],
            "Nomme les deux équipes concernées (ex. magasin → comptabilité).",
          ),
          c(
            "Le point de rupture",
            [
              "transmi|transfert|relais|attente|information|perd|delai|statut|previent|bloque|rupture|silence",
            ],
            "Décris ce qui se perd ou attend entre les deux étapes.",
          ),
        ],
      },
      {
        model:
          "Garder le contrôle magasin, mais transmettre automatiquement son résultat à la comptabilité et au client, avec un responsable et un délai.",
        criteria: [
          c(
            "Le contrôle est conservé",
            ["control|verif|garder|conserv|mainten|sans supprimer"],
            "Montre que tu gardes le contrôle utile.",
          ),
          c(
            "La transmission ou l’information est améliorée",
            ["statut|notif|inform|transm|automat|suivi|responsable|delai|date"],
            "Propose comment mieux transmettre l’information.",
          ),
        ],
        avoid: [
          {
            patterns: ["supprim(er|ons|e) (le |la |les )?(control|verif)"],
            message:
              "Supprimer le contrôle peut créer d’autres problèmes : améliore plutôt la transmission.",
          },
        ],
      },
    ],
    keyIdeas: [
      c(
        "Délimiter le processus",
        ["declench|debut|\\bfin\\b|resultat|limite"],
        "Mentionne déclencheur et résultat.",
      ),
      c(
        "Repérer les passages de relais",
        ["relais|transmi|passage|entre (les )?(equipes|services|acteurs)"],
        "Parle des transmissions entre équipes.",
      ),
      c(
        "Rendre visibles décisions et exceptions",
        ["exception|decision|erreur|choix"],
        "Ajoute les décisions et exceptions à cartographier.",
      ),
    ],
  },
  "ba-prioriser": {
    checks: [
      {
        model:
          "Le paiement : aucun client ne peut acheter, c’est la valeur principale du site qui est bloquée.",
        criteria: [
          c(
            "Le paiement en premier",
            ["paiement|payer|caisse|checkout"],
            "Le paiement est en panne : c’est lui qui bloque tout.",
          ),
          c(
            "Justifié par l’impact",
            [
              "bloqu|impact|chiffre d'affaires|\\bca\\b|vente|aucun|essentiel|valeur|critique|perte|commande|achet",
            ],
            "Explique l’impact : sans paiement, aucune vente.",
          ),
        ],
        avoid: [
          {
            patterns: [
              "(d'abord|en premier|priorit)[^.]{0,40}avatar|avatar[^.]{0,40}(d'abord|en premier|en priorite)",
            ],
            message:
              "Les avatars n’apportent aucune valeur tant que le paiement ne fonctionne pas.",
          },
        ],
      },
      {
        model:
          "L’impact sur les clients (combien sont gênés par le suivi actuel ?) et l’effort ou les dépendances de chaque demande.",
        criteria: [
          c(
            "L’impact ou la valeur",
            [
              "impact|valeur|client|usage|demande|satisfaction|reclamation|benefice",
            ],
            "Il faut savoir combien de clients chaque demande aide.",
          ),
          c(
            "L’effort, le coût ou les dépendances",
            ["effort|cout|complex|temps|charge|dependanc|risque|delai"],
            "Il faut aussi connaître l’effort ou les dépendances.",
          ),
        ],
      },
      {
        model:
          "Consigner dans un journal de décisions : le choix, les critères utilisés, la justification, la personne qui arbitre et la date.",
        criteria: [
          c(
            "Une trace écrite",
            [
              "document|ecri|consign|trace|journal|registre|backlog|compte[- ]rendu|note|wiki|confluence|jira",
            ],
            "Indique où la décision est consignée.",
          ),
          c(
            "Critères et décideur",
            [
              "critere|justif|raison|pourquoi|decideur|qui (a )?(decide|arbitr)|arbitr|date",
            ],
            "Garde les critères, la justification et le nom de qui a tranché.",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Prioriser selon un objectif",
        ["objectif|\\bbut\\b|valeur|impact"],
        "Rappelle qu’une priorité se rattache à un objectif.",
      ),
      c(
        "Utiliser des critères explicites",
        ["critere|effort|cout|risque|urgence"],
        "Mentionne les critères (impact, effort, risque…).",
      ),
      c(
        "Tracer la décision et le décideur",
        ["decid|arbitr|trace|document|consign"],
        "Ajoute la traçabilité de l’arbitrage.",
      ),
    ],
  },
  "ba-data": {
    checks: [
      {
        model:
          "Une livraison est en retard si l’heure de livraison effective dépasse la fin du créneau promis au client.",
        criteria: [
          c(
            "Comparaison réel / promis",
            [
              "(effectiv|reel|livr)[^.]{0,120}(promis|prevu|creneau|annonce|engag)|(promis|prevu|creneau|annonce)[^.]{0,120}(effectiv|reel|livr)",
            ],
            "Compare l’heure réelle à l’heure promise.",
          ),
          c(
            "Un seuil précis",
            ["\\d|minute|heure|fin du creneau|apres|depasse|seuil"],
            "Précise à partir de quand on compte un retard.",
          ),
        ],
      },
      {
        model:
          "Vérifier l’horodatage réel et le créneau promis ; exclure ou traiter à part les annulations et absences client ; comparer des volumes suffisants par transporteur.",
        criteria: [
          c(
            "Les données nécessaires",
            [
              "horodat|heure|date|donnee|source|creneau|transporteur|systeme|qualite",
            ],
            "Liste les données à vérifier (heures réelles, créneaux, transporteur).",
          ),
          c(
            "Les exclusions ou limites",
            [
              "exclu|annul|absen|fuseau|volume|cas particulier|hors|incomplet|manquant|doublon",
            ],
            "Pense aux cas à exclure (annulations, absences, faibles volumes).",
          ),
        ],
      },
      {
        model:
          "Décider de la répartition des volumes entre transporteurs, ou renégocier le contrat de celui qui dépasse le seuil.",
        criteria: [
          c(
            "Une décision concrète",
            [
              "decid|decision|choisir|changer|renegoc|contrat|penal|arbitr|reparti|allouer|garder|remplacer",
            ],
            "Dis quelle décision le chiffre doit éclairer.",
          ),
          c(
            "Liée aux transporteurs",
            ["transporteur|prestataire|fournisseur|contrat|volume|zone"],
            "Relie la décision à la comparaison des transporteurs.",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Définir précisément l’indicateur",
        ["defini|precis|reproductible|formule|calcul"],
        "Rappelle qu’un indicateur a une définition reproductible.",
      ),
      c(
        "Connaître les limites des données",
        ["limite|exclu|qualite|biais|source|perimetre"],
        "Mentionne les limites et exclusions.",
      ),
      c(
        "Relier le chiffre à une décision",
        ["decision|decider|action|choisir"],
        "Ajoute à quelle décision sert le chiffre.",
      ),
    ],
  },
  "ba-recette": {
    checks: [
      {
        model:
          "Prérequis : un rendez-vous confirmé demain à 10 h, client avec un numéro valide. Action : déclencher le traitement des rappels aujourd’hui à 10 h.",
        criteria: [
          c(
            "Des prérequis reproductibles",
            [
              "prerequis|rendez-vous|rdv|demain|numero|donnee|compte|client|configur",
            ],
            "Décris l’état de départ (rendez-vous prévu demain, numéro valide).",
          ),
          c(
            "Une action déclenchée",
            [
              "declench|lancer|execut|attendre|simuler|avancer|horloge|traitement|batch|action|cliqu",
            ],
            "Dis ce que tu fais pour lancer le test.",
          ),
        ],
      },
      {
        model:
          "Le client reçoit un seul rappel, au bon numéro, mentionnant la date, l’heure et le lieu du rendez-vous.",
        criteria: [
          c(
            "Un résultat observable",
            ["recoi|recu|envoy|affich|sms|mail|message|notification|rappel"],
            "Décris ce qu’on peut constater (le client reçoit…).",
          ),
          c(
            "Précis (destinataire, contenu, moment)",
            [
              "contenu|destinataire|heure|date|\\d|une fois|un seul|texte|lieu|bon numero",
            ],
            "Précise le destinataire, le contenu ou le moment de l’envoi.",
          ),
        ],
      },
      {
        model:
          "Annuler le rendez-vous avant le déclenchement : aucun rappel ne doit être envoyé.",
        criteria: [
          c(
            "Un cas alternatif pertinent",
            [
              "annul|modifi|deplac|report|invalide|sans numero|moins de 24|meme jour|doublon|echec",
            ],
            "L’énoncé suggère l’annulation : teste ce cas.",
          ),
          c(
            "Son résultat attendu",
            ["aucun|pas de|ne (doit|recoit)|n'est pas|rien|attendu|verifi"],
            "Dis ce qui doit se passer (aucun rappel envoyé).",
          ),
        ],
      },
    ],
    keyIdeas: [
      c(
        "Prérequis, action, résultat",
        ["prerequis|action|resultat|reproduc|etape"],
        "Rappelle la structure d’un cas de test.",
      ),
      c(
        "Un résultat observable",
        ["observable|attendu|verifi|precis"],
        "Mentionne le résultat attendu vérifiable.",
      ),
      c(
        "Tester les cas alternatifs",
        ["alternati|exception|annul|erreur|limite|cas"],
        "Ajoute l’importance des cas alternatifs.",
      ),
    ],
  },
};
