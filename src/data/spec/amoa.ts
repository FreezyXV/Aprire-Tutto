import type { Course, Lesson } from "@/lib/types";
import { c, LUMEN, q } from "./helpers";

/*
 * Specialization: AMOA and change management. Original writing in French,
 * informed by the owner's private reference sheet (not reproduced), the
 * IIBA standard and common project-management practice (ADKAR by Prosci).
 */
const lessons: Lesson[] = [
  {
    id: "amoa-cadrage",
    title: "Cadrer avant d’avancer.",
    subtitle:
      "Poser le périmètre, les objectifs et la gouvernance d’une mission.",
    skill: "Cadrer une mission",
    recall: q(
      "Un projet démarre sans document de cadrage. Quel risque est le plus probable ?",
      [
        "Un budget trop élevé dès le départ",
        "Des attentes différentes selon les acteurs, découvertes trop tard",
        "Une équipe technique trop nombreuse",
      ],
      1,
      "Sans cadrage écrit, chacun garde sa propre vision du périmètre et des objectifs : les écarts apparaissent en recette, quand ils coûtent le plus.",
    ),
    paragraphs: [
      "Le cadrage fixe ce que le projet doit produire, pour qui, dans quelles limites et avec quelle gouvernance. Il se formalise dans une note de cadrage validée par le sponsor.",
      "Un bon cadrage écrit autant ce qui est exclu que ce qui est inclus, et nomme qui décide de quoi.",
    ],
    takeaway:
      "Un périmètre non écrit est un périmètre qui s’élargit tout seul.",
    example: {
      context: "Refonte du suivi des commandes d’un site marchand.",
      before: "« On améliore le suivi des commandes. »",
      after:
        "« Inclus : notifications et page de suivi. Exclu : refonte du paiement. Objectif : −50 % d’appels sur le suivi en 6 mois. Arbitrage : la directrice e-commerce. »",
    },
    check: q(
      "Quel élément rend un objectif de cadrage vérifiable ?",
      [
        "Un verbe d’action ambitieux",
        "Un indicateur, une cible et une échéance",
        "La liste des développeurs mobilisés",
      ],
      1,
      "Un objectif vérifiable précise ce qu’on mesure, la valeur visée et la date. Sans ces trois éléments, on ne peut pas conclure à la réussite.",
    ),
    transfer: q(
      "En cours de projet, le marketing demande d’ajouter un programme de fidélité. Que fais-tu d’abord ?",
      [
        "Tu l’ajoutes : le marketing est un client important",
        "Tu refuses : ce n’était pas prévu",
        "Tu vérifies s’il est dans le périmètre, puis tu prépares une demande de changement pour arbitrage",
      ],
      2,
      "Le cadrage sert de référence : une demande hors périmètre devient une demande de changement, évaluée (valeur, coût, délai) et arbitrée par le décideur.",
    ),
    exam: q(
      "Qui valide la note de cadrage ?",
      [
        "Le sponsor ou le décideur métier du projet",
        "Le BA qui l’a rédigée",
        "L’équipe de développement",
      ],
      0,
      "Le BA rédige et fait converger ; le sponsor, qui porte les objectifs et le budget, valide.",
    ),
    mission: {
      title: "Rédige l’essentiel d’une note de cadrage.",
      context:
        "Une PME veut « moderniser la prise de rendez-vous » de ses ateliers de réparation. La directrice des opérations sponsorise le projet ; elle veut un résultat avant l’été.",
      prompts: [
        "Formule un objectif mesurable pour ce projet.",
        "Indique un élément inclus et un élément exclu du périmètre, puis qui arbitre.",
      ],
      rubric: [
        "Mon objectif a un indicateur, une cible et une échéance.",
        "Mon périmètre dit ce qui est exclu et nomme le décideur.",
      ],
      example:
        "Objectif : faire passer de 40 % à 70 % la part des rendez-vous pris en ligne d’ici fin juin. Inclus : prise et modification de rendez-vous en ligne. Exclu : paiement en ligne. Arbitrage : la directrice des opérations.",
      checks: [
        {
          model:
            "Faire passer de 40 % à 70 % la part des rendez-vous pris en ligne d’ici fin juin.",
          criteria: [
            c(
              "Un indicateur chiffré",
              ["\\d|%|taux|part|nombre|delai|duree"],
              "Indique ce que tu mesures avec un chiffre.",
            ),
            c(
              "Une échéance",
              [
                "d'ici|avant|fin |juin|juillet|ete|mois|semaine|trimestre|date|echeance|\\b20\\d\\d\\b",
              ],
              "Ajoute une date ou une période.",
            ),
          ],
          avoid: [
            {
              patterns: ["^[^\\d%]*(moderniser|ameliorer|optimiser)[^\\d%]*$"],
              message:
                "« Moderniser » ou « améliorer » sans chiffre n’est pas vérifiable.",
            },
          ],
        },
        {
          model:
            "Inclus : prise et modification de rendez-vous en ligne. Exclu : paiement en ligne. Arbitrage : la directrice des opérations.",
          criteria: [
            c(
              "Un élément inclus",
              ["inclu|dans le perimetre|in scope|couvre|prevu"],
              "Précise ce qui fait partie du projet.",
            ),
            c(
              "Un élément exclu",
              [
                "exclu|hors perimetre|hors du perimetre|pas inclus|ne comprend pas|out of scope|won't",
              ],
              "Écris noir sur blanc ce qui n’est pas fait.",
            ),
            c(
              "Le décideur",
              ["arbitr|decid|sponsor|directrice|directeur|valide"],
              "Nomme qui tranche en cas de désaccord.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Le cadrage fixe objectifs, périmètre et gouvernance",
        ["cadrage|perimetre|objectif"],
        "Rappelle ce que contient un cadrage.",
      ),
      c(
        "Écrire ce qui est exclu",
        ["exclu|hors"],
        "Mentionne l’importance de l’exclu.",
      ),
      c("Le sponsor valide", ["sponsor|valid|decid"], "Dis qui valide."),
    ],
    cards: [
      {
        front: "Que contient une note de cadrage ?",
        back: "Contexte et enjeux, objectifs mesurables, périmètre inclus et exclu, parties prenantes et gouvernance, contraintes, risques, jalons et livrables.",
      },
      {
        front: "Que devient une demande hors périmètre ?",
        back: "Une demande de changement : évaluée (valeur, coût, délai, risques) puis arbitrée par le décideur.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras rédiger les éléments clés d’une note de cadrage, fixer des objectifs vérifiables et organiser qui décide de quoi.",
      prerequisites: [
        "Socle BA, chapitre 1 : formuler un besoin.",
        "Socle BA, chapitre 3 : les rôles MOA, AMOA, MOE.",
      ],
      sections: [
        {
          heading: "À quoi sert le cadrage",
          paragraphs: [
            "Le cadrage transforme une intention (« moderniser », « améliorer ») en engagement : ce que le projet doit produire, pour qui, dans quelles limites et comment on saura qu’il a réussi. C’est la première pièce que l’AMOA construit avec le sponsor.",
            "Il protège tout le monde : le sponsor sait ce qu’il obtiendra, l’équipe sait ce qu’elle ne fera pas, et chaque nouvelle demande peut être comparée à une référence écrite.",
          ],
          diagram: {
            kind: "table",
            title: "Le squelette d’une note de cadrage",
            columns: ["Rubrique", "Question à laquelle elle répond"],
            rows: [
              ["Contexte et enjeux", "Pourquoi maintenant ?"],
              ["Objectifs", "Qu’est-ce qui aura changé, chiffres à l’appui ?"],
              ["Périmètre", "Qu’est-ce qui est inclus, et surtout exclu ?"],
              ["Parties prenantes", "Qui est concerné, qui décide ?"],
              ["Contraintes", "Budget, délais, règles imposées"],
              ["Risques et hypothèses", "Qu’est-ce qui pourrait dérailler ?"],
              ["Jalons et livrables", "Quoi, quand, validé par qui ?"],
            ],
            caption:
              "Deux pages suffisent souvent : un cadrage court et validé vaut mieux qu’un long document que personne ne lit.",
          },
        },
        {
          heading: "Des objectifs qu’on peut vérifier",
          paragraphs: [
            "Un objectif utile précise un indicateur, une cible et une échéance : « faire passer de 40 % à 70 % la part des rendez-vous pris en ligne d’ici fin juin ». Il découle du besoin et servira, à la fin, à mesurer la valeur obtenue.",
            "Méfie-toi des objectifs qui décrivent une activité (« déployer un nouvel outil ») plutôt qu’un résultat : on peut déployer l’outil et ne rien améliorer.",
          ],
          keyPoint:
            "Un objectif décrit un résultat mesurable, pas une activité.",
        },
        {
          heading: "Le périmètre : l’inclus et l’exclu",
          paragraphs: [
            "Le périmètre liste ce que le projet couvre. Sa partie la plus précieuse est l’exclu : écrire « le paiement en ligne n’est pas dans cette version » évite des semaines de malentendus.",
            "Quand une nouvelle demande arrive, on la compare au périmètre. Si elle en sort, elle devient une demande de changement : on évalue sa valeur, son coût, son effet sur le délai, puis le décideur arbitre.",
          ],
        },
        {
          heading: "Qui décide de quoi : la gouvernance",
          paragraphs: [
            "La gouvernance précise les instances et les rôles. Le comité de pilotage (COPIL) réunit sponsor et direction pour les arbitrages majeurs ; le comité projet (COPROJ) suit l’avancement chaque semaine. Une matrice RACI clarifie, pour chaque livrable, qui réalise, qui approuve, qui est consulté et qui est informé.",
            "Une seule personne doit approuver chaque livrable : deux « A » sur une même ligne, c’est l’assurance d’un blocage.",
          ],
          diagram: {
            kind: "table",
            title: "Un RACI de cadrage",
            columns: ["Livrable", "BA / AMOA", "Sponsor", "Équipe technique"],
            rows: [
              ["Note de cadrage", "Réalise", "Approuve", "Consultée"],
              ["Expression de besoin", "Réalise", "Approuve", "Consultée"],
              [
                "Spécifications techniques",
                "Consulté",
                "Informé",
                "Réalise et approuve",
              ],
            ],
            caption:
              "Le RACI se lit ligne par ligne : une seule approbation par livrable.",
          },
        },
      ],
      workedExample: {
        title: "« Moderniser la prise de rendez-vous »",
        situation:
          "La directrice des opérations d’une PME de réparation veut « moderniser la prise de rendez-vous » avant l’été.",
        steps: [
          {
            label: "Faire préciser l’enjeu",
            detail:
              "Aujourd’hui, 60 % des rendez-vous sont pris par téléphone et saturent l’accueil aux heures de pointe.",
          },
          {
            label: "Formuler l’objectif",
            detail:
              "Passer de 40 % à 70 % de rendez-vous pris en ligne d’ici fin juin, sans baisse de satisfaction.",
          },
          {
            label: "Délimiter",
            detail:
              "Inclus : prise, modification et annulation en ligne. Exclu : paiement en ligne et devis automatiques.",
          },
          {
            label: "Organiser la décision",
            detail:
              "Sponsor : la directrice des opérations. COPIL mensuel, point projet hebdomadaire, RACI des livrables.",
          },
        ],
        outcome:
          "En deux pages validées, le projet a une cible, des limites et un arbitre : les demandes futures pourront être évaluées sereinement.",
      },
      pitfalls: [
        {
          confusion:
            "Considérer le cadrage comme une formalité administrative.",
          correction:
            "C’est la référence de toutes les décisions ; sans elle, chaque demande se discute de zéro.",
          counterExample:
            "Trois mois après le lancement, le marketing obtient « juste une petite fonction » : sans périmètre écrit, impossible de l’évaluer.",
        },
        {
          confusion: "Laisser deux personnes approuver le même livrable.",
          correction:
            "Une seule approbation par livrable ; les autres sont consultés.",
          counterExample:
            "Deux directeurs « valident » les spécifications : chacun attend l’autre, le projet prend trois semaines de retard.",
        },
      ],
      summary: [
        "Le cadrage transforme une intention en engagement écrit et validé.",
        "Objectif = indicateur + cible + échéance.",
        "Le périmètre écrit l’inclus et surtout l’exclu.",
        "Une demande hors périmètre devient une demande de changement arbitrée.",
        "COPIL, COPROJ et RACI organisent la décision.",
      ],
      glossary: [
        {
          term: "Note de cadrage",
          definition:
            "Document court qui fixe contexte, objectifs, périmètre, gouvernance, risques et jalons.",
        },
        {
          term: "COPIL",
          definition:
            "Comité de pilotage : sponsors et direction, arbitrages majeurs.",
        },
        {
          term: "COPROJ",
          definition: "Comité projet : suivi opérationnel régulier.",
        },
        {
          term: "Demande de changement",
          definition:
            "Demande formelle de modifier le périmètre, le délai ou le budget, évaluée puis arbitrée.",
        },
      ],
    },
    caseStep: {
      title: "Dossier AMOA · Cadrer le projet Maison Lumen",
      context: `${LUMEN} La directrice lance le projet « commandes sans retard » et te demande la note de cadrage.`,
      prompts: [
        "Rédige deux objectifs mesurables pour ce projet.",
        "Écris le périmètre (un inclus, un exclu) et la gouvernance (qui décide, quelles instances).",
      ],
      criteria: [
        [
          "Indicateur, cible et échéance pour chaque objectif",
          "Lien avec les retards ou les appels",
        ],
        [
          "Un inclus et un exclu",
          "Un décideur nommé",
          "Au moins une instance (COPIL, point projet)",
        ],
      ],
      models: [
        "1) Réduire le délai entre paiement et expédition de 3 jours à 1 jour d’ici fin mars. 2) Diviser par deux les appels liés au suivi de commande d’ici fin juin.",
        "Inclus : vérification d’adresse, transmission à l’entrepôt, notifications client. Exclu : programme de fidélité et refonte du site. Décideuse : la directrice ; COPIL mensuel, point projet hebdomadaire avec service client et entrepôt.",
      ],
    },
  },
  {
    id: "amoa-cdc",
    title: "Du besoin au cahier des charges.",
    subtitle: "Formaliser pour choisir et faire réaliser la bonne solution.",
    skill: "Formaliser un cahier des charges",
    recall: q(
      "Un cahier des charges décrit d’abord…",
      [
        "La solution technique retenue",
        "Le besoin, le périmètre et les exigences attendues",
        "Le planning des développeurs",
      ],
      1,
      "Le cahier des charges exprime ce qui est attendu, pas comment le construire : il permet de comparer des solutions et de cadrer le réalisateur.",
    ),
    paragraphs: [
      "Le cahier des charges rassemble le besoin, le périmètre, les exigences et les critères de réussite. Il sert à choisir une solution et à cadrer celui qui la réalise.",
      "Il précède les spécifications détaillées, qui décrivent finement le comportement attendu fonctionnalité par fonctionnalité.",
    ],
    takeaway:
      "Le cahier des charges dit quoi et pourquoi ; la solution dira comment.",
    example: {
      context: "Choix d’un outil de prise de rendez-vous.",
      before: "« Il nous faut l’outil X, comme notre concurrent. »",
      after:
        "« Exigences : rendez-vous en ligne 24 h/24, rappel la veille, synchronisation avec le planning atelier, accessibilité RGAA AA. Critère de choix : couverture des exigences, coût sur 3 ans, délai de mise en place. »",
    },
    check: q(
      "Pourquoi écrire des exigences plutôt que nommer un logiciel ?",
      [
        "Pour pouvoir comparer plusieurs solutions sur des critères objectifs",
        "Parce que les logiciels changent de nom",
        "Pour allonger le document",
      ],
      0,
      "Des exigences neutres permettent de comparer plusieurs solutions et de vérifier, en recette, que celle retenue répond bien au besoin.",
    ),
    transfer: q(
      "Deux éditeurs répondent à ton cahier des charges. Comment les départager ?",
      [
        "Choisir le moins cher",
        "Noter chaque réponse sur une grille pondérée : couverture des exigences, coût total, délai, risques",
        "Choisir celui qui fait la meilleure démonstration",
      ],
      1,
      "Une grille pondérée, définie avant de lire les réponses, rend le choix traçable et défendable.",
    ),
    exam: q(
      "Quelle différence entre cahier des charges et spécifications fonctionnelles détaillées ?",
      [
        "Aucune, ce sont des synonymes",
        "Le cahier des charges exprime le besoin global ; les spécifications détaillent le comportement de chaque fonctionnalité",
        "Les spécifications sont écrites par le client, le cahier des charges par le développeur",
      ],
      1,
      "Le cahier des charges sert à choisir et cadrer ; les spécifications, plus fines, servent à réaliser et tester.",
    ),
    mission: {
      title: "Prépare le choix d’un outil.",
      context:
        "Une enseigne veut un outil de gestion des rendez-vous pour ses 12 magasins. Le directeur a déjà une préférence pour un éditeur qu’il connaît.",
      prompts: [
        "Écris deux exigences neutres, sans nommer d’outil, dont une non fonctionnelle.",
        "Propose trois critères de choix pour comparer les éditeurs, avec leur poids.",
      ],
      rubric: [
        "Mes exigences sont neutres et vérifiables, dont une non fonctionnelle.",
        "Mes critères sont pondérés et définis avant de comparer.",
      ],
      example:
        "Exigences : le client modifie son rendez-vous en ligne jusqu’à 2 heures avant ; la page s’affiche en moins de 2 secondes sur mobile. Critères : couverture des exigences 50 %, coût total sur 3 ans 30 %, délai de mise en place 20 %.",
      checks: [
        {
          model:
            "Le client peut modifier son rendez-vous en ligne jusqu’à 2 heures avant ; la page s’affiche en moins de 2 secondes sur mobile.",
          criteria: [
            c(
              "Une exigence fonctionnelle",
              [
                "peut|permet|doit pouvoir|possibilite|modifier|annuler|prendre|reserver|consulter",
              ],
              "Décris ce que l’utilisateur peut faire.",
            ),
            c(
              "Une exigence non fonctionnelle chiffrée",
              [
                "seconde|\\bs\\b|disponib|%|accessib|rgaa|securi|temps de reponse|performance|chiffr",
              ],
              "Ajoute une qualité mesurable (temps de réponse, disponibilité, accessibilité).",
            ),
          ],
        },
        {
          model:
            "Couverture des exigences 50 %, coût total sur 3 ans 30 %, délai de mise en place 20 %.",
          criteria: [
            c(
              "Des critères de comparaison",
              [
                "couverture|exigence|cout|prix|delai|risque|support|reference|integration",
              ],
              "Liste ce qui sert à comparer les éditeurs.",
            ),
            c(
              "Une pondération",
              ["%|poids|pondera|coefficient|/\\s*\\d|points"],
              "Donne un poids à chaque critère.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Exprimer le besoin, pas la solution",
        ["besoin|quoi|neutre|pas la solution|exigence"],
        "Rappelle que le cahier des charges reste neutre.",
      ),
      c(
        "Comparer avec une grille définie à l’avance",
        ["grille|critere|pondera|compar"],
        "Mentionne la grille de choix.",
      ),
      c(
        "Spécifications détaillées ensuite",
        ["specification|detail"],
        "Situe les spécifications détaillées.",
      ),
    ],
    cards: [
      {
        front: "Cahier des charges vs spécifications détaillées ?",
        back: "Le cahier des charges exprime besoin, périmètre et exigences pour choisir et cadrer ; les spécifications détaillent le comportement de chaque fonctionnalité pour réaliser et tester.",
      },
      {
        front: "Comment départager des éditeurs ?",
        back: "Avec une grille de critères pondérés définie avant de lire les réponses : couverture, coût total, délai, risques.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras structurer un cahier des charges, écrire des exigences neutres et comparer des solutions avec une grille pondérée.",
      prerequisites: [
        "Socle BA, chapitre 4 : les familles d’exigences.",
        "Chapitre précédent : le cadrage.",
      ],
      sections: [
        {
          heading: "Le cahier des charges dans le cycle du projet",
          paragraphs: [
            "Après le cadrage, l’AMOA formalise le besoin en exigences. Ce cahier des charges sert à choisir une solution (développement, progiciel, prestataire) puis à cadrer celui qui la réalise. Viennent ensuite les spécifications détaillées et, enfin, la recette qui vérifie le tout.",
          ],
          diagram: {
            kind: "flow",
            title: "Du besoin à la recette",
            steps: [
              { label: "Expression de besoin", tone: "apricot" },
              {
                label: "Cahier des charges",
                note: "Exigences, critères de réussite",
                tone: "marker",
              },
              { label: "Choix de la solution", note: "Grille pondérée" },
              { label: "Spécifications détaillées" },
              { label: "Recette", note: "Vérifie les exigences", tone: "sky" },
            ],
            caption:
              "Chaque étape s’appuie sur la précédente : la recette vérifie les exigences écrites au début.",
          },
        },
        {
          heading: "Des exigences neutres et vérifiables",
          paragraphs: [
            "Une exigence décrit ce qui est attendu sans imposer d’outil : « le client modifie son rendez-vous en ligne jusqu’à 2 heures avant ». Nommer un logiciel ferme la comparaison et fait du cahier des charges un bon de commande.",
            "Pense aux exigences non fonctionnelles (performance, accessibilité, sécurité, disponibilité) et aux contraintes (budget, date légale, intégration avec l’existant). Ce sont souvent elles qui départagent les solutions.",
          ],
          keyPoint:
            "Une exigence qui nomme un produit n’est plus une exigence : c’est un choix déjà fait.",
        },
        {
          heading: "Choisir avec une grille pondérée",
          paragraphs: [
            "Avant de lire les réponses des éditeurs, définis tes critères et leur poids : couverture des exigences, coût total sur plusieurs années, délai, risques, qualité du support. Chaque réponse est notée sur la même grille.",
            "La grille ne décide pas à ta place, mais elle rend le choix traçable : si le directeur préfère un éditeur, l’écart avec la note devient explicite et discutable.",
          ],
          diagram: {
            kind: "table",
            title: "Exemple de grille de choix",
            columns: ["Critère", "Poids", "Éditeur A", "Éditeur B"],
            rows: [
              ["Couverture des exigences", "50 %", "16/20", "13/20"],
              ["Coût total sur 3 ans", "30 %", "12/20", "17/20"],
              ["Délai de mise en place", "20 %", "14/20", "15/20"],
              ["Note pondérée", "100 %", "14,4", "14,6"],
            ],
            caption:
              "Notes fictives : B l’emporte de peu malgré une couverture plus faible. La discussion porte alors sur ce compromis.",
          },
        },
      ],
      workedExample: {
        title: "L’outil de rendez-vous des 12 magasins",
        situation:
          "Le directeur souhaite l’outil qu’il utilisait dans son ancienne entreprise. Tu dois rendre le choix objectif.",
        steps: [
          {
            label: "Reformuler en exigences",
            detail:
              "Prise et modification en ligne, rappel la veille, synchronisation avec le planning, affichage en moins de 2 s sur mobile.",
          },
          {
            label: "Ajouter les contraintes",
            detail:
              "Budget annuel plafonné, mise en service avant septembre, accessibilité RGAA AA.",
          },
          {
            label: "Fixer la grille",
            detail:
              "Couverture 50 %, coût sur 3 ans 30 %, délai 20 %, validée par le directeur avant l’appel aux éditeurs.",
          },
          {
            label: "Comparer",
            detail:
              "Trois éditeurs, dont celui du directeur, notés sur la même grille ; démonstrations sur des scénarios réels.",
          },
        ],
        outcome:
          "Le choix est documenté. Si l’outil du directeur l’emporte, c’est sur des critères partagés ; sinon, l’écart est visible et argumenté.",
      },
      pitfalls: [
        {
          confusion:
            "Écrire le cahier des charges à partir des fonctionnalités d’un outil connu.",
          correction:
            "Pars du besoin ; l’outil connu sera évalué comme les autres.",
          counterExample:
            "Le cahier des charges reprend la brochure d’un éditeur : les autres ne peuvent pas répondre équitablement.",
        },
        {
          confusion: "Définir la grille après avoir lu les réponses.",
          correction: "La grille se fixe avant, sinon elle s’ajuste au favori.",
          counterExample:
            "Le poids du « design » passe de 10 % à 30 % après la démonstration la plus séduisante.",
        },
      ],
      summary: [
        "Le cahier des charges exprime besoin, périmètre, exigences et critères de réussite.",
        "Les exigences restent neutres et vérifiables, non fonctionnelles comprises.",
        "Une grille pondérée, fixée à l’avance, rend le choix traçable.",
        "Les spécifications détaillées suivent ; la recette vérifie les exigences.",
      ],
      glossary: [
        {
          term: "Cahier des charges",
          definition:
            "Document qui exprime le besoin, le périmètre et les exigences pour choisir et cadrer une solution.",
        },
        {
          term: "Spécifications fonctionnelles détaillées",
          definition:
            "Description fine du comportement attendu de chaque fonctionnalité.",
        },
        {
          term: "RFP (appel d’offres)",
          definition:
            "Demande formelle de proposition chiffrée adressée à des fournisseurs.",
        },
        {
          term: "Grille pondérée",
          definition:
            "Liste de critères avec leur poids, utilisée pour comparer des solutions.",
        },
      ],
    },
    caseStep: {
      title: "Dossier AMOA · Choisir l’outil de suivi",
      context: `${LUMEN} Deux options pour le suivi des commandes : un module de l’ERP existant ou un outil spécialisé du marché.`,
      prompts: [
        "Écris trois exigences neutres pour l’outil de suivi, dont une non fonctionnelle.",
        "Propose une grille de comparaison pondérée et explique qui la valide.",
      ],
      criteria: [
        [
          "Exigences sans nom d’outil",
          "Une exigence non fonctionnelle mesurable",
        ],
        [
          "Critères pertinents",
          "Pondération",
          "Validation par la directrice avant comparaison",
        ],
      ],
      models: [
        "Le client consulte l’état de sa commande sans se connecter, via un lien reçu par e-mail ; l’entrepôt met à jour le statut en un geste ; la page de suivi s’affiche en moins de 2 secondes sur mobile.",
        "Couverture des exigences 45 %, coût sur 3 ans 25 %, intégration avec l’ERP 20 %, délai 10 %. La directrice valide la grille avant que les deux options soient notées.",
      ],
    },
  },
  {
    id: "amoa-changement",
    title: "Accompagner le changement.",
    subtitle: "Un outil livré n’est utile que s’il est adopté.",
    skill: "Conduire le changement",
    recall: q(
      "Un nouvel outil fonctionne parfaitement, mais les équipes continuent d’utiliser leur tableur. Quelle est la cause la plus probable ?",
      [
        "Un défaut technique caché",
        "Un changement mal accompagné : utilité, formation ou impacts mal traités",
        "Un budget trop faible",
      ],
      1,
      "L’adoption dépend de la compréhension, de l’envie et de la capacité des personnes à changer leurs habitudes, pas seulement de la qualité de l’outil.",
    ),
    paragraphs: [
      "La conduite du changement prépare les personnes à adopter une nouvelle façon de travailler. Elle commence dès le cadrage, pas la veille de la mise en production.",
      "On analyse les impacts (qui change quoi), on communique sur le pourquoi, on forme au comment, puis on mesure l’adoption.",
    ],
    takeaway:
      "Un projet réussit quand les usages changent, pas quand l’outil est livré.",
    example: {
      context: "Nouvel outil de suivi des commandes pour le service client.",
      before:
        "Un e-mail la veille : « Demain, nouvel outil. Tutoriel en pièce jointe. »",
      after:
        "Analyse d’impacts par équipe, ambassadeurs formés en avance, démonstration du gain (moins de ressaisie), formation pratique, suivi du taux d’utilisation pendant un mois.",
    },
    check: q(
      "Par quoi commence une analyse d’impacts ?",
      [
        "Par la rédaction du support de formation",
        "Par l’identification, pour chaque groupe, de ce qui change dans son travail",
        "Par le choix de la date de mise en production",
      ],
      1,
      "On ne peut accompagner un changement qu’après avoir identifié qui est touché et comment : tâches, outils, compétences, organisation.",
    ),
    transfer: q(
      "Un chef d’équipe très respecté est opposé au projet. Que fais-tu ?",
      [
        "Tu l’ignores : la direction a décidé",
        "Tu écoutes ses objections, tu cherches ce qui l’inquiète et tu l’associes à la solution",
        "Tu demandes à la direction de le remplacer",
      ],
      1,
      "Une résistance contient souvent une information utile. Un opposant écouté et associé peut devenir un relais puissant.",
    ),
    exam: q(
      "Dans le modèle ADKAR, que faut-il obtenir avant de former les personnes ?",
      [
        "La conscience du besoin de changer et l’envie d’y participer",
        "La maîtrise complète de l’outil",
        "La validation du budget de formation",
      ],
      0,
      "ADKAR enchaîne Awareness (conscience), Desire (envie), Knowledge (savoir), Ability (capacité), Reinforcement (ancrage) : former quelqu’un qui ne voit pas l’intérêt est peu efficace.",
    ),
    mission: {
      title: "Prépare l’adoption d’un nouvel outil.",
      context:
        "Le service client (12 conseillers) va passer d’un tableur partagé à un outil de suivi des réclamations. Plusieurs conseillers expérimentés sont sceptiques.",
      prompts: [
        "Décris deux impacts concrets du changement pour les conseillers.",
        "Propose deux actions d’accompagnement, dont une pour les sceptiques.",
      ],
      rubric: [
        "Mes impacts décrivent ce qui change dans le travail réel.",
        "Mes actions traitent l’utilité perçue et les résistances.",
      ],
      example:
        "Impacts : saisie dans l’outil au lieu du tableur ; suivi des délais visible par le responsable. Actions : associer deux conseillers sceptiques aux tests pour qu’ils deviennent référents ; former sur des cas réels en montrant le temps gagné.",
      checks: [
        {
          model:
            "Les conseillers saisissent les réclamations dans l’outil au lieu du tableur ; leurs délais de traitement deviennent visibles par le responsable.",
          criteria: [
            c(
              "Un changement de tâche ou d’outil",
              [
                "saisi|tableur|outil|tache|procedure|habitude|ecran|remplac|au lieu",
              ],
              "Décris ce qui change dans le travail quotidien.",
            ),
            c(
              "Un second impact (organisation, contrôle, compétence)",
              [
                "visib|suivi|responsable|delai|controle|competence|organisation|role|indicateur",
              ],
              "Ajoute un impact sur l’organisation ou les compétences.",
            ),
          ],
        },
        {
          model:
            "Associer deux conseillers sceptiques aux tests pour qu’ils deviennent référents ; former sur des cas réels en montrant le temps gagné.",
          criteria: [
            c(
              "Une action pour les sceptiques",
              [
                "sceptique|resist|opposant|associ|implique|ecout|referent|ambassadeur|relais",
              ],
              "Prévois une action qui associe ou écoute les sceptiques.",
            ),
            c(
              "Une action de formation ou de communication",
              [
                "form|demonstr|communi|atelier|tutoriel|accompagn|exemple|cas reel",
              ],
              "Ajoute une action de formation ou de communication.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Analyser les impacts par groupe",
        ["impact|change|groupe|equipe"],
        "Rappelle l’analyse d’impacts.",
      ),
      c(
        "Expliquer le pourquoi avant le comment",
        ["pourquoi|sens|conscience|envie|utilite"],
        "Mentionne le sens du changement.",
      ),
      c(
        "Mesurer l’adoption",
        ["adopt|usage|mesur|suivi"],
        "Ajoute la mesure de l’adoption.",
      ),
    ],
    cards: [
      {
        front: "Les cinq étapes d’ADKAR ?",
        back: "Conscience du besoin, envie de participer, connaissance du comment, capacité à faire, ancrage dans la durée.",
      },
      {
        front: "Que contient une analyse d’impacts ?",
        back: "Pour chaque groupe : ce qui change (tâches, outils, compétences, organisation), l’ampleur du changement et l’accompagnement prévu.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras analyser les impacts d’un changement, choisir des actions d’accompagnement adaptées et mesurer l’adoption.",
      prerequisites: ["Socle BA, chapitre 2 : les parties prenantes."],
      sections: [
        {
          heading: "Pourquoi les outils « parfaits » échouent",
          paragraphs: [
            "Un projet peut livrer exactement ce qui était spécifié et échouer quand même : les utilisateurs gardent leurs anciennes habitudes, contournent l’outil ou l’utilisent à moitié. La valeur attendue n’arrive jamais.",
            "La conduite du changement traite cette dimension humaine : comprendre ce que le changement coûte à chacun, donner envie, former, puis ancrer les nouveaux usages.",
          ],
          diagram: {
            kind: "flow",
            title: "ADKAR : les cinq étapes d’un changement individuel",
            steps: [
              {
                label: "Conscience",
                note: "Pourquoi changer ?",
                tone: "apricot",
              },
              {
                label: "Envie",
                note: "Qu’est-ce que j’y gagne ?",
                tone: "apricot",
              },
              {
                label: "Connaissance",
                note: "Comment faire ?",
                tone: "marker",
              },
              {
                label: "Capacité",
                note: "Je sais le faire en vrai",
                tone: "marker",
              },
              { label: "Ancrage", note: "Je continue", tone: "sky" },
            ],
            caption:
              "Former (connaissance) quelqu’un qui ne voit pas l’intérêt du changement (conscience, envie) donne peu de résultats.",
          },
        },
        {
          heading: "L’analyse d’impacts",
          paragraphs: [
            "Pour chaque groupe concerné, liste ce qui change : tâches, outils, compétences, organisation, indicateurs de performance. Évalue l’ampleur (faible, moyenne, forte) : c’est elle qui dimensionne l’accompagnement.",
            "Les impacts invisibles comptent aussi : une activité rendue mesurable (« mes délais deviennent visibles ») peut inquiéter davantage qu’un nouvel écran.",
          ],
          diagram: {
            kind: "table",
            title: "Extrait d’analyse d’impacts",
            columns: ["Groupe", "Ce qui change", "Ampleur", "Accompagnement"],
            rows: [
              [
                "Conseillers",
                "Saisie dans l’outil, délais visibles",
                "Forte",
                "Référents, formation sur cas réels",
              ],
              [
                "Responsable",
                "Pilotage par tableau de bord",
                "Moyenne",
                "Atelier sur les indicateurs",
              ],
              [
                "Comptabilité",
                "Reçoit les remboursements validés",
                "Faible",
                "Note d’information",
              ],
            ],
            caption:
              "L’ampleur de l’impact décide de l’effort d’accompagnement, groupe par groupe.",
          },
        },
        {
          heading: "Communiquer, former, écouter les résistances",
          paragraphs: [
            "Communique d’abord le pourquoi (le problème résolu, le gain pour chacun), ensuite le comment. Forme sur des cas réels, au plus près de la mise en service, et prévois des référents de proximité.",
            "Une résistance n’est pas un obstacle à écraser : elle signale souvent un risque réel (charge de travail, perte d’autonomie, défaut de l’outil). Écoute-la, traite ce qui est fondé et associe les opposants influents aux tests.",
          ],
          keyPoint:
            "Un sceptique écouté et associé devient souvent ton meilleur relais.",
        },
        {
          heading: "Mesurer l’adoption",
          paragraphs: [
            "Après la mise en service, suis des indicateurs d’usage : part des réclamations saisies dans l’outil, nombre de contournements, questions au support, satisfaction des utilisateurs. Compare à la cible fixée au cadrage.",
            "Si l’adoption stagne, reviens aux étapes ADKAR : manque-t-il le sens, l’envie, la formation ou la pratique ?",
          ],
        },
      ],
      workedExample: {
        title: "Du tableur à l’outil de réclamations",
        situation:
          "Douze conseillers vont quitter leur tableur partagé ; plusieurs anciens sont sceptiques.",
        steps: [
          {
            label: "Analyser les impacts",
            detail:
              "Saisie dans l’outil, délais visibles par le responsable : impact fort pour les conseillers.",
          },
          {
            label: "Donner le sens",
            detail:
              "Montrer le problème actuel (doublons, réclamations perdues) et le gain : moins de ressaisie, historique complet.",
          },
          {
            label: "Associer les sceptiques",
            detail:
              "Deux conseillers expérimentés testent l’outil et proposent des ajustements ; ils deviennent référents.",
          },
          {
            label: "Former et accompagner",
            detail:
              "Sessions courtes sur des cas réels la semaine de la mise en service ; référents disponibles.",
          },
          {
            label: "Mesurer",
            detail:
              "Cible : 90 % des réclamations saisies dans l’outil après un mois ; suivi hebdomadaire.",
          },
        ],
        outcome:
          "L’outil est adopté parce que les conseillers comprennent son intérêt, l’ont amélioré et savent s’en servir.",
      },
      pitfalls: [
        {
          confusion:
            "Réduire le changement à une formation la veille du lancement.",
          correction:
            "Le changement se prépare dès le cadrage : sens, impacts, implication.",
          counterExample:
            "Une formation impeccable le vendredi ; lundi, la moitié de l’équipe reste sur le tableur.",
        },
        {
          confusion: "Traiter les résistants comme des obstacles.",
          correction: "Leurs objections contiennent souvent des risques réels.",
          counterExample:
            "Un conseiller signale que l’outil ne gère pas les retours partiels : c’était un vrai manque.",
        },
      ],
      summary: [
        "Un outil livré n’a de valeur que s’il est adopté.",
        "ADKAR : conscience, envie, connaissance, capacité, ancrage.",
        "L’analyse d’impacts dimensionne l’accompagnement, groupe par groupe.",
        "Les résistances signalent souvent des risques réels : écoute et associe.",
        "On mesure l’adoption après la mise en service.",
      ],
      glossary: [
        {
          term: "Conduite du changement",
          definition:
            "Ensemble des actions qui préparent les personnes à adopter une nouvelle façon de travailler.",
        },
        {
          term: "Analyse d’impacts",
          definition:
            "Identification, par groupe, de ce qui change et de l’ampleur du changement.",
        },
        {
          term: "ADKAR",
          definition:
            "Modèle de changement individuel : conscience, envie, connaissance, capacité, ancrage.",
        },
        {
          term: "Référent",
          definition:
            "Utilisateur formé en avance qui aide ses collègues au quotidien.",
        },
      ],
    },
    caseStep: {
      title: "Dossier AMOA · Faire adopter les nouveaux usages",
      context: `${LUMEN} L’entrepôt va abandonner les bons papier pour une file de commandes à l’écran. Le chef d’entrepôt, très respecté, craint de perdre du temps.`,
      prompts: [
        "Analyse les impacts pour l’entrepôt et le service client (ce qui change, ampleur).",
        "Propose un plan d’accompagnement en trois actions, dont une pour le chef d’entrepôt, et un indicateur d’adoption.",
      ],
      criteria: [
        ["Impacts concrets par groupe", "Ampleur évaluée"],
        [
          "Action spécifique pour le chef d’entrepôt",
          "Formation ou communication",
          "Indicateur d’adoption chiffré",
        ],
      ],
      models: [
        "Entrepôt : préparation pilotée par la file à l’écran au lieu des bons papier ; impact fort. Service client : vérification d’adresse automatisée, moins de saisie ; impact moyen.",
        "Associer le chef d’entrepôt aux tests et au réglage de la file, pour qu’il devienne référent ; former l’équipe sur des commandes réelles à 7 h la semaine du lancement ; communiquer le gain attendu (fin des bons perdus). Indicateur : 95 % des commandes préparées depuis la file après trois semaines.",
      ],
    },
  },
  {
    id: "amoa-pilotage",
    title: "Piloter sans subir.",
    subtitle:
      "Risques, changements et comités : garder le projet sous contrôle.",
    skill: "Piloter et sécuriser",
    recall: q(
      "Comment calcule-t-on l’exposition à un risque ?",
      [
        "Probabilité × impact",
        "Coût du projet ÷ durée",
        "Nombre de risques identifiés",
      ],
      0,
      "L’exposition combine la probabilité que le risque survienne et l’impact s’il survient ; elle permet de prioriser les risques.",
    ),
    paragraphs: [
      "Piloter, c’est anticiper : tenir un registre des risques, traiter les demandes de changement selon une règle claire et faire remonter les décisions aux bonnes instances.",
      "Le BA ou l’AMOA alimente ces mécanismes avec des informations factuelles : impacts, options, recommandations.",
    ],
    takeaway:
      "Un risque identifié et suivi coûte moins cher qu’un incident subi.",
    example: {
      context: "Projet dont la recette tombe pendant les congés d’été.",
      before: "« On verra en juillet si les métiers sont disponibles. »",
      after:
        "Risque inscrit au registre : indisponibilité des testeurs métier en août (probabilité 4, impact 3, exposition 12). Traitement : planifier la recette en juin et nommer un suppléant par service.",
    },
    check: q(
      "Un risque a une probabilité de 2/5 et un impact de 5/5. Que fais-tu ?",
      [
        "Rien, il est peu probable",
        "Tu le suis de près et prépares un plan, car son impact est majeur",
        "Tu le supprimes du registre",
      ],
      1,
      "Un impact majeur justifie un plan de traitement même si la probabilité est modérée : exposition 10, zone élevée.",
    ),
    transfer: q(
      "Une demande de changement arrive deux semaines avant la mise en production. Quelle est la bonne démarche ?",
      [
        "L’intégrer tout de suite pour faire plaisir",
        "Évaluer valeur, coût, risque et effet sur la date, puis faire arbitrer par le comité",
        "La refuser systématiquement",
      ],
      1,
      "Toute demande de changement suit la même règle : évaluation factuelle puis arbitrage par l’instance compétente.",
    ),
    exam: q(
      "Quelle stratégie de traitement consiste à confier la charge d’un risque à un tiers ?",
      ["Éviter", "Réduire", "Transférer"],
      2,
      "Transférer, c’est déplacer la charge du risque vers un tiers : assurance, sous-traitance, clause contractuelle.",
    ),
    mission: {
      title: "Tiens le registre des risques.",
      context:
        "Un projet de nouvel outil de rendez-vous doit ouvrir avant la rentrée. L’éditeur dépend d’une interface avec le planning atelier, jamais testée. Les responsables d’atelier partent en congés en août.",
      prompts: [
        "Décris un risque avec sa probabilité, son impact et son exposition.",
        "Propose une stratégie de traitement et une action concrète avec un porteur.",
      ],
      rubric: [
        "Mon risque est formulé avec cause, effet, probabilité et impact.",
        "Ma stratégie est nommée et mon action a un porteur.",
      ],
      example:
        "Risque : l’interface avec le planning atelier ne fonctionne pas à temps, ce qui retarde l’ouverture. Probabilité 3, impact 4, exposition 12. Stratégie : réduire. Action : test d’interface en juin, porté par l’éditeur, avec un point de contrôle au COPROJ.",
      checks: [
        {
          model:
            "L’interface avec le planning atelier ne fonctionne pas à temps, ce qui retarde l’ouverture. Probabilité 3, impact 4, exposition 12.",
          criteria: [
            c(
              "Cause et effet du risque",
              [
                "interface|conges|absence|indisponib|retard|depend|ne fonctionne|echec",
              ],
              "Décris ce qui peut arriver et sa conséquence.",
            ),
            c(
              "Probabilité et impact évalués",
              ["probabilit|impact|exposition|\\d\\s*[x×*]\\s*\\d|/5"],
              "Note la probabilité et l’impact.",
            ),
          ],
        },
        {
          model:
            "Stratégie : réduire. Action : test d’interface en juin, porté par l’éditeur, avec un point de contrôle au COPROJ.",
          criteria: [
            c(
              "Une stratégie nommée",
              ["evit|redui|reduction|mitig|transf|accept"],
              "Nomme la stratégie : éviter, réduire, transférer ou accepter.",
            ),
            c(
              "Une action avec un porteur",
              [
                "porte|responsable|editeur|chef de projet|\\bba\\b|amoa|directri|directeur|par l",
              ],
              "Indique qui porte l’action.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Exposition = probabilité × impact",
        ["probabilit|impact|exposition"],
        "Rappelle le calcul de l’exposition.",
      ),
      c(
        "Quatre stratégies de traitement",
        ["evit|redui|transf|accept"],
        "Cite les stratégies de traitement.",
      ),
      c(
        "Arbitrer les changements en comité",
        ["changement|arbitr|comite|copil"],
        "Mentionne l’arbitrage des changements.",
      ),
    ],
    cards: [
      {
        front: "Les quatre stratégies de traitement d’un risque ?",
        back: "Éviter (supprimer la cause), réduire (baisser probabilité ou impact), transférer (vers un tiers), accepter (en connaissance de cause, avec un plan de secours).",
      },
      {
        front: "Comment traiter une demande de changement ?",
        back: "L’évaluer (valeur, coût, risques, effet sur la date) puis la faire arbitrer par l’instance compétente ; tracer la décision.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras tenir un registre des risques, traiter une demande de changement et préparer une décision de comité.",
      prerequisites: ["Chapitre « Cadrer avant d’avancer »."],
      sections: [
        {
          heading: "Le registre des risques",
          paragraphs: [
            "Un risque est un événement incertain qui, s’il survient, affecte le projet. On le formule avec sa cause et son effet (« les testeurs sont absents en août, donc la recette glisse »), on évalue sa probabilité et son impact sur une échelle de 1 à 5, puis on calcule l’exposition.",
            "Le registre se revoit à chaque comité projet : nouveaux risques, risques clos, actions en retard.",
          ],
          diagram: {
            kind: "quadrant",
            title: "Où placer un risque ?",
            xAxis: "Impact",
            yAxis: "Probabilité",
            cells: [
              {
                title: "À surveiller",
                text: "Probable mais impact faible : plan léger.",
                tone: "marker",
              },
              {
                title: "Critique",
                text: "Probable et impact fort : traiter tout de suite.",
                tone: "blush",
              },
              {
                title: "Faible",
                text: "Peu probable, impact faible : accepter.",
                tone: "neutral",
              },
              {
                title: "Élevé",
                text: "Peu probable mais impact fort : plan de secours.",
                tone: "apricot",
              },
            ],
            caption:
              "Exposition = probabilité × impact. Les risques à fort impact méritent un plan même s’ils semblent peu probables.",
          },
        },
        {
          heading: "Quatre façons de traiter un risque",
          paragraphs: [
            "Éviter : modifier le projet pour supprimer la cause. Réduire : agir en amont sur la probabilité ou l’impact. Transférer : confier la charge à un tiers (assurance, contrat). Accepter : ne rien faire de particulier, en connaissance de cause, avec un plan de secours prêt.",
            "Chaque action de traitement a un porteur et une échéance, sinon elle reste une intention.",
          ],
          keyPoint: "Une action sans porteur ni date n’est pas une action.",
        },
        {
          heading: "Les demandes de changement",
          paragraphs: [
            "Toute modification du périmètre, du délai ou du budget passe par la même règle : décrire la demande, évaluer sa valeur, son coût, ses risques et son effet sur la date, proposer des options, puis faire arbitrer par l’instance compétente.",
            "Cette discipline n’empêche pas de changer : elle empêche de changer sans le savoir.",
          ],
          diagram: {
            kind: "flow",
            title: "Le circuit d’une demande de changement",
            steps: [
              { label: "Demande décrite", tone: "apricot" },
              { label: "Évaluation", note: "Valeur, coût, risques, délai" },
              {
                label: "Options",
                note: "Accepter, reporter, refuser, découper",
              },
              { label: "Arbitrage", note: "COPROJ ou COPIL", tone: "marker" },
              { label: "Décision tracée", tone: "sky" },
            ],
            caption:
              "Le niveau d’arbitrage dépend de l’ampleur : les gros écarts montent au COPIL.",
          },
        },
      ],
      workedExample: {
        title: "Les responsables d’atelier en congés",
        situation:
          "La recette d’un outil de rendez-vous est prévue en août ; les responsables d’atelier seront en congés.",
        steps: [
          {
            label: "Formuler le risque",
            detail:
              "Testeurs métier indisponibles en août, donc la recette glisse et l’ouverture de rentrée est menacée.",
          },
          {
            label: "Évaluer",
            detail:
              "Probabilité 4 (période connue), impact 3 (retard sans mettre le projet en péril) : exposition 12, zone élevée.",
          },
          {
            label: "Choisir la stratégie",
            detail:
              "Réduire : avancer la recette en juin et désigner un suppléant par atelier.",
          },
          {
            label: "Suivre",
            detail:
              "Action portée par l’AMOA, point de contrôle au COPROJ du 15 mai.",
          },
        ],
        outcome:
          "Le risque est traité avant de devenir un problème ; s’il évolue, le registre le montre au comité.",
      },
      pitfalls: [
        {
          confusion: "Remplir un registre une fois et ne plus le relire.",
          correction: "Le registre vit : il se revoit à chaque comité projet.",
          counterExample:
            "Un risque noté « faible » en janvier devient critique en avril sans que personne ne s’en aperçoive.",
        },
        {
          confusion: "Accepter les petites demandes sans les évaluer.",
          correction: "Les petites demandes cumulées font les grands retards.",
          counterExample:
            "Dix « petites » demandes acceptées oralement ajoutent trois semaines au projet.",
        },
      ],
      summary: [
        "Un risque se formule avec sa cause et son effet, puis s’évalue : probabilité × impact.",
        "Quatre stratégies : éviter, réduire, transférer, accepter.",
        "Chaque action a un porteur et une échéance.",
        "Toute demande de changement est évaluée puis arbitrée par l’instance compétente.",
      ],
      glossary: [
        {
          term: "Registre des risques",
          definition:
            "Liste des risques avec probabilité, impact, exposition, stratégie, action et porteur.",
        },
        {
          term: "Exposition",
          definition: "Probabilité × impact : sert à prioriser les risques.",
        },
        {
          term: "Plan de secours",
          definition:
            "Actions prêtes à déclencher si un risque accepté survient.",
        },
        {
          term: "Jalon",
          definition: "Point de contrôle marquant l’atteinte d’une étape clé.",
        },
      ],
    },
    caseStep: {
      title: "Dossier AMOA · Sécuriser le lancement",
      context: `${LUMEN} Le lancement de la nouvelle file de commandes est prévu en novembre, juste avant le pic des fêtes. Le prestataire informatique est aussi engagé sur un autre client.`,
      prompts: [
        "Identifie deux risques, chacun avec probabilité, impact et exposition.",
        "Pour le plus exposé, propose une stratégie, une action, un porteur et l’instance qui suit.",
      ],
      criteria: [
        [
          "Deux risques formulés avec cause et effet",
          "Probabilité, impact et exposition",
        ],
        ["Stratégie nommée", "Action et porteur", "Instance de suivi"],
      ],
      models: [
        "1) Le lancement coïncide avec le pic des fêtes : une panne bloquerait les expéditions (probabilité 3, impact 5, exposition 15). 2) Le prestataire est moins disponible, donc les corrections tardent (probabilité 3, impact 3, exposition 9).",
        "Risque 1 : réduire en avançant le lancement à mi-octobre et en gardant la procédure papier en secours deux semaines. Porteur : l’AMOA avec le chef d’entrepôt ; suivi en COPROJ hebdomadaire, décision de date au COPIL.",
      ],
    },
  },
];

export const amoaCourse: Course = {
  id: "ba-amoa",
  title: "AMOA et conduite du changement",
  eyebrow: "Spécialisation",
  color: "peach",
  icon: "compass",
  description:
    "Cadrer une mission, formaliser le cahier des charges, faire adopter le changement et piloter les risques.",
  lessons,
  caseStudy: {
    name: "Maison Lumen",
    pitch: `${LUMEN} Tu poursuis la mission côté AMOA : cadrage, choix d’outil, adoption et sécurisation du lancement.`,
  },
  sources: [
    {
      title: "IIBA · The Business Analysis Standard",
      url: "https://www.iiba.org/knowledgehub/the-business-analysis-standard/",
    },
    {
      title: "Prosci · Le modèle ADKAR",
      url: "https://www.prosci.com/methodology/adkar",
    },
  ],
};
