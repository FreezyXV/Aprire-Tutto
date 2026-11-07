import type { Course, Lesson } from "@/lib/types";
import { c, q } from "./helpers";

/*
 * Specialization: BA job interviews. Original writing in French. Examples
 * are fictional: the learner writes their own answers in the exercises, and
 * no personal data is stored in this public repository.
 */
const OFFER =
  "Offre fictive : « Business Analyst AMOA, secteur logistique. Ateliers métier, rédaction des user stories, préparation et pilotage de la recette, lien quotidien avec l’équipe de développement. »";

const lessons: Lesson[] = [
  {
    id: "ent-pitch",
    title: "Te présenter en 90 secondes.",
    subtitle: "Un pitch clair, chiffré et relié au poste.",
    skill: "Se présenter",
    recall: q(
      "« Parlez-moi de vous. » Que cherche d’abord le recruteur ?",
      [
        "Ton parcours scolaire complet",
        "Une présentation courte qui relie ton expérience au poste",
        "Tes loisirs",
      ],
      1,
      "Il veut comprendre en une minute et demie qui tu es professionnellement et pourquoi tu corresponds au poste.",
    ),
    paragraphs: [
      "Un bon pitch suit trois temps : qui tu es aujourd’hui (ton positionnement), ce que tu as fait (deux réalisations chiffrées), ce que tu cherches (et pourquoi ce poste).",
      "Il s’adapte à chaque offre : on met en avant les expériences qui répondent aux activités décrites.",
    ],
    takeaway:
      "Positionnement, deux preuves chiffrées, lien avec le poste : en 90 secondes.",
    example: {
      context: "Candidat à un poste de BA AMOA.",
      before:
        "« J’ai fait plein de choses, du marketing, du web, un peu de tout, et j’aimerais découvrir le métier de BA. »",
      after:
        "« Je suis Business Analyst orienté métier. J’ai mené une quarantaine d’ateliers sur un projet de refonte, rédigé et priorisé une centaine de user stories, et contribué à réduire de 30 % les abandons d’un formulaire. Je cherche un poste AMOA où l’analyse du besoin et la recette sont au cœur du rôle, ce que décrit votre offre. »",
    },
    check: q(
      "Quelle phrase rend un pitch plus crédible ?",
      [
        "« Je suis très motivé et polyvalent. »",
        "« J’ai animé 15 ateliers et rédigé 80 user stories sur un projet de refonte. »",
        "« J’ai toujours aimé l’informatique. »",
      ],
      1,
      "Un fait chiffré prouve ; un adjectif affirme.",
    ),
    transfer: q(
      "L’offre insiste sur la recette. Comment adaptes-tu ton pitch ?",
      [
        "Tu ne changes rien : un pitch est universel",
        "Tu mets en avant une réalisation liée aux tests et à la validation",
        "Tu ajoutes une liste de tous tes outils",
      ],
      1,
      "Le pitch se recalibre pour chaque offre : la réalisation mise en avant répond à l’activité clé du poste.",
    ),
    exam: q(
      "Quelle durée viser pour un pitch d’entretien ?",
      ["Environ 90 secondes", "Au moins 10 minutes", "15 secondes"],
      0,
      "Une minute et demie suffit pour poser le positionnement, deux preuves et le lien avec le poste ; le recruteur creusera ensuite.",
    ),
    mission: {
      title: "Écris ton pitch pour une offre.",
      context: OFFER,
      prompts: [
        "Écris la phrase de positionnement et une réalisation chiffrée.",
        "Écris la phrase qui relie ton projet professionnel à cette offre.",
      ],
      rubric: [
        "Mon positionnement est clair et ma réalisation est chiffrée.",
        "Je relie explicitement mon projet aux activités de l’offre.",
      ],
      example:
        "Je suis Business Analyst orienté métier, à l’aise entre équipes métier et techniques. Sur un projet de refonte, j’ai animé une quarantaine d’ateliers et rédigé une centaine de user stories priorisées. Je cherche un poste AMOA centré sur l’analyse du besoin et la recette, exactement ce que décrit votre offre, dans un secteur logistique où les processus comptent.",
      checks: [
        {
          model:
            "Je suis Business Analyst orienté métier. Sur un projet de refonte, j’ai animé une quarantaine d’ateliers et rédigé une centaine de user stories priorisées.",
          criteria: [
            c(
              "Un positionnement",
              ["je suis|business analyst|\\bba\\b|amoa|analyste|consultant"],
              "Commence par qui tu es professionnellement.",
            ),
            c(
              "Une réalisation chiffrée",
              ["\\d|une (quarantaine|centaine|dizaine|vingtaine|trentaine)"],
              "Ajoute un chiffre qui prouve.",
            ),
          ],
          avoid: [
            {
              patterns: ["(tres )?motive|polyvalent|passionne"],
              message:
                "Les adjectifs (motivé, polyvalent) n’apportent pas de preuve : remplace-les par un fait.",
            },
          ],
        },
        {
          model:
            "Je cherche un poste AMOA centré sur l’analyse du besoin et la recette, exactement ce que décrit votre offre.",
          criteria: [
            c(
              "Ce que tu cherches",
              ["je cherche|je souhaite|mon objectif|je vise|projet"],
              "Dis ce que tu cherches.",
            ),
            c(
              "Lien avec l’offre",
              ["offre|poste|votre|ateliers?|recette|user stor|logistique"],
              "Relie à une activité précise de l’offre.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Trois temps : positionnement, preuves, projet",
        ["positionnement|preuve|projet"],
        "Rappelle la structure.",
      ),
      c(
        "Des réalisations chiffrées",
        ["chiffr|\\d"],
        "Mentionne les chiffres.",
      ),
      c(
        "Adapter à chaque offre",
        ["offre|adapt|poste"],
        "Ajoute l’adaptation à l’offre.",
      ),
    ],
    cards: [
      {
        front: "Structure d’un pitch d’entretien ?",
        back: "Positionnement (qui je suis), deux réalisations chiffrées (ce que j’ai fait), projet (ce que je cherche et pourquoi ce poste). Environ 90 secondes.",
      },
      {
        front: "Pourquoi éviter « motivé et polyvalent » ?",
        back: "Ce sont des affirmations sans preuve ; un fait chiffré convainc davantage.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras construire un pitch de 90 secondes, chiffré et adapté à chaque offre de BA.",
      prerequisites: ["Socle BA, chapitre 3 : les orientations du métier."],
      sections: [
        {
          heading: "Trois temps, pas un CV récité",
          paragraphs: [
            "« Parlez-moi de vous » n’invite pas à réciter ton CV dans l’ordre chronologique. Le recruteur veut comprendre en 90 secondes qui tu es professionnellement, ce que tu sais faire et pourquoi ce poste.",
            "Structure simple : un positionnement (« Business Analyst orienté métier »), deux réalisations chiffrées en lien avec l’offre, puis ton projet et le lien avec le poste.",
          ],
          diagram: {
            kind: "flow",
            title: "Le pitch en trois temps",
            steps: [
              {
                label: "Positionnement",
                note: "Qui je suis aujourd’hui (10 s)",
                tone: "apricot",
              },
              {
                label: "Preuves",
                note: "Deux réalisations chiffrées (50 s)",
                tone: "marker",
              },
              {
                label: "Projet",
                note: "Ce que je cherche, pourquoi ce poste (30 s)",
                tone: "sky",
              },
            ],
            caption:
              "Le recruteur posera ensuite ses questions sur ce que tu as mis en avant.",
          },
        },
        {
          heading: "Des preuves plutôt que des adjectifs",
          paragraphs: [
            "« Rigoureux, motivé, polyvalent » ne distingue personne. « J’ai animé 40 ateliers, rédigé 100 user stories, et le taux d’abandon du formulaire a baissé de 30 % » distingue immédiatement. Choisis des chiffres que tu peux expliquer en détail : le recruteur va creuser.",
            "Si ton expérience BA est récente, appuie-toi sur des missions où tu as fait le travail d’un BA, même avec un autre intitulé : recueil de besoins, rédaction de spécifications, tests, suivi d’indicateurs.",
          ],
          keyPoint: "Un chiffre que tu sais expliquer vaut dix adjectifs.",
        },
        {
          heading: "Adapter à chaque offre",
          paragraphs: [
            "Relis l’offre et repère ses trois activités principales. Choisis les deux réalisations qui y répondent le mieux, et termine en nommant explicitement le lien : « c’est exactement ce que décrit votre offre ». Entraîne-toi à voix haute, chronomètre en main.",
          ],
        },
      ],
      workedExample: {
        title: "Un pitch pour un poste AMOA logistique",
        situation: OFFER,
        steps: [
          {
            label: "Repérer les activités clés",
            detail:
              "Ateliers, user stories, recette, lien avec les développeurs.",
          },
          {
            label: "Positionnement",
            detail:
              "« Business Analyst orienté métier, à l’aise entre équipes métier et techniques. »",
          },
          {
            label: "Deux preuves",
            detail:
              "Une quarantaine d’ateliers animés ; une centaine de user stories priorisées et recettées.",
          },
          {
            label: "Projet et lien",
            detail:
              "« Je cherche un poste AMOA centré sur le besoin et la recette, ce que décrit votre offre. »",
          },
        ],
        outcome:
          "En 90 secondes, le recruteur sait qui tu es, ce que tu as prouvé et pourquoi tu postules ici.",
      },
      pitfalls: [
        {
          confusion: "Réciter le CV dans l’ordre chronologique.",
          correction: "Sélectionne ce qui sert le poste visé.",
          counterExample:
            "Cinq minutes sur les premiers emplois sans lien avec la BA : le recruteur décroche.",
        },
        {
          confusion: "Utiliser le même pitch pour toutes les offres.",
          correction:
            "Change les preuves mises en avant selon les activités de l’offre.",
          counterExample:
            "Un pitch centré sur le SQL pour un poste très orienté conduite du changement.",
        },
      ],
      summary: [
        "90 secondes : positionnement, deux preuves chiffrées, projet.",
        "Des faits chiffrés plutôt que des adjectifs.",
        "Adapter les preuves aux activités de chaque offre.",
        "S’entraîner à voix haute, chronomètre en main.",
      ],
      glossary: [
        {
          term: "Pitch",
          definition:
            "Présentation orale courte de son profil, adaptée à un interlocuteur.",
        },
        {
          term: "Positionnement",
          definition:
            "Phrase qui situe ton profil (orientation, secteur, force principale).",
        },
        {
          term: "Preuve",
          definition:
            "Réalisation concrète, idéalement chiffrée, qui appuie une compétence.",
        },
      ],
    },
    caseStep: {
      title: "Dossier entretien · Ton pitch pour Maison Lumen",
      context:
        "Maison Lumen recrute un BA pour piloter la refonte du traitement des commandes (ateliers avec le service client et l’entrepôt, user stories, recette, suivi des délais).",
      prompts: [
        "Écris ton pitch complet de 90 secondes pour ce poste, avec tes propres réalisations.",
        "Quelle réalisation as-tu choisie de mettre en avant, et pourquoi pour ce poste ?",
      ],
      criteria: [
        ["Positionnement", "Deux réalisations chiffrées", "Lien avec le poste"],
        ["Choix justifié par les activités de l’offre"],
      ],
      models: [
        "Exemple de structure : « Je suis Business Analyst orienté métier. [Réalisation 1 chiffrée : ateliers, user stories]. [Réalisation 2 chiffrée : résultat mesuré après livraison]. Je cherche un poste où je pilote un projet de bout en bout, du besoin à la mesure de la valeur, ce que propose Maison Lumen avec la refonte des commandes. »",
        "La réalisation où un indicateur s’est amélioré après la livraison, car le poste demande de suivre les délais : elle montre que je vais jusqu’à la mesure de la valeur.",
      ],
    },
  },
  {
    id: "ent-star",
    title: "Raconter une situation qui prouve.",
    subtitle: "La méthode STAR pour les questions comportementales.",
    skill: "Répondre avec la méthode STAR",
    recall: q(
      "Que signifie STAR ?",
      [
        "Stratégie, Tactique, Action, Résultat",
        "Situation, Tâche, Action, Résultat",
        "Synthèse, Test, Analyse, Recette",
      ],
      1,
      "Situation (le contexte), Tâche (ton objectif), Action (ce que tu as fait, toi), Résultat (chiffré si possible).",
    ),
    paragraphs: [
      "Les questions comportementales (« Racontez une fois où… ») se préparent avec STAR : Situation, Tâche, Action, Résultat. L’Action occupe la moitié de la réponse et parle de toi (« j’ai »), pas de l’équipe en général.",
      "Le Résultat se chiffre si possible et se termine par ce que tu en as retenu.",
    ],
    takeaway:
      "Situation et tâche en deux phrases, l’action en détail avec « je », un résultat chiffré.",
    example: {
      context: "« Racontez un désaccord entre parties prenantes. »",
      before:
        "« Ça arrive souvent, on finit toujours par trouver un compromis. »",
      after:
        "« Situation : marketing et DSI s’opposaient sur le périmètre d’une refonte. Tâche : obtenir une décision avant le comité. Action : j’ai réuni les deux en atelier, chiffré la valeur et l’effort de chaque demande et préparé deux options. Résultat : décision prise en une séance, 12 demandes reportées en version 2. »",
    },
    check: q(
      "Quelle partie de STAR doit être la plus développée ?",
      ["La Situation", "L’Action", "Le Résultat"],
      1,
      "C’est l’Action qui montre ce que tu sais faire : décris tes choix et pourquoi.",
    ),
    transfer: q(
      "Ta réponse dit surtout « nous avons fait… ». Que corriger ?",
      [
        "Rien, le travail d’équipe est apprécié",
        "Préciser ta contribution personnelle avec « j’ai… »",
        "Supprimer l’équipe de l’histoire",
      ],
      1,
      "Le recruteur évalue ta contribution : cite l’équipe, mais détaille ce que toi tu as fait.",
    ),
    exam: q(
      "Pourquoi conclure une réponse STAR par ce que tu en as retenu ?",
      [
        "Pour allonger la réponse",
        "Pour montrer ta capacité à apprendre et à réutiliser l’expérience",
        "Parce que c’est obligatoire",
      ],
      1,
      "L’apprentissage tiré montre ta maturité professionnelle et ta capacité à progresser.",
    ),
    mission: {
      title: "Rédige une réponse STAR.",
      context:
        "Question : « Racontez une situation où une demande du métier était floue. Comment l’avez-vous clarifiée ? » Tu peux utiliser une expérience réelle ou fictive.",
      prompts: [
        "Écris la Situation et la Tâche en deux phrases.",
        "Écris l’Action (avec « je ») et le Résultat chiffré, puis ce que tu en as retenu.",
      ],
      rubric: [
        "Ma situation et ma tâche sont courtes et précises.",
        "Mon action est personnelle et détaillée ; mon résultat est chiffré avec un enseignement.",
      ],
      example:
        "Situation : un responsable demandait « un tableau de bord des ventes » sans autre précision. Tâche : livrer un outil réellement utile en un mois. Action : j’ai organisé deux entretiens pour identifier les décisions à prendre chaque semaine, puis j’ai fait valider une maquette de trois indicateurs. Résultat : le tableau est utilisé chaque lundi en réunion, et le temps de préparation est passé de 3 heures à 20 minutes. J’en retiens qu’il faut partir des décisions avant de dessiner des graphiques.",
      checks: [
        {
          model:
            "Situation : un responsable demandait « un tableau de bord des ventes » sans autre précision. Tâche : livrer un outil réellement utile en un mois.",
          criteria: [
            c(
              "Une situation concrète",
              ["situation|contexte|demand|projet|responsable|client|equipe"],
              "Pose le contexte en une phrase.",
            ),
            c(
              "Une tâche ou un objectif",
              ["tache|objectif|mission|je devais|il fallait|mon role|livrer"],
              "Précise ton objectif dans cette situation.",
            ),
          ],
        },
        {
          model:
            "Action : j’ai organisé deux entretiens, puis j’ai fait valider une maquette de trois indicateurs. Résultat : le temps de préparation est passé de 3 heures à 20 minutes. J’en retiens qu’il faut partir des décisions.",
          criteria: [
            c(
              "Une action personnelle",
              ["\\bj'ai\\b|\\bje\\b"],
              "Décris ce que toi tu as fait, avec « je ».",
            ),
            c("Un résultat chiffré", ["\\d"], "Chiffre le résultat."),
            c(
              "Un enseignement",
              ["retien|appris|lecon|desormais|aujourd'hui je|enseignement"],
              "Termine par ce que tu en retiens.",
            ),
          ],
          avoid: [
            {
              patterns: ["^(?!.*\\bj'ai\\b)(?!.*\\bje\\b).*\\bnous avons\\b"],
              message:
                "Tu parles seulement de « nous » : précise ta contribution avec « je ».",
            },
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Situation, Tâche, Action, Résultat",
        ["situation|tache|action|resultat"],
        "Rappelle les quatre temps.",
      ),
      c(
        "L’action parle de toi",
        ["\\bje\\b|personnel|contribution"],
        "Mentionne le « je ».",
      ),
      c(
        "Résultat chiffré et enseignement",
        ["chiffr|retenu|retiens|enseignement"],
        "Ajoute le résultat et l’enseignement.",
      ),
    ],
    cards: [
      {
        front: "Les quatre temps de STAR ?",
        back: "Situation (contexte), Tâche (ton objectif), Action (ce que tu as fait, avec « je »), Résultat (chiffré, avec ce que tu en retiens).",
      },
      {
        front: "Quelle partie développer le plus ?",
        back: "L’Action : tes choix, tes méthodes et pourquoi. Situation et tâche tiennent en deux phrases.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras préparer et raconter tes expériences avec la méthode STAR, de façon concise, personnelle et chiffrée.",
      prerequisites: ["Chapitre « Te présenter en 90 secondes »."],
      sections: [
        {
          heading: "Pourquoi STAR",
          paragraphs: [
            "Les questions comportementales partent d’un principe : ce que tu as fait dans une situation passée prédit ce que tu feras demain. STAR structure ta réponse pour qu’elle soit courte, concrète et vérifiable.",
          ],
          diagram: {
            kind: "flow",
            title: "STAR : le poids de chaque partie",
            steps: [
              {
                label: "Situation",
                note: "Le contexte, en une phrase",
                tone: "neutral",
              },
              {
                label: "Tâche",
                note: "Ton objectif, en une phrase",
                tone: "neutral",
              },
              {
                label: "Action",
                note: "Ce que TU as fait, en détail",
                tone: "apricot",
              },
              {
                label: "Résultat",
                note: "Chiffré, puis ce que tu en retiens",
                tone: "sky",
              },
            ],
            caption: "L’Action occupe environ la moitié de la réponse.",
          },
        },
        {
          heading: "Le « je » et les chiffres",
          paragraphs: [
            "Le recruteur évalue ta contribution, pas celle de l’équipe : « j’ai organisé, j’ai proposé, j’ai fait valider ». Cite l’équipe, mais détaille tes choix et leurs raisons.",
            "Le résultat se chiffre dès que possible : délai, volume, taux, nombre de personnes. Termine par un enseignement : il montre que tu sais apprendre de tes expériences.",
          ],
          keyPoint: "« Nous avons » raconte l’équipe ; « j’ai » te présente.",
        },
        {
          heading: "Préparer une banque d’histoires",
          paragraphs: [
            "Prépare à l’avance six à huit histoires STAR qui couvrent les thèmes classiques du BA : besoin flou, désaccord entre parties prenantes, priorisation sous contrainte, erreur et correction, recette difficile, résistance au changement. Une même histoire peut répondre à plusieurs questions.",
          ],
          diagram: {
            kind: "table",
            title: "Les thèmes à couvrir",
            columns: ["Thème", "Question type"],
            rows: [
              ["Besoin flou", "Comment avez-vous clarifié une demande vague ?"],
              ["Conflit", "Racontez un désaccord entre parties prenantes."],
              ["Priorisation", "Comment avez-vous arbitré avec peu de temps ?"],
              ["Erreur", "Parlez d’une erreur et de ce que vous en avez tiré."],
              [
                "Changement",
                "Comment avez-vous fait adopter un nouvel outil ?",
              ],
            ],
            caption:
              "Une banque de six à huit histoires couvre la plupart des questions.",
          },
        },
      ],
      workedExample: {
        title: "Le tableau de bord flou",
        situation:
          "Question : « Racontez une demande floue et comment vous l’avez clarifiée. »",
        steps: [
          {
            label: "Situation",
            detail:
              "Un responsable demande « un tableau de bord des ventes », sans autre précision.",
          },
          {
            label: "Tâche",
            detail: "Livrer en un mois un outil réellement utilisé.",
          },
          {
            label: "Action",
            detail:
              "J’ai mené deux entretiens sur les décisions hebdomadaires, proposé trois indicateurs, fait valider une maquette avant tout développement.",
          },
          {
            label: "Résultat",
            detail:
              "Utilisé chaque lundi ; préparation de la réunion passée de 3 heures à 20 minutes. Enseignement : partir des décisions avant les graphiques.",
          },
        ],
        outcome:
          "Une réponse de 90 secondes, personnelle, chiffrée, qui montre la démarche BA.",
      },
      pitfalls: [
        {
          confusion: "Passer trop de temps sur le contexte.",
          correction:
            "Situation et tâche en deux phrases ; l’essentiel est l’action.",
          counterExample:
            "Deux minutes sur l’organigramme du client, trente secondes sur ce que tu as fait.",
        },
        {
          confusion: "Répondre en généralités (« d’habitude, je… »).",
          correction: "Raconte une situation précise, réellement vécue.",
          counterExample:
            "« En général, je fais des ateliers » ne prouve rien ; « lors du projet X, j’ai… » prouve.",
        },
      ],
      summary: [
        "STAR : Situation, Tâche, Action, Résultat.",
        "L’action est personnelle (« je ») et détaillée.",
        "Résultat chiffré et enseignement tiré.",
        "Préparer une banque de six à huit histoires.",
      ],
      glossary: [
        {
          term: "Question comportementale",
          definition:
            "Question qui demande de raconter une situation passée réelle.",
        },
        {
          term: "STAR",
          definition:
            "Structure de réponse : Situation, Tâche, Action, Résultat.",
        },
        {
          term: "Banque d’histoires",
          definition:
            "Ensemble d’expériences préparées pour répondre aux questions fréquentes.",
        },
      ],
    },
    caseStep: {
      title: "Dossier entretien · Deux histoires STAR",
      context:
        "Maison Lumen te demande en entretien : « Racontez une situation où vous avez dû faire adopter un changement à une équipe réticente. »",
      prompts: [
        "Rédige ta réponse complète en STAR, à partir d’une expérience réelle.",
        "Quelle autre question pourrait réutiliser cette histoire, et comment l’adapterais-tu ?",
      ],
      criteria: [
        [
          "Situation et tâche courtes",
          "Action personnelle détaillée",
          "Résultat chiffré et enseignement",
        ],
        ["Une question pertinente", "Adaptation de l’angle"],
      ],
      models: [
        "Structure : Situation (équipe et outil concernés, en une phrase). Tâche (ton objectif d’adoption). Action (j’ai écouté les objections, associé un référent, formé sur des cas réels…). Résultat (taux d’utilisation après un mois, gain de temps) et ce que tu en retiens.",
        "« Comment gérez-vous une partie prenante opposée au projet ? » : même histoire, en détaillant davantage l’écoute des objections et l’association de l’opposant aux tests.",
      ],
    },
  },
  {
    id: "ent-cas",
    title: "Le cas pratique en direct.",
    subtitle: "Structurer sa réflexion face à un problème inconnu.",
    skill: "Résoudre un cas en entretien",
    recall: q(
      "Face à un cas pratique, que faire en premier ?",
      [
        "Proposer immédiatement une solution",
        "Reformuler et poser des questions pour clarifier l’objectif",
        "Dire que tu n’as pas assez d’informations",
      ],
      1,
      "Le recruteur évalue ta démarche : reformuler et questionner, c’est déjà faire le métier de BA.",
    ),
    paragraphs: [
      "Un cas pratique évalue ta démarche plus que ta réponse. Une structure simple : reformuler, poser des questions, formuler des hypothèses, proposer une démarche, conclure par des prochaines étapes.",
      "Penser à voix haute permet au recruteur de suivre ton raisonnement et de te guider.",
    ],
    takeaway:
      "Reformuler, questionner, poser des hypothèses, proposer, conclure : à voix haute.",
    example: {
      context:
        "« Un responsable dit que ses équipes perdent du temps avec l’outil de facturation. Que faites-vous ? »",
      before: "« Je proposerais de changer d’outil. »",
      after:
        "« Si je comprends bien, l’enjeu est le temps perdu. Je demanderais : combien d’utilisateurs, sur quelles étapes, depuis quand ? Hypothèse : la ressaisie entre deux outils. J’observerais deux personnes, je mesurerais le temps par étape, puis je proposerais des pistes chiffrées. Première étape : un entretien avec le responsable cette semaine. »",
    },
    check: q(
      "Pourquoi formuler des hypothèses à voix haute ?",
      [
        "Pour impressionner",
        "Pour montrer ton raisonnement et permettre au recruteur de le corriger ou de le compléter",
        "Pour gagner du temps",
      ],
      1,
      "Une hypothèse explicite rend ton raisonnement visible et ouvre le dialogue, comme avec un vrai client.",
    ),
    transfer: q(
      "Le recruteur répond « je ne sais pas » à une de tes questions. Que fais-tu ?",
      [
        "Tu bloques",
        "Tu poses une hypothèse raisonnable et tu continues, en la signalant",
        "Tu changes de sujet",
      ],
      1,
      "En mission aussi, certaines informations manquent : on pose une hypothèse explicite et on avance.",
    ),
    exam: q(
      "Comment conclure un cas pratique ?",
      [
        "Par une solution définitive",
        "Par une synthèse et des prochaines étapes concrètes",
        "En demandant si la réponse était bonne",
      ],
      1,
      "Une synthèse et des prochaines étapes montrent que tu sais transformer une analyse en action.",
    ),
    mission: {
      title: "Résous un cas comme en entretien.",
      context:
        "Cas : « Le directeur d’un réseau de 30 agences constate que les clients attendent trop longtemps leur devis. Il vous demande de l’aider. Comment procédez-vous ? »",
      prompts: [
        "Reformule l’enjeu et pose trois questions de clarification.",
        "Formule une hypothèse, ta démarche, et les prochaines étapes.",
      ],
      rubric: [
        "Je reformule l’enjeu et pose des questions ouvertes et factuelles.",
        "J’explicite une hypothèse, une démarche et des prochaines étapes.",
      ],
      example:
        "Si je comprends bien, l’enjeu est le délai entre la demande et l’envoi du devis. Questions : quel est le délai actuel et la cible ? Toutes les agences sont-elles concernées ? Quelles étapes composent la préparation d’un devis ? Hypothèse : le devis attend une validation au siège. Démarche : mesurer le délai par étape sur un échantillon de dossiers, observer deux agences, comparer les plus rapides et les plus lentes. Prochaine étape : un entretien avec le directeur et l’accès aux données de délai cette semaine.",
      checks: [
        {
          model:
            "Si je comprends bien, l’enjeu est le délai entre la demande et l’envoi du devis. Quel est le délai actuel et la cible ? Toutes les agences sont-elles concernées ? Quelles étapes composent la préparation d’un devis ?",
          criteria: [
            c(
              "Une reformulation",
              ["si je comprends|l'enjeu|reformul|autrement dit|l'objectif est"],
              "Commence par reformuler l’enjeu.",
            ),
            c(
              "Des questions factuelles",
              ["\\?[\\s\\S]*\\?"],
              "Pose au moins deux questions.",
            ),
          ],
        },
        {
          model:
            "Hypothèse : le devis attend une validation au siège. Démarche : mesurer le délai par étape, observer deux agences. Prochaine étape : un entretien avec le directeur cette semaine.",
          criteria: [
            c(
              "Une hypothèse explicite",
              ["hypothese|je suppose|il est possible|peut-etre|piste"],
              "Formule une hypothèse.",
            ),
            c(
              "Une démarche",
              ["mesur|observ|entretien|analys|donnees|compar|atelier"],
              "Décris comment tu vérifierais.",
            ),
            c(
              "Des prochaines étapes",
              ["prochaine|d'abord|premiere etape|cette semaine|ensuite"],
              "Termine par une action concrète.",
            ),
          ],
          avoid: [
            {
              patterns: ["^[^?]*(changer d'outil|nouveau logiciel|acheter)"],
              message:
                "Proposer une solution d’emblée : commence par comprendre le problème.",
            },
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Reformuler et questionner d’abord",
        ["reformul|question"],
        "Rappelle le début de la démarche.",
      ),
      c(
        "Poser des hypothèses explicites",
        ["hypothese"],
        "Mentionne les hypothèses.",
      ),
      c(
        "Conclure par des prochaines étapes",
        ["prochaine|etape|action"],
        "Ajoute la conclusion.",
      ),
    ],
    cards: [
      {
        front: "Les cinq temps d’un cas pratique ?",
        back: "Reformuler, questionner, poser des hypothèses, proposer une démarche, conclure par des prochaines étapes.",
      },
      {
        front: "Que faire si une information manque ?",
        back: "Poser une hypothèse raisonnable, la signaler explicitement, et continuer.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras aborder un cas pratique inconnu avec une démarche structurée, à voix haute.",
      prerequisites: ["Socle BA, chapitre 1 : du problème au besoin."],
      sections: [
        {
          heading: "Ce que le recruteur évalue",
          paragraphs: [
            "Dans un cas pratique, il n’existe pas une bonne réponse. Le recruteur observe si tu fais le travail d’un BA : comprendre avant de proposer, chercher des faits, rendre ton raisonnement visible et transformer l’analyse en action.",
          ],
          diagram: {
            kind: "flow",
            title: "La démarche en cinq temps",
            steps: [
              {
                label: "Reformuler",
                note: "L’enjeu, en une phrase",
                tone: "apricot",
              },
              { label: "Questionner", note: "Faits, chiffres, périmètre" },
              {
                label: "Hypothèses",
                note: "Explicites, à vérifier",
                tone: "marker",
              },
              { label: "Démarche", note: "Comment vérifier et agir" },
              {
                label: "Conclure",
                note: "Synthèse et prochaines étapes",
                tone: "sky",
              },
            ],
            caption: "C’est la démarche d’une vraie mission, en accéléré.",
          },
        },
        {
          heading: "Penser à voix haute",
          paragraphs: [
            "Annonce ta structure (« je vais d’abord clarifier, puis proposer une démarche »), puis déroule-la. Si une information manque, pose une hypothèse explicite et continue : c’est exactement ce qu’on attend en mission.",
            "Évite de te précipiter sur une solution. Proposer « changer d’outil » en première phrase montre l’inverse du réflexe BA.",
          ],
          keyPoint:
            "Une hypothèse explicite vaut mieux qu’un silence ou qu’une certitude.",
        },
      ],
      workedExample: {
        title: "Les devis trop lents",
        situation:
          "Un directeur de 30 agences constate que les clients attendent trop leur devis.",
        steps: [
          {
            label: "Reformuler",
            detail:
              "« L’enjeu est le délai entre la demande et l’envoi du devis. »",
          },
          {
            label: "Questionner",
            detail:
              "Délai actuel et cible ? Toutes les agences ? Quelles étapes ? Quels types de devis ?",
          },
          {
            label: "Hypothèses",
            detail:
              "Une validation au siège, ou des informations techniques manquantes à la prise de demande.",
          },
          {
            label: "Démarche",
            detail:
              "Mesurer le délai par étape sur 50 dossiers, observer une agence rapide et une lente.",
          },
          {
            label: "Conclure",
            detail:
              "« Première étape : un entretien avec vous et l’accès aux données de délai cette semaine. »",
          },
        ],
        outcome:
          "En cinq minutes, le recruteur a vu la démarche complète d’un BA.",
      },
      pitfalls: [
        {
          confusion: "Proposer une solution immédiatement.",
          correction: "Commence par comprendre : reformule et questionne.",
          counterExample:
            "« Il faut un nouveau logiciel de devis » : le vrai problème était une validation au siège.",
        },
        {
          confusion: "Se bloquer quand une information manque.",
          correction: "Pose une hypothèse explicite et avance.",
          counterExample:
            "« Je ne peux pas répondre sans données » met fin à l’exercice.",
        },
      ],
      summary: [
        "Reformuler, questionner, hypothèses, démarche, prochaines étapes.",
        "Penser à voix haute et annoncer sa structure.",
        "Une information manquante devient une hypothèse explicite.",
        "Ne pas se précipiter sur une solution.",
      ],
      glossary: [
        {
          term: "Cas pratique",
          definition:
            "Exercice où l’on résout un problème inconnu devant le recruteur.",
        },
        {
          term: "Hypothèse",
          definition:
            "Supposition explicite, à vérifier, qui permet d’avancer.",
        },
        {
          term: "Prochaine étape",
          definition: "Action concrète et datée qui conclut une analyse.",
        },
      ],
    },
    caseStep: {
      title: "Dossier entretien · Le cas Maison Lumen",
      context:
        "En entretien chez Maison Lumen, la directrice te dit : « Nos clients appellent sans arrêt pour savoir où est leur commande. Qu’est-ce que vous feriez ? »",
      prompts: [
        "Reformule, puis pose trois questions de clarification.",
        "Formule deux hypothèses, ta démarche et la première étape concrète.",
      ],
      criteria: [
        ["Reformulation", "Questions factuelles"],
        [
          "Hypothèses explicites",
          "Démarche de vérification",
          "Première étape datée",
        ],
      ],
      models: [
        "Si je comprends bien, l’enjeu est le volume d’appels sur le suivi. Combien d’appels par semaine, et quelle part sur le suivi ? À quel moment de la commande appellent-ils ? Que voit aujourd’hui le client après sa commande ?",
        "Hypothèses : le client n’est informé de rien entre le paiement et la livraison ; les commandes attendent entre le service client et l’entrepôt. Démarche : analyser les motifs d’appel sur deux semaines et mesurer les délais par étape. Première étape : écouter des appels avec le service client dès cette semaine.",
      ],
    },
  },
  {
    id: "ent-questions",
    title: "Les questions techniques, et les tiennes.",
    subtitle: "Répondre aux questions de métier et poser les bonnes questions.",
    skill: "Répondre et questionner en entretien",
    recall: q(
      "« Quelle différence entre MOA et MOE ? » Quelle réponse est la plus convaincante ?",
      [
        "Une définition récitée",
        "Une définition courte suivie d’un exemple vécu",
        "« Ça dépend des entreprises »",
      ],
      1,
      "Définir puis illustrer montre que tu maîtrises la notion et que tu l’as pratiquée.",
    ),
    paragraphs: [
      "Les questions techniques reviennent souvent : MOA/MOE, user story et critères d’acceptation, recette, priorisation, BPMN, SQL. Réponds en trois temps : définition courte, exemple concret, nuance ou limite.",
      "En fin d’entretien, tes questions comptent autant que tes réponses : elles montrent que tu comprends le métier et t’aident à juger le poste.",
    ],
    takeaway:
      "Définir, illustrer, nuancer ; puis poser des questions qui révèlent le vrai poste.",
    example: {
      context: "« Comment priorisez-vous un backlog ? »",
      before: "« Je mets les plus importantes en premier. »",
      after:
        "« Je relie chaque élément à l’objectif, j’estime valeur et effort, et j’utilise MoSCoW ou un score comme RICE pour en discuter. Sur un projet, cela a permis de reporter douze demandes en version 2 en une séance. La décision revient au Product Owner ou au sponsor : je l’éclaire. »",
    },
    check: q(
      "Quelle question à poser au recruteur révèle le mieux la réalité du poste ?",
      [
        "« Quels sont les horaires ? »",
        "« Le poste est-il rattaché au métier ou à la DSI, et qui valide les besoins ? »",
        "« L’entreprise est-elle connue ? »",
      ],
      1,
      "Rattachement et circuit de décision révèlent la nature réelle du poste, bien plus que l’intitulé.",
    ),
    transfer: q(
      "On te pose une question technique dont tu ne connais pas la réponse. Que fais-tu ?",
      [
        "Tu inventes une réponse",
        "Tu dis honnêtement ce que tu sais, comment tu chercherais, et tu relies à une compétence proche",
        "Tu changes de sujet",
      ],
      1,
      "L’honnêteté et la démarche d’apprentissage rassurent davantage qu’une réponse inventée, vite repérée.",
    ),
    exam: q(
      "Quelle structure de réponse convient aux questions techniques ?",
      [
        "Définition, exemple vécu, nuance",
        "Anecdote longue sans définition",
        "Liste d’outils",
      ],
      0,
      "Définir prouve la connaissance, l’exemple prouve la pratique, la nuance prouve la maturité.",
    ),
    mission: {
      title: "Réponds et questionne.",
      context:
        "Fin d’entretien pour un poste de BA. Le manager te demande : « Quelle différence faites-vous entre un Business Analyst et un Product Owner ? », puis « Avez-vous des questions ? »",
      prompts: [
        "Réponds à la question BA / Product Owner en trois temps : définition, exemple, nuance.",
        "Écris trois questions à poser au manager pour comprendre le poste réel.",
      ],
      rubric: [
        "Ma réponse définit, illustre et nuance.",
        "Mes questions portent sur le rattachement, les décisions et la réussite du poste.",
      ],
      example:
        "Le Product Owner est responsable de la valeur du produit et de l’ordre du backlog ; le BA analyse le besoin et le traduit en exigences testables. Par exemple, sur un projet, le PO arbitrait les priorités pendant que je rédigeais les user stories et préparais la recette. Dans beaucoup d’équipes, une seule personne porte les deux rôles : l’important est de savoir qui décide. Questions : le poste est-il rattaché au métier ou à la DSI ? Qui valide les besoins et arbitre les priorités ? Comment saurez-vous dans six mois que ce recrutement est une réussite ?",
      checks: [
        {
          model:
            "Le Product Owner est responsable de la valeur et de l’ordre du backlog ; le BA analyse le besoin et le traduit en exigences testables. Par exemple, le PO arbitrait les priorités pendant que je rédigeais les user stories. Dans beaucoup d’équipes, une seule personne porte les deux rôles.",
          criteria: [
            c(
              "Définition des deux rôles",
              [
                "(product owner|\\bpo\\b)[\\s\\S]*(\\bba\\b|business analyst)|(\\bba\\b|business analyst)[\\s\\S]*(product owner|\\bpo\\b)",
              ],
              "Définis le PO et le BA.",
            ),
            c(
              "Un exemple",
              [
                "par exemple|sur un projet|lors|quand j|j'ai|je redigeais|dans ma",
              ],
              "Illustre par un exemple vécu.",
            ),
            c(
              "Une nuance",
              [
                "beaucoup d'equipes|parfois|selon|depend|souvent|meme personne|les deux roles|cumul",
              ],
              "Ajoute une nuance.",
            ),
          ],
        },
        {
          model:
            "Le poste est-il rattaché au métier ou à la DSI ? Qui valide les besoins et arbitre les priorités ? Comment saurez-vous dans six mois que ce recrutement est une réussite ?",
          criteria: [
            c(
              "Rattachement ou organisation",
              ["rattach|metier|dsi|equipe|organisation|reporte"],
              "Demande le rattachement du poste.",
            ),
            c(
              "Circuit de décision",
              ["valide|decid|arbitr|prior"],
              "Demande qui décide.",
            ),
            c(
              "Critère de réussite",
              ["reussite|succes|objectif|attente|six mois|indicateur|reussi"],
              "Demande comment la réussite sera mesurée.",
            ),
          ],
        },
      ],
    },
    keyIdeas: [
      c(
        "Définir, illustrer, nuancer",
        ["defin|illustr|exemple|nuanc"],
        "Rappelle la structure de réponse.",
      ),
      c(
        "Poser des questions sur le rattachement et les décisions",
        ["rattach|decid|valide"],
        "Mentionne les bonnes questions.",
      ),
      c(
        "Rester honnête sur ce qu’on ne sait pas",
        ["honnet|ne sais pas|cherch|apprendre"],
        "Ajoute l’honnêteté.",
      ),
    ],
    cards: [
      {
        front: "Structure d’une réponse technique ?",
        back: "Définition courte, exemple vécu, nuance ou limite.",
      },
      {
        front: "Trois questions à poser en fin d’entretien ?",
        back: "Le rattachement (métier ou DSI) ; qui valide et arbitre ; comment sera mesurée la réussite du poste dans six mois.",
      },
    ],
    chapter: {
      objective:
        "À la fin de ce chapitre, tu sauras répondre aux questions techniques fréquentes avec une structure claire, et poser les questions qui révèlent le vrai poste.",
      prerequisites: [
        "Les chapitres du socle BA, à réviser avant l’entretien.",
      ],
      sections: [
        {
          heading: "Les questions techniques qui reviennent",
          paragraphs: [
            "Les recruteurs vérifient les fondamentaux : MOA et MOE, user story et critères d’acceptation, recette, priorisation, lecture d’un schéma BPMN, notions de SQL ou d’API selon l’orientation du poste. Réponds en trois temps : une définition courte, un exemple vécu, une nuance.",
          ],
          diagram: {
            kind: "table",
            title: "Questions fréquentes et éléments de réponse",
            columns: ["Question", "Définition clé", "Nuance à ajouter"],
            rows: [
              [
                "MOA ou MOE ?",
                "Propriétaire du besoin / réalisateur",
                "Le rattachement change le poste réel",
              ],
              [
                "Une bonne user story ?",
                "Rôle, action, bénéfice + critères testables",
                "Prévoir les cas d’erreur",
              ],
              [
                "Comment prioriser ?",
                "Objectif, valeur, effort, MoSCoW ou RICE",
                "Le BA éclaire, le PO ou sponsor décide",
              ],
              [
                "Qu’est-ce que la recette ?",
                "Validation par le métier avant mise en production",
                "Recette réussie ≠ valeur obtenue",
              ],
              [
                "BA ou Product Owner ?",
                "Analyse et spécifie / porte la valeur et le backlog",
                "Souvent cumulés, responsabilités distinctes",
              ],
            ],
            caption:
              "Chaque ligne renvoie à un chapitre de l’app : à relire la veille.",
          },
        },
        {
          heading: "Quand tu ne sais pas",
          paragraphs: [
            "Il arrive qu’une question dépasse tes connaissances. Dis ce que tu sais, comment tu chercherais, et relie à une compétence proche : « je n’ai pas utilisé cet outil, mais j’ai modélisé des processus en BPMN avec un autre ; je m’y formerais en quelques jours ». Une réponse inventée se repère vite et coûte plus cher qu’un aveu bien formulé.",
          ],
          keyPoint:
            "L’honnêteté assortie d’une démarche rassure plus qu’une réponse inventée.",
        },
        {
          heading: "Tes questions en fin d’entretien",
          paragraphs: [
            "Tes questions montrent que tu comprends le métier et t’aident à juger le poste. Les plus révélatrices portent sur le rattachement (métier ou DSI), le circuit de décision (qui valide, qui arbitre), les livrables attendus et la définition de la réussite dans six mois.",
            "Écoute les signaux d’alerte : personne ne sait qui décide, le BA « fait aussi un peu de développement », ou la réussite se résume à « livrer vite ».",
          ],
        },
      ],
      workedExample: {
        title: "BA ou Product Owner ?",
        situation:
          "Le manager demande la différence entre BA et Product Owner, puis si tu as des questions.",
        steps: [
          {
            label: "Définir",
            detail:
              "Le PO porte la valeur et l’ordre du backlog ; le BA analyse le besoin et le traduit en exigences testables.",
          },
          {
            label: "Illustrer",
            detail:
              "« Sur un projet, le PO arbitrait pendant que je rédigeais les stories et préparais la recette. »",
          },
          {
            label: "Nuancer",
            detail:
              "« Souvent, une même personne cumule : l’important est de clarifier qui décide. »",
          },
          {
            label: "Questionner",
            detail:
              "Rattachement, circuit de décision, critère de réussite à six mois.",
          },
        ],
        outcome:
          "La réponse montre la maîtrise des rôles ; les questions montrent la maturité et donnent l’information pour choisir.",
      },
      pitfalls: [
        {
          confusion: "Réciter une définition apprise par cœur.",
          correction: "Ajoute un exemple vécu et une nuance.",
          counterExample:
            "Une définition parfaite du RACI, mais incapable de dire quand tu l’as utilisé.",
        },
        {
          confusion: "Ne poser aucune question.",
          correction:
            "Prépare trois questions sur le rattachement, la décision et la réussite.",
          counterExample:
            "« Non, tout est clair » : le recruteur doute de ton intérêt, et tu n’as rien appris du poste.",
        },
      ],
      summary: [
        "Réponse technique : définition, exemple vécu, nuance.",
        "Si tu ne sais pas : honnêteté, démarche, compétence proche.",
        "Questions à poser : rattachement, décision, livrables, réussite à six mois.",
        "Repérer les signaux d’alerte du poste.",
      ],
      glossary: [
        {
          term: "Question technique",
          definition:
            "Question qui vérifie la maîtrise d’une notion du métier.",
        },
        {
          term: "Signal d’alerte",
          definition:
            "Indice que le poste réel diffère de l’annonce ou manque de cadre.",
        },
        {
          term: "Critère de réussite",
          definition:
            "Ce qui permettra de dire, après quelques mois, que le recrutement est réussi.",
        },
      ],
    },
    caseStep: {
      title: "Dossier entretien · La fin d’entretien chez Maison Lumen",
      context:
        "La directrice de Maison Lumen te demande : « Comment vous assureriez-vous qu’une fonctionnalité livrée apporte vraiment de la valeur ? », puis « Avez-vous des questions ? »",
      prompts: [
        "Réponds à la question en trois temps : définition, exemple, nuance.",
        "Pose trois questions adaptées à Maison Lumen et à ce poste.",
      ],
      criteria: [
        [
          "Indicateur défini avant la livraison",
          "Mesure après la mise en production",
          "Nuance",
        ],
        ["Rattachement ou organisation", "Décision", "Réussite du poste"],
      ],
      models: [
        "La valeur se vérifie avec l’indicateur fixé au cadrage, mesuré avant et après la livraison. Par exemple, pour une notification d’expédition, je comparerais les appels liés au suivi un mois avant et un mois après. Nuance : une recette réussie ne garantit pas la valeur ; si l’indicateur ne bouge pas, on cherche pourquoi (usage, moment d’envoi).",
        "Le BA est-il rattaché à vous directement ou à un prestataire informatique ? Qui arbitre entre les demandes du service client et de l’entrepôt ? Quels résultats attendez-vous de ce poste à la fin de la saison des fêtes ?",
      ],
    },
  },
];

export const entretiensCourse: Course = {
  id: "ba-entretiens",
  title: "Préparation aux entretiens",
  eyebrow: "Spécialisation",
  color: "peach",
  icon: "globe",
  description:
    "Se présenter en 90 secondes, raconter avec la méthode STAR, résoudre un cas en direct et poser les bonnes questions.",
  lessons,
  caseStudy: {
    name: "Maison Lumen",
    pitch:
      "Maison Lumen recrute un Business Analyst pour la refonte de son traitement des commandes : tu prépares ton entretien de bout en bout.",
  },
  sources: [
    {
      title: "IIBA · Business Analyst career road map",
      url: "https://www.iiba.org/career-resources/develop-your-business-analysis-career/business-analyst-career-road-map/",
    },
  ],
};
