import type { Course, Lesson, Question } from "@/lib/types";
import { baGrading } from "./ba-grading";
const q = (
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): Question => ({ prompt, options, answer, explanation });
const lessons: Lesson[] = [
  {
    id: "ba-besoin",
    title: "Derrière la demande, le vrai besoin.",
    subtitle: "Faire la différence entre un problème et une solution.",
    skill: "Analyser un besoin",
    recall: q(
      "« Il nous faut une nouvelle application. » Qu’as-tu devant toi ?",
      [
        "Un besoin déjà validé",
        "Une solution proposée, à explorer",
        "Une exigence fonctionnelle complète",
      ],
      1,
      "La demande exprime un moyen. Il reste à comprendre le problème, les personnes concernées et le résultat attendu.",
    ),
    paragraphs: [
      "Un client demande souvent une solution avant de décrire son problème. Le premier travail du Business Analyst consiste à découvrir ce qu’il cherche réellement à améliorer.",
      "Distingue trois éléments : le problème observé, le besoin à satisfaire et la solution envisagée. « Nos clients attendent trop longtemps » décrit un problème. « Réduire leur attente » exprime un besoin. « Installer une borne » est une solution possible.",
      "Pose des questions sur les faits : qui est concerné, à quel moment, avec quel impact ? Puis cherche un résultat mesurable. Plusieurs solutions peuvent répondre au même besoin.",
    ],
    takeaway:
      "Commence par « Pourquoi ? » et « Pour qui ? », avant de décider « Comment ? ».",
    example: {
      context:
        "Une équipe commerciale perd du temps dans le suivi de ses prospects.",
      before: "« Nous devons acheter un nouveau CRM. »",
      after:
        "« Les commerciaux passent 45 minutes par jour à ressaisir les mêmes données. Nous voulons réduire ce temps à 10 minutes, sans perdre d’information. »",
    },
    check: q(
      "Quelle question poser en premier à ce client ?",
      [
        "Quel logiciel préférez-vous ?",
        "Quel problème cherchez-vous à résoudre, et pour qui ?",
        "Quel développeur est disponible ?",
      ],
      1,
      "On explore d’abord la situation et les personnes concernées. Le choix du logiciel intervient après cette compréhension.",
    ),
    transfer: q(
      "Une direction demande un tableau de bord. Quelle reformulation est la plus utile ?",
      [
        "Construire un tableau avec cinq graphiques",
        "Choisir les couleurs du tableau",
        "Identifier les décisions à prendre et les informations qui manquent",
      ],
      2,
      "La valeur d’un tableau de bord vient des décisions qu’il permet. Les graphiques sont un moyen, pas le besoin.",
    ),
    exam: q(
      "Un manager exige un chatbot pour réduire les réclamations. Quelle est ta première action ?",
      [
        "Rédiger les réponses du chatbot",
        "Mesurer les causes et le parcours des réclamations",
        "Comparer les fournisseurs de chatbot",
      ],
      1,
      "L’analyse des causes peut révéler qu’un chatbot ne traite pas le problème réel.",
    ),
    mission: {
      title: "Le client veut « refaire son outil ».",
      context:
        "Tu accompagnes une petite entreprise de livraison. La responsable t’annonce : « On doit refaire notre outil, les clients nous appellent tout le temps. » Tu prépares ton premier entretien.",
      prompts: [
        "Quelle question poses-tu pour comprendre le problème ?",
        "Quelle information chercherais-tu à mesurer ?",
        "Reformule un besoin sans imposer de solution.",
      ],
      rubric: [
        "Ma question est ouverte et cherche des faits.",
        "Mon indicateur décrit un impact observable.",
        "Mon besoin décrit un résultat, sans nommer un outil.",
      ],
      example:
        "« Pour quelles raisons les clients appellent-ils, et à quel moment de leur commande ? » Mesurer le nombre d’appels liés au statut de livraison. Besoin possible à confirmer : permettre au client de connaître la date de livraison sans contacter l’équipe.",
    },
    cards: [
      {
        front: "Quelle différence entre un besoin et une solution ?",
        back: "Le besoin décrit le résultat recherché. La solution décrit un moyen de l’obtenir. Un même besoin peut avoir plusieurs solutions.",
      },
      {
        front: "Quelles trois questions poser avant de choisir une solution ?",
        back: "Quel problème ? Pour qui ? Quel résultat observable ou mesurable voulons-nous obtenir ?",
      },
    ],
  },
  {
    id: "ba-acteurs",
    title: "Trouver les bonnes personnes.",
    subtitle: "Comprendre les parties prenantes et leurs intérêts.",
    skill: "Écouter les parties prenantes",
    recall: q(
      "Qui doit être écouté pour améliorer un outil ?",
      [
        "Seulement la personne qui paie",
        "Seulement les développeurs",
        "Les décideurs, utilisateurs et personnes affectées",
      ],
      2,
      "Les intérêts et les contraintes varient selon les acteurs. Une seule personne ne représente pas tous les besoins.",
    ),
    paragraphs: [
      "Une partie prenante est une personne ou un groupe concerné par le changement, capable de l’influencer ou affecté par ses résultats.",
      "Identifie les utilisateurs, le sponsor, les équipes techniques, le support et, selon le contexte, les experts conformité. Pour chacun : intérêt, influence, impact et disponibilité.",
      "Un atelier permet de confronter les points de vue. Un entretien individuel aide à comprendre une expérience précise. Confirme ensuite les conclusions avec les personnes concernées.",
    ],
    takeaway:
      "La personne qui commande, celle qui décide et celle qui utilise ne sont pas toujours la même.",
    example: {
      context: "Le déploiement d’un nouvel outil de livraison.",
      before: "« La direction a validé : tout le monde est d’accord. »",
      after:
        "« Le sponsor valide l’objectif ; les livreurs vérifient le parcours terrain ; le support décrit les incidents ; la DSI confirme les contraintes. »",
    },
    check: q(
      "Un utilisateur contredit le sponsor. Que faire ?",
      [
        "Ignorer l’utilisateur",
        "Documenter le désaccord et examiner les faits et impacts",
        "Décider seul qui a raison",
      ],
      1,
      "Le BA rend les différences visibles et facilite un arbitrage informé. Il ne remplace pas le décideur.",
    ),
    transfer: q(
      "Les opérateurs refusent le nouveau processus. Quelle action est la plus pertinente ?",
      [
        "Comprendre leurs contraintes et tester le processus avec eux",
        "Rendre la formation obligatoire immédiatement",
        "Supprimer les entretiens",
      ],
      0,
      "Le refus peut révéler des contraintes réelles. Les observer aide à améliorer la solution et à préparer le changement.",
    ),
    exam: q(
      "Quelle personne ajouter à un atelier de conception du parcours de réclamation ?",
      [
        "Uniquement le directeur financier",
        "Une personne du support traitant les réclamations",
        "Uniquement le fournisseur logiciel",
      ],
      1,
      "Le support apporte une connaissance directe des difficultés et cas particuliers.",
    ),
    mission: {
      title: "Prépare ton premier atelier.",
      context:
        "Une boutique veut améliorer les retours de commandes. Le directeur est disponible, mais les vendeurs et le service client travaillent sur des créneaux différents.",
      prompts: [
        "Quels trois acteurs inviter et pourquoi ?",
        "Quelle question poser à un utilisateur terrain ?",
        "Comment confirmer les conclusions après l’atelier ?",
      ],
      rubric: [
        "J’inclus un décideur et des personnes affectées.",
        "Ma question explore une expérience concrète.",
        "Je prévois une validation des conclusions.",
      ],
      example:
        "Inviter le responsable, un vendeur et un conseiller du service client. Demander : « Racontez-moi le dernier retour difficile. » Envoyer ensuite une synthèse des décisions et questions ouvertes à confirmer.",
    },
    cards: [
      {
        front: "Qu’est-ce qu’une partie prenante ?",
        back: "Une personne ou un groupe concerné, influent ou affecté par le changement.",
      },
    ],
  },
  {
    id: "ba-roles",
    title: "BA, MOA, AMOA : trouver sa place.",
    subtitle: "Distinguer les responsabilités au-delà des intitulés.",
    skill: "Se positionner",
    recall: q(
      "Le titre « Business Analyst » suffit-il à connaître les missions ?",
      [
        "Oui, elles sont identiques partout",
        "Non, il faut comprendre les responsabilités et le contexte",
        "Oui, si le poste est en informatique",
      ],
      1,
      "Le contenu réel dépend de l’organisation, des décisions confiées et des interlocuteurs.",
    ),
    paragraphs: [
      "La MOA porte les objectifs métier et la validation du besoin. L’AMOA l’accompagne dans l’analyse, la formalisation et le suivi. La MOE porte la réalisation de la solution.",
      "Le BA peut contribuer dans plusieurs contextes : métier, technico-fonctionnel, produit ou projet. Le rattachement donne des indices, mais les responsabilités doivent être clarifiées concrètement.",
      "Un Product Owner est responsable de la valeur et de la gestion efficace du backlog produit dans Scrum. Un chef de projet suit notamment les engagements du projet. Ces activités peuvent se recouper avec l’analyse métier sans être identiques.",
    ],
    takeaway:
      "Demande : quelles décisions, quels livrables, quels interlocuteurs et quelles limites ? ",
    example: {
      context: "Deux offres portent le même titre de Business Analyst.",
      before: "« Je peux en déduire exactement le travail attendu. »",
      after:
        "« La première insiste sur les ateliers métier ; la seconde sur les flux de données. Je clarifie le rôle, le rattachement et les livrables avant de me positionner. »",
    },
    check: q(
      "Quelle question aide le plus à comprendre un poste ?",
      [
        "Quel est l’intitulé exact sur le badge ?",
        "Quels livrables et décisions seront sous ma responsabilité ?",
        "Combien de réunions y a-t-il ?",
      ],
      1,
      "Les responsabilités réelles sont plus instructives qu’un intitulé.",
    ),
    transfer: q(
      "On te demande de trancher seul entre deux directions. Que fais-tu ?",
      [
        "Tu choisis la demande la plus récente",
        "Tu évites le sujet",
        "Tu compares les impacts et organises l’arbitrage avec le décideur désigné",
      ],
      2,
      "L’analyse éclaire l’arbitrage. L’autorité de décision doit être identifiée.",
    ),
    exam: q(
      "Quelle description correspond le mieux à une activité d’AMOA ?",
      [
        "Choisir seul l’architecture serveur",
        "Aider le métier à formaliser ses exigences et préparer la recette",
        "Garantir à elle seule la rentabilité",
      ],
      1,
      "L’AMOA accompagne la maîtrise d’ouvrage dans ses responsabilités métier.",
    ),
    mission: {
      title: "Décode une fiche de poste.",
      context:
        "Une offre mentionne : ateliers utilisateurs, spécifications d’interfaces, SQL, préparation de recette et échanges quotidiens avec les développeurs.",
      prompts: [
        "Quelle orientation semble dominante ?",
        "Quelle question poser sur le rattachement ?",
        "Quelle frontière de responsabilité clarifier ?",
      ],
      rubric: [
        "Je m’appuie sur les activités décrites.",
        "Je distingue rattachement et mission réelle.",
        "Je clarifie les décisions attendues.",
      ],
      example:
        "Orientation probablement technico-fonctionnelle, à confirmer. Qui valide les besoins ? Qui arbitre les changements ? Le poste inclut-il du développement ou seulement la spécification et la validation ?",
    },
    cards: [
      {
        front: "Que distinguent MOA, AMOA et MOE ?",
        back: "La MOA porte le besoin et les objectifs métier ; l’AMOA l’assiste ; la MOE porte la réalisation de la solution. Les responsabilités concrètes doivent être clarifiées.",
      },
    ],
  },
  {
    id: "ba-exigences",
    title: "Écrire pour être compris.",
    subtitle: "Transformer un besoin en exigence vérifiable.",
    skill: "Formaliser les exigences",
    recall: q(
      "« L’application doit être rapide » est-elle testable telle quelle ?",
      [
        "Oui",
        "Non, il manque une mesure et des conditions",
        "Seulement par un développeur senior",
      ],
      1,
      "Il faut définir l’action, le seuil, les conditions et la méthode de mesure.",
    ),
    paragraphs: [
      "Une exigence représente un besoin de façon exploitable. Elle doit être compréhensible, nécessaire, cohérente et vérifiable.",
      "Les exigences fonctionnelles décrivent ce que la solution fait. Les exigences non fonctionnelles précisent ses qualités ou contraintes, comme l’accessibilité ou les performances.",
      "Les critères d’acceptation rendent la validation observable. Le format « Étant donné / Quand / Alors » aide à préciser le contexte, l’action et le résultat, sans remplacer l’analyse des cas d’erreur.",
    ],
    takeaway:
      "Si deux personnes peuvent tester la phrase et conclure différemment, précise-la.",
    example: {
      context: "Une équipe veut accélérer la recherche de commandes.",
      before: "« La recherche doit être rapide. »",
      after:
        "« Pour 95 % des recherches par numéro de commande, le résultat s’affiche en moins de deux secondes, avec 100 utilisateurs simultanés dans l’environnement de test convenu. »",
    },
    check: q(
      "Quel critère d’acceptation est le plus clair ?",
      [
        "Le formulaire est intuitif",
        "Le formulaire fonctionne bien",
        "Si l’adresse est vide, la validation affiche « Adresse requise » et bloque l’envoi",
      ],
      2,
      "Le contexte et le résultat attendu sont observables.",
    ),
    transfer: q(
      "Une user story ne mentionne que le parcours réussi. Que compléter ?",
      [
        "Les couleurs de l’interface uniquement",
        "Les règles de gestion et les cas alternatifs ou d’erreur pertinents",
        "Le nom de tous les développeurs",
      ],
      1,
      "Les cas d’erreur et exceptions font partie de l’analyse nécessaire.",
    ),
    exam: q(
      "Quelle exigence est non fonctionnelle ?",
      [
        "Le client peut annuler une commande",
        "Le système calcule le prix TTC",
        "Le service doit être disponible selon un objectif mesurable défini",
      ],
      2,
      "La disponibilité est une qualité attendue du système.",
    ),
    mission: {
      title: "Rends une demande testable.",
      context:
        "Le client souhaite : « Être averti suffisamment tôt si sa livraison est en retard. » Les délais exacts restent à négocier.",
      prompts: [
        "Quelles informations manquent ?",
        "Propose un critère d’acceptation avec tes hypothèses explicites.",
        "Quel cas d’erreur faut-il prévoir ?",
      ],
      rubric: [
        "Je signale mes hypothèses au lieu de les présenter comme validées.",
        "Mon résultat est observable.",
        "J’ai considéré une exception.",
      ],
      example:
        "À confirmer : définition du retard, canal et délai d’alerte. Hypothèse : si l’heure estimée dépasse le créneau confirmé de 30 minutes, envoyer une notification. Prévoir un numéro de téléphone invalide et une livraison finalement annulée.",
    },
    cards: [
      {
        front: "Quels sont les trois éléments de Given / When / Then ?",
        back: "Étant donné un contexte, quand une action ou un événement arrive, alors un résultat observable est attendu.",
      },
    ],
  },
  {
    id: "ba-processus",
    title: "Voir le parcours dans son ensemble.",
    subtitle: "Observer l’existant avant de dessiner la cible.",
    skill: "Analyser un processus",
    recall: q(
      "Que représente un processus « As-Is » ?",
      [
        "Le fonctionnement actuel",
        "La solution idéale",
        "Une liste de logiciels",
      ],
      0,
      "As-Is décrit l’existant. To-Be représente une cible envisagée.",
    ),
    paragraphs: [
      "Un processus relie des activités à un résultat pour un acteur. Commence par son déclencheur, ses étapes, ses acteurs et son résultat.",
      "Observe le fonctionnement réel, y compris les contournements, attentes et exceptions. Un processus officiel peut différer de ce qui se passe sur le terrain.",
      "La cible To-Be doit répondre aux problèmes observés. BPMN fournit une notation pour représenter les événements, tâches et décisions. Une approche orientée processus peut servir la qualité, l’efficacité ou la conformité.",
    ],
    takeaway:
      "Une carte utile rend visibles les décisions, les passages de relais et les exceptions.",
    example: {
      context: "Une demande de remboursement traverse plusieurs équipes.",
      before: "« Le traitement prend trop de temps. »",
      after:
        "« Le dossier attend trois jours entre la vérification du support et l’accord du responsable. Ce passage de relais est un point à investiguer. »",
    },
    check: q(
      "Quelle étape précède une proposition de processus cible ?",
      [
        "Acheter un outil de dessin",
        "Comprendre les étapes actuelles et leurs difficultés",
        "Supprimer toutes les validations",
      ],
      1,
      "Il faut comprendre l’existant et ses raisons avant de le transformer.",
    ),
    transfer: q(
      "Une validation semble inutile. Que vérifier avant de la supprimer ?",
      [
        "Uniquement son nom",
        "Sa couleur dans le diagramme",
        "Sa finalité, ses risques et les obligations qu’elle peut couvrir",
      ],
      2,
      "Une étape peut couvrir un risque ou une obligation invisible au premier regard.",
    ),
    exam: q(
      "Le processus documenté diffère de la pratique. Quelle réaction choisir ?",
      [
        "Corriger immédiatement les utilisateurs",
        "Observer les écarts et comprendre leurs causes",
        "Ignorer la documentation",
      ],
      1,
      "Les écarts révèlent souvent des contraintes ou des améliorations informelles.",
    ),
    mission: {
      title: "Repère un passage de relais.",
      context:
        "Le support reçoit un retour, le magasin contrôle le produit, la comptabilité rembourse. Le client n’a aucune information entre les étapes.",
      prompts: [
        "Quel est le déclencheur et le résultat attendu ?",
        "Quel passage de relais examiner ?",
        "Quelle amélioration tester sans supprimer un contrôle utile ?",
      ],
      rubric: [
        "Je définis les limites du processus.",
        "Je décris un point de rupture concret.",
        "Je relie l’amélioration au besoin.",
      ],
      example:
        "Déclencheur : demande de retour acceptée. Résultat : remboursement et information du client. Tester une transmission du statut de contrôle à la comptabilité et au client, avec un responsable et une date.",
    },
    cards: [
      {
        front: "Quelle différence entre As-Is et To-Be ?",
        back: "As-Is : fonctionnement actuel observé. To-Be : fonctionnement cible proposé pour atteindre les objectifs.",
      },
    ],
  },
  {
    id: "ba-prioriser",
    title: "Choisir ce qui compte vraiment.",
    subtitle: "Rendre les arbitrages explicites.",
    skill: "Prioriser par la valeur",
    recall: q(
      "Toutes les demandes sont « urgentes ». Que manque-t-il ?",
      [
        "Une police plus grande",
        "Des critères partagés de priorité",
        "Plus de demandes",
      ],
      1,
      "Les critères permettent de comparer la valeur, le risque, l’effort et les dépendances.",
    ),
    paragraphs: [
      "Prioriser consiste à décider ce qui doit être traité maintenant, plus tard ou pas du tout, en fonction d’un objectif.",
      "MoSCoW distingue Must, Should, Could et Won’t pour un périmètre ou une période donnée. Un Must doit avoir une justification réelle ; sinon tout devient indispensable.",
      "Le BA rend les critères, impacts et dépendances visibles. Le décideur compétent arbitre. Documente le choix pour pouvoir le revoir quand les conditions changent.",
    ],
    takeaway:
      "Une priorité n’a de sens qu’avec un objectif, des critères et un horizon.",
    example: {
      context: "Le lancement d’un service approche.",
      before: "« Tout est Must Have. »",
      after:
        "« Le paiement sécurisé est indispensable au lancement. La personnalisation du profil peut attendre la version suivante. »",
    },
    check: q(
      "Dans MoSCoW, « Won’t » signifie généralement…",
      [
        "Jamais, quoi qu’il arrive",
        "Hors du périmètre ou de la période considérée",
        "Techniquement impossible",
      ],
      1,
      "La décision est située dans un périmètre et un horizon ; elle peut être réexaminée.",
    ),
    transfer: q(
      "Une fonction très demandée dépend d’une donnée indisponible. Que faire ?",
      [
        "Ignorer la dépendance",
        "Promettre la livraison quand même",
        "Rendre la dépendance visible et adapter l’arbitrage",
      ],
      2,
      "La valeur ne suffit pas : faisabilité, dépendances et risques influencent l’ordre de réalisation.",
    ),
    exam: q(
      "Quel élément rend une priorité défendable ?",
      [
        "Le volume de messages du demandeur",
        "Un lien explicite avec la valeur et les contraintes",
        "L’ordre alphabétique",
      ],
      1,
      "Les critères et justifications doivent être partagés.",
    ),
    mission: {
      title: "Prépare un arbitrage.",
      context:
        "Tu as une semaine pour améliorer un site : corriger le paiement, ajouter des avatars ou améliorer le suivi de livraison. Aucun paiement ne fonctionne actuellement.",
      prompts: [
        "Quelle demande traiter en premier et pourquoi ?",
        "Quelle information manque pour classer les suivantes ?",
        "Comment documenter la décision ?",
      ],
      rubric: [
        "Je relie la priorité à un impact.",
        "J’explique une incertitude.",
        "Je conserve critères et décideur.",
      ],
      example:
        "Le paiement bloque la valeur principale. Pour les autres, mesurer l’impact sur les clients, l’effort et les dépendances. Consigner le choix, sa justification et la personne qui arbitre.",
    },
    cards: [
      {
        front: "Quelles dimensions comparer pour prioriser ?",
        back: "Valeur attendue, urgence réelle, risques, effort et dépendances, selon des critères convenus.",
      },
    ],
  },
  {
    id: "ba-data",
    title: "Faire parler les données.",
    subtitle: "Relier une mesure à une question métier.",
    skill: "Raisonner avec les données",
    recall: q(
      "Quel est le premier pas pour créer un indicateur utile ?",
      [
        "Choisir un graphique",
        "Définir la question ou la décision qu’il doit éclairer",
        "Exporter toutes les tables",
      ],
      1,
      "Un indicateur doit répondre à une question et soutenir une décision.",
    ),
    paragraphs: [
      "Un BA orienté données relie les questions métier aux définitions, sources, règles de transformation et contrôles de qualité.",
      "Définis chaque indicateur : formule, périmètre, période, exclusions et source. Sans définition commune, deux équipes peuvent afficher des chiffres différents tout en parlant du même sujet.",
      "SQL permet d’interroger les données ; une API permet à des systèmes d’échanger. Avant les outils, clarifie la signification des données et les cas particuliers.",
    ],
    takeaway:
      "Un chiffre devient utile quand sa définition et ses limites sont comprises.",
    example: {
      context:
        "Deux équipes annoncent un taux de livraison à l’heure différent.",
      before: "« L’un des tableaux de bord est faux. »",
      after:
        "« Vérifions si les deux calculs utilisent la même date promise, les mêmes commandes, la même période et les mêmes exclusions. »",
    },
    check: q(
      "Que faut-il préciser pour un taux de conversion ?",
      [
        "Seulement la couleur",
        "Le numérateur, le dénominateur, la période et le périmètre",
        "Uniquement le total des ventes",
      ],
      1,
      "La définition rend le calcul reproductible et comparable.",
    ),
    transfer: q(
      "Une jointure SQL double le total des commandes. Quelle piste vérifier ?",
      [
        "La relation entre les tables et la multiplicité des lignes",
        "Le nom de la colonne seulement",
        "La taille de l’écran",
      ],
      0,
      "Une relation un-à-plusieurs peut multiplier les lignes et donc les sommes.",
    ),
    exam: q(
      "Un champ « date de commande » n’est pas défini. Que demander ?",
      [
        "Sa couleur dans le logiciel",
        "L’événement exact, le fuseau et les règles de remplissage",
        "Qu’il soit toujours masqué",
      ],
      1,
      "La sémantique et les règles du champ conditionnent son usage fiable.",
    ),
    mission: {
      title: "Définis un indicateur.",
      context:
        "La responsable logistique veut suivre « les livraisons en retard » et comparer les transporteurs.",
      prompts: [
        "Propose une définition du retard.",
        "Quelles données et exclusions faut-il vérifier ?",
        "Quelle décision l’indicateur doit-il aider à prendre ?",
      ],
      rubric: [
        "Ma définition est reproductible.",
        "Je précise le périmètre et les limites.",
        "Je relie le chiffre à une décision.",
      ],
      example:
        "Comparer l’heure de livraison effective à la fin du créneau promis. Clarifier les annulations, fuseaux, absences client et volumes par transporteur avant de comparer les performances.",
    },
    cards: [
      {
        front: "Que contient la définition d’un KPI ?",
        back: "Son objectif, sa formule, sa source, sa période, son périmètre et ses exclusions.",
      },
    ],
  },
  {
    id: "ba-recette",
    title: "Vérifier que la promesse est tenue.",
    subtitle: "Relier les tests aux besoins et à la valeur.",
    skill: "Valider une solution",
    recall: q(
      "Un logiciel sans erreur technique répond-il forcément au besoin ?",
      [
        "Oui",
        "Non, il faut aussi valider les usages et résultats métier",
        "Oui, si le projet est agile",
      ],
      1,
      "La qualité technique est nécessaire mais ne prouve pas que la solution répond au besoin.",
    ),
    paragraphs: [
      "La recette métier vérifie que la solution répond aux exigences et permet les usages attendus. Elle s’appuie sur des scénarios représentatifs.",
      "Un cas de test précise les prérequis, étapes, données et résultats attendus. La traçabilité relie le besoin à l’exigence, puis à son test et son résultat.",
      "Après livraison, mesure les résultats réels. Une fonctionnalité acceptée peut ne pas produire la valeur attendue ; il faut alors comprendre pourquoi et ajuster.",
    ],
    takeaway:
      "Livrer une fonctionnalité est une étape. Vérifier son effet sur le besoin en est une autre.",
    example: {
      context: "Un SMS doit prévenir le client avant sa livraison.",
      before: "« Le développeur a testé l’envoi : c’est terminé. »",
      after:
        "« Testons le bon destinataire, le bon moment, les commandes annulées et les échecs ; puis mesurons si les appels de suivi diminuent. »",
    },
    check: q(
      "Quel lien doit-on retrouver dans un cas de test ?",
      [
        "Le besoin ou l’exigence vérifiée",
        "Le nombre de réunions",
        "La préférence du développeur",
      ],
      0,
      "La traçabilité explique ce que le test prouve et permet d’identifier les exigences non couvertes.",
    ),
    transfer: q(
      "Le produit est livré, mais l’indicateur ne s’améliore pas. Que faire ?",
      [
        "Clore l’analyse définitivement",
        "Examiner l’adoption, les hypothèses et les résultats réels",
        "Modifier uniquement le logo",
      ],
      1,
      "L’évaluation de la solution poursuit l’analyse de la valeur après la livraison.",
    ),
    exam: q(
      "Quelle information est indispensable pour conclure à la réussite d’un test ?",
      [
        "Un résultat attendu défini avant son exécution",
        "Le ressenti global du testeur",
        "Une capture de l’écran d’accueil",
      ],
      0,
      "Une conclusion défendable compare le résultat obtenu à une attente explicite.",
    ),
    mission: {
      title: "Écris ton premier cas de recette.",
      context:
        "Un client doit recevoir un rappel 24 heures avant son rendez-vous. Aucun rappel ne doit être envoyé après annulation.",
      prompts: [
        "Décris les prérequis et une action.",
        "Quel résultat précis attends-tu ?",
        "Quel scénario complémentaire tester ?",
      ],
      rubric: [
        "Mes prérequis permettent de reproduire le test.",
        "Mon résultat attendu est observable.",
        "Je couvre un cas alternatif pertinent.",
      ],
      example:
        "Rendez-vous confirmé pour demain 10 h, numéro valide. Déclencher le traitement à 10 h aujourd’hui. Vérifier le destinataire et le contenu du rappel. Tester séparément une annulation avant le déclenchement.",
    },
    cards: [
      {
        front: "À quoi sert la traçabilité des exigences ?",
        back: "À relier le besoin, l’exigence, sa réalisation et les tests, pour suivre les changements et vérifier la couverture.",
      },
    ],
  },
];
export const baCourse: Course = {
  id: "business-analysis",
  title: "Business Analysis",
  eyebrow: "Ton premier terrain d’exploration",
  color: "olive",
  icon: "compass",
  description:
    "Du besoin à la valeur. Construis les réflexes du métier, une situation concrète à la fois.",
  lessons: lessons.map((l) => ({
    ...l,
    mission: { ...l.mission, checks: baGrading[l.id]?.checks },
    keyIdeas: baGrading[l.id]?.keyIdeas,
  })),
  sources: [
    {
      title: "IIBA · The Business Analysis Standard",
      url: "https://www.iiba.org/knowledgehub/the-business-analysis-standard/",
    },
    {
      title: "IIBA · Rôles et parcours de Business Analyst",
      url: "https://www.iiba.org/career-resources/develop-your-business-analysis-career/business-analyst-career-road-map/",
    },
    {
      title: "Scrum Guide · Responsabilités du Product Owner",
      url: "https://scrumguides.org/scrum-guide.html",
    },
  ],
};
