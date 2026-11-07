import type { Course, Lesson } from "@/lib/types";
import { c, LUMEN, q } from "./helpers";

/*
 * Specialization: advanced BPMN. Original writing in French, based on the
 * OMG BPMN 2.0.2 specification and modelling practice.
 */
const lessons: Lesson[] = [
  {
    id: "bpmn-passerelles",
    title: "Les embranchements sans ambiguïté.",
    subtitle:
      "Choisir la bonne passerelle : exclusive, parallèle ou inclusive.",
    skill: "Modéliser les décisions",
    recall: q(
      "Une passerelle exclusive (losange avec un X) signifie…",
      [
        "Tous les chemins sont suivis en même temps",
        "Un seul chemin est suivi, selon une condition",
        "Le processus s’arrête",
      ],
      1,
      "La passerelle exclusive choisit un seul chemin parmi plusieurs, selon une condition évaluée à ce moment.",
    ),
    paragraphs: [
      "Une passerelle représente un point où le flux se divise ou se rejoint. L’exclusive (X) choisit un seul chemin, la parallèle (+) les suit tous en même temps, l’inclusive (O) suit un ou plusieurs chemins selon les conditions vraies.",
      "Une passerelle qui divise appelle souvent une passerelle du même type qui rejoint : sinon, le flux attend indéfiniment ou se duplique.",
    ],
    takeaway:
      "Une passerelle exclusive pose une question ; une parallèle n’en pose aucune.",
    example: {
      context: "Traitement d’une commande payée.",
      before: "Un losange sans nom avec trois flèches qui en partent.",
      after:
        "Passerelle exclusive « Adresse valide ? » : oui, préparer la commande ; non, contacter le client. Puis passerelle parallèle : préparer le colis et envoyer la confirmation en même temps, rejointes par une parallèle avant l’expédition.",
    },
    check: q(
      "La préparation du colis et l’envoi de l’e-mail de confirmation se font en même temps. Quelle passerelle utiliser ?",
      ["Exclusive", "Parallèle", "Inclusive"],
      1,
      "Les deux activités ont toujours lieu, simultanément : c’est une passerelle parallèle (+), sans condition.",
    ),
    transfer: q(
      "Un client peut demander un emballage cadeau, une livraison express, les deux ou aucun. Quelle passerelle ?",
      ["Exclusive", "Parallèle", "Inclusive"],
      2,
      "Un ou plusieurs chemins selon les conditions vraies : c’est la passerelle inclusive.",
    ),
    exam: q(
      "Que se passe-t-il si deux chemins ouverts par une passerelle parallèle sont rejoints par une passerelle exclusive ?",
      [
        "Rien de particulier",
        "La suite peut s’exécuter deux fois, car l’exclusive laisse passer chaque jeton",
        "Le processus s’annule",
      ],
      1,
      "La jonction doit être du même type : une parallèle qui rejoint attend tous les chemins ; une exclusive laisse passer chacun, d’où un doublon.",
    ),
    mission: {
      title: "Modélise une décision de livraison.",
      context:
        "Une commande payée est vérifiée. Si l’article est en stock, on prépare le colis ; sinon, on propose au client d’attendre ou d’annuler. Une fois le colis prêt, on imprime l’étiquette et on prévient le client, en même temps.",
      prompts: [
        "Quelle passerelle pour « article en stock ? » et quels chemins en sortent ?",
        "Quelle passerelle pour « imprimer l’étiquette » et « prévenir le client », et comment les rejoindre ?",
      ],
      rubric: [
        "J’utilise une exclusive avec une condition nommée et ses chemins.",
        "J’utilise une parallèle pour diviser et une parallèle pour rejoindre.",
      ],
      example:
        "Passerelle exclusive « Article en stock ? » : oui, préparer le colis ; non, proposer d’attendre ou d’annuler. Passerelle parallèle pour imprimer l’étiquette et prévenir le client, puis passerelle parallèle de jonction avant l’expédition.",
      checks: [
        {
          model:
            "Passerelle exclusive « Article en stock ? » : oui, préparer le colis ; non, proposer d’attendre ou d’annuler.",
          criteria: [
            c(
              "Passerelle exclusive",
              ["exclusi|\\bxor\\b|\\bx\\b"],
              "Une seule issue possible : passerelle exclusive.",
            ),
            c(
              "Deux chemins décrits (oui / non)",
              [
                "oui[^.]*non|non[^.]*oui|sinon|en stock[^.]*(rupture|pas en stock|indisponible)",
              ],
              "Décris le chemin « oui » et le chemin « non ».",
            ),
          ],
          avoid: [
            {
              patterns: ["(parallele|inclusi)[^.]{0,40}stock"],
              message:
                "« En stock ? » n’a qu’une réponse à la fois : ce n’est ni parallèle ni inclusif.",
            },
          ],
        },
        {
          model:
            "Passerelle parallèle pour imprimer l’étiquette et prévenir le client, puis passerelle parallèle de jonction avant l’expédition.",
          criteria: [
            c(
              "Passerelle parallèle",
              ["parallel|\\band\\b|\\+|simultan|en meme temps"],
              "Les deux actions ont toujours lieu : passerelle parallèle.",
            ),
            c(
              "Une jonction du même type",
              ["jonction|rejoin|synchronis|fusion|reunir|merge|attend"],
              "Rejoins les chemins par une passerelle parallèle.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Exclusive : un seul chemin selon une condition",
        ["exclusi|un seul chemin"],
        "Rappelle l’exclusive.",
      ),
      c(
        "Parallèle : tous les chemins",
        ["parallel|tous les chemins|en meme temps"],
        "Rappelle la parallèle.",
      ),
      c(
        "Rejoindre avec le même type",
        ["rejoin|jonction|meme type"],
        "Mentionne la jonction.",
      ),
    ],
    cards: [
      {
        front: "Exclusive, parallèle, inclusive : la différence ?",
        back: "Exclusive (X) : un seul chemin selon une condition. Parallèle (+) : tous les chemins, sans condition. Inclusive (O) : un ou plusieurs chemins selon les conditions vraies.",
      },
      {
        front: "Comment rejoindre des chemins parallèles ?",
        back: "Avec une passerelle parallèle de jonction, qui attend tous les chemins avant de continuer : on rejoint avec le même type de passerelle.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras choisir la bonne passerelle, nommer ses conditions et rejoindre correctement les chemins.",
      prerequisites: ["Socle BA, chapitre 5 : les symboles BPMN essentiels."],
      sections: [
        {
          heading: "Trois passerelles, trois logiques",
          paragraphs: [
            "Une passerelle n’est pas une tâche : elle ne fait rien, elle aiguille. L’exclusive pose une question à réponse unique (« Adresse valide ? »). La parallèle ne pose aucune question : tous les chemins partent en même temps. L’inclusive pose plusieurs questions indépendantes et suit chaque chemin dont la condition est vraie.",
            "Nomme toujours une passerelle exclusive par une question et ses flux sortants par les réponses : le schéma se lit alors comme une phrase.",
          ],
          diagram: {
            kind: "table",
            title: "Choisir sa passerelle",
            columns: ["Passerelle", "Symbole", "Chemins suivis", "Exemple"],
            rows: [
              [
                "Exclusive",
                "Losange avec X",
                "Un seul, selon une condition",
                "Adresse valide ? oui / non",
              ],
              [
                "Parallèle",
                "Losange avec +",
                "Tous, sans condition",
                "Préparer le colis et confirmer au client",
              ],
              [
                "Inclusive",
                "Losange avec O",
                "Un ou plusieurs selon les conditions",
                "Emballage cadeau, express, les deux",
              ],
            ],
            caption:
              "Si la question a une seule réponse possible à la fois, c’est une exclusive.",
          },
        },
        {
          heading: "Diviser puis rejoindre",
          paragraphs: [
            "Les chemins ouverts doivent se rejoindre proprement. Une passerelle parallèle de jonction attend que tous les chemins soient terminés ; une exclusive de jonction laisse passer le premier qui arrive. Mélanger les types crée des doublons (la suite s’exécute deux fois) ou des blocages (on attend un chemin qui n’a jamais été pris).",
          ],
          diagram: {
            kind: "flow",
            title: "Une commande, deux décisions",
            steps: [
              { label: "Commande payée" },
              {
                label: "Adresse valide ?",
                note: "Exclusive : oui → suite ; non → contacter le client",
                tone: "marker",
              },
              {
                label: "Division parallèle",
                note: "Préparer le colis + confirmer au client",
                tone: "apricot",
              },
              {
                label: "Jonction parallèle",
                note: "Attend les deux",
                tone: "apricot",
              },
              { label: "Expédier", tone: "sky" },
            ],
            caption:
              "La division et la jonction parallèles encadrent les activités simultanées.",
          },
          keyPoint:
            "On rejoint avec le même type de passerelle que celui qui a divisé.",
        },
      ],
      workedExample: {
        title: "Stock et expédition",
        situation:
          "Commande payée, vérification du stock, puis étiquette et information client en même temps.",
        steps: [
          {
            label: "Repérer les décisions",
            detail: "« Article en stock ? » a une seule réponse : exclusive.",
          },
          {
            label: "Nommer les chemins",
            detail:
              "Oui : préparer le colis. Non : proposer d’attendre ou d’annuler.",
          },
          {
            label: "Repérer la simultanéité",
            detail:
              "Étiquette et information client ont toujours lieu : parallèle.",
          },
          {
            label: "Rejoindre",
            detail:
              "Une parallèle de jonction attend les deux avant l’expédition.",
          },
        ],
        outcome:
          "Le schéma se lit sans ambiguïté et ne produit ni doublon ni blocage.",
      },
      pitfalls: [
        {
          confusion: "Utiliser une exclusive pour des actions simultanées.",
          correction:
            "Des actions qui ont toujours lieu ensemble passent par une parallèle.",
          counterExample:
            "Avec une exclusive, le schéma laisse croire qu’on choisit entre l’étiquette et l’information client.",
        },
        {
          confusion: "Laisser des passerelles sans nom.",
          correction:
            "Une exclusive se nomme par une question, ses sorties par les réponses.",
          counterExample:
            "Un losange muet avec trois flèches : personne ne sait ce qui est décidé.",
        },
      ],
      summary: [
        "Exclusive : un chemin selon une condition. Parallèle : tous. Inclusive : un ou plusieurs.",
        "Une passerelle aiguille, elle ne fait rien.",
        "On rejoint avec le même type de passerelle.",
        "Une exclusive se nomme par une question ; ses sorties, par les réponses.",
      ],
      glossary: [
        {
          term: "Passerelle exclusive (XOR)",
          definition: "Un seul chemin sortant est suivi, selon une condition.",
        },
        {
          term: "Passerelle parallèle (AND)",
          definition:
            "Tous les chemins sortants sont suivis ; la jonction attend tous les chemins.",
        },
        {
          term: "Passerelle inclusive (OR)",
          definition: "Un ou plusieurs chemins selon les conditions vraies.",
        },
        {
          term: "Jeton",
          definition:
            "Représentation de l’avancement d’une instance de processus dans le schéma.",
        },
      ],
    },
    caseStep: {
      title: "Dossier BPMN · Les décisions de la commande",
      context: `${LUMEN} Une commande payée passe par : vérification d’adresse, contrôle du stock, puis préparation du colis et envoi d’une confirmation au client.`,
      prompts: [
        "Liste les passerelles nécessaires, leur type et leurs conditions.",
        "Explique comment rejoindre les chemins avant l’expédition.",
      ],
      criteria: [
        [
          "Exclusives pour adresse et stock, avec conditions",
          "Parallèle pour colis et confirmation",
        ],
        ["Jonction parallèle avant l’expédition"],
      ],
      models: [
        "Exclusive « Adresse valide ? » (non : contacter le client) ; exclusive « Article en stock ? » (non : proposer d’attendre ou d’annuler) ; parallèle pour préparer le colis et envoyer la confirmation.",
        "Une passerelle parallèle de jonction attend la fin de la préparation et de la confirmation avant la tâche « Remettre au transporteur ».",
      ],
    },
  },
  {
    id: "bpmn-evenements",
    title: "Le temps, les messages et les imprévus.",
    subtitle:
      "Événements intermédiaires, événements de bordure et sous-processus.",
    skill: "Modéliser les événements",
    recall: q(
      "Comment représenter « attendre 48 heures » dans un processus BPMN ?",
      [
        "Par une tâche « Attendre »",
        "Par un événement intermédiaire de type minuterie",
        "Par une passerelle",
      ],
      1,
      "L’attente se modélise par un événement intermédiaire minuterie (horloge), pas par une tâche.",
    ),
    paragraphs: [
      "Les événements intermédiaires marquent ce qui arrive pendant le processus : un délai écoulé (minuterie), un message reçu, une erreur. Posés sur le bord d’une tâche, ils interrompent ou complètent son déroulement.",
      "Le sous-processus regroupe une suite de tâches détaillée ailleurs : il garde le schéma principal lisible.",
    ],
    takeaway:
      "Ce qui arrive se modélise par un événement ; ce qu’on fait, par une tâche.",
    example: {
      context: "Relance d’un client qui n’a pas confirmé son adresse.",
      before:
        "Une tâche « Attendre la réponse du client et relancer si besoin ».",
      after:
        "Tâche « Demander confirmation » avec, sur sa bordure, une minuterie de 48 heures qui déclenche « Relancer le client », et un événement message « Réponse reçue » qui poursuit le processus.",
    },
    check: q(
      "Un événement minuterie posé sur la bordure d’une tâche sert à…",
      [
        "Décorer le schéma",
        "Déclencher un autre chemin si la tâche dure trop longtemps",
        "Compter le nombre de tâches",
      ],
      1,
      "L’événement de bordure surveille la tâche : si le délai expire avant la fin, un chemin d’exception démarre.",
    ),
    transfer: q(
      "Le paiement est refusé par la banque pendant la validation de commande. Comment le modéliser ?",
      [
        "Un événement d’erreur sur la bordure de la tâche de paiement, menant à un chemin de traitement",
        "Une note en marge du schéma",
        "Une nouvelle passerelle parallèle",
      ],
      0,
      "L’erreur interrompt la tâche et ouvre un chemin d’exception : événement d’erreur de bordure.",
    ),
    exam: q(
      "Pourquoi utiliser un sous-processus ?",
      [
        "Pour cacher des tâches gênantes",
        "Pour regrouper une séquence détaillée ailleurs et garder le schéma principal lisible",
        "Pour supprimer les passerelles",
      ],
      1,
      "Le sous-processus (rectangle avec un +) masque le détail au niveau principal sans le perdre : on le détaille dans un schéma séparé.",
    ),
    mission: {
      title: "Modélise une relance et une erreur.",
      context:
        "Après une commande, on demande au client de confirmer son adresse. Sans réponse sous 48 heures, on le relance. Pendant le paiement, la banque peut refuser la transaction.",
      prompts: [
        "Comment modéliser la relance après 48 heures sans réponse ?",
        "Comment modéliser le refus de paiement par la banque ?",
      ],
      rubric: [
        "J’utilise une minuterie de bordure qui ouvre un chemin de relance.",
        "J’utilise un événement d’erreur qui mène à un traitement.",
      ],
      example:
        "Une minuterie de 48 heures posée sur la bordure de la tâche « Attendre la confirmation » déclenche « Relancer le client ». Un événement d’erreur sur la bordure de « Encaisser le paiement » mène à « Informer le client du refus ».",
      checks: [
        {
          model:
            "Une minuterie de 48 heures posée sur la bordure de la tâche « Attendre la confirmation » déclenche « Relancer le client ».",
          criteria: [
            c(
              "Un événement minuterie",
              ["minuterie|timer|horloge|delai|48"],
              "Le délai se modélise par une minuterie.",
            ),
            c(
              "Il déclenche la relance",
              ["relan|rappel|declench|chemin"],
              "Dis ce que déclenche la minuterie.",
            ),
          ],
          avoid: [
            {
              patterns: ["^[^.]*tache[^.]{0,20}attendre 48"],
              message:
                "Une attente n’est pas une tâche : utilise un événement minuterie.",
            },
          ],
        },
        {
          model:
            "Un événement d’erreur sur la bordure de « Encaisser le paiement » mène à « Informer le client du refus ».",
          criteria: [
            c(
              "Un événement d’erreur",
              ["erreur|error|exception|echec"],
              "Le refus se modélise par un événement d’erreur.",
            ),
            c(
              "Un chemin de traitement",
              [
                "inform|prevenir|proposer|annul|nouveau moyen|traitement|chemin|mene",
              ],
              "Indique la suite après l’erreur.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Une attente est une minuterie",
        ["minuterie|delai|attente"],
        "Rappelle la minuterie.",
      ),
      c(
        "Les événements de bordure gèrent les exceptions",
        ["bordure|exception|erreur"],
        "Mentionne les événements de bordure.",
      ),
      c(
        "Le sous-processus garde la lisibilité",
        ["sous-processus|lisib|detail"],
        "Ajoute le sous-processus.",
      ),
    ],
    cards: [
      {
        front: "Tâche ou événement ?",
        back: "Ce qu’un acteur fait est une tâche ; ce qui arrive (délai écoulé, message reçu, erreur) est un événement.",
      },
      {
        front: "À quoi sert un événement de bordure ?",
        back: "Il surveille une tâche : si l’événement survient avant la fin (délai, erreur, message), il ouvre un chemin d’exception.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras modéliser les délais, les messages, les erreurs et les sous-processus sans alourdir ton schéma.",
      prerequisites: ["Chapitre « Les embranchements sans ambiguïté »."],
      sections: [
        {
          heading: "Ce qui arrive pendant le processus",
          paragraphs: [
            "Un événement intermédiaire marque un fait qui survient en cours de route. La minuterie (une horloge) représente un délai : « 48 heures plus tard ». Le message (une enveloppe) représente une information reçue d’un autre acteur. L’erreur (un éclair) représente un échec qui interrompt une activité.",
            "Les débutants transforment souvent ces faits en tâches (« Attendre », « Recevoir la réponse ») : le schéma devient confus et ne dit plus qui fait quoi.",
          ],
          diagram: {
            kind: "table",
            title: "Trois événements intermédiaires à connaître",
            columns: ["Événement", "Symbole", "Ce qu’il représente", "Exemple"],
            rows: [
              [
                "Minuterie",
                "Cercle double avec horloge",
                "Un délai ou une date",
                "48 h sans réponse",
              ],
              [
                "Message",
                "Cercle double avec enveloppe",
                "Une information reçue ou envoyée",
                "Réponse du client",
              ],
              [
                "Erreur",
                "Cercle double avec éclair",
                "Un échec qui interrompt",
                "Paiement refusé",
              ],
            ],
            caption: "Le double cercle signale un événement intermédiaire.",
          },
        },
        {
          heading: "Les événements de bordure",
          paragraphs: [
            "Posé sur le bord d’une tâche, un événement la surveille. Si une minuterie expire avant la fin de la tâche, ou si une erreur survient, un chemin d’exception démarre. C’est la façon propre de représenter les relances, les escalades et les échecs.",
          ],
          diagram: {
            kind: "flow",
            title: "Relance après 48 heures",
            steps: [
              { label: "Demander la confirmation d’adresse" },
              {
                label: "Minuterie 48 h sur la bordure",
                note: "Pas de réponse",
                tone: "marker",
              },
              { label: "Relancer le client", tone: "apricot" },
              {
                label: "Message : réponse reçue",
                note: "Le processus reprend",
                tone: "sky",
              },
            ],
            caption:
              "La minuterie n’attend pas « en plus » : elle surveille la tâche et ouvre la relance si besoin.",
          },
        },
        {
          heading: "Le sous-processus",
          paragraphs: [
            "Quand une partie du processus contient beaucoup d’étapes (par exemple « Préparer le colis »), on la remplace par un sous-processus : un rectangle marqué d’un +, détaillé dans un schéma séparé. Le schéma principal reste lisible pour la direction, le détail reste disponible pour l’entrepôt.",
          ],
          keyPoint:
            "Un bon schéma principal tient sur un écran ; le détail vit dans les sous-processus.",
        },
      ],
      workedExample: {
        title: "Confirmation d’adresse et paiement",
        situation:
          "Une commande demande une confirmation d’adresse et un paiement qui peut être refusé.",
        steps: [
          {
            label: "Tâche de demande",
            detail: "« Demander la confirmation d’adresse » au client.",
          },
          {
            label: "Minuterie de bordure",
            detail: "48 heures sans réponse : chemin « Relancer le client ».",
          },
          {
            label: "Message",
            detail:
              "« Réponse reçue » : le processus continue vers le paiement.",
          },
          {
            label: "Erreur de bordure",
            detail:
              "Sur « Encaisser le paiement » : refus de la banque, donc « Informer le client et proposer un autre moyen ».",
          },
        ],
        outcome:
          "Les exceptions sont visibles et propres, sans tâches « Attendre » qui brouillent la lecture.",
      },
      pitfalls: [
        {
          confusion: "Modéliser une attente comme une tâche.",
          correction:
            "Une attente est un événement minuterie : personne ne « fait » l’attente.",
          counterExample:
            "« Attendre 48 h » dans le couloir du service client laisse croire qu’un conseiller attend devant son écran.",
        },
        {
          confusion: "Tout détailler dans le schéma principal.",
          correction: "Regroupe les séquences longues en sous-processus.",
          counterExample:
            "Quarante tâches sur un seul schéma : plus personne ne voit le parcours global.",
        },
      ],
      summary: [
        "Ce qu’on fait est une tâche ; ce qui arrive est un événement.",
        "Minuterie pour les délais, message pour les échanges, erreur pour les échecs.",
        "Les événements de bordure ouvrent les chemins d’exception.",
        "Le sous-processus garde le schéma principal lisible.",
      ],
      glossary: [
        {
          term: "Événement intermédiaire",
          definition:
            "Fait qui survient pendant le processus (délai, message, erreur).",
        },
        {
          term: "Événement de bordure",
          definition:
            "Événement attaché à une tâche, qui ouvre un chemin d’exception s’il survient.",
        },
        {
          term: "Minuterie",
          definition: "Événement lié à un délai ou une date.",
        },
        {
          term: "Sous-processus",
          definition:
            "Regroupement d’une séquence de tâches, détaillée dans un schéma séparé.",
        },
      ],
    },
    caseStep: {
      title: "Dossier BPMN · Les imprévus de la commande",
      context: `${LUMEN} Si l’adresse est douteuse, le service client écrit au client ; sans réponse sous 24 heures, il appelle. Le transporteur peut signaler un colis non livrable.`,
      prompts: [
        "Modélise la demande d’adresse et la relance avec les bons événements.",
        "Modélise le signalement « colis non livrable » du transporteur et ce qui suit.",
      ],
      criteria: [
        ["Minuterie de 24 h en bordure", "Chemin d’appel"],
        [
          "Événement message reçu du transporteur",
          "Suite : contacter le client ou réexpédier",
        ],
      ],
      models: [
        "Tâche « Écrire au client » avec une minuterie de 24 heures sur la bordure qui ouvre la tâche « Appeler le client » ; un événement message « Réponse reçue » poursuit vers la préparation.",
        "Événement message « Colis non livrable » reçu du transporteur, qui déclenche « Contacter le client » puis une passerelle exclusive « Nouvelle adresse ? » : oui, réexpédier ; non, rembourser.",
      ],
    },
  },
  {
    id: "bpmn-collaboration",
    title: "Plusieurs acteurs, un seul parcours.",
    subtitle: "Pools, couloirs et flux de messages.",
    skill: "Modéliser une collaboration",
    recall: q(
      "Quelle différence entre un pool et un couloir (lane) ?",
      [
        "Aucune",
        "Un pool représente une organisation ou un système distinct ; un couloir, un rôle à l’intérieur",
        "Un couloir contient plusieurs pools",
      ],
      1,
      "Le pool délimite un participant autonome (le client, l’entreprise, le transporteur) ; les couloirs découpent les rôles à l’intérieur d’un pool.",
    ),
    paragraphs: [
      "Quand plusieurs organisations interviennent, chacune a son pool. À l’intérieur d’un pool, les couloirs séparent les rôles. Le flux de séquence relie les activités d’un même pool ; le flux de message (pointillé) relie des pools différents.",
      "Un flux de séquence ne traverse jamais la frontière d’un pool : deux organisations ne s’enchaînent pas, elles s’échangent des messages.",
    ],
    takeaway:
      "Entre deux pools, on s’envoie des messages ; à l’intérieur, on s’enchaîne.",
    example: {
      context: "Livraison d’une commande par un transporteur externe.",
      before:
        "Une flèche pleine de la tâche « Remettre le colis » de l’entrepôt vers « Livrer » chez le transporteur.",
      after:
        "Pool « Entreprise » (couloirs Service client et Entrepôt) et pool « Transporteur ». Un flux de message en pointillé « Colis et bordereau » relie la remise du colis au début du processus du transporteur.",
    },
    check: q(
      "Comment relier une tâche de l’entreprise à une tâche du transporteur ?",
      [
        "Par un flux de séquence (flèche pleine)",
        "Par un flux de message (flèche en pointillé)",
        "Par une passerelle",
      ],
      1,
      "Entre deux pools, seul le flux de message est permis : chaque organisation garde son propre déroulement.",
    ),
    transfer: q(
      "Le processus interne du client final n’est pas connu. Comment le représenter ?",
      [
        "Ne pas le représenter du tout",
        "Par un pool fermé (boîte noire), relié par des flux de message",
        "Inventer ses tâches",
      ],
      1,
      "Un pool fermé représente un participant dont on ne modélise pas l’intérieur : seuls les messages échangés apparaissent.",
    ),
    exam: q(
      "À quoi servent les couloirs à l’intérieur d’un pool ?",
      [
        "À montrer qui est responsable de chaque tâche",
        "À compter les tâches",
        "À représenter les délais",
      ],
      0,
      "Chaque couloir correspond à un rôle ou un service : la position d’une tâche dit qui la réalise.",
    ),
    mission: {
      title: "Modélise une collaboration avec un transporteur.",
      context:
        "L’entreprise prépare la commande (entrepôt), le transporteur la livre, le client reçoit des notifications. On ne connaît pas l’organisation interne du transporteur.",
      prompts: [
        "Quels pools et quels couloirs utilises-tu ?",
        "Comment représentes-tu la remise du colis au transporteur et le statut qu’il renvoie ?",
      ],
      rubric: [
        "Je distingue pools (organisations) et couloirs (rôles).",
        "J’utilise des flux de message entre pools.",
      ],
      example:
        "Un pool « Entreprise » avec les couloirs Service client et Entrepôt ; un pool fermé « Transporteur » ; un pool fermé « Client ». La remise du colis et le statut de livraison sont des flux de message en pointillé entre l’entreprise et le transporteur.",
      checks: [
        {
          model:
            "Un pool « Entreprise » avec les couloirs Service client et Entrepôt ; un pool fermé « Transporteur » ; un pool fermé « Client ».",
          criteria: [
            c(
              "Un pool par organisation",
              [
                "pool[^.]*(transporteur|client|entreprise)|(transporteur|client|entreprise)[^.]*pool",
              ],
              "Donne un pool à chaque organisation.",
            ),
            c(
              "Des couloirs pour les rôles internes",
              ["couloir|lane"],
              "Découpe l’entreprise en couloirs (service client, entrepôt).",
            ),
          ],
        },
        {
          model:
            "La remise du colis et le statut de livraison sont des flux de message en pointillé entre l’entreprise et le transporteur.",
          criteria: [
            c(
              "Flux de message",
              ["message|pointill"],
              "Entre pools, on utilise des flux de message.",
            ),
            c(
              "Les deux échanges cités",
              ["(colis|remise)[^.]*statut|statut[^.]*(colis|remise)"],
              "Cite la remise du colis et le retour de statut.",
            ),
          ],
          avoid: [
            {
              patterns: [
                "flux de sequence[^.]{0,40}transporteur|fleche pleine[^.]{0,40}transporteur",
              ],
              message:
                "Un flux de séquence ne traverse pas la frontière d’un pool.",
            },
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Pool = organisation, couloir = rôle",
        ["pool|couloir"],
        "Rappelle pool et couloir.",
      ),
      c("Messages entre pools", ["message"], "Mentionne les flux de message."),
      c(
        "Pool fermé si l’intérieur est inconnu",
        ["ferme|boite noire|inconnu"],
        "Ajoute le pool fermé.",
      ),
    ],
    cards: [
      {
        front: "Flux de séquence ou flux de message ?",
        back: "Séquence (flèche pleine) : ordre des activités dans un même pool. Message (pointillé) : échange entre deux pools.",
      },
      {
        front: "Qu’est-ce qu’un pool fermé ?",
        back: "Un participant dont on ne modélise pas le fonctionnement interne ; seuls les messages échangés apparaissent.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras représenter plusieurs organisations, leurs rôles et leurs échanges dans un même schéma.",
      prerequisites: ["Socle BA, chapitre 5 : les couloirs."],
      sections: [
        {
          heading: "Pools et couloirs",
          paragraphs: [
            "Un pool représente un participant autonome : l’entreprise, le client, un transporteur, un système externe. À l’intérieur, les couloirs découpent les rôles : service client, entrepôt, comptabilité.",
            "Si tu ne connais pas (ou n’as pas besoin de connaître) le fonctionnement interne d’un participant, représente-le par un pool fermé : une boîte noire avec laquelle on échange des messages.",
          ],
          diagram: {
            kind: "lanes",
            title: "Une commande entre trois participants",
            lanes: ["Client", "Service client", "Entrepôt", "Transporteur"],
            steps: [
              { lane: 0, label: "Passer commande" },
              { lane: 1, label: "Vérifier l’adresse" },
              { lane: 2, label: "Préparer le colis" },
              { lane: 3, label: "Message : colis et bordereau", issue: true },
              { lane: 3, label: "Livrer" },
              { lane: 0, label: "Message : statut de livraison", issue: true },
            ],
            caption:
              "Client et transporteur sont des participants externes : les relais marqués sont des messages (pointillés en BPMN), pas des enchaînements.",
          },
        },
        {
          heading: "Séquence ou message",
          paragraphs: [
            "Le flux de séquence (flèche pleine) ordonne les activités d’un même pool. Le flux de message (flèche en pointillé) représente un échange entre deux pools : un e-mail, un fichier, un colis, un appel d’API.",
            "Règle d’or : une flèche pleine ne traverse jamais la frontière d’un pool. Chaque organisation pilote son propre déroulement ; elles ne font que s’échanger des informations.",
          ],
          keyPoint:
            "Une flèche pleine reste dans son pool ; une flèche en pointillé relie deux pools.",
        },
        {
          heading: "À quoi sert une collaboration",
          paragraphs: [
            "Le schéma de collaboration montre les points de contact avec l’extérieur : c’est là que se jouent souvent les retards et les malentendus (statut non transmis, fichier au mauvais format). Pour un BA, chaque flux de message est une interface à spécifier : quelles données, quel format, quelle fréquence, que se passe-t-il en cas d’échec.",
          ],
        },
      ],
      workedExample: {
        title: "Entreprise, transporteur, client",
        situation:
          "Une commande est préparée par l’entreprise, livrée par un transporteur externe, suivie par le client.",
        steps: [
          {
            label: "Identifier les participants",
            detail:
              "Entreprise (connue en détail), transporteur et client (boîtes noires).",
          },
          {
            label: "Découper l’entreprise",
            detail: "Couloirs Service client et Entrepôt.",
          },
          {
            label: "Tracer les messages",
            detail:
              "Colis et bordereau vers le transporteur ; statut de livraison en retour ; notifications vers le client.",
          },
          {
            label: "Spécifier les interfaces",
            detail:
              "Pour le statut : format, fréquence, comportement si le transporteur ne répond pas.",
          },
        ],
        outcome:
          "Les points de contact sont visibles et deviennent des interfaces à spécifier, au lieu d’angles morts.",
      },
      pitfalls: [
        {
          confusion: "Mettre le transporteur dans un couloir de l’entreprise.",
          correction: "Une organisation externe a son propre pool.",
          counterExample:
            "En couloir, le transporteur semble recevoir des ordres directs, alors qu’il suit son propre processus.",
        },
        {
          confusion: "Relier deux pools par une flèche pleine.",
          correction: "Entre pools, seuls les messages sont permis.",
          counterExample:
            "Une flèche pleine vers le transporteur laisse croire qu’il démarre automatiquement dès la fin de la préparation.",
        },
      ],
      summary: [
        "Un pool par participant autonome ; des couloirs pour les rôles internes.",
        "Séquence dans un pool, message entre pools.",
        "Pool fermé quand l’intérieur n’est pas modélisé.",
        "Chaque flux de message est une interface à spécifier.",
      ],
      glossary: [
        {
          term: "Pool",
          definition:
            "Participant autonome d’une collaboration (organisation, système externe).",
        },
        {
          term: "Couloir (lane)",
          definition: "Rôle ou service à l’intérieur d’un pool.",
        },
        {
          term: "Flux de message",
          definition: "Échange entre deux pools, représenté en pointillé.",
        },
        {
          term: "Pool fermé",
          definition:
            "Participant dont on ne modélise pas le fonctionnement interne.",
        },
      ],
    },
    caseStep: {
      title: "Dossier BPMN · La collaboration Maison Lumen",
      context: `${LUMEN} La commande implique le client, le service client, l’entrepôt, le transporteur et la banque (paiement).`,
      prompts: [
        "Liste les pools et les couloirs de ton schéma, en justifiant les pools fermés.",
        "Cite trois flux de message et ce qu’il faudrait spécifier pour l’un d’eux.",
      ],
      criteria: [
        [
          "Pool Maison Lumen avec couloirs",
          "Pools fermés pour client, transporteur, banque",
        ],
        [
          "Trois flux de message",
          "Données, format ou comportement en cas d’échec",
        ],
      ],
      models: [
        "Pool Maison Lumen avec les couloirs Service client et Entrepôt ; pools fermés Client, Transporteur et Banque, car on ne modélise pas leur fonctionnement interne.",
        "Autorisation de paiement entre la banque et Maison Lumen ; remise du colis au transporteur ; statut de livraison renvoyé par le transporteur. Pour le statut : données (numéro, statut, horodatage), format, fréquence d’envoi et comportement si le statut n’arrive pas sous 24 heures.",
      ],
    },
  },
  {
    id: "bpmn-qualite",
    title: "Un schéma utile, pas un schéma joli.",
    subtitle: "Choisir le niveau de détail et mesurer pour améliorer.",
    skill: "Modéliser pour améliorer",
    recall: q(
      "Pour qui fait-on d’abord un schéma de processus ?",
      [
        "Pour le plaisir de la notation",
        "Pour un public et une décision précis",
        "Pour l’archiver",
      ],
      1,
      "Un schéma sert une décision ou une compréhension partagée : son niveau de détail dépend de son public.",
    ),
    paragraphs: [
      "On ne modélise pas tout au même niveau : une cartographie pour la direction, un processus pour les équipes, une procédure pour l’opérateur. Le niveau dépend de la décision à prendre.",
      "Un schéma devient un outil d’amélioration quand on y ajoute des mesures : durée des tâches, temps d’attente, taux de reprise.",
    ],
    takeaway: "Le bon schéma est celui qui aide son public à décider.",
    example: {
      context: "Réduire le délai de remboursement des retours.",
      before: "Un schéma de 45 tâches, très détaillé, sans aucun chiffre.",
      after:
        "Un schéma de 8 étapes lisible par la direction, avec pour chacune la durée et l’attente mesurées : 6 jours sur 9 se passent en attente entre le contrôle et le remboursement.",
    },
    check: q(
      "Dans un processus de 9 jours, les tâches prennent 4 heures au total. Où chercher le gain ?",
      [
        "Dans l’accélération des tâches",
        "Dans les attentes entre les tâches",
        "Dans le choix d’un nouvel outil",
      ],
      1,
      "L’essentiel du délai est de l’attente : c’est là que se trouve le gain, souvent aux passages de relais.",
    ),
    transfer: q(
      "La direction veut comprendre en 5 minutes pourquoi les retours sont lents. Quel schéma présenter ?",
      [
        "La procédure détaillée de l’entrepôt",
        "Une vue de quelques étapes avec les durées et attentes clés",
        "Le diagramme de classes de la base de données",
      ],
      1,
      "Un public de décision a besoin d’une vue synthétique chiffrée, pas d’un détail opérationnel.",
    ),
    exam: q(
      "Quelle erreur rend un schéma inutilisable ?",
      [
        "Nommer les tâches par un verbe à l’infinitif",
        "Mélanger plusieurs niveaux de détail sur le même schéma",
        "Utiliser des couloirs",
      ],
      1,
      "Mélanger cartographie et procédure sur un même schéma noie l’essentiel ; chaque niveau a son schéma.",
    ),
    mission: {
      title: "Rends un schéma utile.",
      context:
        "Le service retours a un schéma de 45 tâches, sans chiffres. La direction veut savoir pourquoi un remboursement prend 9 jours.",
      prompts: [
        "Quel niveau de détail proposes-tu pour la direction, et pourquoi ?",
        "Quelles mesures ajoutes-tu au schéma pour trouver le gain ?",
      ],
      rubric: [
        "J’adapte le niveau de détail au public et à la décision.",
        "J’ajoute des durées et des attentes mesurées.",
      ],
      example:
        "Une vue de 6 à 8 étapes pour la direction, car elle doit décider où agir, pas exécuter la procédure. Mesures : durée de chaque étape, temps d’attente entre les étapes, nombre de dossiers en attente.",
      checks: [
        {
          model:
            "Une vue de 6 à 8 étapes pour la direction, car elle doit décider où agir, pas exécuter la procédure.",
          criteria: [
            c(
              "Un niveau synthétique",
              [
                "synth|vue|quelques|\\d+ etapes|macro|cartographie|simplifi|resume",
              ],
              "Propose une vue réduite à l’essentiel.",
            ),
            c(
              "Justifié par le public ou la décision",
              ["direction|decid|public|lecteur|comprendre|car|parce"],
              "Justifie par le public et sa décision.",
            ),
          ],
        },
        {
          model:
            "Mesures : durée de chaque étape, temps d’attente entre les étapes, nombre de dossiers en attente.",
          criteria: [
            c(
              "Durées des étapes",
              ["duree|temps|heure|jour"],
              "Mesure la durée des étapes.",
            ),
            c(
              "Attentes ou files",
              ["attente|file|stock|en cours|bloqu|relais"],
              "Mesure les attentes entre étapes.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Adapter le niveau au public",
        ["niveau|public|detail"],
        "Rappelle les niveaux de détail.",
      ),
      c(
        "Mesurer durées et attentes",
        ["attente|duree|mesur"],
        "Mentionne les mesures.",
      ),
      c(
        "Le gain se cache dans les attentes",
        ["attente|relais|gain"],
        "Ajoute où se cache le gain.",
      ),
    ],
    cards: [
      {
        front: "Les trois niveaux de modélisation ?",
        back: "Cartographie (direction, vue d’ensemble), processus (équipes, enchaînements et rôles), procédure (opérateur, mode opératoire détaillé).",
      },
      {
        front: "Où se cache souvent le gain dans un processus lent ?",
        back: "Dans les attentes entre les tâches, en particulier aux passages de relais, plutôt que dans la durée des tâches elles-mêmes.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras choisir le niveau de détail d’un schéma selon son public et l’enrichir de mesures pour trouver où agir.",
      prerequisites: ["Les trois chapitres précédents de ce parcours."],
      sections: [
        {
          heading: "Trois niveaux, trois publics",
          paragraphs: [
            "La cartographie montre les grands processus de l’entreprise et leurs liens : elle sert la direction. Le schéma de processus montre les étapes, les rôles et les décisions : il sert les équipes et le BA. La procédure décrit le mode opératoire d’une tâche : elle sert l’opérateur.",
            "Mélanger ces niveaux sur un même schéma produit un document que personne ne peut lire.",
          ],
          diagram: {
            kind: "table",
            title: "Choisir son niveau de modélisation",
            columns: ["Niveau", "Public", "Question servie"],
            rows: [
              [
                "Cartographie",
                "Direction",
                "Quels processus, et comment s’articulent-ils ?",
              ],
              [
                "Processus",
                "Équipes, BA",
                "Qui fait quoi, dans quel ordre, avec quelles décisions ?",
              ],
              [
                "Procédure",
                "Opérateur",
                "Comment exécuter cette tâche, pas à pas ?",
              ],
            ],
            caption: "Un schéma, un public, une question.",
          },
        },
        {
          heading: "Mesurer pour améliorer",
          paragraphs: [
            "Un schéma sans chiffres décrit ; un schéma mesuré explique. Pour chaque étape, relève la durée de travail effectif et le temps d’attente avant l’étape suivante. Le délai total est souvent dominé par les attentes, notamment aux passages de relais.",
            "Ce constat change la discussion : au lieu d’accélérer les gens, on supprime les attentes (information transmise automatiquement, responsable de relais, files visibles).",
          ],
          diagram: {
            kind: "flow",
            title: "9 jours de remboursement, dont 4 heures de travail",
            steps: [
              { label: "Retour accepté", note: "Travail 15 min · attente 1 j" },
              {
                label: "Colis reçu et contrôlé",
                note: "Travail 30 min · attente 6 j",
                tone: "blush",
              },
              {
                label: "Remboursement",
                note: "Travail 10 min · attente 2 j",
                tone: "marker",
              },
              { label: "Client informé", tone: "sky" },
            ],
            caption:
              "Chiffres fictifs : l’attente après le contrôle concentre l’essentiel du délai.",
          },
          keyPoint:
            "On gagne rarement en accélérant le travail ; on gagne en supprimant l’attente.",
        },
        {
          heading: "Les règles de lisibilité",
          paragraphs: [
            "Une tâche se nomme par un verbe à l’infinitif et un objet (« Contrôler le produit ») ; une passerelle exclusive, par une question. Le flux se lit de gauche à droite, avec un seul événement de début par processus. Au-delà d’une quinzaine de tâches, découpe en sous-processus.",
          ],
        },
      ],
      workedExample: {
        title: "Le schéma de 45 tâches",
        situation:
          "Le service retours présente un schéma exhaustif ; la direction veut comprendre les 9 jours de délai.",
        steps: [
          {
            label: "Identifier le public",
            detail:
              "La direction décide où investir : elle a besoin d’une vue synthétique.",
          },
          {
            label: "Condenser",
            detail:
              "Six étapes de haut niveau, le détail reste dans des sous-processus.",
          },
          {
            label: "Mesurer",
            detail:
              "Durée et attente de chaque étape, sur 50 dossiers récents.",
          },
          {
            label: "Montrer le goulot",
            detail:
              "Six jours d’attente entre le contrôle et le remboursement : décision de transmettre automatiquement le résultat du contrôle.",
          },
        ],
        outcome:
          "En une page, la direction voit où agir ; la décision est prise en une réunion.",
      },
      pitfalls: [
        {
          confusion: "Croire qu’un schéma plus détaillé est meilleur.",
          correction: "Le bon détail est celui qui sert la décision du public.",
          counterExample:
            "Quarante-cinq tâches montrées en comité de direction : personne ne voit le goulot.",
        },
        {
          confusion:
            "Optimiser la durée des tâches sans regarder les attentes.",
          correction: "Mesure les deux : l’attente domine souvent.",
          counterExample:
            "On forme l’équipe à contrôler plus vite (−10 minutes) alors que le dossier attend six jours ensuite.",
        },
      ],
      summary: [
        "Cartographie, processus, procédure : un niveau par public.",
        "Un schéma mesuré (durées, attentes) montre où agir.",
        "Le gain se cache souvent dans les attentes aux relais.",
        "Verbes à l’infinitif, questions sur les passerelles, sous-processus au-delà de quinze tâches.",
      ],
      glossary: [
        {
          term: "Cartographie des processus",
          definition:
            "Vue d’ensemble des processus d’une organisation et de leurs liens.",
        },
        {
          term: "Procédure",
          definition: "Mode opératoire détaillé d’une tâche.",
        },
        {
          term: "Temps d’attente",
          definition:
            "Durée pendant laquelle un dossier attend entre deux étapes.",
        },
        {
          term: "Goulot d’étranglement",
          definition:
            "Étape qui limite le débit ou concentre l’attente du processus.",
        },
      ],
    },
    caseStep: {
      title: "Dossier BPMN · Montrer où agir",
      context: `${LUMEN} Mesures sur 100 commandes : vérification d’adresse 10 min de travail et 20 h d’attente ; préparation 25 min et 6 h d’attente ; remise au transporteur 5 min et 18 h d’attente (un seul enlèvement à 16 h).`,
      prompts: [
        "Quel schéma présentes-tu à la directrice, et qu’y mets-tu ?",
        "Où se trouve le gain principal, et quelle piste en découle ?",
      ],
      criteria: [
        ["Vue synthétique pour la direction", "Durées et attentes affichées"],
        ["Le goulot identifié par les attentes", "Une piste concrète"],
      ],
      models: [
        "Une vue en quatre étapes (paiement, vérification d’adresse, préparation, remise au transporteur), avec pour chacune la durée de travail et l’attente mesurées.",
        "Le gain est dans les attentes : 20 heures avant la vérification d’adresse et 18 heures avant l’enlèvement, contre 40 minutes de travail. Pistes : vérification automatique au paiement et second enlèvement à 11 h.",
      ],
    },
  },
];

export const bpmnCourse: Course = {
  id: "ba-bpmn",
  title: "BPMN avancé",
  eyebrow: "Spécialisation",
  color: "lavender",
  icon: "compass",
  description:
    "Passerelles, événements, collaborations entre organisations et schémas mesurés pour décider où agir.",
  lessons,
  caseStudy: {
    name: "Maison Lumen",
    pitch: `${LUMEN} Tu modélises le parcours de commande pour décider où agir.`,
  },
  sources: [
    {
      title: "OMG · BPMN 2.0.2",
      url: "https://www.omg.org/spec/BPMN/2.0.2/About-BPMN",
    },
  ],
};
