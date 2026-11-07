import type { Chapter } from "@/lib/types";

/*
 * Reference course, chapters 1-4. Original writing in French, informed by the
 * owner's private BA reference sheet (not reproduced), the IIBA Business
 * Analysis Standard and professional practice.
 */
export const chaptersPart1: Record<string, Chapter> = {
  "ba-besoin": {
    objective:
      "À la fin de ce chapitre, tu sauras séparer un problème, un besoin et une solution, remonter à la cause d’une demande et reformuler un besoin mesurable avant que quiconque parle d’outil.",
    prerequisites: [
      "Aucun : c’est le point de départ du parcours.",
      "Savoir qu’un projet naît presque toujours d’une insatisfaction ou d’une opportunité.",
    ],
    sections: [
      {
        heading: "Une demande arrive souvent déguisée en solution",
        paragraphs: [
          "Quand un responsable dit « il nous faut un nouvel outil », il ne décrit pas son besoin : il propose déjà une réponse. C’est normal, chacun pense en solutions. Mais si l’équipe construit directement l’outil demandé, elle risque de livrer exactement ce qui a été dit… et rien de ce qui était nécessaire.",
          "Le premier réflexe du Business Analyst est donc de suspendre la solution, sans la rejeter. Tu la notes, tu la gardes comme une piste, puis tu cherches ce qu’elle est censée améliorer : quel désagrément, pour qui, à quel moment, avec quel coût.",
        ],
        keyPoint:
          "Une solution proposée est une hypothèse. Le besoin est ce qui permettra de juger si cette hypothèse est la bonne.",
      },
      {
        heading: "Trois niveaux à ne pas mélanger",
        paragraphs: [
          "Le problème est un constat observable : « 40 % des appels au service client portent sur l’état d’une commande ». Le besoin décrit le résultat attendu pour une population précise : « les clients doivent connaître l’état de leur commande sans appeler ». La solution est un moyen parmi d’autres : notification, page de suivi, SMS, chatbot…",
          "Ce découpage a une conséquence pratique : un même besoin accepte plusieurs solutions, qu’il faudra comparer sur leur coût, leur délai et leur efficacité. Si tu figes la solution trop tôt, tu supprimes cette comparaison.",
        ],
        diagram: {
          kind: "flow",
          title: "Du constat au choix d’une solution",
          steps: [
            {
              label: "Problème observé",
              note: "Un fait, idéalement chiffré",
              tone: "blush",
            },
            {
              label: "Cause",
              note: "Pourquoi ce fait se produit",
              tone: "neutral",
            },
            {
              label: "Besoin",
              note: "Le résultat attendu, et pour qui",
              tone: "apricot",
            },
            {
              label: "Solutions possibles",
              note: "Plusieurs options à comparer",
              tone: "sky",
            },
          ],
          caption:
            "On ne parle de solution qu’en dernier : chaque étape réduit le risque de construire la mauvaise chose.",
        },
      },
      {
        heading: "Remonter à la cause",
        paragraphs: [
          "Les bonnes questions sont ouvertes et factuelles : « Que se passe-t-il exactement ? », « Pour qui ? », « Depuis quand ? », « Combien de fois par semaine ? », « Qu’est-ce que cela coûte ? ». Elles font raconter des situations réelles plutôt que des opinions.",
          "La technique des « 5 pourquoi » consiste à demander « pourquoi ? » plusieurs fois de suite, jusqu’à atteindre une cause sur laquelle on peut agir. Le chiffre 5 est indicatif : on s’arrête quand la réponse devient une cause actionnable, pas un symptôme.",
        ],
        diagram: {
          kind: "flow",
          title: "Les « 5 pourquoi » sur un cas de livraison",
          steps: [
            { label: "Les clients appellent beaucoup", tone: "blush" },
            { label: "Ils ne savent pas où est leur colis" },
            { label: "Le statut affiché n’est pas à jour" },
            { label: "Les statuts du transporteur sont ressaisis à la main" },
            {
              label: "Cause actionnable : la ressaisie manuelle",
              tone: "apricot",
            },
          ],
          caption:
            "Chaque « pourquoi » descend d’un niveau. On s’arrête dès qu’on tient une cause sur laquelle agir.",
        },
      },
      {
        heading: "Mesurer l’écart entre aujourd’hui et la cible",
        paragraphs: [
          "Une analyse d’écart compare la situation actuelle (« as-is ») à la situation visée (« to-be »). Elle transforme un ressenti en objectif : on ne cherche plus à « améliorer le suivi », mais à faire passer un indicateur d’une valeur à une autre.",
          "Cet écart sert ensuite à tout : arbitrer entre les solutions, définir les critères de réussite et, après la livraison, vérifier que la valeur a bien été obtenue.",
        ],
        diagram: {
          kind: "table",
          title: "Analyse d’écart : appels sur le suivi des commandes",
          columns: ["Indicateur", "Aujourd’hui", "Cible", "Écart à combler"],
          rows: [
            [
              "Appels « où est ma commande ? »",
              "120 par semaine",
              "30 par semaine",
              "−75 %",
            ],
            [
              "Délai de mise à jour du statut",
              "24 heures",
              "1 heure",
              "Supprimer la ressaisie",
            ],
            [
              "Temps passé par l’équipe",
              "10 h par semaine",
              "3 h par semaine",
              "Libérer 7 h",
            ],
          ],
          caption:
            "Les chiffres sont fictifs : l’important est que chaque ligne soit mesurable avant et après.",
        },
      },
      {
        heading: "Formuler un besoin solide",
        paragraphs: [
          "Une formulation utile tient en une phrase : « Permettre à [qui] de [résultat], [mesure], sans [contrainte] ». Par exemple : « Permettre aux clients de connaître la date de livraison de leur commande à tout moment, sans contacter le service client ».",
          "Cette phrase ne nomme aucun outil. Elle est vérifiable et compréhensible par le métier comme par l’équipe technique. Fais-la valider par la personne qui porte le besoin : c’est elle qui en décide, pas toi.",
        ],
        keyPoint:
          "Un bon besoin se reconnaît à trois choses : un bénéficiaire, un résultat observable, aucune solution imposée.",
      },
    ],
    workedExample: {
      title: "« Il faut refaire notre outil »",
      situation:
        "La responsable d’une petite entreprise de livraison t’annonce : « On doit refaire notre outil, les clients nous appellent tout le temps. » Tu prépares ton premier échange.",
      steps: [
        {
          label: "Accueillir sans contredire",
          detail:
            "Tu notes « refaire l’outil » comme piste et tu demandes : « Qu’est-ce qui vous fait dire que l’outil est en cause ? » La personne se sent écoutée, et tu ouvres la discussion sur les faits.",
        },
        {
          label: "Faire parler les faits",
          detail:
            "« Pour quelles raisons les clients appellent-ils ? À quel moment de leur commande ? Combien d’appels par semaine ? » Tu apprends que la majorité des appels concernent la date de livraison.",
        },
        {
          label: "Chercher la cause",
          detail:
            "En remontant les « pourquoi », tu découvres que les statuts du transporteur arrivent par e-mail et sont ressaisis le lendemain. L’outil n’est pas le seul coupable : le flux d’information l’est.",
        },
        {
          label: "Chiffrer l’écart",
          detail:
            "Aujourd’hui : environ 120 appels par semaine. Cible proposée : 30. Tu fais valider ces ordres de grandeur, quitte à les mesurer précisément ensuite.",
        },
        {
          label: "Reformuler et faire valider",
          detail:
            "« Permettre aux clients de connaître la date de livraison à jour, sans contacter l’équipe. » La responsable valide : on peut maintenant comparer plusieurs solutions, dont la refonte de l’outil.",
        },
      ],
      outcome:
        "La refonte complète n’est peut-être pas nécessaire : une récupération automatique des statuts du transporteur pourrait suffire. Sans ce travail sur le besoin, on aurait lancé un projet bien plus lourd.",
    },
    pitfalls: [
      {
        confusion: "Écrire une fonctionnalité en croyant écrire un besoin.",
        correction:
          "« Un chatbot pour répondre aux clients » est une solution. Le besoin est le résultat que ce chatbot est censé produire.",
        counterExample:
          "Besoin : « réduire de moitié le temps d’attente des clients qui ont une question simple ». Un chatbot, une FAQ ou un rappel automatique peuvent y répondre.",
      },
      {
        confusion:
          "Penser que le client se trompe quand il demande une solution.",
        correction:
          "Sa piste peut être la bonne. Le rôle du BA n’est pas de la rejeter, mais de vérifier qu’elle répond au vrai problème.",
        counterExample:
          "Après analyse, la refonte demandée reste la meilleure option : tu la recommandes, mais avec un besoin et des critères de réussite clairs.",
      },
      {
        confusion: "Formuler un besoin impossible à vérifier.",
        correction:
          "« Améliorer l’expérience client » ne permet ni de choisir ni de tester. Il faut un résultat observable.",
        counterExample:
          "« 90 % des clients trouvent la date de livraison en moins de 30 secondes » se mesure avant et après.",
      },
    ],
    summary: [
      "Une demande arrive souvent sous forme de solution : garde-la comme piste.",
      "Problème (fait observé), besoin (résultat attendu pour quelqu’un), solution (un moyen parmi d’autres) : trois niveaux distincts.",
      "Des questions ouvertes et factuelles, puis les « 5 pourquoi », mènent à une cause actionnable.",
      "L’analyse d’écart transforme un ressenti en objectif chiffré.",
      "Un bon besoin : un bénéficiaire, un résultat observable, aucune solution imposée, validé par le métier.",
    ],
    glossary: [
      {
        term: "Besoin",
        definition:
          "Résultat qu’une personne ou une organisation cherche à obtenir, indépendamment du moyen.",
      },
      {
        term: "Cause racine",
        definition:
          "Cause profonde d’un problème, sur laquelle on peut agir, par opposition à ses symptômes.",
      },
      {
        term: "Analyse d’écart (gap analysis)",
        definition:
          "Comparaison entre la situation actuelle et la situation visée, pour identifier ce qu’il faut changer.",
      },
      {
        term: "As-is / To-be",
        definition:
          "Situation actuelle / situation cible d’un processus ou d’une organisation.",
      },
      {
        term: "Élicitation",
        definition:
          "Ensemble des activités qui font émerger et préciser les besoins des parties prenantes.",
      },
    ],
  },

  "ba-acteurs": {
    objective:
      "À la fin de ce chapitre, tu sauras identifier les parties prenantes d’un changement, choisir comment impliquer chacune, préparer un atelier et faire valider ce que tu as compris.",
    prerequisites: [
      "Chapitre 1 : distinguer un besoin d’une solution.",
      "Savoir qu’un projet touche souvent plus de personnes que celles qui l’ont demandé.",
    ],
    sections: [
      {
        heading: "Qui est concerné, vraiment ?",
        paragraphs: [
          "Une partie prenante est toute personne ou tout groupe qui influence le changement ou en subit les effets : le sponsor qui finance, les utilisateurs au quotidien, le support qui gère les incidents, l’équipe technique, parfois un service conformité ou un partenaire externe.",
          "L’oubli d’une partie prenante coûte cher : une exigence découverte en fin de projet, un refus de validation, une équipe qui contourne l’outil livré. Dresser la liste tôt, même imparfaite, est un investissement rentable.",
        ],
        keyPoint:
          "Celui qui commande, celui qui décide et celui qui utilise sont rarement la même personne.",
      },
      {
        heading: "Adapter l’implication : la matrice influence / intérêt",
        paragraphs: [
          "Toutes les parties prenantes n’ont pas besoin du même niveau d’échange. Une matrice simple croise leur pouvoir sur le projet et leur intérêt pour ses résultats. Elle aide à répartir ton temps, qui est limité.",
          "Cette position n’est pas figée : un service peu intéressé au départ peut devenir central quand le projet touche ses processus. Revois la matrice à chaque grande étape.",
        ],
        diagram: {
          kind: "quadrant",
          title: "Quatre stratégies d’engagement",
          xAxis: "Intérêt pour le projet",
          yAxis: "Pouvoir sur le projet",
          cells: [
            {
              title: "Tenir satisfait",
              text: "Informer régulièrement, sans surcharger. Ex. direction financière.",
              tone: "marker",
            },
            {
              title: "Impliquer étroitement",
              text: "Associer aux décisions clés. Ex. sponsor, responsable métier.",
              tone: "apricot",
            },
            {
              title: "Surveiller",
              text: "Effort minimal, vérifier que rien ne change. Ex. service peu touché.",
              tone: "neutral",
            },
            {
              title: "Tenir informé",
              text: "Communiquer et recueillir leur vécu. Ex. utilisateurs finaux.",
              tone: "sky",
            },
          ],
          caption:
            "Le quadrant indique où placer ton énergie, pas qui compte le plus : les utilisateurs finaux restent essentiels pour comprendre le terrain.",
        },
      },
      {
        heading: "Choisir la bonne technique de recueil",
        paragraphs: [
          "L’atelier réunit plusieurs points de vue et fait émerger les désaccords ; il demande une préparation sérieuse (objectif, ordre du jour, questions, règles). L’entretien individuel convient aux sujets sensibles ou très experts. L’observation sur le terrain révèle ce que les gens font vraiment, y compris les contournements qu’ils ne pensent pas à mentionner.",
          "D’autres techniques complètent : l’analyse des documents existants, le questionnaire pour un grand nombre de personnes, le prototype pour faire réagir sur du concret. On en combine souvent plusieurs.",
        ],
        diagram: {
          kind: "table",
          title: "Quelle technique pour quel objectif ?",
          columns: ["Technique", "Idéale pour", "Point de vigilance"],
          rows: [
            [
              "Atelier",
              "Confronter des points de vue, décider ensemble",
              "Les voix fortes dominent : prévois un tour de parole",
            ],
            [
              "Entretien individuel",
              "Sujet sensible, expertise pointue",
              "Une seule vision : croise avec d’autres sources",
            ],
            [
              "Observation",
              "Comprendre le travail réel et les contournements",
              "Être présent modifie un peu les comportements",
            ],
            [
              "Questionnaire",
              "Mesurer une tendance sur beaucoup de personnes",
              "Peu de nuance : à compléter par des échanges",
            ],
            [
              "Prototype",
              "Faire réagir sur du concret",
              "On risque de discuter design avant le besoin",
            ],
          ],
          caption:
            "Aucune technique ne suffit seule : l’observation corrige souvent ce que l’entretien laisse croire.",
        },
      },
      {
        heading: "Poser des questions qui font raconter",
        paragraphs: [
          "Une question fermée (« Est-ce que l’outil est lent ? ») obtient un oui ou un non. Une question ouverte et ancrée dans le vécu obtient une histoire : « Racontez-moi le dernier retour client difficile que vous avez traité. » C’est dans ces histoires que se cachent les vraies règles, les exceptions et les irritants.",
          "Reformule régulièrement ce que tu entends (« Si je comprends bien… ») : cela vérifie ta compréhension et montre à la personne qu’elle est écoutée.",
        ],
      },
      {
        heading: "Confirmer ce qui a été compris",
        paragraphs: [
          "Un atelier ne vaut que par ce qui en reste. Envoie rapidement un compte rendu court : participants, objectif, décisions prises, points ouverts, actions avec un porteur et une échéance. Demande explicitement une validation ou des corrections.",
          "Ce document devient une référence : il évite les « je n’ai jamais dit ça » et rend les décisions traçables.",
        ],
        keyPoint:
          "Une conclusion d’atelier non validée par écrit reste une hypothèse.",
      },
    ],
    workedExample: {
      title: "Préparer l’atelier sur les retours de commandes",
      situation:
        "Une boutique veut améliorer le traitement des retours. Le directeur est disponible, mais les vendeurs et le service client travaillent sur des horaires différents.",
      steps: [
        {
          label: "Lister les parties prenantes",
          detail:
            "Directeur (décide et finance), vendeurs (reçoivent les retours en boutique), service client (traite les réclamations), comptabilité (rembourse), clients (subissent le délai).",
        },
        {
          label: "Les placer sur la matrice",
          detail:
            "Directeur : impliquer étroitement. Service client et vendeurs : tenir informés et surtout écouter. Comptabilité : tenir satisfaite, car elle peut bloquer le remboursement.",
        },
        {
          label: "Choisir les techniques",
          detail:
            "Un atelier court avec le directeur, un vendeur et un conseiller ; un entretien séparé avec la comptabilité ; une heure d’observation au comptoir des retours.",
        },
        {
          label: "Préparer les questions",
          detail:
            "« Racontez-moi le dernier retour difficile : que s’est-il passé, étape par étape ? Qu’est-ce qui vous a fait perdre du temps ? »",
        },
        {
          label: "Valider les conclusions",
          detail:
            "Sous 48 heures, un compte rendu liste les constats, décisions et questions ouvertes ; chaque participant valide ou corrige.",
        },
      ],
      outcome:
        "En une semaine, tu as une vision partagée du problème, des décisions tracées et des personnes qui se sentent associées : la suite du projet sera beaucoup plus fluide.",
    },
    pitfalls: [
      {
        confusion: "Ne parler qu’à la personne qui a commandé le projet.",
        correction:
          "Le commanditaire connaît les objectifs, rarement le détail du terrain.",
        counterExample:
          "Le directeur pense que les retours sont lents à cause de l’outil ; l’observation montre qu’ils attendent surtout la validation de la comptabilité.",
      },
      {
        confusion:
          "Croire qu’un atelier suffit à faire émerger tout le besoin.",
        correction:
          "Un atelier collectif masque souvent les points sensibles ou minoritaires.",
        counterExample:
          "Un conseiller n’ose pas dire en atelier qu’il contourne la procédure ; il l’explique en entretien individuel.",
      },
    ],
    summary: [
      "Une partie prenante influence le changement ou en subit les effets : liste-les tôt.",
      "La matrice influence / intérêt aide à choisir le bon niveau d’implication.",
      "Atelier, entretien, observation, questionnaire, prototype : on combine les techniques.",
      "Les questions ouvertes qui font raconter révèlent les règles réelles et les exceptions.",
      "Un compte rendu validé transforme les conclusions en décisions traçables.",
    ],
    glossary: [
      {
        term: "Partie prenante",
        definition:
          "Personne ou groupe qui influence un changement ou en subit les effets.",
      },
      {
        term: "Sponsor",
        definition:
          "Personne qui porte et finance le projet, et arbitre ses grandes orientations.",
      },
      {
        term: "RACI",
        definition:
          "Matrice des responsabilités : Réalise, Approuve (une seule personne), Consulté avant, Informé après.",
      },
      {
        term: "Compte rendu d’atelier",
        definition:
          "Document court qui trace participants, décisions, points ouverts et actions avec porteur et échéance.",
      },
    ],
  },

  "ba-roles": {
    objective:
      "À la fin de ce chapitre, tu sauras situer le BA entre le métier et la technique, distinguer MOA, AMOA et MOE, lire la réalité d’un poste au-delà de son intitulé et poser les bonnes questions en entretien.",
    prerequisites: [
      "Chapitres 1 et 2 : besoin et parties prenantes.",
      "Avoir déjà vu une offre d’emploi de BA, AMOA ou consultant fonctionnel.",
    ],
    sections: [
      {
        heading: "Le BA, un traducteur dans les deux sens",
        paragraphs: [
          "Le Business Analyst se tient entre ceux qui ont le besoin et ceux qui construisent la solution. Vers la technique, il traduit un besoin parfois flou en exigences claires et testables. Vers le métier, il traduit une contrainte technique en conséquence concrète : délai, coût, limite fonctionnelle.",
          "Il ne décide pas à la place du métier et ne construit pas à la place de la technique. Sa valeur : permettre une décision éclairée et une réalisation fidèle au besoin.",
        ],
        diagram: {
          kind: "bridge",
          title: "La position d’interface du BA",
          left: {
            title: "Métier / MOA",
            lines: ["Porte le besoin", "Connaît le terrain", "Valide"],
          },
          center: {
            title: "Business Analyst",
            lines: ["Clarifie", "Formalise", "Trace"],
          },
          right: {
            title: "Technique / MOE",
            lines: ["Conçoit", "Développe", "Livre"],
          },
          forward: ["besoin", "exigences"],
          backward: ["reformulation", "faisabilité"],
          caption:
            "Les flèches vont dans les deux sens : le BA fait aussi remonter les contraintes vers le métier.",
        },
      },
      {
        heading: "MOA, AMOA, MOE : qui fait quoi ?",
        paragraphs: [
          "La maîtrise d’ouvrage (MOA) est le propriétaire du besoin : elle fixe les objectifs, décide et réceptionne la solution. La maîtrise d’œuvre (MOE) conçoit et réalise la solution. L’assistance à maîtrise d’ouvrage (AMOA) aide la MOA à exprimer, formaliser et piloter son besoin, sans décider à sa place.",
          "Deux postes avec le même intitulé peuvent donc être très différents selon leur rattachement : côté MOA, on représente le métier face à l’informatique ; côté MOE, on représente l’informatique face au métier.",
        ],
        diagram: {
          kind: "table",
          title: "Le rattachement change le métier réel",
          columns: ["Critère", "Côté MOA (client)", "Côté MOE (réalisateur)"],
          rows: [
            [
              "Question dominante",
              "De quoi le métier a-t-il besoin, et pourquoi ?",
              "Comment construire ce qui est demandé ?",
            ],
            [
              "Livrables typiques",
              "Expression de besoin, cahier des charges, recette métier",
              "Spécifications détaillées, paramétrage, tests techniques",
            ],
            [
              "Risque du poste",
              "Perdre le contact avec la faisabilité",
              "Glisser vers l’exécution technique",
            ],
          ],
          caption:
            "En entretien, demande toujours si le poste est rattaché à la MOA ou à la MOE.",
        },
      },
      {
        heading: "Trois orientations, un seul métier",
        paragraphs: [
          "Dans la pratique, chaque poste de BA penche vers un centre de gravité. L’orientation métier (souvent appelée AMOA) se concentre sur les processus, les règles de gestion et la conduite du changement. L’orientation technico-fonctionnelle travaille les interfaces, les données et le paramétrage. L’orientation produit ou projet gère le backlog, la priorisation et la valeur livrée.",
          "Personne ne maîtrise parfaitement les trois. Savoir dire où tu te situes, et où tu veux aller, est plus crédible que de prétendre tout couvrir.",
        ],
        diagram: {
          kind: "table",
          title: "Les trois orientations du BA",
          columns: ["Orientation", "Centre de gravité", "Intitulés fréquents"],
          rows: [
            [
              "Métier",
              "Processus, règles de gestion, changement",
              "AMOA, analyste métier, consultant fonctionnel",
            ],
            [
              "Technico-fonctionnelle",
              "Interfaces, données, paramétrage",
              "BA IT, analyste technico-fonctionnel",
            ],
            [
              "Produit / projet",
              "Backlog, priorisation, valeur livrée",
              "Product Owner, Proxy PO, BA agile",
            ],
          ],
          caption:
            "Les activités décrites dans une offre comptent plus que son titre.",
        },
      },
      {
        heading: "Les rôles voisins et leurs frontières",
        paragraphs: [
          "Le Product Owner décide de la valeur et ordonne le backlog ; le BA analyse et spécifie. Dans beaucoup d’équipes, une même personne porte les deux, mais ce sont deux responsabilités différentes. Le chef de projet pilote délais, budget et ressources ; le BA pilote le contenu fonctionnel et sa cohérence. Le consultant fonctionnel est souvent spécialiste d’un progiciel ; le BA reste indépendant de l’outil.",
          "La frontière la plus souvent franchie : un BA à l’aise techniquement se voit confier du paramétrage, puis des corrections. Cela se cadre au début de la mission, dans la note de cadrage, pas au moment où la demande arrive.",
        ],
        keyPoint:
          "Un rôle se définit par ses décisions et ses livrables, pas par son intitulé.",
      },
    ],
    workedExample: {
      title: "Décoder une offre d’emploi",
      situation:
        "Une offre mentionne : ateliers utilisateurs, spécifications d’interfaces, requêtes SQL, préparation de la recette et échanges quotidiens avec les développeurs.",
      steps: [
        {
          label: "Repérer les activités",
          detail:
            "Ateliers et recette relèvent du métier ; interfaces, SQL et échanges avec les développeurs relèvent du technico-fonctionnel.",
        },
        {
          label: "Déduire l’orientation dominante",
          detail:
            "La majorité des activités penche vers le technico-fonctionnel. Hypothèse à vérifier en entretien.",
        },
        {
          label: "Questionner le rattachement",
          detail:
            "« Le poste est-il rattaché à une direction métier ou à la DSI ? À qui reporterai-je au quotidien ? »",
        },
        {
          label: "Clarifier les frontières",
          detail:
            "« Qui valide les besoins ? Qui arbitre les changements ? Le poste inclut-il du développement ou seulement la spécification et la recette ? »",
        },
      ],
      outcome:
        "Tu arrives en entretien avec une lecture précise du poste et des questions qui montrent que tu connais le métier, au lieu de subir l’intitulé.",
    },
    pitfalls: [
      {
        confusion: "Croire que l’AMOA décide à la place du métier.",
        correction:
          "L’AMOA éclaire et prépare la décision ; la MOA tranche et assume.",
        counterExample:
          "Le BA recommande de reporter une fonctionnalité ; c’est le responsable métier qui valide ce report en comité.",
      },
      {
        confusion: "Assimiler BA et Product Owner.",
        correction:
          "Le PO est responsable de la valeur et de l’ordre du backlog ; le BA analyse et spécifie. Les deux rôles peuvent être portés par une seule personne, sans être identiques.",
        counterExample:
          "Dans une grande équipe, le PO arbitre les priorités pendant que deux BA rédigent les user stories et préparent la recette.",
      },
    ],
    summary: [
      "Le BA traduit dans les deux sens : besoin vers exigences, contraintes vers conséquences métier.",
      "MOA : propriétaire du besoin. MOE : réalisateur. AMOA : aide la MOA sans décider.",
      "Trois orientations : métier, technico-fonctionnelle, produit/projet.",
      "Le rattachement et les activités décrivent le poste mieux que l’intitulé.",
      "Les frontières de responsabilité se fixent au cadrage.",
    ],
    glossary: [
      {
        term: "MOA",
        definition:
          "Maîtrise d’ouvrage : le propriétaire du besoin, qui fixe les objectifs et réceptionne la solution.",
      },
      {
        term: "MOE",
        definition:
          "Maîtrise d’œuvre : l’entité qui conçoit et réalise la solution.",
      },
      {
        term: "AMOA",
        definition:
          "Assistance à maîtrise d’ouvrage : accompagne la MOA dans l’expression, la formalisation et le pilotage du besoin.",
      },
      {
        term: "Product Owner",
        definition:
          "Dans Scrum, responsable de maximiser la valeur du produit et de gérer le backlog.",
      },
      {
        term: "Note de cadrage",
        definition:
          "Document de début de projet : contexte, objectifs, périmètre, acteurs, contraintes, risques, jalons.",
      },
    ],
  },

  "ba-exigences": {
    objective:
      "À la fin de ce chapitre, tu sauras transformer un besoin en exigences claires, distinguer leurs types, rédiger une user story avec des critères d’acceptation testables et repérer les formulations ambiguës.",
    prerequisites: [
      "Chapitre 1 : formuler un besoin sans solution.",
      "Chapitre 2 : savoir qui valide quoi.",
    ],
    sections: [
      {
        heading: "Du besoin à l’exigence",
        paragraphs: [
          "Le besoin dit ce que le métier veut obtenir. L’exigence dit ce que la solution devra faire ou respecter pour y parvenir. Une bonne exigence est nécessaire, compréhensible, non ambiguë, cohérente avec les autres et surtout vérifiable.",
          "Le test le plus simple : si deux personnes lisent la phrase et peuvent conclure différemment sur le fait qu’elle est respectée, elle n’est pas encore assez précise.",
        ],
        diagram: {
          kind: "flow",
          title: "De la demande au critère testable",
          steps: [
            {
              label: "Demande",
              note: "« Prévenir le client assez tôt en cas de retard »",
              tone: "blush",
            },
            {
              label: "Besoin",
              note: "Le client peut s’organiser quand sa livraison glisse",
            },
            {
              label: "Exigence",
              note: "Le système notifie le client d’un retard de livraison",
              tone: "marker",
            },
            {
              label: "Critère testable",
              note: "Si l’heure estimée dépasse le créneau de 30 min, alors un SMS part dans les 5 min",
              tone: "sky",
            },
          ],
          caption:
            "Chaque étape retire de l’ambiguïté. Les valeurs (30 min, 5 min) sont des hypothèses à faire valider.",
        },
      },
      {
        heading: "Les familles d’exigences",
        paragraphs: [
          "Les exigences fonctionnelles décrivent ce que fait le système (« le client peut annuler un rendez-vous jusqu’à 2 heures avant »). Les exigences non fonctionnelles décrivent comment il doit se comporter : performance, sécurité, accessibilité, fiabilité. Les règles de gestion expriment une logique métier indépendante de la technique. Les contraintes sont des limites imposées et non négociables. Les exigences de transition n’existent que pendant le passage de l’ancien au nouveau système.",
          "Oublier les non fonctionnelles est une erreur classique : un écran qui fait tout ce qui est demandé mais met 10 secondes à s’afficher ne sera pas utilisé.",
        ],
        diagram: {
          kind: "table",
          title: "Cinq familles, cinq exemples",
          columns: ["Famille", "Ce qu’elle exprime", "Exemple"],
          rows: [
            [
              "Fonctionnelle",
              "Ce que fait le système",
              "Le client filtre les produits par prix",
            ],
            [
              "Non fonctionnelle",
              "Comment il se comporte",
              "La page s’affiche en moins de 2 s en 4G",
            ],
            [
              "Règle de gestion",
              "Une logique métier",
              "Pas de remise au-delà de 30 % sans accord du responsable",
            ],
            [
              "Contrainte",
              "Une limite imposée",
              "Mise en conformité avant la date légale",
            ],
            [
              "Transition",
              "Le temps du passage",
              "Reprendre les 15 000 fiches clients de l’ancien outil",
            ],
          ],
          caption:
            "La norme ISO/IEC 25010 détaille les qualités non fonctionnelles : performance, sécurité, utilisabilité, fiabilité…",
        },
      },
      {
        heading: "User story et critères d’acceptation",
        paragraphs: [
          "En contexte agile, le besoin est souvent exprimé en user story : « En tant que [rôle], je veux [action], afin de [bénéfice] ». La story ouvre une conversation ; ce sont ses critères d’acceptation qui la rendent vérifiable.",
          "Le format « Étant donné [contexte], quand [action], alors [résultat attendu] » force à préciser la situation de départ et un résultat observable. Prévois au moins un cas nominal et un cas alternatif ou d’erreur.",
        ],
        keyPoint:
          "Une story sans critère d’acceptation est une intention ; avec des critères, elle devient un engagement testable.",
      },
      {
        heading: "Chasser l’ambiguïté",
        paragraphs: [
          "Certains mots sont des signaux d’alarme : « rapidement », « simple », « suffisamment », « intuitif », « etc. », « si possible ». Chacun cache une décision non prise. Remplace-les par une valeur, une règle ou une liste fermée, quitte à proposer une hypothèse à faire valider.",
          "La grille INVEST aide à juger une story : Indépendante, Négociable, porteuse de Valeur, Estimable, de petite taille (Small), Testable. Si elle n’est pas testable, elle n’est pas prête.",
        ],
      },
    ],
    workedExample: {
      title: "Rendre testable « prévenir le client assez tôt »",
      situation:
        "Le client souhaite : « Être averti suffisamment tôt si sa livraison est en retard. » Les délais exacts restent à négocier.",
      steps: [
        {
          label: "Lister ce qui manque",
          detail:
            "Qu’appelle-t-on un retard (seuil en minutes) ? Combien de temps avant le créneau prévenir ? Par quel canal ?",
        },
        {
          label: "Proposer des hypothèses explicites",
          detail:
            "Retard = heure estimée au-delà de la fin du créneau de plus de 30 minutes. Canal : SMS. Délai d’envoi : 5 minutes après détection. Tout est marqué « à confirmer ».",
        },
        {
          label: "Écrire la story",
          detail:
            "« En tant que client, je veux être averti d’un retard de livraison, afin de réorganiser ma journée. »",
        },
        {
          label: "Écrire les critères",
          detail:
            "CA1 : Étant donné une livraison prévue entre 10 h et 12 h, quand l’heure estimée passe à 12 h 40, alors le client reçoit un SMS dans les 5 minutes. CA2 : Étant donné un numéro invalide, quand le SMS échoue, alors l’échec est tracé et un e-mail est envoyé.",
        },
        {
          label: "Faire valider",
          detail:
            "Le responsable métier confirme les seuils ; l’équipe technique confirme la faisabilité du délai de 5 minutes.",
        },
      ],
      outcome:
        "Une phrase vague devient deux critères que n’importe quel testeur peut vérifier, et les décisions prises sont visibles.",
    },
    pitfalls: [
      {
        confusion: "Présenter ses hypothèses comme des décisions.",
        correction:
          "Une valeur que tu proposes reste une hypothèse tant que le métier ne l’a pas validée.",
        counterExample:
          "« Hypothèse à confirmer : seuil de retard à 30 minutes » plutôt que « le seuil est de 30 minutes ».",
      },
      {
        confusion: "Décrire l’interface au lieu du comportement.",
        correction:
          "« Un bouton rouge en haut à droite » fige une solution ; l’exigence porte sur ce que l’utilisateur doit pouvoir faire.",
        counterExample:
          "« L’utilisateur peut annuler sa commande tant qu’elle n’est pas expédiée » laisse la conception libre.",
      },
      {
        confusion: "Oublier les cas d’erreur.",
        correction:
          "Le cas nominal ne suffit pas : que se passe-t-il si la donnée manque, si le service est indisponible, si l’utilisateur annule ?",
        counterExample:
          "Un critère dédié au numéro de téléphone invalide évite qu’un client ne soit jamais prévenu.",
      },
    ],
    summary: [
      "Le besoin dit ce que le métier veut ; l’exigence dit ce que la solution doit faire ou respecter.",
      "Familles : fonctionnelle, non fonctionnelle, règle de gestion, contrainte, transition.",
      "User story + critères « Étant donné / Quand / Alors » = un engagement testable.",
      "Les mots vagues cachent une décision : remplace-les par une valeur ou une hypothèse signalée.",
      "Prévois toujours un cas d’erreur ou alternatif.",
    ],
    glossary: [
      {
        term: "Exigence fonctionnelle",
        definition: "Comportement ou fonctionnalité observable du système.",
      },
      {
        term: "Exigence non fonctionnelle",
        definition:
          "Qualité attendue du système : performance, sécurité, accessibilité, fiabilité…",
      },
      {
        term: "Règle de gestion",
        definition:
          "Logique métier qui encadre un processus, indépendamment de sa mise en œuvre technique.",
      },
      {
        term: "User story",
        definition:
          "Expression courte d’un besoin : rôle, action, bénéfice attendu.",
      },
      {
        term: "Critère d’acceptation",
        definition:
          "Condition vérifiable qu’une story doit remplir pour être acceptée par le métier.",
      },
      {
        term: "INVEST",
        definition:
          "Grille de qualité d’une story : Indépendante, Négociable, Valeur, Estimable, Small, Testable.",
      },
    ],
  },
};
