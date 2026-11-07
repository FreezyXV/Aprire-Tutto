import type { Chapter } from "@/lib/types";

/*
 * Reference course, chapters 5-8. Original writing in French, informed by the
 * owner's private BA reference sheet (not reproduced), OMG BPMN 2.0,
 * ISO/IEC 25010 and professional practice.
 */
export const chaptersPart2: Record<string, Chapter> = {
  "ba-processus": {
    objective:
      "À la fin de ce chapitre, tu sauras délimiter un processus, représenter l’existant avec des couloirs, repérer les passages de relais qui posent problème et proposer une cible sans casser un contrôle utile.",
    prerequisites: [
      "Chapitre 2 : identifier les acteurs.",
      "Chapitre 1 : relier une amélioration à un besoin.",
    ],
    sections: [
      {
        heading:
          "Un processus, c’est un déclencheur, des étapes et un résultat",
        paragraphs: [
          "Un processus est une suite d’activités qui produit un résultat pour quelqu’un. Pour le délimiter, réponds à trois questions : quel événement le déclenche ? Quel résultat marque sa fin réussie ? Qui intervient entre les deux ?",
          "Sans ces limites, une cartographie s’étend sans fin. Avec elles, tu peux mesurer le processus (durée, nombre de dossiers, taux d’erreur) et comparer l’avant et l’après.",
        ],
        keyPoint:
          "Pas de déclencheur ni de résultat explicites, pas de processus analysable.",
      },
      {
        heading: "Observer l’existant avant de dessiner la cible",
        paragraphs: [
          "La procédure officielle et le travail réel diffèrent souvent : contournements, tableurs parallèles, relances par téléphone. Observe et fais raconter des cas réels avant de modéliser. C’est l’état actuel (as-is) qui révèle les vrais points de friction.",
          "Une représentation en couloirs (une bande par acteur) rend visibles les passages de relais. C’est souvent là que l’information se perd, que les dossiers attendent et que personne ne se sent responsable.",
        ],
        diagram: {
          kind: "lanes",
          title: "Retour d’un produit : l’existant",
          lanes: ["Support", "Magasin", "Comptabilité"],
          steps: [
            { lane: 0, label: "Accepter la demande de retour" },
            { lane: 1, label: "Recevoir le colis" },
            { lane: 1, label: "Contrôler le produit" },
            { lane: 2, label: "Attendre l’info du contrôle", issue: true },
            { lane: 2, label: "Rembourser le client" },
            { lane: 0, label: "Informer le client", issue: true },
          ],
          caption:
            "Les relais en rose sont ceux où l’information se perd : la comptabilité attend, et le client n’est prévenu qu’à la fin.",
        },
      },
      {
        heading: "Lire et écrire du BPMN simple",
        paragraphs: [
          "BPMN est la notation standard pour modéliser les processus métier. Pour démarrer, quelques symboles suffisent : l’événement de début (cercle fin), la tâche (rectangle arrondi), la passerelle exclusive (losange avec un X, un seul chemin selon une condition), l’événement de fin (cercle épais), et les couloirs (une bande par acteur).",
          "Nomme les tâches avec un verbe d’action (« Contrôler le produit », pas « Contrôle ») et les passerelles avec une question (« Produit conforme ? »). Un bon schéma se lit à voix haute comme une histoire.",
        ],
        diagram: {
          kind: "table",
          title: "Les symboles BPMN essentiels",
          columns: ["Symbole", "Forme", "Sens"],
          rows: [
            [
              "Événement de début",
              "Cercle à trait fin",
              "Déclenche le processus",
            ],
            [
              "Tâche",
              "Rectangle arrondi",
              "Une action réalisée par un acteur ou un système",
            ],
            [
              "Passerelle exclusive",
              "Losange avec un X",
              "Un seul chemin parmi plusieurs, selon une condition",
            ],
            [
              "Passerelle parallèle",
              "Losange avec un +",
              "Tous les chemins en même temps",
            ],
            [
              "Événement de fin",
              "Cercle à trait épais",
              "Termine le processus",
            ],
            [
              "Couloir",
              "Bande horizontale",
              "Un acteur responsable des tâches qu’il contient",
            ],
          ],
          caption:
            "Six symboles couvrent l’essentiel des processus que tu modéliseras au début.",
        },
      },
      {
        heading: "Concevoir la cible sans casser ce qui protège",
        paragraphs: [
          "La cible (to-be) doit répondre aux problèmes observés, pas seulement « moderniser ». Avant de supprimer une étape, demande à quoi elle sert : un contrôle peut sembler lent mais protéger contre la fraude ou une erreur coûteuse.",
          "Souvent, l’amélioration la plus rentable ne supprime rien : elle accélère la transmission de l’information, donne un responsable à chaque relais et informe le client à chaque étape.",
        ],
        diagram: {
          kind: "lanes",
          title: "Retour d’un produit : la cible",
          lanes: ["Support", "Magasin", "Comptabilité"],
          steps: [
            { lane: 0, label: "Accepter le retour et informer le client" },
            { lane: 1, label: "Contrôler le produit" },
            { lane: 1, label: "Saisir le résultat dans l’outil partagé" },
            { lane: 2, label: "Rembourser sous 48 h (alerte automatique)" },
            { lane: 0, label: "Notification automatique au client" },
          ],
          caption:
            "Le contrôle est conservé ; seule la transmission change. Le client est informé au début et à la fin.",
        },
      },
    ],
    workedExample: {
      title: "Le remboursement qui traîne",
      situation:
        "Les clients se plaignent d’attendre leur remboursement. Le support reçoit les retours, le magasin contrôle, la comptabilité rembourse, et personne ne sait où en est un dossier.",
      steps: [
        {
          label: "Délimiter",
          detail:
            "Déclencheur : demande de retour acceptée. Résultat : client remboursé et informé.",
        },
        {
          label: "Observer",
          detail:
            "Une semaine de dossiers montre un délai moyen de 9 jours, dont 6 entre le contrôle et le remboursement.",
        },
        {
          label: "Repérer le relais critique",
          detail:
            "Le magasin note le résultat sur papier ; la comptabilité le découvre par relance téléphonique.",
        },
        {
          label: "Proposer une cible",
          detail:
            "Garder le contrôle, mais saisir son résultat dans un outil partagé qui alerte la comptabilité, avec un délai cible de 48 heures.",
        },
        {
          label: "Mesurer",
          detail:
            "Indicateur de suivi : délai entre contrôle et remboursement, avant et après.",
        },
      ],
      outcome:
        "Le délai visé passe de 9 à 3 jours sans supprimer le contrôle. La solution répond au problème observé, pas à une intuition.",
    },
    pitfalls: [
      {
        confusion: "Modéliser la procédure officielle au lieu du travail réel.",
        correction:
          "Le document de procédure décrit l’intention ; l’observation montre la réalité.",
        counterExample:
          "La procédure prévoit un e-mail au client à chaque étape ; en pratique, il n’est jamais envoyé faute de modèle.",
      },
      {
        confusion: "Supprimer une étape parce qu’elle ralentit.",
        correction:
          "Comprends d’abord le risque qu’elle couvre ; améliore plutôt sa transmission ou son délai.",
        counterExample:
          "Supprimer le contrôle des retours accélère les remboursements… et ceux des produits abîmés par le client.",
      },
    ],
    summary: [
      "Un processus a un déclencheur, des étapes, des acteurs et un résultat.",
      "Observe l’existant réel avant de dessiner la cible.",
      "Les couloirs rendent visibles les passages de relais, où l’information se perd.",
      "Quelques symboles BPMN suffisent : début, tâche, passerelle, fin, couloirs.",
      "Une bonne cible répond aux problèmes observés sans casser les contrôles utiles.",
    ],
    glossary: [
      {
        term: "BPMN",
        definition:
          "Business Process Model and Notation : notation standard de modélisation des processus, publiée par l’OMG.",
      },
      {
        term: "Couloir (lane)",
        definition:
          "Bande d’un diagramme qui regroupe les tâches d’un même acteur.",
      },
      {
        term: "Passerelle exclusive",
        definition:
          "Point de décision où un seul chemin est suivi selon une condition.",
      },
      {
        term: "Passage de relais",
        definition:
          "Moment où un dossier passe d’un acteur à un autre ; zone fréquente de perte d’information.",
      },
    ],
  },

  "ba-prioriser": {
    objective:
      "À la fin de ce chapitre, tu sauras rendre un arbitrage explicite : relier les priorités à un objectif, utiliser MoSCoW et la matrice valeur/effort, calculer un score RICE et documenter la décision.",
    prerequisites: [
      "Chapitre 1 : un besoin relié à un résultat mesurable.",
      "Chapitre 3 : savoir qui décide.",
    ],
    sections: [
      {
        heading: "Prioriser, c’est choisir ce qu’on ne fera pas",
        paragraphs: [
          "Les ressources sont toujours plus limitées que les demandes. Prioriser consiste à décider ce qui sera fait maintenant, plus tard, ou pas du tout, en fonction d’un objectif et d’un horizon.",
          "Le BA ne tranche pas seul : il rend visibles la valeur, les coûts, les risques et les dépendances, pour que le décideur compétent arbitre en connaissance de cause. Une priorité sans objectif ni critères n’est qu’une préférence.",
        ],
        keyPoint:
          "Une priorité n’a de sens qu’avec un objectif, des critères et un horizon.",
      },
      {
        heading: "MoSCoW : quatre catégories, une règle d’or",
        paragraphs: [
          "MoSCoW classe chaque élément d’un périmètre donné : Must have (indispensable, pas de livraison sans), Should have (important mais contournable temporairement), Could have (souhaitable si le temps le permet), Won’t have (explicitement exclu de cette version).",
          "La catégorie la plus utile est souvent la dernière : écrire noir sur blanc ce qui ne sera pas fait protège le périmètre et évite les malentendus. Et si tout est « Must », rien ne l’est : chaque Must doit avoir une justification réelle.",
        ],
        diagram: {
          kind: "flow",
          title: "MoSCoW sur une prise de rendez-vous en ligne",
          steps: [
            {
              label: "Must",
              note: "Choisir un créneau et confirmer",
              tone: "apricot",
            },
            {
              label: "Should",
              note: "Rappel par SMS la veille",
              tone: "marker",
            },
            {
              label: "Could",
              note: "Proposer le créneau le plus proche",
              tone: "sky",
            },
            {
              label: "Won’t (cette version)",
              note: "Paiement en ligne",
              tone: "neutral",
            },
          ],
          caption:
            "Priorité décroissante de gauche à droite. Le « Won’t » est écrit, pas sous-entendu.",
        },
      },
      {
        heading: "La matrice valeur / effort",
        paragraphs: [
          "Placer chaque demande selon sa valeur métier et son effort de réalisation déplace le débat du ressenti vers deux critères. C’est un support visuel efficace en comité.",
          "Les gains rapides passent en premier ; les gros projets se planifient ; les petites améliorations comblent les creux ; les demandes coûteuses et peu utiles s’écartent, en le disant clairement.",
        ],
        diagram: {
          kind: "quadrant",
          title: "Où placer chaque demande ?",
          xAxis: "Effort de réalisation",
          yAxis: "Valeur métier",
          cells: [
            {
              title: "Gain rapide",
              text: "Valeur haute, effort faible : à faire en premier.",
              tone: "sky",
            },
            {
              title: "Gros projet",
              text: "Valeur haute, effort élevé : à planifier.",
              tone: "apricot",
            },
            {
              title: "Bonus",
              text: "Valeur faible, effort faible : en remplissage.",
              tone: "neutral",
            },
            {
              title: "À écarter",
              text: "Valeur faible, effort élevé : on le dit et on n’y va pas.",
              tone: "blush",
            },
          ],
          caption:
            "La position dépend d’estimations : note les hypothèses derrière chaque placement.",
        },
      },
      {
        heading: "Des scores pour comparer : RICE",
        paragraphs: [
          "RICE calcule un score : (Portée × Impact × Confiance) ÷ Effort. La portée compte les personnes ou événements concernés sur une période ; l’impact est estimé sur une échelle (par exemple 0,25 à 3) ; la confiance, en pourcentage, pénalise les estimations fragiles ; l’effort se compte en personnes-mois.",
          "Exemple : un rappel SMS touche 4 000 clients par trimestre, impact 2, confiance 80 %, effort 2 personnes-mois : 4 000 × 2 × 0,8 ÷ 2 = 3 200. Le score n’a de sens que comparé à celui d’autres demandes calculées de la même façon.",
        ],
        keyPoint:
          "Un score ne décide pas : il rend la discussion plus honnête.",
      },
      {
        heading: "Documenter l’arbitrage",
        paragraphs: [
          "Une décision de priorité doit pouvoir être relue dans trois mois : ce qui a été choisi, les critères utilisés, les hypothèses, la personne qui a arbitré et la date. Un simple journal de décisions suffit.",
          "Quand le contexte change (nouvelle réglementation, incident, budget), on revoit la décision en partant de cette trace, au lieu de tout rediscuter de zéro.",
        ],
      },
    ],
    workedExample: {
      title: "Une semaine, trois demandes",
      situation:
        "Tu as une semaine d’équipe pour améliorer un site : corriger le paiement, ajouter des avatars ou améliorer le suivi de livraison. Aucun paiement ne fonctionne actuellement.",
      steps: [
        {
          label: "Rappeler l’objectif",
          detail:
            "Le site existe pour vendre. Toute demande se juge à son effet sur les ventes et la satisfaction.",
        },
        {
          label: "Traiter le bloquant",
          detail:
            "Le paiement en panne bloque toute la valeur : c’est un Must, sans débat.",
        },
        {
          label: "Identifier ce qui manque pour la suite",
          detail:
            "Pour le suivi et les avatars : combien de clients sont gênés, quel effort, quelles dépendances ?",
        },
        {
          label: "Proposer un classement",
          detail:
            "Suivi de livraison en Should (réclamations fréquentes), avatars en Won’t pour cette semaine.",
        },
        {
          label: "Tracer",
          detail:
            "Journal de décisions : choix, critères, hypothèses, arbitre (le responsable produit), date.",
        },
      ],
      outcome:
        "Le décideur valide en dix minutes, parce que les critères sont visibles. Si les avatars reviennent dans un mois, la trace explique pourquoi ils ont été reportés.",
    },
    pitfalls: [
      {
        confusion: "Tout classer en Must.",
        correction:
          "Si tout est indispensable, rien ne l’est : exige une justification pour chaque Must.",
        counterExample:
          "« Sans cette fonction, la livraison est-elle inutilisable ? » Si la réponse est non, ce n’est pas un Must.",
      },
      {
        confusion: "Laisser le BA trancher seul.",
        correction:
          "Le BA éclaire la décision ; le responsable métier ou produit arbitre et assume.",
        counterExample:
          "Le BA présente la matrice valeur/effort ; le Product Owner choisit l’ordre en comité.",
      },
      {
        confusion: "Prendre un score pour une vérité.",
        correction:
          "RICE ou valeur/effort reposent sur des estimations : affiche la confiance et les hypothèses.",
        counterExample:
          "Une demande au score élevé mais avec 30 % de confiance mérite d’abord une vérification rapide.",
      },
    ],
    summary: [
      "Prioriser, c’est choisir ce qu’on ne fera pas, au service d’un objectif.",
      "MoSCoW : Must, Should, Could, Won’t ; le Won’t s’écrit.",
      "La matrice valeur/effort rend l’arbitrage visuel et discutable.",
      "RICE = (Portée × Impact × Confiance) ÷ Effort, à comparer entre demandes.",
      "Le BA éclaire, le décideur arbitre, la décision est tracée.",
    ],
    glossary: [
      {
        term: "MoSCoW",
        definition:
          "Méthode de priorisation : Must, Should, Could, Won’t have (pour un périmètre donné).",
      },
      {
        term: "RICE",
        definition:
          "Score de priorisation : (Reach × Impact × Confidence) ÷ Effort.",
      },
      {
        term: "Backlog",
        definition:
          "Liste ordonnée du travail restant sur un produit ou un projet.",
      },
      {
        term: "Journal de décisions",
        definition:
          "Trace des arbitrages : choix, critères, hypothèses, décideur, date.",
      },
    ],
  },

  "ba-data": {
    objective:
      "À la fin de ce chapitre, tu sauras définir un indicateur de façon reproductible, vérifier les données qui l’alimentent, relier chaque chiffre à une décision et lire un modèle de données simple.",
    prerequisites: [
      "Chapitre 1 : un besoin mesurable.",
      "Chapitre 6 : relier un choix à des critères.",
    ],
    sections: [
      {
        heading: "Un chiffre n’a de sens qu’avec sa définition",
        paragraphs: [
          "Deux équipes peuvent afficher des chiffres différents en parlant du « même » indicateur, simplement parce qu’elles ne l’ont pas défini de la même façon. Le BA orienté données commence donc par la définition : formule, périmètre, période, exclusions, source.",
          "Une définition est bonne quand deux personnes qui l’appliquent sur les mêmes données obtiennent le même résultat.",
        ],
        diagram: {
          kind: "flow",
          title: "Du chiffre brut à la décision",
          steps: [
            {
              label: "Donnée source",
              note: "Heure de livraison réelle, créneau promis",
            },
            {
              label: "Règle de calcul",
              note: "Retard si livraison après la fin du créneau",
              tone: "marker",
            },
            {
              label: "Indicateur",
              note: "Taux de livraisons en retard par transporteur",
              tone: "apricot",
            },
            {
              label: "Décision",
              note: "Répartir les volumes, renégocier un contrat",
              tone: "sky",
            },
          ],
          caption:
            "Si l’on ne sait pas quelle décision un indicateur doit éclairer, il ne mérite probablement pas d’être suivi.",
        },
      },
      {
        heading: "Vérifier les données avant de les croire",
        paragraphs: [
          "Avant de comparer des chiffres, pose quelques questions : d’où vient la donnée ? Est-elle complète ? Quels cas faut-il exclure ou traiter à part (annulations, doublons, absences) ? Le volume est-il suffisant pour comparer ?",
          "Un transporteur qui ne livre que 20 colis par mois peut afficher un taux de retard spectaculaire sur un seul incident : sans volume, pas de conclusion.",
        ],
        keyPoint:
          "Une exclusion non documentée change un indicateur sans que personne ne le sache.",
      },
      {
        heading: "Quelques indicateurs à connaître",
        paragraphs: [
          "Tu croiseras souvent les mêmes familles d’indicateurs : conversion et abandon pour un parcours numérique, satisfaction (CSAT, NPS), qualité de la recette, délais de livraison d’une fonctionnalité. L’important n’est pas de tous les connaître par cœur, mais de savoir lire leur formule et leurs limites.",
        ],
        diagram: {
          kind: "table",
          title: "Indicateurs fréquents et leur formule",
          columns: ["Indicateur", "Formule", "Limite à garder en tête"],
          rows: [
            [
              "Taux de conversion",
              "Conversions ÷ visiteurs × 100",
              "Dépend de la définition d’un « visiteur »",
            ],
            [
              "Taux d’abandon",
              "Abandons à une étape ÷ entrées à cette étape × 100",
              "Ne dit pas pourquoi les gens abandonnent",
            ],
            [
              "NPS",
              "% promoteurs (9-10) − % détracteurs (0-6)",
              "Une intention, pas un comportement",
            ],
            [
              "Taux d’acceptation en recette",
              "Cas validés ÷ cas exécutés × 100",
              "Dépend de la qualité des cas de test",
            ],
            [
              "Délai de mise à disposition",
              "Demande → mise en production",
              "Préciser où commence et finit le chronomètre",
            ],
          ],
          caption:
            "Chaque formule cache des choix de périmètre : écris-les dans la définition.",
        },
      },
      {
        heading: "Lire un modèle de données simple",
        paragraphs: [
          "Un modèle entité-relation décrit les objets métier (client, commande, produit), leurs attributs et leurs liens. Les cardinalités se lisent dans les deux sens : un client passe zéro ou plusieurs commandes (0,N) ; une commande appartient à un seul client (1,1).",
          "Une clé primaire identifie chaque ligne de façon unique ; une clé étrangère référence une autre table et matérialise le lien. Savoir lire cela suffit pour dialoguer avec une équipe data et écrire des requêtes SQL simples.",
        ],
        diagram: {
          kind: "flow",
          title: "Client, commande, transporteur",
          steps: [
            { label: "Client", note: "id_client (clé primaire)" },
            {
              label: "Commande",
              note: "id_commande, id_client (clé étrangère), créneau promis",
              tone: "apricot",
            },
            {
              label: "Livraison",
              note: "id_commande, transporteur, heure réelle",
            },
          ],
          caption:
            "Un client a 0 à N commandes ; une commande a 1 seul client et 0 ou 1 livraison.",
        },
      },
    ],
    workedExample: {
      title: "« Suivre les livraisons en retard »",
      situation:
        "La responsable logistique veut suivre les livraisons en retard et comparer les transporteurs.",
      steps: [
        {
          label: "Définir le retard",
          detail:
            "Une livraison est en retard si l’heure de livraison réelle dépasse la fin du créneau promis au client.",
        },
        {
          label: "Vérifier les sources",
          detail:
            "Heure réelle : transmise par le transporteur ; créneau : dans la commande. Les fuseaux horaires sont-ils homogènes ?",
        },
        {
          label: "Fixer les exclusions",
          detail:
            "Annulations exclues ; absences du client comptées à part ; pas de comparaison sous 100 livraisons par mois.",
        },
        {
          label: "Relier à une décision",
          detail:
            "L’indicateur sert à répartir les volumes entre transporteurs et à déclencher une renégociation au-delà de 8 % de retard.",
        },
      ],
      outcome:
        "Le chiffre devient comparable, reproductible et utile : chacun sait ce qu’il mesure et à quoi il sert.",
    },
    pitfalls: [
      {
        confusion: "Comparer des chiffres sans définition commune.",
        correction:
          "Écris la formule, le périmètre, la période et les exclusions avant toute comparaison.",
        counterExample:
          "L’équipe A compte les retards au créneau, l’équipe B à la journée : leurs taux ne sont pas comparables.",
      },
      {
        confusion: "Suivre un indicateur pour le plaisir de le suivre.",
        correction: "Chaque indicateur doit éclairer une décision identifiée.",
        counterExample:
          "Le nombre de pages vues ne sert à rien si personne ne décide quoi que ce soit à partir de lui.",
      },
    ],
    summary: [
      "Un indicateur se définit : formule, périmètre, période, exclusions, source.",
      "Vérifie la provenance, la complétude et le volume avant de conclure.",
      "Chaque chiffre doit servir une décision.",
      "Un modèle entité-relation se lit avec ses cardinalités dans les deux sens.",
    ],
    glossary: [
      {
        term: "KPI",
        definition:
          "Indicateur clé de performance, relié à un objectif et suivi dans le temps.",
      },
      {
        term: "Cardinalité",
        definition:
          "Nombre d’occurrences possibles d’une entité liée à une autre (0,1 / 1,1 / 0,N…).",
      },
      {
        term: "Clé primaire",
        definition: "Identifiant unique de chaque ligne d’une table.",
      },
      {
        term: "Clé étrangère",
        definition:
          "Colonne qui référence la clé primaire d’une autre table et matérialise un lien.",
      },
      {
        term: "Dictionnaire de données",
        definition:
          "Référentiel qui décrit chaque donnée : définition, format, valeurs possibles, propriétaire.",
      },
    ],
  },

  "ba-recette": {
    objective:
      "À la fin de ce chapitre, tu sauras écrire un cas de test reproductible, relier chaque test à une exigence, qualifier une anomalie et vérifier après la livraison que la valeur attendue est bien là.",
    prerequisites: [
      "Chapitre 4 : critères d’acceptation testables.",
      "Chapitre 7 : mesurer avec un indicateur défini.",
    ],
    sections: [
      {
        heading: "La recette vérifie la promesse, pas seulement le code",
        paragraphs: [
          "Les tests techniques (unitaires, d’intégration) vérifient que le logiciel fonctionne. La recette métier, ou UAT, vérifie qu’il répond au besoin exprimé, avec des scénarios réalistes et des utilisateurs du métier. C’est le dernier filet avant la mise en production.",
          "Dans un cycle en V, chaque phase de conception a sa phase de vérification en miroir : l’expression du besoin est vérifiée par la recette utilisateur, les spécifications par les tests fonctionnels.",
        ],
        diagram: {
          kind: "table",
          title: "Chaque conception a son test miroir",
          columns: ["Ce qu’on conçoit", "Ce qui le vérifie", "Qui s’en charge"],
          rows: [
            [
              "Expression du besoin",
              "Recette utilisateur (UAT)",
              "Métier, accompagné par le BA",
            ],
            [
              "Spécifications fonctionnelles",
              "Tests fonctionnels",
              "BA et testeurs",
            ],
            ["Architecture", "Tests d’intégration", "Équipe technique"],
            ["Conception détaillée", "Tests unitaires", "Développeurs"],
          ],
          caption:
            "Le BA est surtout présent en haut du V : là où l’on vérifie le besoin.",
        },
      },
      {
        heading: "Écrire un cas de test reproductible",
        paragraphs: [
          "Un cas de test précise l’exigence couverte, les prérequis (données et état de départ), les étapes, le résultat attendu, puis le résultat obtenu et le statut (OK, KO, bloqué). Il doit pouvoir être rejoué par quelqu’un d’autre et donner le même verdict.",
          "Teste le cas nominal, mais aussi les cas alternatifs et d’erreur : annulation, donnée manquante, limite de date. C’est souvent là que se cachent les anomalies qui coûtent cher en production.",
        ],
        keyPoint:
          "Un résultat attendu vague (« ça marche ») ne permet pas de conclure : il doit être observable.",
      },
      {
        heading: "La traçabilité, du besoin au test",
        paragraphs: [
          "La matrice de traçabilité relie chaque besoin à ses exigences, à leurs spécifications, aux user stories et aux cas de test, avec leur statut. Elle répond en quelques secondes à la question : « Ce besoin est-il couvert et testé ? »",
          "Elle sert aussi quand une exigence change : on voit immédiatement quels tests rejouer.",
        ],
        diagram: {
          kind: "flow",
          title: "La chaîne de traçabilité",
          steps: [
            { label: "Besoin", note: "Le client n’oublie pas son rendez-vous" },
            { label: "Exigence", note: "EX-001 : rappel la veille" },
            { label: "User story", note: "US-014 : rappel SMS" },
            { label: "Cas de test", note: "TC-021 : SMS reçu à J-1" },
            { label: "Statut", note: "Recette OK", tone: "sky" },
          ],
          caption:
            "Chaque maillon a un identifiant : on peut remonter d’un test jusqu’au besoin qui le justifie.",
        },
      },
      {
        heading: "Qualifier et suivre une anomalie",
        paragraphs: [
          "Une anomalie se décrit avec ses étapes de reproduction, le résultat attendu, le résultat obtenu et sa sévérité : bloquante (empêche l’usage), majeure (usage dégradé), mineure (contournement possible), cosmétique (sans impact fonctionnel). La sévérité guide l’ordre de correction.",
          "Son cycle de vie suit des statuts clairs ; une anomalie corrigée n’est fermée qu’après revérification, sinon elle est rouverte.",
        ],
        diagram: {
          kind: "flow",
          title: "Cycle de vie d’une anomalie",
          steps: [
            { label: "Nouvelle", tone: "blush" },
            { label: "Assignée" },
            { label: "En correction" },
            { label: "À revérifier", tone: "marker" },
            { label: "Fermée", tone: "sky" },
          ],
          loop: {
            from: 3,
            to: 2,
            label: "Rouverte si la revérification échoue",
          },
          caption: "Seule une revérification réussie ferme l’anomalie.",
        },
      },
      {
        heading: "Après la livraison : la valeur est-elle là ?",
        paragraphs: [
          "Une fonctionnalité acceptée en recette peut ne pas produire l’effet attendu. Reprends l’indicateur défini au départ (par exemple le nombre d’appels ou le délai de remboursement) et compare-le à la cible.",
          "Si l’écart persiste, cherche pourquoi : usage faible, besoin mal compris, cause non traitée. C’est la boucle qui ferme le travail du BA, du besoin initial à la valeur mesurée.",
        ],
      },
    ],
    workedExample: {
      title: "Le rappel SMS de rendez-vous",
      situation:
        "Un client doit recevoir un rappel 24 heures avant son rendez-vous. Aucun rappel ne doit être envoyé après une annulation.",
      steps: [
        {
          label: "Prérequis",
          detail:
            "Un rendez-vous confirmé demain à 10 h, pour un client dont le numéro est valide.",
        },
        {
          label: "Action",
          detail:
            "Déclencher le traitement des rappels aujourd’hui à 10 h (ou le forcer en environnement de test).",
        },
        {
          label: "Résultat attendu",
          detail:
            "Le client reçoit un seul SMS, sur le bon numéro, avec la date, l’heure et le lieu du rendez-vous.",
        },
        {
          label: "Cas alternatif",
          detail:
            "Annuler le rendez-vous avant le déclenchement : aucun SMS ne doit partir.",
        },
        {
          label: "Traçabilité",
          detail:
            "Les deux cas sont reliés à l’exigence du rappel et à sa user story ; leur statut alimente la matrice.",
        },
      ],
      outcome:
        "Deux tests reproductibles couvrent le nominal et l’annulation. Après la mise en production, on suit le taux de rendez-vous manqués pour vérifier la valeur.",
    },
    pitfalls: [
      {
        confusion: "Ne tester que le cas nominal.",
        correction:
          "Les anomalies coûteuses se cachent dans les cas alternatifs et d’erreur.",
        counterExample:
          "Le rappel fonctionne… mais part aussi pour les rendez-vous annulés.",
      },
      {
        confusion: "Confondre recette réussie et valeur obtenue.",
        correction:
          "La recette vérifie la conformité ; la mesure après livraison vérifie l’effet.",
        counterExample:
          "Les SMS partent correctement, mais le taux de rendez-vous manqués ne baisse pas : l’heure d’envoi est peut-être mal choisie.",
      },
    ],
    summary: [
      "La recette (UAT) vérifie que la solution répond au besoin, avec le métier.",
      "Un cas de test : exigence, prérequis, étapes, résultat attendu observable, statut.",
      "Teste aussi les cas alternatifs et d’erreur.",
      "La traçabilité relie besoin, exigence, story, test et statut.",
      "Après livraison, l’indicateur de départ dit si la valeur est obtenue.",
    ],
    glossary: [
      {
        term: "Recette (UAT)",
        definition:
          "Validation par le métier que la solution répond au besoin exprimé avant la mise en production.",
      },
      {
        term: "Cas de test",
        definition:
          "Scénario reproductible : prérequis, étapes, résultat attendu, résultat obtenu, statut.",
      },
      {
        term: "Non-régression",
        definition:
          "Vérification qu’une modification n’a pas cassé un comportement existant.",
      },
      {
        term: "Matrice de traçabilité",
        definition:
          "Tableau qui relie chaque besoin à ses exigences, stories, tests et statuts.",
      },
      {
        term: "Sévérité",
        definition:
          "Gravité d’une anomalie : bloquante, majeure, mineure, cosmétique.",
      },
    ],
  },
};
