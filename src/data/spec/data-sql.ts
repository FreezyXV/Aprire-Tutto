import type { Course, Lesson } from "@/lib/types";
import { c, LUMEN, q } from "./helpers";

/*
 * Specialization: data and SQL for business analysts. Original writing in
 * French; SQL follows the standard behaviour documented by PostgreSQL.
 * Example schema: client(id_client, nom, ville), commande(id_commande,
 * id_client, montant, statut, date_commande), livraison(id_commande,
 * transporteur, livree_le).
 */
const lessons: Lesson[] = [
  {
    id: "sql-select",
    title: "Lire une requête comme la base l’exécute.",
    subtitle: "SELECT, WHERE, ORDER BY et le piège du NULL.",
    skill: "Interroger des données",
    recall: q(
      "Dans quel ordre la base traite-t-elle SELECT, FROM et WHERE ?",
      [
        "SELECT, puis FROM, puis WHERE",
        "FROM, puis WHERE, puis SELECT",
        "WHERE, puis SELECT, puis FROM",
      ],
      1,
      "La base part de la table (FROM), filtre les lignes (WHERE), puis calcule les colonnes demandées (SELECT).",
    ),
    paragraphs: [
      "Une requête s’écrit SELECT… FROM… WHERE… ORDER BY, mais s’exécute FROM → WHERE → SELECT → ORDER BY. Lire dans l’ordre d’exécution évite la plupart des erreurs d’interprétation.",
      "NULL signifie « valeur inconnue » : une comparaison avec NULL n’est ni vraie ni fausse, et la ligne disparaît d’un filtre WHERE.",
    ],
    takeaway:
      "Lis une requête dans l’ordre où elle s’exécute : FROM, WHERE, SELECT, ORDER BY.",
    example: {
      context: "Vérifier les commandes du mois.",
      before: "SELECT * FROM commande",
      after:
        "SELECT id_commande, montant FROM commande WHERE date_commande >= '2026-11-01' AND statut <> 'annulee' ORDER BY montant DESC",
    },
    check: q(
      "La requête « WHERE statut <> 'annulee' » renvoie-t-elle les commandes dont le statut est NULL ?",
      ["Oui", "Non", "Seulement si la table est petite"],
      1,
      "Comparer NULL donne « inconnu », jamais vrai : ces lignes sont exclues. Il faut ajouter « OR statut IS NULL » si on veut les garder.",
    ),
    transfer: q(
      "Un tableau affiche 1 180 commandes au lieu des 1 200 attendues. Quelle est la première piste ?",
      [
        "Un bug du logiciel de tableau",
        "Un filtre qui exclut des lignes, par exemple des valeurs NULL",
        "Une erreur de ORDER BY",
      ],
      1,
      "ORDER BY ne retire aucune ligne. Un écart de volume vient d’un filtre : WHERE, condition sur NULL, jointure.",
    ),
    exam: q(
      "Que fait ORDER BY montant DESC ?",
      [
        "Filtre les plus gros montants",
        "Trie les lignes du plus grand au plus petit montant sans en retirer",
        "Calcule le montant total",
      ],
      1,
      "ORDER BY ne change que l’ordre d’affichage : aucune ligne n’est ajoutée ni retirée.",
    ),
    mission: {
      title: "Écris et lis une requête simple.",
      context:
        "Table commande(id_commande, id_client, montant, statut, date_commande). La responsable veut les commandes de novembre non annulées, des plus grosses aux plus petites. Certaines commandes ont un statut vide (NULL).",
      prompts: [
        "Écris la requête SQL demandée.",
        "Explique ce qu’il advient des commandes au statut NULL et comment les garder.",
      ],
      rubric: [
        "Ma requête filtre la période et le statut, et trie par montant décroissant.",
        "J’explique l’effet du NULL et la correction IS NULL.",
      ],
      example:
        "SELECT id_commande, montant FROM commande WHERE date_commande >= '2026-11-01' AND date_commande < '2026-12-01' AND (statut <> 'annulee' OR statut IS NULL) ORDER BY montant DESC. Sans la condition IS NULL, les commandes au statut vide disparaîtraient, car une comparaison avec NULL n’est jamais vraie.",
      checks: [
        {
          model:
            "SELECT id_commande, montant FROM commande WHERE date_commande >= '2026-11-01' AND date_commande < '2026-12-01' AND statut <> 'annulee' ORDER BY montant DESC",
          criteria: [
            c(
              "SELECT … FROM commande",
              ["select[\\s\\S]*from\\s+commande"],
              "Pars de la table commande.",
            ),
            c(
              "Filtre sur la période et le statut",
              [
                "where[\\s\\S]*date[\\s\\S]*statut|where[\\s\\S]*statut[\\s\\S]*date",
              ],
              "Filtre la date et le statut dans WHERE.",
            ),
            c(
              "Tri décroissant par montant",
              ["order by\\s+montant\\s+desc"],
              "Trie avec ORDER BY montant DESC.",
            ),
          ],
        },
        {
          model:
            "Les commandes au statut NULL disparaissent, car une comparaison avec NULL n’est jamais vraie ; pour les garder, on ajoute OR statut IS NULL.",
          criteria: [
            c(
              "Elles disparaissent du résultat",
              ["disparai|exclu|retir|pas renvoy|absent|perd"],
              "Dis ce qu’il arrive à ces lignes.",
            ),
            c(
              "Correction avec IS NULL",
              ["is null|coalesce"],
              "Propose OR statut IS NULL (ou COALESCE).",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Ordre d’exécution FROM, WHERE, SELECT",
        ["from[^.]*where|ordre"],
        "Rappelle l’ordre d’exécution.",
      ),
      c("NULL exclu des comparaisons", ["null"], "Mentionne le piège du NULL."),
      c(
        "ORDER BY ne filtre pas",
        ["order by|tri"],
        "Rappelle que le tri ne retire rien.",
      ),
    ],
    cards: [
      {
        front: "Ordre d’exécution d’une requête ?",
        back: "FROM, puis WHERE, puis GROUP BY et HAVING, puis SELECT, puis ORDER BY et LIMIT.",
      },
      {
        front: "Pourquoi « statut <> 'annulee' » perd-il des lignes ?",
        back: "Les lignes où statut est NULL donnent une comparaison inconnue, jamais vraie : elles sont exclues. Ajouter OR statut IS NULL.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras lire et écrire une requête SELECT simple, prévoir ce qu’elle renvoie et éviter le piège du NULL.",
      prerequisites: ["Socle BA, chapitre 7 : définir un indicateur."],
      sections: [
        {
          heading: "Écrite dans un ordre, exécutée dans un autre",
          paragraphs: [
            "On écrit SELECT en premier, mais la base commence par FROM : elle prend la table, filtre les lignes avec WHERE, calcule les colonnes du SELECT, puis trie avec ORDER BY. Cet ordre explique pourquoi un alias défini dans SELECT n’est pas utilisable dans WHERE.",
          ],
          diagram: {
            kind: "flow",
            title: "L’ordre d’exécution",
            steps: [
              { label: "FROM", note: "Quelle table ?", tone: "apricot" },
              {
                label: "WHERE",
                note: "Quelles lignes garder ?",
                tone: "marker",
              },
              {
                label: "SELECT",
                note: "Quelles colonnes afficher ou calculer ?",
              },
              { label: "ORDER BY", note: "Dans quel ordre ?", tone: "sky" },
            ],
            caption:
              "Seuls FROM et WHERE décident des lignes ; SELECT et ORDER BY décident de la présentation.",
          },
        },
        {
          heading: "Filtrer avec WHERE",
          paragraphs: [
            "WHERE garde les lignes dont la condition est vraie : « date_commande >= '2026-11-01' AND statut <> 'annulee' ». Pour une période, préfère une borne de début incluse et une borne de fin exclue (« < '2026-12-01' ») : tu évites les oublis liés aux heures de la dernière journée.",
          ],
          keyPoint:
            "Un écart de volume vient presque toujours d’un filtre, jamais du tri.",
        },
        {
          heading: "Le piège du NULL",
          paragraphs: [
            "NULL signifie « inconnu ». Comparer NULL à quoi que ce soit (même à NULL) donne « inconnu », que WHERE traite comme faux. Ainsi « statut <> 'annulee' » exclut silencieusement les commandes sans statut.",
            "Pour tester l’absence de valeur, on écrit « IS NULL » ; pour la remplacer dans un calcul, COALESCE(statut, 'inconnu').",
          ],
          diagram: {
            kind: "table",
            title: "Comment se comporte NULL",
            columns: ["Expression", "Résultat", "Conséquence dans WHERE"],
            rows: [
              [
                "statut = 'annulee'",
                "Inconnu si statut est NULL",
                "Ligne exclue",
              ],
              [
                "statut <> 'annulee'",
                "Inconnu si statut est NULL",
                "Ligne exclue aussi",
              ],
              ["statut IS NULL", "Vrai si statut est NULL", "Ligne gardée"],
            ],
            caption:
              "Une ligne au statut NULL n’est ni égale ni différente : elle échappe aux deux filtres.",
          },
        },
      ],
      workedExample: {
        title: "Les commandes de novembre",
        situation:
          "La responsable veut les commandes de novembre non annulées, des plus grosses aux plus petites.",
        steps: [
          { label: "Partir de la table", detail: "FROM commande." },
          {
            label: "Filtrer la période",
            detail:
              "date_commande >= '2026-11-01' AND date_commande < '2026-12-01'.",
          },
          {
            label: "Filtrer le statut sans perdre les NULL",
            detail: "(statut <> 'annulee' OR statut IS NULL).",
          },
          {
            label: "Choisir les colonnes et trier",
            detail: "SELECT id_commande, montant … ORDER BY montant DESC.",
          },
        ],
        outcome:
          "La requête renvoie exactement ce qui est demandé, y compris les commandes au statut manquant, à signaler pour correction.",
      },
      pitfalls: [
        {
          confusion:
            "Penser que « <> 'annulee' » garde tout sauf les annulées.",
          correction: "Les lignes au statut NULL sont exclues aussi.",
          counterExample:
            "20 commandes sans statut disparaissent du rapport mensuel.",
        },
        {
          confusion: "Utiliser SELECT * dans un rapport.",
          correction:
            "Choisis les colonnes : le rapport reste stable si la table évolue.",
          counterExample:
            "Une colonne ajoutée à la table casse l’export du rapport.",
        },
      ],
      summary: [
        "Exécution : FROM, WHERE, SELECT, ORDER BY.",
        "WHERE décide des lignes ; ORDER BY ne fait que trier.",
        "NULL échappe aux comparaisons : utilise IS NULL ou COALESCE.",
        "Pour une période : début inclus, fin exclue.",
      ],
      glossary: [
        {
          term: "SELECT",
          definition: "Clause qui choisit ou calcule les colonnes du résultat.",
        },
        {
          term: "WHERE",
          definition: "Clause qui filtre les lignes avant tout regroupement.",
        },
        {
          term: "NULL",
          definition:
            "Absence de valeur (inconnue), qui rend les comparaisons inconnues.",
        },
        {
          term: "COALESCE",
          definition:
            "Fonction qui remplace une valeur NULL par une valeur de repli.",
        },
      ],
    },
    caseStep: {
      title: "Dossier données · Les commandes en retard",
      context: `${LUMEN} Table commande(id_commande, montant, statut, payee_le, expediee_le). La directrice veut la liste des commandes payées depuis plus de 24 heures et pas encore expédiées.`,
      prompts: [
        "Écris la requête SQL.",
        "Quels pièges vérifies-tu avant de diffuser le résultat ?",
      ],
      criteria: [
        [
          "Filtre sur expediee_le IS NULL",
          "Filtre sur payee_le au-delà de 24 h",
          "Annulées exclues",
        ],
        ["Statuts manquants ou incohérents", "Fuseaux ou heures de fermeture"],
      ],
      models: [
        "SELECT id_commande, montant, payee_le FROM commande WHERE expediee_le IS NULL AND payee_le < now() - interval '24 hours' AND (statut <> 'annulee' OR statut IS NULL) ORDER BY payee_le.",
        "Vérifier les statuts NULL ou incohérents (expédiée sans date), les commandes annulées après paiement, et les week-ends où l’entrepôt est fermé, qui gonflent artificiellement les retards.",
      ],
    },
  },
  {
    id: "sql-jointures",
    title: "Relier des tables sans perdre de lignes.",
    subtitle: "INNER JOIN, LEFT JOIN et les doublons.",
    skill: "Relier des données",
    recall: q(
      "Que renvoie un INNER JOIN entre client et commande ?",
      [
        "Tous les clients, même sans commande",
        "Seulement les clients qui ont au moins une commande, combinés à chacune",
        "Uniquement les commandes sans client",
      ],
      1,
      "L’INNER JOIN ne garde que les lignes qui ont une correspondance des deux côtés.",
    ),
    paragraphs: [
      "Une jointure relie deux tables par une clé commune (id_client). INNER JOIN garde les correspondances ; LEFT JOIN garde toutes les lignes de la table de gauche, avec des NULL quand il n’y a pas de correspondance.",
      "Une jointure sur une relation 1-N multiplie les lignes : un client avec trois commandes apparaît trois fois.",
    ],
    takeaway:
      "Avant de compter, demande-toi si la jointure a retiré ou multiplié des lignes.",
    example: {
      context: "Lister les clients et leurs commandes.",
      before:
        "SELECT c.nom, cm.montant FROM client c JOIN commande cm ON cm.id_client = c.id_client",
      after:
        "Pour voir aussi les clients sans commande : FROM client c LEFT JOIN commande cm ON cm.id_client = c.id_client ; leur montant apparaît à NULL.",
    },
    check: q(
      "Tu veux la liste de tous les clients, y compris ceux qui n’ont jamais commandé. Quelle jointure ?",
      ["INNER JOIN", "client LEFT JOIN commande", "commande LEFT JOIN client"],
      1,
      "La table dont on veut garder toutes les lignes se place à gauche d’un LEFT JOIN.",
    ),
    transfer: q(
      "Après une jointure client-commande, le nombre de clients passe de 500 à 1 200. Pourquoi ?",
      [
        "La jointure a créé de faux clients",
        "Chaque client apparaît autant de fois qu’il a de commandes",
        "La table client contient des doublons cachés",
      ],
      1,
      "Relation 1-N : une ligne par commande. Pour compter les clients, utilise COUNT(DISTINCT c.id_client).",
    ),
    exam: q(
      "Comment trouver les clients qui n’ont jamais commandé ?",
      [
        "client INNER JOIN commande WHERE montant > 0",
        "client LEFT JOIN commande … WHERE cm.id_commande IS NULL",
        "SELECT * FROM commande WHERE id_client IS NULL",
      ],
      1,
      "Le LEFT JOIN garde tous les clients ; ceux sans correspondance ont id_commande à NULL.",
    ),
    mission: {
      title: "Relie clients et commandes.",
      context:
        "Tables client(id_client, nom, ville) et commande(id_commande, id_client, montant). Le marketing veut relancer les clients qui n’ont jamais commandé, et connaître le nombre de clients ayant commandé.",
      prompts: [
        "Écris la requête qui liste les clients sans aucune commande.",
        "Comment comptes-tu les clients ayant commandé sans les compter plusieurs fois ?",
      ],
      rubric: [
        "J’utilise un LEFT JOIN et un filtre IS NULL.",
        "J’utilise COUNT(DISTINCT) et j’explique pourquoi.",
      ],
      example:
        "SELECT c.id_client, c.nom FROM client c LEFT JOIN commande cm ON cm.id_client = c.id_client WHERE cm.id_commande IS NULL. Pour compter : SELECT COUNT(DISTINCT cm.id_client) FROM commande cm, car un client avec plusieurs commandes apparaîtrait plusieurs fois.",
      checks: [
        {
          model:
            "SELECT c.id_client, c.nom FROM client c LEFT JOIN commande cm ON cm.id_client = c.id_client WHERE cm.id_commande IS NULL",
          criteria: [
            c(
              "LEFT JOIN depuis client",
              ["client[\\s\\S]*left (outer )?join\\s+commande"],
              "Garde tous les clients avec client LEFT JOIN commande.",
            ),
            c(
              "Filtre sur l’absence de commande",
              ["is null|not exists|not in"],
              "Filtre les clients sans correspondance (IS NULL).",
            ),
          ],
        },
        {
          model:
            "SELECT COUNT(DISTINCT cm.id_client) FROM commande cm, car un client avec plusieurs commandes apparaîtrait plusieurs fois.",
          criteria: [
            c(
              "COUNT(DISTINCT …)",
              ["count\\s*\\(\\s*distinct"],
              "Utilise COUNT(DISTINCT id_client).",
            ),
            c(
              "Explication des doublons",
              [
                "plusieurs (fois|commandes)|doublon|multipli|une ligne par commande|1-n|1,n",
              ],
              "Explique que la jointure multiplie les lignes.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "INNER garde les correspondances, LEFT garde tout à gauche",
        ["inner|left"],
        "Rappelle INNER et LEFT.",
      ),
      c(
        "Une relation 1-N multiplie les lignes",
        ["multipli|doublon|plusieurs"],
        "Mentionne la multiplication des lignes.",
      ),
      c(
        "COUNT(DISTINCT) pour compter des entités",
        ["distinct"],
        "Ajoute COUNT(DISTINCT).",
      ),
    ],
    cards: [
      {
        front: "INNER JOIN ou LEFT JOIN ?",
        back: "INNER : seulement les lignes qui correspondent des deux côtés. LEFT : toutes les lignes de gauche, avec NULL quand il n’y a pas de correspondance.",
      },
      {
        front: "Pourquoi le nombre de clients augmente après une jointure ?",
        back: "Relation 1-N : un client apparaît une fois par commande. Compter avec COUNT(DISTINCT id_client).",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras choisir entre INNER et LEFT JOIN, trouver les lignes sans correspondance et éviter les doubles comptages.",
      prerequisites: [
        "Socle BA, chapitre 7 : clés et cardinalités.",
        "Chapitre précédent : SELECT et NULL.",
      ],
      sections: [
        {
          heading: "Relier par une clé",
          paragraphs: [
            "Une jointure associe les lignes de deux tables qui partagent une valeur de clé : la commande porte id_client, qui renvoie au client. On écrit : FROM commande cm JOIN client c ON c.id_client = cm.id_client.",
            "Le choix du type de jointure décide des lignes gardées quand il n’y a pas de correspondance.",
          ],
          diagram: {
            kind: "table",
            title: "Les jointures à connaître",
            columns: ["Jointure", "Lignes gardées", "Usage typique"],
            rows: [
              [
                "INNER JOIN",
                "Seulement les correspondances",
                "Commandes avec leur client",
              ],
              [
                "LEFT JOIN",
                "Toute la table de gauche",
                "Tous les clients, avec ou sans commande",
              ],
              [
                "LEFT JOIN + IS NULL",
                "Lignes de gauche sans correspondance",
                "Clients qui n’ont jamais commandé",
              ],
            ],
            caption:
              "La table dont tu veux garder toutes les lignes se place à gauche.",
          },
        },
        {
          heading: "Le piège de la multiplication",
          paragraphs: [
            "Entre client et commande, la relation est 1-N : un client a zéro ou plusieurs commandes. Après la jointure, il y a une ligne par commande ; un client fidèle apparaît dix fois. Compter les lignes revient alors à compter des commandes, pas des clients.",
            "Pour compter des entités après une jointure, utilise COUNT(DISTINCT id_client). Pour sommer un montant porté par la table du côté « 1 », méfie-toi : il serait additionné autant de fois qu’il y a de lignes.",
          ],
          keyPoint:
            "Après une jointure 1-N, chaque ligne est une commande, plus un client.",
        },
      ],
      workedExample: {
        title: "La relance marketing",
        situation:
          "Le marketing veut relancer les clients qui n’ont jamais commandé et connaître le nombre de clients actifs.",
        steps: [
          {
            label: "Garder tous les clients",
            detail:
              "FROM client c LEFT JOIN commande cm ON cm.id_client = c.id_client.",
          },
          {
            label: "Isoler l’absence",
            detail:
              "WHERE cm.id_commande IS NULL : clients sans aucune commande.",
          },
          {
            label: "Compter les actifs",
            detail: "SELECT COUNT(DISTINCT id_client) FROM commande.",
          },
          {
            label: "Contrôler",
            detail:
              "Actifs + sans commande = nombre total de clients : sinon, une donnée est incohérente.",
          },
        ],
        outcome:
          "Deux chiffres fiables et un contrôle de cohérence simple avant diffusion.",
      },
      pitfalls: [
        {
          confusion:
            "Utiliser un INNER JOIN pour une liste qui doit être complète.",
          correction:
            "L’INNER JOIN retire silencieusement les lignes sans correspondance.",
          counterExample:
            "Le rapport « tous les clients » oublie les 120 clients sans commande.",
        },
        {
          confusion: "Compter les lignes après une jointure 1-N.",
          correction: "Compte les entités avec COUNT(DISTINCT).",
          counterExample:
            "« 1 200 clients actifs » alors qu’il y en a 500, avec 1 200 commandes.",
        },
      ],
      summary: [
        "INNER : correspondances ; LEFT : toute la table de gauche.",
        "LEFT JOIN + IS NULL trouve les lignes sans correspondance.",
        "Une jointure 1-N multiplie les lignes : COUNT(DISTINCT) pour compter des entités.",
        "Vérifie la cohérence des totaux avant de diffuser.",
      ],
      glossary: [
        {
          term: "Jointure",
          definition:
            "Association des lignes de deux tables par une clé commune.",
        },
        {
          term: "INNER JOIN",
          definition:
            "Ne garde que les lignes qui ont une correspondance des deux côtés.",
        },
        {
          term: "LEFT JOIN",
          definition:
            "Garde toutes les lignes de la table de gauche, complétées par NULL.",
        },
        {
          term: "COUNT(DISTINCT)",
          definition: "Compte les valeurs différentes, sans doublons.",
        },
      ],
    },
    caseStep: {
      title: "Dossier données · Commandes et livraisons",
      context: `${LUMEN} Tables commande(id_commande, payee_le, statut) et livraison(id_commande, transporteur, livree_le). Toutes les commandes n’ont pas encore de ligne de livraison.`,
      prompts: [
        "Écris la requête qui liste toutes les commandes payées avec leur transporteur, y compris celles pas encore remises.",
        "Explique comment tu comptes les commandes par transporteur sans erreur.",
      ],
      criteria: [
        ["commande LEFT JOIN livraison", "Commandes sans livraison conservées"],
        [
          "GROUP BY transporteur",
          "COUNT(DISTINCT id_commande) ou contrôle des doublons",
          "Traitement des NULL",
        ],
      ],
      models: [
        "SELECT cm.id_commande, cm.payee_le, l.transporteur FROM commande cm LEFT JOIN livraison l ON l.id_commande = cm.id_commande WHERE cm.payee_le IS NOT NULL.",
        "SELECT l.transporteur, COUNT(DISTINCT l.id_commande) FROM livraison l GROUP BY l.transporteur ; le DISTINCT protège des lignes de livraison en double (réexpéditions), et les commandes sans transporteur sont comptées à part avec transporteur IS NULL.",
      ],
    },
  },
  {
    id: "sql-agregations",
    title: "Résumer pour décider.",
    subtitle: "GROUP BY, COUNT, SUM, AVG et HAVING.",
    skill: "Agréger des données",
    recall: q(
      "Quelle différence entre WHERE et HAVING ?",
      [
        "Aucune",
        "WHERE filtre les lignes avant le regroupement ; HAVING filtre les groupes après",
        "HAVING s’utilise seulement avec ORDER BY",
      ],
      1,
      "WHERE agit sur les lignes, avant GROUP BY ; HAVING agit sur les résultats agrégés, après.",
    ),
    paragraphs: [
      "GROUP BY regroupe les lignes qui partagent une valeur (un transporteur, un mois) ; les fonctions d’agrégation résument chaque groupe : COUNT, SUM, AVG, MIN, MAX.",
      "Toute colonne non agrégée du SELECT doit figurer dans le GROUP BY. HAVING filtre les groupes selon un résultat agrégé.",
    ],
    takeaway:
      "WHERE choisit les lignes, GROUP BY forme les groupes, HAVING choisit les groupes.",
    example: {
      context: "Taux de retard par transporteur.",
      before: "Un export brut de 12 000 lignes de livraison dans un tableur.",
      after:
        "SELECT transporteur, COUNT(*) AS livraisons, AVG(CASE WHEN en_retard THEN 1 ELSE 0 END) AS taux_retard FROM livraison GROUP BY transporteur HAVING COUNT(*) >= 100",
    },
    check: q(
      "Tu veux les transporteurs ayant plus de 100 livraisons. Où mettre la condition ?",
      ["Dans WHERE", "Dans HAVING", "Dans ORDER BY"],
      1,
      "« Plus de 100 livraisons » porte sur un résultat agrégé (COUNT) : c’est un filtre de groupe, donc HAVING.",
    ),
    transfer: q(
      "AVG(montant) donne 48 €, mais 30 % des montants sont NULL. Que conclure ?",
      [
        "La moyenne inclut les NULL comme des zéros",
        "La moyenne ignore les NULL : elle porte seulement sur 70 % des commandes",
        "La requête est fausse",
      ],
      1,
      "Les fonctions d’agrégation ignorent les NULL (sauf COUNT(*)) : la moyenne ne représente qu’une partie des commandes, à signaler.",
    ),
    exam: q(
      "Pourquoi « SELECT ville, nom, COUNT(*) FROM client GROUP BY ville » est-elle invalide dans la plupart des bases ?",
      [
        "COUNT(*) est interdit",
        "nom n’est ni agrégé ni dans le GROUP BY",
        "GROUP BY doit suivre ORDER BY",
      ],
      1,
      "Une ville regroupe plusieurs noms : la base ne sait pas lequel afficher. Toute colonne non agrégée doit être dans le GROUP BY.",
    ),
    mission: {
      title: "Calcule un indicateur par groupe.",
      context:
        "Table livraison(id_commande, transporteur, en_retard) où en_retard vaut vrai ou faux. La directrice veut le nombre de livraisons et le taux de retard par transporteur, uniquement pour ceux qui ont au moins 100 livraisons.",
      prompts: [
        "Écris la requête.",
        "Explique pourquoi la condition « au moins 100 livraisons » va dans HAVING et pas dans WHERE.",
      ],
      rubric: [
        "Ma requête regroupe par transporteur et calcule nombre et taux.",
        "J’explique la différence entre filtre de lignes et filtre de groupes.",
      ],
      example:
        "SELECT transporteur, COUNT(*) AS livraisons, AVG(CASE WHEN en_retard THEN 1.0 ELSE 0 END) AS taux_retard FROM livraison GROUP BY transporteur HAVING COUNT(*) >= 100. La condition porte sur un nombre calculé par groupe, connu seulement après le regroupement : WHERE agit avant, sur les lignes, donc c’est HAVING.",
      checks: [
        {
          model:
            "SELECT transporteur, COUNT(*) AS livraisons, AVG(CASE WHEN en_retard THEN 1.0 ELSE 0 END) AS taux_retard FROM livraison GROUP BY transporteur HAVING COUNT(*) >= 100",
          criteria: [
            c(
              "GROUP BY transporteur",
              ["group by\\s+transporteur"],
              "Regroupe par transporteur.",
            ),
            c(
              "Nombre et taux calculés",
              ["count\\s*\\([\\s\\S]*(avg|sum|/)"],
              "Calcule le nombre (COUNT) et le taux (AVG ou SUM ÷ COUNT).",
            ),
            c(
              "HAVING sur le volume",
              ["having\\s+count"],
              "Filtre les groupes avec HAVING COUNT(*) >= 100.",
            ),
          ],
        },
        {
          model:
            "La condition porte sur un nombre calculé par groupe, connu seulement après le regroupement : WHERE agit avant, sur les lignes, donc c’est HAVING.",
          criteria: [
            c(
              "WHERE agit sur les lignes, avant",
              ["where[^.]*(avant|ligne)|(avant|ligne)[^.]*where"],
              "Explique ce que fait WHERE.",
            ),
            c(
              "HAVING agit sur les groupes, après",
              [
                "having[^.]*(apres|groupe|agreg)|(apres|groupe|agreg)[^.]*having",
              ],
              "Explique ce que fait HAVING.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "GROUP BY forme des groupes",
        ["group by|groupe"],
        "Rappelle GROUP BY.",
      ),
      c("WHERE avant, HAVING après", ["having"], "Distingue WHERE et HAVING."),
      c(
        "Les agrégats ignorent les NULL",
        ["null"],
        "Mentionne les NULL dans les agrégats.",
      ),
    ],
    cards: [
      {
        front: "WHERE ou HAVING ?",
        back: "WHERE filtre les lignes avant le regroupement ; HAVING filtre les groupes après, sur un résultat agrégé.",
      },
      {
        front: "Comment les agrégats traitent-ils NULL ?",
        back: "SUM, AVG, MIN, MAX et COUNT(colonne) ignorent les NULL ; seul COUNT(*) compte toutes les lignes.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras calculer des indicateurs par groupe, filtrer avant ou après le regroupement et interpréter les agrégats en présence de NULL.",
      prerequisites: ["Chapitres précédents : SELECT et jointures."],
      sections: [
        {
          heading: "Regrouper puis résumer",
          paragraphs: [
            "GROUP BY transporteur crée un groupe par transporteur ; chaque fonction d’agrégation résume le groupe : COUNT(*) compte les lignes, SUM additionne, AVG fait la moyenne, MIN et MAX donnent les extrêmes.",
            "Un taux s’obtient souvent par la moyenne d’un indicateur 0/1 : AVG(CASE WHEN en_retard THEN 1.0 ELSE 0 END).",
          ],
          diagram: {
            kind: "flow",
            title: "Le chemin d’une requête agrégée",
            steps: [
              { label: "FROM livraison", tone: "apricot" },
              {
                label: "WHERE",
                note: "Filtre les lignes (ex. novembre)",
                tone: "marker",
              },
              { label: "GROUP BY transporteur", note: "Forme les groupes" },
              {
                label: "HAVING",
                note: "Filtre les groupes (ex. ≥ 100)",
                tone: "marker",
              },
              { label: "SELECT", note: "Nombre, taux de retard", tone: "sky" },
            ],
            caption: "WHERE agit avant le regroupement, HAVING après.",
          },
        },
        {
          heading: "Les règles qui évitent les erreurs",
          paragraphs: [
            "Toute colonne non agrégée du SELECT doit figurer dans le GROUP BY : sinon la base ne sait pas quelle valeur afficher pour le groupe. Les agrégats ignorent les NULL, sauf COUNT(*) : une moyenne calculée sur 70 % des lignes doit être signalée comme telle.",
            "Enfin, un taux n’a de sens qu’avec un volume suffisant : HAVING COUNT(*) >= 100 évite de comparer un transporteur à 3 livraisons avec un autre à 3 000.",
          ],
          keyPoint:
            "Un taux sans son volume peut tromper : affiche toujours les deux.",
        },
      ],
      workedExample: {
        title: "Comparer les transporteurs",
        situation:
          "La directrice veut comparer les transporteurs sur novembre.",
        steps: [
          {
            label: "Filtrer la période",
            detail:
              "WHERE livree_le >= '2026-11-01' AND livree_le < '2026-12-01'.",
          },
          { label: "Regrouper", detail: "GROUP BY transporteur." },
          {
            label: "Calculer",
            detail:
              "COUNT(*) AS livraisons, AVG(CASE WHEN en_retard THEN 1.0 ELSE 0 END) AS taux_retard.",
          },
          {
            label: "Écarter les petits volumes",
            detail:
              "HAVING COUNT(*) >= 100, et liste à part des petits transporteurs.",
          },
        ],
        outcome:
          "Un tableau comparable, avec le volume affiché à côté de chaque taux.",
      },
      pitfalls: [
        {
          confusion: "Mettre une condition sur COUNT(*) dans WHERE.",
          correction: "Un filtre sur un agrégat va dans HAVING.",
          counterExample:
            "« WHERE COUNT(*) > 100 » provoque une erreur : le compte n’existe pas encore à ce stade.",
        },
        {
          confusion: "Lire une moyenne sans regarder les NULL.",
          correction:
            "Les NULL sont ignorés : vérifie la part de lignes réellement prises en compte.",
          counterExample:
            "Une moyenne de 48 € calculée sur les seules commandes dont le montant est renseigné.",
        },
      ],
      summary: [
        "GROUP BY forme les groupes ; COUNT, SUM, AVG, MIN, MAX les résument.",
        "WHERE filtre les lignes avant, HAVING filtre les groupes après.",
        "Toute colonne non agrégée doit être dans le GROUP BY.",
        "Les agrégats ignorent les NULL ; affiche le volume à côté d’un taux.",
      ],
      glossary: [
        {
          term: "GROUP BY",
          definition:
            "Regroupe les lignes qui partagent une ou plusieurs valeurs.",
        },
        {
          term: "HAVING",
          definition: "Filtre les groupes selon un résultat agrégé.",
        },
        {
          term: "Agrégat",
          definition:
            "Calcul qui résume plusieurs lignes en une valeur (COUNT, SUM, AVG…).",
        },
        {
          term: "CASE WHEN",
          definition:
            "Expression conditionnelle, utile pour fabriquer un indicateur 0/1.",
        },
      ],
    },
    caseStep: {
      title: "Dossier données · Le taux d’expédition en 24 h",
      context: `${LUMEN} Table commande(id_commande, payee_le, expediee_le, statut). L’indicateur défini : part des commandes expédiées moins de 24 heures après le paiement, par semaine.`,
      prompts: [
        "Écris la requête qui calcule ce taux par semaine.",
        "Quels contrôles fais-tu avant de présenter le chiffre en COPIL ?",
      ],
      criteria: [
        [
          "Regroupement par semaine",
          "Taux calculé avec CASE et AVG ou SUM/COUNT",
          "Annulées exclues",
        ],
        ["Volume affiché", "Contrôle des NULL", "Cohérence avec la définition"],
      ],
      models: [
        "SELECT date_trunc('week', payee_le) AS semaine, COUNT(*) AS commandes, AVG(CASE WHEN expediee_le - payee_le <= interval '24 hours' THEN 1.0 ELSE 0 END) AS taux_24h FROM commande WHERE statut <> 'annulee' AND payee_le IS NOT NULL GROUP BY semaine ORDER BY semaine.",
        "Afficher le volume de chaque semaine, vérifier les commandes sans date d’expédition (comptées comme non expédiées) et les statuts NULL, et contrôler que la règle des week-ends correspond à la définition validée.",
      ],
    },
  },
  {
    id: "sql-qualite",
    title: "Faire confiance aux données, mais vérifier.",
    subtitle: "Les dimensions de la qualité et les contrôles simples.",
    skill: "Contrôler la qualité des données",
    recall: q(
      "Une adresse e-mail « jean@@exemple » enregistrée dans la base pose un problème de…",
      ["Complétude", "Validité", "Fraîcheur"],
      1,
      "La valeur existe mais ne respecte pas le format attendu : c’est un problème de validité.",
    ),
    paragraphs: [
      "La qualité des données se juge sur plusieurs dimensions : complétude (la valeur est-elle là ?), validité (respecte-t-elle le format ?), unicité (pas de doublon), cohérence (pas de contradiction) et fraîcheur (est-elle à jour ?).",
      "Le BA ne corrige pas les données lui-même : il définit les règles, mesure les écarts et fait décider qui corrige.",
    ],
    takeaway:
      "Une décision n’est pas meilleure que les données qui la nourrissent.",
    example: {
      context: "Fichier clients avant une campagne.",
      before: "« Le fichier est bon, on l’utilise tel quel. »",
      after:
        "Contrôles : 8 % d’e-mails vides (complétude), 2 % mal formés (validité), 140 doublons sur l’e-mail (unicité). Décision : nettoyage avant envoi, porté par le marketing.",
    },
    check: q(
      "Deux fiches client ont le même e-mail et des noms légèrement différents. Quelle dimension est en cause ?",
      ["Unicité", "Fraîcheur", "Complétude"],
      0,
      "Une même personne enregistrée deux fois : c’est un problème d’unicité (doublon).",
    ),
    transfer: q(
      "Une commande est « livrée » mais n’a aucune date de livraison. Quelle dimension est en cause ?",
      ["Validité", "Cohérence", "Unicité"],
      1,
      "Deux informations se contredisent (statut livré, date absente) : c’est un problème de cohérence.",
    ),
    exam: q(
      "Quelle requête mesure les doublons d’e-mail ?",
      [
        "SELECT email, COUNT(*) FROM client GROUP BY email HAVING COUNT(*) > 1",
        "SELECT * FROM client ORDER BY email",
        "SELECT COUNT(*) FROM client WHERE email IS NULL",
      ],
      0,
      "On regroupe par e-mail et on garde les groupes de plus d’une ligne : ce sont les doublons.",
    ),
    mission: {
      title: "Contrôle un fichier avant usage.",
      context:
        "Table client(id_client, nom, email, ville, maj_le). Le marketing veut envoyer une campagne à tous les clients la semaine prochaine.",
      prompts: [
        "Cite trois contrôles de qualité à faire, chacun avec sa dimension.",
        "Écris la requête qui détecte les e-mails en double.",
      ],
      rubric: [
        "Mes contrôles couvrent plusieurs dimensions, nommées.",
        "Ma requête regroupe par e-mail avec HAVING COUNT(*) > 1.",
      ],
      example:
        "Complétude : part des e-mails vides. Validité : e-mails sans « @ » ou mal formés. Unicité : e-mails présents plusieurs fois. Requête : SELECT email, COUNT(*) FROM client GROUP BY email HAVING COUNT(*) > 1.",
      checks: [
        {
          model:
            "Complétude : part des e-mails vides. Validité : e-mails mal formés. Unicité : e-mails présents plusieurs fois.",
          criteria: [
            c(
              "Au moins deux dimensions nommées",
              [
                "(completude|validite|unicite|coherence|fraicheur)[\\s\\S]*(completude|validite|unicite|coherence|fraicheur)",
              ],
              "Nomme les dimensions contrôlées.",
            ),
            c(
              "Des contrôles concrets",
              [
                "vide|null|manquant|format|@|double|plusieurs fois|ancien|date|contradic",
              ],
              "Décris ce que tu vérifies concrètement.",
            ),
          ],
        },
        {
          model:
            "SELECT email, COUNT(*) FROM client GROUP BY email HAVING COUNT(*) > 1",
          criteria: [
            c(
              "GROUP BY email",
              ["group by\\s+(lower\\()?email"],
              "Regroupe par e-mail.",
            ),
            c(
              "HAVING COUNT(*) > 1",
              ["having\\s+count\\s*\\([^)]*\\)\\s*(>\\s*1|>=\\s*2)"],
              "Garde les groupes de plus d’une ligne.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Cinq dimensions de qualité",
        ["completude|validite|unicite|coherence|fraicheur"],
        "Cite les dimensions de qualité.",
      ),
      c(
        "Mesurer avant d’utiliser",
        ["mesur|control|verif"],
        "Mentionne la mesure.",
      ),
      c(
        "Le BA fait décider qui corrige",
        ["decid|corrig|proprietaire|porte"],
        "Dis qui corrige.",
      ),
    ],
    cards: [
      {
        front: "Les cinq dimensions de la qualité des données ?",
        back: "Complétude, validité, unicité, cohérence, fraîcheur.",
      },
      {
        front: "Rôle du BA face à une donnée de mauvaise qualité ?",
        back: "Définir la règle, mesurer l’écart, faire décider qui corrige et comment éviter que l’erreur se reproduise.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras évaluer la qualité d’un jeu de données sur cinq dimensions, écrire les contrôles SQL de base et organiser la correction.",
      prerequisites: ["Chapitres précédents : SELECT, jointures, agrégations."],
      sections: [
        {
          heading: "Cinq dimensions pour juger une donnée",
          paragraphs: [
            "Une donnée peut manquer (complétude), être mal formée (validité), exister en double (unicité), contredire une autre donnée (cohérence) ou être périmée (fraîcheur). Chaque dimension se mesure par une règle et un taux.",
          ],
          diagram: {
            kind: "table",
            title: "Les dimensions et leur contrôle",
            columns: ["Dimension", "Question", "Contrôle SQL type"],
            rows: [
              [
                "Complétude",
                "La valeur est-elle renseignée ?",
                "COUNT(*) FILTER (WHERE email IS NULL)",
              ],
              [
                "Validité",
                "Respecte-t-elle le format ?",
                "WHERE email NOT LIKE '%_@_%._%'",
              ],
              [
                "Unicité",
                "Existe-t-elle une seule fois ?",
                "GROUP BY email HAVING COUNT(*) > 1",
              ],
              [
                "Cohérence",
                "Contredit-elle une autre donnée ?",
                "WHERE statut = 'livree' AND livree_le IS NULL",
              ],
              [
                "Fraîcheur",
                "Est-elle à jour ?",
                "WHERE maj_le < now() - interval '3 years'",
              ],
            ],
            caption:
              "Un taux par dimension permet de suivre la qualité dans le temps.",
          },
        },
        {
          heading: "Du constat à la correction",
          paragraphs: [
            "Le BA ne nettoie pas la base à la main : il formalise les règles (dans un dictionnaire de données), mesure les écarts, présente leur impact sur la décision visée et fait désigner un propriétaire de la donnée qui corrige.",
            "La meilleure correction est préventive : un contrôle de format à la saisie évite mille nettoyages.",
          ],
          keyPoint:
            "Corriger une donnée, c’est bien ; empêcher l’erreur de se reproduire, c’est mieux.",
          diagram: {
            kind: "flow",
            title: "Le cycle d’amélioration",
            steps: [
              {
                label: "Règle écrite",
                note: "Dictionnaire de données",
                tone: "apricot",
              },
              { label: "Mesure", note: "Taux d’écart par dimension" },
              {
                label: "Décision",
                note: "Qui corrige, avant quand ?",
                tone: "marker",
              },
              {
                label: "Prévention",
                note: "Contrôle à la saisie",
                tone: "sky",
              },
            ],
            caption:
              "La qualité se pilote comme un indicateur : règle, mesure, action, suivi.",
          },
        },
      ],
      workedExample: {
        title: "La campagne de la semaine prochaine",
        situation:
          "Le marketing veut écrire à tous les clients ; personne n’a vérifié le fichier.",
        steps: [
          {
            label: "Complétude",
            detail: "8 % d’e-mails vides : ces clients ne recevront rien.",
          },
          {
            label: "Validité",
            detail: "2 % d’e-mails mal formés : rebonds assurés.",
          },
          {
            label: "Unicité",
            detail:
              "140 e-mails en double : certains clients recevraient deux messages.",
          },
          {
            label: "Décision",
            detail:
              "Le marketing dédoublonne avant l’envoi ; la saisie du site vérifie désormais le format.",
          },
        ],
        outcome:
          "La campagne part sur une base propre, et l’erreur de format ne se reproduira plus.",
      },
      pitfalls: [
        {
          confusion: "Supposer qu’une donnée présente est une donnée juste.",
          correction:
            "Présente (complète) ne veut pas dire valide, unique ni à jour.",
          counterExample:
            "Un e-mail renseigné mais vieux de six ans n’atteint plus personne.",
        },
        {
          confusion: "Corriger en masse sans propriétaire ni règle.",
          correction:
            "Fais décider qui corrige et selon quelle règle, puis préviens la récidive.",
          counterExample:
            "Un nettoyage manuel fusionne deux vrais clients homonymes.",
        },
      ],
      summary: [
        "Complétude, validité, unicité, cohérence, fraîcheur.",
        "Chaque dimension se mesure par une règle et un taux.",
        "Le BA définit, mesure et fait décider ; le propriétaire de la donnée corrige.",
        "La prévention à la saisie vaut mieux que le nettoyage.",
      ],
      glossary: [
        {
          term: "Complétude",
          definition: "La valeur attendue est renseignée.",
        },
        {
          term: "Validité",
          definition: "La valeur respecte le format ou les règles attendues.",
        },
        {
          term: "Unicité",
          definition: "Chaque entité n’est enregistrée qu’une fois.",
        },
        {
          term: "Propriétaire de la donnée",
          definition:
            "Personne responsable de la qualité et de la correction d’une donnée.",
        },
      ],
    },
    caseStep: {
      title: "Dossier données · Fiabiliser les adresses",
      context: `${LUMEN} Les retours « adresse introuvable » coûtent cher. Table client(id_client, email, adresse, code_postal, ville, maj_le).`,
      prompts: [
        "Propose trois contrôles de qualité sur les adresses, avec leur dimension et une requête pour l’un d’eux.",
        "Comment organises-tu la correction et la prévention ?",
      ],
      criteria: [
        ["Trois contrôles avec dimension", "Une requête SQL"],
        ["Propriétaire désigné", "Prévention à la saisie"],
      ],
      models: [
        "Complétude : codes postaux vides. Validité : codes postaux qui ne font pas 5 chiffres (WHERE code_postal !~ '^[0-9]{5}$'). Cohérence : ville qui ne correspond pas au code postal, à vérifier avec un référentiel.",
        "Le service client est désigné propriétaire des adresses et corrige les fiches signalées chaque semaine ; le formulaire du site propose une adresse normalisée à la saisie pour prévenir les erreurs.",
      ],
    },
  },
];

export const dataSqlCourse: Course = {
  id: "ba-data-sql",
  title: "Données et SQL",
  eyebrow: "Spécialisation",
  color: "peach",
  icon: "code",
  description:
    "Lire et écrire des requêtes, relier des tables, calculer des indicateurs et contrôler la qualité des données.",
  lessons,
  caseStudy: {
    name: "Maison Lumen",
    pitch: `${LUMEN} Tu interroges les données de commandes pour piloter les délais.`,
  },
  sources: [
    {
      title: "PostgreSQL · Documentation SQL",
      url: "https://www.postgresql.org/docs/current/sql.html",
    },
  ],
};
