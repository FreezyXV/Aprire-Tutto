import type { Course, Lesson } from "@/lib/types";
import { c, LUMEN, q } from "./helpers";

/*
 * Specialization: acceptance testing and quality. Original writing in
 * French, informed by the ISTQB glossary and acceptance-testing practice.
 */
const lessons: Lesson[] = [
  {
    id: "rec-strategie",
    title: "Préparer la recette avant qu’elle commence.",
    subtitle:
      "Stratégie, plan, environnements et critères d’entrée et de sortie.",
    skill: "Organiser une recette",
    recall: q(
      "Quand faut-il commencer à préparer la recette ?",
      [
        "Quand le développement est terminé",
        "Dès que les exigences sont écrites",
        "Le jour de la mise en production",
      ],
      1,
      "Les cas de test se dérivent des exigences : les préparer tôt révèle aussi les exigences ambiguës.",
    ),
    paragraphs: [
      "La stratégie de recette fixe ce qu’on teste, comment, avec qui, sur quel environnement et avec quelles données. Le plan de recette la traduit en calendrier et en campagnes.",
      "Des critères d’entrée (quand commencer) et de sortie (quand s’arrêter) évitent de démarrer trop tôt ou de ne jamais finir.",
    ],
    takeaway:
      "Une recette se prépare dès les exigences, pas après le développement.",
    example: {
      context: "Recette d’un nouveau module de suivi des commandes.",
      before: "« Les métiers testeront quand ce sera prêt. »",
      after:
        "Périmètre : 12 exigences prioritaires. Testeurs : 3 conseillers et 1 magasinier, 2 jours bloqués. Environnement de recette avec données anonymisées. Entrée : build livré et tests techniques passés. Sortie : zéro anomalie bloquante, 95 % des cas exécutés.",
    },
    check: q(
      "À quoi sert un critère de sortie de recette ?",
      [
        "À décider objectivement quand la recette est terminée",
        "À choisir les testeurs",
        "À rédiger les exigences",
      ],
      0,
      "Le critère de sortie (par exemple « aucune anomalie bloquante ») permet de conclure sans débat sans fin.",
    ),
    transfer: q(
      "Les testeurs métier n’ont jamais de temps disponible. Que prévois-tu ?",
      [
        "Tester à leur place",
        "Bloquer leurs créneaux à l’avance dans le plan, validé par leur responsable",
        "Reporter la recette sans date",
      ],
      1,
      "La disponibilité des testeurs est une ressource à planifier et à faire valider, comme un budget.",
    ),
    exam: q(
      "Pourquoi utiliser des données anonymisées en recette ?",
      [
        "Pour accélérer les tests",
        "Pour tester des cas réalistes sans exposer de données personnelles",
        "Parce que les vraies données sont trop nombreuses",
      ],
      1,
      "Les données réalistes rendent les tests pertinents ; l’anonymisation protège les personnes et respecte le RGPD.",
    ),
    mission: {
      title: "Écris l’essentiel d’une stratégie de recette.",
      context:
        "Un nouvel outil de rendez-vous sera mis en production dans six semaines. Trois responsables d’atelier peuvent tester ; les données clients sont personnelles.",
      prompts: [
        "Précise le périmètre testé, les testeurs et l’environnement avec ses données.",
        "Écris un critère d’entrée et un critère de sortie.",
      ],
      rubric: [
        "Je précise périmètre, testeurs, environnement et données.",
        "Mes critères d’entrée et de sortie sont vérifiables.",
      ],
      example:
        "Périmètre : prise, modification et annulation de rendez-vous, rappel SMS. Testeurs : les trois responsables d’atelier, deux demi-journées bloquées. Environnement de recette avec données anonymisées. Entrée : version livrée et tests techniques au vert. Sortie : aucune anomalie bloquante ni majeure ouverte, 95 % des cas exécutés.",
      checks: [
        {
          model:
            "Périmètre : prise, modification et annulation de rendez-vous. Testeurs : les trois responsables d’atelier, deux demi-journées bloquées. Environnement de recette avec données anonymisées.",
          criteria: [
            c(
              "Périmètre testé",
              [
                "perimetre|fonctionnalit|prise|modification|annulation|exigence|parcours",
              ],
              "Dis ce qui est testé.",
            ),
            c(
              "Testeurs et disponibilité",
              [
                "testeur|responsable|metier|utilisateur|creneau|demi-journee|jour",
              ],
              "Indique qui teste et quand.",
            ),
            c(
              "Environnement et données",
              ["environnement|donnees|anonymis|jeu de"],
              "Précise l’environnement et les données (anonymisées).",
            ),
          ],
        },
        {
          model:
            "Entrée : version livrée et tests techniques au vert. Sortie : aucune anomalie bloquante ni majeure ouverte, 95 % des cas exécutés.",
          criteria: [
            c(
              "Un critère d’entrée",
              ["entree|commencer|demarr|prerequis|livr"],
              "Dis à quelle condition la recette commence.",
            ),
            c(
              "Un critère de sortie vérifiable",
              ["sortie|terminer|fin|aucune anomalie|%|bloquant"],
              "Dis à quelle condition elle est terminée, avec un seuil.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Préparer la recette dès les exigences",
        ["exigence|tot|avance|prepar"],
        "Rappelle quand préparer.",
      ),
      c(
        "Critères d’entrée et de sortie",
        ["entree|sortie|critere"],
        "Mentionne les critères.",
      ),
      c(
        "Données anonymisées et testeurs planifiés",
        ["anonymis|testeur|donnee"],
        "Ajoute données et testeurs.",
      ),
    ],
    cards: [
      {
        front: "Que contient une stratégie de recette ?",
        back: "Périmètre testé, types de tests, testeurs et disponibilités, environnement, jeux de données, critères d’entrée et de sortie, gestion des anomalies.",
      },
      {
        front: "Critère d’entrée vs critère de sortie ?",
        back: "Entrée : à quelle condition commencer (version livrée, tests techniques passés). Sortie : à quelle condition s’arrêter (aucune anomalie bloquante, taux d’exécution atteint).",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras organiser une recette : périmètre, testeurs, environnement, données et critères d’entrée et de sortie.",
      prerequisites: ["Socle BA, chapitre 8 : cas de test et traçabilité."],
      sections: [
        {
          heading: "La recette se prépare tôt",
          paragraphs: [
            "Les cas de test se dérivent des exigences et des critères d’acceptation. Les écrire dès que les exigences sont stables a un double effet : la recette est prête à temps, et les exigences ambiguës sont repérées avant le développement.",
          ],
          diagram: {
            kind: "flow",
            title: "Les étapes d’une recette",
            steps: [
              {
                label: "Stratégie",
                note: "Quoi, comment, qui",
                tone: "apricot",
              },
              { label: "Cas de test", note: "Dérivés des exigences" },
              {
                label: "Critères d’entrée",
                note: "Peut-on commencer ?",
                tone: "marker",
              },
              { label: "Campagnes", note: "Exécution, anomalies" },
              {
                label: "Critères de sortie",
                note: "Peut-on conclure ?",
                tone: "sky",
              },
            ],
            caption:
              "Les critères encadrent la campagne : on ne commence pas trop tôt, on ne s’éternise pas.",
          },
        },
        {
          heading: "Testeurs, environnement, données",
          paragraphs: [
            "Les testeurs métier sont la ressource la plus rare : bloque leurs créneaux dans le plan et fais-le valider par leur responsable. L’environnement de recette doit ressembler à la production (versions, paramètres, interfaces).",
            "Les jeux de données doivent couvrir les cas réels (client avec plusieurs commandes, adresse à l’étranger, commande annulée) sans exposer de données personnelles : on anonymise ou on fabrique des données réalistes.",
          ],
          keyPoint: "Un testeur sans créneau bloqué est un testeur absent.",
        },
        {
          heading: "Des critères qui évitent les débats",
          paragraphs: [
            "Le critère d’entrée protège les testeurs : on ne leur livre pas une version qui plante à l’ouverture. Le critère de sortie protège le projet : « aucune anomalie bloquante ou majeure ouverte, 95 % des cas exécutés » permet de conclure sans discussion interminable.",
          ],
          diagram: {
            kind: "table",
            title: "Exemples de critères",
            columns: ["Type", "Exemple", "Pourquoi"],
            rows: [
              [
                "Entrée",
                "Version livrée, tests techniques au vert",
                "Ne pas gaspiller le temps des testeurs",
              ],
              ["Entrée", "Jeux de données chargés", "Tester des cas réalistes"],
              [
                "Sortie",
                "Aucune anomalie bloquante ou majeure ouverte",
                "Garantir l’usage",
              ],
              ["Sortie", "95 % des cas exécutés", "Couvrir le périmètre"],
            ],
            caption: "Les critères se valident avant la recette, pas pendant.",
          },
        },
      ],
      workedExample: {
        title: "L’outil de rendez-vous",
        situation:
          "Mise en production dans six semaines ; trois responsables d’atelier peuvent tester.",
        steps: [
          {
            label: "Périmètre",
            detail:
              "Prise, modification, annulation, rappel SMS : 14 exigences prioritaires.",
          },
          {
            label: "Testeurs",
            detail:
              "Deux demi-journées bloquées par responsable, validées par la direction.",
          },
          {
            label: "Environnement et données",
            detail:
              "Environnement de recette connecté au planning de test, 200 clients fictifs réalistes.",
          },
          {
            label: "Critères",
            detail:
              "Entrée : tests techniques au vert. Sortie : zéro bloquante ou majeure, 95 % des cas exécutés.",
          },
        ],
        outcome:
          "La recette démarre à l’heure, se termine sur une décision claire, et personne n’a vu de données réelles.",
      },
      pitfalls: [
        {
          confusion: "Préparer les cas de test après le développement.",
          correction:
            "Prépare-les dès les exigences : tu gagnes du temps et tu repères les ambiguïtés.",
          counterExample:
            "En écrivant les tests, on découvre que « rappel la veille » n’a jamais précisé l’heure d’envoi.",
        },
        {
          confusion: "Tester avec une copie brute de la production.",
          correction: "Anonymise ou fabrique des données réalistes.",
          counterExample:
            "Un testeur envoie par erreur un SMS de rappel à un vrai client.",
        },
      ],
      summary: [
        "La recette se prépare dès les exigences.",
        "Testeurs planifiés, environnement proche de la production, données réalistes et anonymisées.",
        "Critères d’entrée et de sortie validés à l’avance.",
      ],
      glossary: [
        {
          term: "Stratégie de recette",
          definition:
            "Ce qu’on teste, comment, avec qui, sur quel environnement et avec quelles données.",
        },
        {
          term: "Campagne de test",
          definition:
            "Période d’exécution d’un ensemble de cas de test sur une version donnée.",
        },
        {
          term: "Critère de sortie",
          definition: "Condition objective pour conclure la recette.",
        },
        {
          term: "Données anonymisées",
          definition:
            "Données réalistes dont les éléments personnels ont été rendus non identifiants.",
        },
      ],
    },
    caseStep: {
      title: "Dossier recette · Organiser la recette Maison Lumen",
      context: `${LUMEN} La nouvelle file de commandes et les notifications client doivent être recettées en trois semaines, avant le pic des fêtes.`,
      prompts: [
        "Rédige la stratégie : périmètre, testeurs, environnement, données.",
        "Écris les critères d’entrée et de sortie, et explique qui décide de la fin de recette.",
      ],
      criteria: [
        [
          "Périmètre",
          "Testeurs planifiés (service client, entrepôt)",
          "Données anonymisées",
        ],
        ["Critères vérifiables", "Décision par la directrice"],
      ],
      models: [
        "Périmètre : vérification d’adresse, file de préparation, notifications d’expédition. Testeurs : deux conseillers et le chef d’entrepôt, trois demi-journées bloquées. Environnement de recette relié au transporteur de test, avec 300 commandes fictives réalistes.",
        "Entrée : version livrée et tests techniques au vert. Sortie : aucune anomalie bloquante ou majeure ouverte, 95 % des cas exécutés. La directrice prononce la fin de recette sur le bilan présenté par le BA.",
      ],
    },
  },
  {
    id: "rec-conception",
    title: "Tester plus malin, pas plus.",
    subtitle: "Classes d’équivalence, valeurs limites et tables de décision.",
    skill: "Concevoir des cas de test",
    recall: q(
      "Une remise s’applique dès 100 € d’achat. Quelles valeurs tester en priorité ?",
      ["50 € et 500 €", "99,99 €, 100 € et 100,01 €", "0 € uniquement"],
      1,
      "Les erreurs se cachent aux limites : juste en dessous, pile sur, juste au-dessus du seuil.",
    ),
    paragraphs: [
      "On ne peut pas tout tester : des techniques choisissent les cas qui ont le plus de chances de trouver une anomalie. Les classes d’équivalence regroupent les valeurs traitées de la même façon ; les valeurs limites testent les bords ; la table de décision couvre les combinaisons de conditions.",
      "Une bonne conception réduit le nombre de cas tout en augmentant la couverture des risques.",
    ],
    takeaway:
      "Teste une valeur par classe et chaque limite : c’est là que vivent les bugs.",
    example: {
      context: "Livraison gratuite dès 60 € pour la France métropolitaine.",
      before: "Tester au hasard : 20 €, 75 €, 200 €.",
      after:
        "Classes : moins de 60 €, 60 € et plus. Limites : 59,99 €, 60 €, 60,01 €. Table de décision : montant (oui/non) × France métropolitaine (oui/non) = 4 cas.",
    },
    check: q(
      "Combien de cas une table de décision à deux conditions oui/non contient-elle ?",
      ["2", "4", "8"],
      1,
      "Deux conditions binaires donnent 2 × 2 = 4 combinaisons.",
    ),
    transfer: q(
      "Un mot de passe doit faire de 12 à 64 caractères. Quelles longueurs tester ?",
      ["12 et 64 seulement", "11, 12, 64 et 65", "1, 30 et 100"],
      1,
      "Les limites valides (12, 64) et juste à l’extérieur (11, 65) : c’est là que les erreurs de bornes apparaissent.",
    ),
    exam: q(
      "Qu’est-ce qu’une classe d’équivalence ?",
      [
        "Un ensemble de valeurs que le système doit traiter de la même façon",
        "Un groupe de testeurs du même niveau",
        "Deux cas de test identiques",
      ],
      0,
      "Toutes les valeurs d’une classe déclenchent le même comportement attendu : une valeur représentative suffit.",
    ),
    mission: {
      title: "Conçois des cas de test efficaces.",
      context:
        "Règle : la livraison est gratuite dès 60 € d’achat, uniquement en France métropolitaine. Sinon, elle coûte 5,90 €.",
      prompts: [
        "Quelles valeurs de montant testes-tu, et pourquoi ?",
        "Construis la table de décision (conditions, combinaisons, résultat attendu).",
      ],
      rubric: [
        "Je teste les limites autour de 60 € et justifie par les bornes.",
        "Ma table couvre les quatre combinaisons avec leur résultat.",
      ],
      example:
        "Montants : 59,99 €, 60 € et 60,01 €, car les erreurs de borne (supérieur ou supérieur ou égal) se cachent à la limite, plus une valeur typique par classe. Table : montant ≥ 60 € et métropole, livraison gratuite ; montant ≥ 60 € hors métropole, 5,90 € ; montant < 60 € en métropole, 5,90 € ; montant < 60 € hors métropole, 5,90 €.",
      checks: [
        {
          model:
            "Montants : 59,99 €, 60 € et 60,01 €, car les erreurs de borne se cachent à la limite, plus une valeur typique par classe.",
          criteria: [
            c(
              "Valeurs autour de 60 €",
              ["59[,.]9|60[,.]0?1|60 ?€|60 euros|\\b60\\b"],
              "Teste juste en dessous, pile sur et juste au-dessus de 60 €.",
            ),
            c(
              "Justification par les limites",
              ["limite|borne|seuil|egal|>=|superieur"],
              "Explique pourquoi les limites.",
            ),
          ],
        },
        {
          model:
            "Montant ≥ 60 € et métropole : gratuite. Montant ≥ 60 € hors métropole : 5,90 €. Montant < 60 € en métropole : 5,90 €. Montant < 60 € hors métropole : 5,90 €.",
          criteria: [
            c(
              "Deux conditions croisées",
              [
                "(metropole|france)[\\s\\S]*(montant|60)|(montant|60)[\\s\\S]*(metropole|france)",
              ],
              "Croise le montant et la zone.",
            ),
            c(
              "Résultats attendus",
              ["gratuit[\\s\\S]*5[,.]90|5[,.]90[\\s\\S]*gratuit"],
              "Indique le résultat attendu de chaque combinaison.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Classes d’équivalence",
        ["classe"],
        "Rappelle les classes d’équivalence.",
      ),
      c("Valeurs limites", ["limite|borne"], "Mentionne les valeurs limites."),
      c(
        "Table de décision",
        ["table de decision|combinaison"],
        "Ajoute la table de décision.",
      ),
    ],
    cards: [
      {
        front: "Pourquoi tester les valeurs limites ?",
        back: "Les erreurs de comparaison (> au lieu de ≥) se manifestent exactement aux bornes : juste en dessous, pile sur, juste au-dessus.",
      },
      {
        front: "À quoi sert une table de décision ?",
        back: "À couvrir toutes les combinaisons de conditions d’une règle, avec le résultat attendu de chacune.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras choisir des cas de test avec les classes d’équivalence, les valeurs limites et les tables de décision.",
      prerequisites: [
        "Chapitre précédent : stratégie de recette.",
        "Socle BA, chapitre 4 : règles de gestion.",
      ],
      sections: [
        {
          heading: "Classes d’équivalence et valeurs limites",
          paragraphs: [
            "Une classe d’équivalence regroupe les valeurs que le système doit traiter de la même façon : pour « livraison gratuite dès 60 € », il y a deux classes, moins de 60 € et 60 € ou plus. Une valeur par classe suffit pour vérifier le comportement général.",
            "Les erreurs se concentrent pourtant aux frontières : un développeur écrit « > 60 » au lieu de « ≥ 60 ». On teste donc juste en dessous, pile sur et juste au-dessus de chaque limite.",
          ],
          diagram: {
            kind: "flow",
            title: "Les valeurs à tester autour de 60 €",
            steps: [
              { label: "30 €", note: "Valeur typique : payante" },
              {
                label: "59,99 €",
                note: "Juste en dessous : payante",
                tone: "marker",
              },
              {
                label: "60,00 €",
                note: "Pile sur la limite : gratuite",
                tone: "apricot",
              },
              {
                label: "60,01 €",
                note: "Juste au-dessus : gratuite",
                tone: "marker",
              },
              {
                label: "150 €",
                note: "Valeur typique : gratuite",
                tone: "sky",
              },
            ],
            caption:
              "Cinq valeurs suffisent à couvrir la règle et ses limites.",
          },
        },
        {
          heading: "La table de décision",
          paragraphs: [
            "Quand une règle combine plusieurs conditions, la table de décision liste toutes les combinaisons et le résultat attendu de chacune. Deux conditions binaires donnent quatre cas ; trois en donnent huit.",
            "La table révèle souvent des combinaisons que personne n’avait prévues : c’est alors une question à poser au métier, pas un détail à deviner.",
          ],
          diagram: {
            kind: "table",
            title: "Livraison gratuite : table de décision",
            columns: [
              "Montant ≥ 60 €",
              "France métropolitaine",
              "Résultat attendu",
            ],
            rows: [
              ["Oui", "Oui", "Livraison gratuite"],
              ["Oui", "Non", "5,90 €"],
              ["Non", "Oui", "5,90 €"],
              ["Non", "Non", "5,90 €"],
            ],
            caption:
              "Chaque ligne devient un cas de test ; aucune combinaison n’est oubliée.",
          },
          keyPoint:
            "Une combinaison sans résultat attendu est une question à poser au métier.",
        },
      ],
      workedExample: {
        title: "La livraison gratuite",
        situation:
          "Règle : gratuite dès 60 € en France métropolitaine, sinon 5,90 €.",
        steps: [
          {
            label: "Repérer les conditions",
            detail: "Montant (seuil 60 €) et zone (métropole ou non).",
          },
          {
            label: "Classes et limites",
            detail:
              "59,99 €, 60 €, 60,01 €, plus une valeur typique par classe.",
          },
          {
            label: "Table de décision",
            detail: "Quatre combinaisons avec leur résultat attendu.",
          },
          {
            label: "Questions ouvertes",
            detail:
              "La Corse est-elle « métropolitaine » pour cette règle ? Le montant s’entend-il avant ou après remise ? À faire trancher par le métier.",
          },
        ],
        outcome:
          "Une dizaine de cas couvrent la règle, et deux ambiguïtés sont levées avant la mise en production.",
      },
      pitfalls: [
        {
          confusion: "Multiplier les cas sans méthode.",
          correction:
            "Une valeur par classe et chaque limite couvrent mieux avec moins de cas.",
          counterExample:
            "Cinquante montants testés au hasard, aucun à 60 € pile : l’erreur de borne passe en production.",
        },
        {
          confusion: "Deviner le résultat d’une combinaison non prévue.",
          correction: "Fais trancher le métier et mets à jour la règle.",
          counterExample:
            "Le testeur suppose que la Corse est exclue ; le métier pensait l’inverse.",
        },
      ],
      summary: [
        "Une valeur par classe d’équivalence suffit pour le comportement général.",
        "Les limites se testent juste en dessous, pile sur et juste au-dessus.",
        "La table de décision couvre toutes les combinaisons de conditions.",
        "Une combinaison non prévue est une question pour le métier.",
      ],
      glossary: [
        {
          term: "Classe d’équivalence",
          definition:
            "Ensemble de valeurs que le système doit traiter de la même façon.",
        },
        {
          term: "Valeur limite",
          definition:
            "Valeur située à la frontière d’une classe, où se concentrent les erreurs.",
        },
        {
          term: "Table de décision",
          definition:
            "Tableau des combinaisons de conditions et du résultat attendu de chacune.",
        },
        {
          term: "Couverture",
          definition:
            "Part des exigences ou des cas possibles vérifiée par les tests.",
        },
      ],
    },
    caseStep: {
      title: "Dossier recette · Tester la vérification d’adresse",
      context: `${LUMEN} Règle : une commande part directement si l’adresse est reconnue par le référentiel postal ; sinon, contrôle manuel. Les commandes de plus de 500 € passent toujours par un contrôle manuel.`,
      prompts: [
        "Quelles valeurs de montant testes-tu, et pourquoi ?",
        "Construis la table de décision et signale une question à poser au métier.",
      ],
      criteria: [
        ["Limites autour de 500 €", "Justification"],
        [
          "Quatre combinaisons avec résultat",
          "Une question ouverte pertinente",
        ],
      ],
      models: [
        "499,99 €, 500 € et 500,01 €, car l’erreur de borne (« plus de 500 € » inclut-il 500 € ?) se joue exactement à la limite, plus une valeur typique de chaque côté.",
        "Adresse reconnue et ≤ 500 € : départ direct. Adresse reconnue et > 500 € : contrôle manuel. Adresse non reconnue et ≤ 500 € : contrôle manuel. Adresse non reconnue et > 500 € : contrôle manuel. Question : une commande de 500 € pile est-elle « plus de 500 € » ?",
      ],
    },
  },
  {
    id: "rec-anomalies",
    title: "Une anomalie bien décrite est à moitié corrigée.",
    subtitle: "Décrire, qualifier et prioriser les anomalies.",
    skill: "Gérer les anomalies",
    recall: q(
      "Quelle différence entre sévérité et priorité d’une anomalie ?",
      [
        "Aucune",
        "La sévérité mesure l’impact sur l’usage ; la priorité, l’urgence de la correction",
        "La priorité est fixée par le développeur seul",
      ],
      1,
      "Une faute d’orthographe sur la page d’accueil est peu sévère mais peut être prioritaire ; un bug grave sur une fonction rare peut attendre.",
    ),
    paragraphs: [
      "Une anomalie se décrit pour être reproduite : étapes, données, résultat attendu, résultat obtenu, environnement, capture. Sans cela, elle revient avec « impossible à reproduire ».",
      "La sévérité qualifie l’impact sur l’usage (bloquante, majeure, mineure, cosmétique) ; la priorité, fixée avec le métier, décide de l’ordre de correction.",
    ],
    takeaway:
      "Décris l’anomalie pour qu’un inconnu la reproduise en deux minutes.",
    example: {
      context: "Anomalie sur la notification d’expédition.",
      before: "« Les e-mails ne marchent pas. »",
      after:
        "Étapes : valider l’expédition de la commande 1042 (client avec e-mail valide). Attendu : e-mail avec numéro de suivi sous 15 min. Obtenu : e-mail reçu sans numéro de suivi. Environnement : recette, version 1.3. Sévérité : majeure.",
    },
    check: q(
      "Quel élément manque le plus souvent dans une anomalie mal décrite ?",
      [
        "La date du jour",
        "Les étapes et données pour la reproduire",
        "Le nom du testeur",
      ],
      1,
      "Sans étapes ni données, le développeur ne peut pas reproduire le problème, donc pas le corriger.",
    ),
    transfer: q(
      "Le logo est légèrement décalé sur la page d’accueil, la veille d’une campagne marketing. Sévérité et priorité ?",
      [
        "Sévérité bloquante, priorité basse",
        "Sévérité cosmétique, priorité haute",
        "Sévérité majeure, priorité basse",
      ],
      1,
      "Aucun impact fonctionnel (cosmétique), mais une forte visibilité au mauvais moment : priorité haute.",
    ),
    exam: q(
      "Quand une anomalie corrigée peut-elle être fermée ?",
      [
        "Dès que le développeur l’indique corrigée",
        "Après revérification réussie par le testeur",
        "Après la mise en production",
      ],
      1,
      "La correction doit être revérifiée ; si le test échoue, l’anomalie est rouverte.",
    ),
    mission: {
      title: "Rédige un rapport d’anomalie.",
      context:
        "En recette, tu valides l’expédition de la commande 1042. Le client reçoit l’e-mail de confirmation, mais le lien de suivi mène à une page d’erreur. Version 1.3, environnement de recette.",
      prompts: [
        "Rédige l’anomalie : étapes, données, attendu, obtenu, environnement.",
        "Propose une sévérité et une priorité, en justifiant chacune.",
      ],
      rubric: [
        "Mon anomalie est reproductible : étapes, données, attendu, obtenu.",
        "Je distingue et justifie sévérité et priorité.",
      ],
      example:
        "Étapes : valider l’expédition de la commande 1042, ouvrir l’e-mail reçu, cliquer sur le lien de suivi. Attendu : la page de suivi du colis. Obtenu : une page d’erreur. Environnement : recette, version 1.3. Sévérité majeure, car le client ne peut pas suivre son colis mais reçoit l’information d’expédition ; priorité haute, car c’est le cœur du projet et la mise en production approche.",
      checks: [
        {
          model:
            "Étapes : valider l’expédition de la commande 1042, ouvrir l’e-mail, cliquer sur le lien de suivi. Attendu : la page de suivi du colis. Obtenu : une page d’erreur. Environnement : recette, version 1.3.",
          criteria: [
            c(
              "Étapes et données de reproduction",
              ["etape|1042|cliquer|ouvrir|valider|reprodu"],
              "Liste les étapes avec les données utilisées.",
            ),
            c(
              "Attendu et obtenu",
              ["attendu[\\s\\S]*obtenu|obtenu[\\s\\S]*attendu"],
              "Distingue le résultat attendu du résultat obtenu.",
            ),
            c(
              "Environnement",
              ["environnement|recette|version|1\\.3"],
              "Indique l’environnement et la version.",
            ),
          ],
        },
        {
          model:
            "Sévérité majeure, car le client ne peut pas suivre son colis ; priorité haute, car c’est le cœur du projet et la mise en production approche.",
          criteria: [
            c(
              "Sévérité justifiée",
              [
                "severite[^.]*(car|parce|puisque|impact)|(bloquant|majeur|mineur|cosmetique)[^.]*(car|parce)",
              ],
              "Donne la sévérité et son impact sur l’usage.",
            ),
            c(
              "Priorité justifiée",
              [
                "priorite[^.]*(car|parce|puisque|urgence|mise en production|campagne)",
              ],
              "Donne la priorité et son urgence.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Une anomalie doit être reproductible",
        ["reprodu|etape"],
        "Rappelle la reproductibilité.",
      ),
      c(
        "Sévérité et priorité sont différentes",
        ["severite|priorite"],
        "Distingue sévérité et priorité.",
      ),
      c(
        "Fermer après revérification",
        ["reverif|ferm|rouver"],
        "Mentionne la revérification.",
      ),
    ],
    cards: [
      {
        front: "Que contient un bon rapport d’anomalie ?",
        back: "Étapes et données pour reproduire, résultat attendu, résultat obtenu, environnement et version, capture, sévérité.",
      },
      {
        front: "Sévérité ou priorité ?",
        back: "Sévérité : impact sur l’usage (bloquante à cosmétique). Priorité : urgence de correction, décidée avec le métier selon le contexte.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras rédiger une anomalie reproductible, distinguer sévérité et priorité et suivre son cycle de vie.",
      prerequisites: ["Socle BA, chapitre 8 : sévérité et cycle de vie."],
      sections: [
        {
          heading: "Décrire pour reproduire",
          paragraphs: [
            "Une anomalie utile permet à quelqu’un qui n’était pas là de reproduire le problème : étapes précises, données utilisées (numéro de commande, profil client), résultat attendu, résultat obtenu, environnement et version, capture d’écran.",
            "Un titre clair aide aussi au tri : « Lien de suivi de l’e-mail d’expédition mène à une erreur » plutôt que « Bug e-mail ».",
          ],
          keyPoint:
            "Attendu contre obtenu : sans ces deux lignes, ce n’est pas une anomalie, c’est une impression.",
        },
        {
          heading: "Sévérité et priorité",
          paragraphs: [
            "La sévérité mesure l’impact sur l’usage : bloquante (impossible d’utiliser), majeure (usage dégradé), mineure (contournement simple), cosmétique (aucun impact fonctionnel). La priorité mesure l’urgence de la correction ; elle se décide avec le métier, selon le calendrier et la visibilité.",
            "Les deux ne vont pas toujours ensemble : c’est justement pour cela qu’on les distingue.",
          ],
          diagram: {
            kind: "quadrant",
            title: "Sévérité et priorité ne vont pas toujours ensemble",
            xAxis: "Sévérité",
            yAxis: "Priorité",
            cells: [
              {
                title: "Visible mais bénin",
                text: "Logo décalé la veille d’une campagne.",
                tone: "marker",
              },
              {
                title: "À corriger tout de suite",
                text: "Paiement impossible.",
                tone: "blush",
              },
              {
                title: "Quand on aura le temps",
                text: "Faute dans une page rarement vue.",
                tone: "neutral",
              },
              {
                title: "Grave mais rare",
                text: "Erreur sur un export annuel, à planifier.",
                tone: "apricot",
              },
            ],
            caption:
              "La priorité dépend du contexte ; la sévérité, de l’impact.",
          },
        },
        {
          heading: "Suivre jusqu’à la fermeture",
          paragraphs: [
            "Une anomalie passe par des statuts : nouvelle, qualifiée, en correction, corrigée, à revérifier, fermée ou rouverte. Le testeur revérifie avec les mêmes étapes ; s’il reproduit encore le problème, il la rouvre avec un commentaire.",
            "Le suivi quotidien en recette (combien d’ouvertes, par sévérité) alimente la décision de fin de recette.",
          ],
        },
      ],
      workedExample: {
        title: "Le lien de suivi cassé",
        situation:
          "L’e-mail d’expédition arrive, mais le lien de suivi mène à une erreur.",
        steps: [
          {
            label: "Reproduire",
            detail:
              "Rejouer avec la commande 1042, puis avec une autre commande : même résultat.",
          },
          {
            label: "Décrire",
            detail:
              "Étapes, données, attendu (page de suivi), obtenu (page d’erreur), recette version 1.3, capture.",
          },
          {
            label: "Qualifier",
            detail:
              "Sévérité majeure (le suivi est impossible) ; priorité haute, décidée avec la directrice.",
          },
          {
            label: "Revérifier",
            detail:
              "Après correction, mêmes étapes : la page de suivi s’affiche, l’anomalie est fermée.",
          },
        ],
        outcome:
          "L’anomalie est corrigée en une journée, parce qu’elle était reproductible du premier coup.",
      },
      pitfalls: [
        {
          confusion: "Écrire « ça ne marche pas ».",
          correction: "Donne étapes, données, attendu et obtenu.",
          counterExample:
            "« Les e-mails ne marchent pas » revient trois fois avec « impossible à reproduire ».",
        },
        {
          confusion: "Confondre sévérité et priorité.",
          correction: "L’impact et l’urgence sont deux axes différents.",
          counterExample:
            "Un bug grave sur l’export annuel est traité avant le logo décalé de la page vue par tous la veille du lancement.",
        },
      ],
      summary: [
        "Une anomalie se décrit pour être reproduite : étapes, données, attendu, obtenu, environnement.",
        "Sévérité = impact ; priorité = urgence, décidée avec le métier.",
        "Une anomalie n’est fermée qu’après revérification.",
      ],
      glossary: [
        {
          term: "Anomalie",
          definition:
            "Écart constaté entre le résultat attendu et le résultat obtenu.",
        },
        {
          term: "Sévérité",
          definition:
            "Impact d’une anomalie sur l’usage : bloquante, majeure, mineure, cosmétique.",
        },
        {
          term: "Priorité",
          definition:
            "Urgence de correction d’une anomalie, selon le contexte.",
        },
        {
          term: "Revérification",
          definition:
            "Nouvelle exécution du test après correction, avant fermeture.",
        },
      ],
    },
    caseStep: {
      title: "Dossier recette · Trier les anomalies",
      context: `${LUMEN} Trois anomalies ouvertes en recette : A) la file de l’entrepôt n’affiche pas les commandes payées après 22 h ; B) une faute d’orthographe dans l’e-mail d’expédition ; C) l’export mensuel des délais plante sur décembre.`,
      prompts: [
        "Donne la sévérité et la priorité de chacune, avec une justification.",
        "Rédige le rapport complet de l’anomalie A.",
      ],
      criteria: [
        ["Sévérité et priorité pour A, B, C", "Justifications"],
        ["Étapes et données", "Attendu et obtenu", "Environnement"],
      ],
      models: [
        "A : sévérité majeure (des commandes ne sont pas préparées), priorité haute car elles prennent du retard chaque nuit. B : sévérité cosmétique, priorité moyenne car l’e-mail est vu par tous les clients. C : sévérité majeure, priorité basse car l’export de décembre n’est utilisé qu’en janvier.",
        "Étapes : payer une commande de test à 22 h 15, puis ouvrir la file de l’entrepôt à 6 h. Attendu : la commande apparaît dans la file. Obtenu : elle n’apparaît pas ; les commandes payées avant 22 h sont visibles. Environnement : recette, version 2.0.",
      ],
    },
  },
  {
    id: "rec-go",
    title: "Décider de la mise en production.",
    subtitle: "Non-régression, bilan de recette et go / no-go.",
    skill: "Préparer la décision de mise en production",
    recall: q(
      "À quoi sert un test de non-régression ?",
      [
        "À vérifier qu’une nouvelle fonctionnalité marche",
        "À vérifier qu’une modification n’a pas cassé ce qui fonctionnait",
        "À mesurer la performance",
      ],
      1,
      "La non-régression rejoue les parcours existants pour s’assurer qu’ils fonctionnent toujours après une évolution.",
    ),
    paragraphs: [
      "Avant la mise en production, on rejoue un socle de tests de non-régression sur les parcours critiques, puis on présente un bilan de recette : couverture, anomalies ouvertes par sévérité, risques résiduels.",
      "La décision de go ou no-go revient au métier, éclairé par ce bilan ; le BA recommande, il ne décide pas.",
    ],
    takeaway:
      "Le BA recommande sur des faits ; le métier décide en connaissance de cause.",
    example: {
      context: "Bilan avant mise en production du suivi des commandes.",
      before: "« Ça a l’air de marcher, on peut y aller. »",
      after:
        "120 cas exécutés sur 124 (97 %), 0 anomalie bloquante, 1 majeure avec contournement documenté, non-régression des parcours de commande et de paiement OK. Recommandation : go, avec correction de la majeure sous une semaine.",
    },
    check: q(
      "Quelle information n’a pas sa place dans un bilan de recette ?",
      [
        "Le nombre d’anomalies ouvertes par sévérité",
        "Les risques résiduels et leurs contournements",
        "L’opinion personnelle du testeur sur le design, sans lien avec les exigences",
      ],
      2,
      "Le bilan présente des faits reliés aux exigences et aux critères de sortie ; les avis hors périmètre vont ailleurs.",
    ),
    transfer: q(
      "Il reste une anomalie majeure, avec un contournement simple, et la date est contrainte. Que recommandes-tu ?",
      [
        "No-go automatique",
        "Go conditionnel : contournement documenté, correction planifiée, décision prise par le métier",
        "Go sans en parler",
      ],
      1,
      "Une anomalie majeure avec contournement peut être acceptée en connaissance de cause : c’est au métier de décider, avec un plan.",
    ),
    exam: q(
      "Que vérifie un test de fumée juste après la mise en production ?",
      [
        "Toutes les fonctionnalités en détail",
        "Que les fonctions critiques répondent (accès, connexion, parcours principal)",
        "La sécurité du réseau",
      ],
      1,
      "Le test de fumée vérifie rapidement que l’essentiel fonctionne avant d’ouvrir largement ; il ne remplace pas la recette.",
    ),
    mission: {
      title: "Prépare le go / no-go.",
      context:
        "Recette terminée : 118 cas exécutés sur 125, 0 anomalie bloquante, 2 majeures (l’une avec contournement, l’autre sans), 6 mineures. La non-régression du paiement est OK. Mise en production prévue lundi.",
      prompts: [
        "Résume le bilan de recette en quelques lignes chiffrées.",
        "Formule ta recommandation et dis qui décide.",
      ],
      rubric: [
        "Mon bilan donne couverture, anomalies par sévérité et non-régression.",
        "Ma recommandation est conditionnée et la décision revient au métier.",
      ],
      example:
        "Bilan : 118 cas exécutés sur 125 (94 %), aucune anomalie bloquante, 2 majeures dont une sans contournement, 6 mineures ; non-régression du paiement OK. Recommandation : no-go lundi tant que la majeure sans contournement n’est pas corrigée, ou go si le métier accepte de désactiver la fonction concernée ; la décision revient à la directrice.",
      checks: [
        {
          model:
            "118 cas exécutés sur 125 (94 %), aucune anomalie bloquante, 2 majeures dont une sans contournement, 6 mineures ; non-régression du paiement OK.",
          criteria: [
            c(
              "Couverture chiffrée",
              ["118|125|94|%|cas execut"],
              "Donne la part de cas exécutés.",
            ),
            c(
              "Anomalies par sévérité",
              ["bloquant[\\s\\S]*majeur|majeur[\\s\\S]*mineur"],
              "Indique les anomalies par sévérité.",
            ),
            c(
              "Non-régression",
              ["regression|paiement"],
              "Mentionne la non-régression.",
            ),
          ],
        },
        {
          model:
            "No-go lundi tant que la majeure sans contournement n’est pas corrigée, ou go si le métier accepte de désactiver la fonction ; la décision revient à la directrice.",
          criteria: [
            c(
              "Une recommandation conditionnée",
              ["go|no-go|report|condition|si |tant que|sauf"],
              "Formule une recommandation avec ses conditions.",
            ),
            c(
              "La décision revient au métier",
              ["decid|decision|directri|directeur|metier|sponsor|comite"],
              "Dis qui décide.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Non-régression avant la mise en production",
        ["regression"],
        "Rappelle la non-régression.",
      ),
      c("Bilan chiffré", ["bilan|anomali|couverture|%"], "Mentionne le bilan."),
      c(
        "Le BA recommande, le métier décide",
        ["recommand|decid"],
        "Distingue recommandation et décision.",
      ),
    ],
    cards: [
      {
        front: "Que contient un bilan de recette ?",
        back: "Couverture (cas exécutés), anomalies ouvertes par sévérité, résultats de non-régression, risques résiduels et contournements, recommandation.",
      },
      {
        front: "Qui décide du go / no-go ?",
        back: "Le métier ou le sponsor, éclairé par le bilan ; le BA recommande sur des faits.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras organiser la non-régression, présenter un bilan de recette et préparer une décision de go ou no-go.",
      prerequisites: ["Les trois chapitres précédents de ce parcours."],
      sections: [
        {
          heading: "La non-régression",
          paragraphs: [
            "Chaque évolution peut casser ce qui marchait. On constitue un socle de tests de non-régression sur les parcours critiques (commander, payer, se connecter) et on le rejoue à chaque version. Ce socle a vocation à être automatisé, car il est répétitif.",
          ],
          keyPoint: "Ce qui marchait hier doit être revérifié aujourd’hui.",
        },
        {
          heading: "Le bilan de recette",
          paragraphs: [
            "Le bilan présente des faits reliés aux critères de sortie : part des cas exécutés et réussis, anomalies ouvertes par sévérité, résultats de non-régression, risques résiduels et contournements. Il se termine par une recommandation argumentée.",
          ],
          diagram: {
            kind: "table",
            title: "Un bilan de recette sur une page",
            columns: ["Rubrique", "Exemple"],
            rows: [
              ["Couverture", "118 cas exécutés sur 125 (94 %)"],
              ["Anomalies ouvertes", "0 bloquante, 2 majeures, 6 mineures"],
              ["Non-régression", "Commande et paiement : OK"],
              [
                "Risques résiduels",
                "1 majeure sans contournement sur l’export",
              ],
              ["Recommandation", "Go conditionnel ou report d’une semaine"],
            ],
            caption:
              "Une page lisible en comité vaut mieux qu’un export de 300 lignes.",
          },
        },
        {
          heading: "Go, no-go et après",
          paragraphs: [
            "La décision revient au métier ou au sponsor. Le BA recommande, en rendant visibles les risques acceptés et les conditions (contournement documenté, correction planifiée, fonction désactivée).",
            "Après la mise en production, un test de fumée vérifie que l’essentiel répond, puis on suit les premiers jours de près et on mesure la valeur avec les indicateurs du cadrage.",
          ],
          diagram: {
            kind: "flow",
            title: "De la recette à la valeur",
            steps: [
              { label: "Bilan de recette", tone: "apricot" },
              {
                label: "Go / no-go",
                note: "Décision du métier",
                tone: "marker",
              },
              { label: "Mise en production" },
              { label: "Test de fumée", note: "L’essentiel répond ?" },
              {
                label: "Mesure de la valeur",
                note: "Indicateurs du cadrage",
                tone: "sky",
              },
            ],
            caption:
              "La recette ne s’arrête pas à la mise en production : la valeur se vérifie après.",
          },
        },
      ],
      workedExample: {
        title: "Lundi ou pas lundi ?",
        situation:
          "Recette terminée avec deux anomalies majeures, dont une sans contournement ; lancement prévu lundi.",
        steps: [
          {
            label: "Rassembler les faits",
            detail:
              "94 % des cas exécutés, 0 bloquante, 2 majeures, 6 mineures, non-régression OK.",
          },
          {
            label: "Évaluer les risques",
            detail:
              "La majeure sans contournement touche l’export mensuel, utilisé le 1er du mois.",
          },
          {
            label: "Proposer des options",
            detail:
              "Go lundi avec l’export désactivé jusqu’à la correction, ou report d’une semaine.",
          },
          {
            label: "Faire décider",
            detail:
              "La directrice choisit le go avec export désactivé ; décision tracée au compte rendu.",
          },
        ],
        outcome:
          "La mise en production a lieu à la date prévue, avec un risque connu, accepté et maîtrisé.",
      },
      pitfalls: [
        {
          confusion: "Décider seul du go parce que « ça a l’air de marcher ».",
          correction: "Présente des faits et laisse le métier décider.",
          counterExample:
            "Une anomalie majeure découverte en production : personne ne l’avait acceptée.",
        },
        {
          confusion:
            "Oublier la non-régression parce que la nouveauté fonctionne.",
          correction: "Rejoue le socle critique à chaque version.",
          counterExample:
            "La notification fonctionne, mais le paiement par carte est cassé depuis la dernière version.",
        },
      ],
      summary: [
        "Un socle de non-régression se rejoue à chaque version.",
        "Le bilan de recette présente des faits reliés aux critères de sortie.",
        "Le BA recommande ; le métier décide du go ou no-go.",
        "Test de fumée après la mise en production, puis mesure de la valeur.",
      ],
      glossary: [
        {
          term: "Non-régression",
          definition:
            "Vérification qu’une modification n’a pas cassé un comportement existant.",
        },
        {
          term: "Bilan de recette",
          definition: "Synthèse factuelle de la recette et recommandation.",
        },
        {
          term: "Go / no-go",
          definition: "Décision de mettre ou non en production.",
        },
        {
          term: "Test de fumée",
          definition:
            "Vérification rapide des fonctions critiques après un déploiement.",
        },
      ],
    },
    caseStep: {
      title: "Dossier recette · Le go avant les fêtes",
      context: `${LUMEN} Bilan : 140 cas sur 150 exécutés, 0 bloquante, 1 majeure (les commandes payées après 22 h n’apparaissent dans la file qu’à 6 h 30 au lieu de 6 h), 5 mineures. Non-régression commande et paiement OK. Lancement prévu dans 3 jours, pic des fêtes dans 3 semaines.`,
      prompts: [
        "Rédige le bilan en quelques lignes chiffrées.",
        "Formule ta recommandation avec ses conditions, et dis qui décide.",
      ],
      criteria: [
        ["Couverture", "Anomalies par sévérité", "Non-régression"],
        ["Recommandation conditionnée", "Décision de la directrice"],
      ],
      models: [
        "140 cas exécutés sur 150 (93 %), aucune anomalie bloquante, une majeure (commandes de nuit visibles à 6 h 30), 5 mineures ; non-régression de la commande et du paiement OK.",
        "Go dans trois jours, à condition de documenter le contournement (l’entrepôt commence par une actualisation de la file à 6 h 30) et de corriger la majeure avant le pic des fêtes. La décision revient à la directrice, au COPIL de go / no-go.",
      ],
    },
  },
];

export const recetteCourse: Course = {
  id: "ba-recette-qualite",
  title: "Recette et qualité",
  eyebrow: "Spécialisation",
  color: "lavender",
  icon: "compass",
  description:
    "Organiser une recette, concevoir des cas efficaces, gérer les anomalies et préparer la décision de mise en production.",
  lessons,
  caseStudy: {
    name: "Maison Lumen",
    pitch: `${LUMEN} Tu recettes la nouvelle file de commandes avant le pic des fêtes.`,
  },
  sources: [
    {
      title: "ISTQB · Glossaire des tests logiciels",
      url: "https://glossary.istqb.org/",
    },
  ],
};
