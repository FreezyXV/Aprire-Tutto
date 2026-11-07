import type { CaseStep } from "@/lib/types";

/*
 * Running case study (practice level 3): one fictional company, one BA file
 * built chapter after chapter. Corrected by the AI; the model answers are the
 * offline fallback.
 */
const COMPANY =
  "Maison Lumen vend des luminaires en ligne (25 salariés, 1 200 commandes par mois). Le service client, l’entrepôt et un transporteur se partagent le traitement des commandes.";

export const baCase: {
  name: string;
  pitch: string;
  steps: Record<string, CaseStep>;
} = {
  name: "Maison Lumen",
  pitch: `${COMPANY} Les retards et les appels se multiplient. Tu es la ou le BA de la mission : à chaque chapitre, tu construis une partie du dossier.`,
  steps: {
    "ba-besoin": {
      title: "Dossier 1 · Le vrai besoin derrière « un nouvel ERP »",
      context: `${COMPANY} La directrice te dit : « Il nous faut un nouvel ERP, on n’arrive plus à suivre. » Tu sais seulement qu’une commande sur six génère un appel du client et qu’une commande met en moyenne 3 jours à partir de l’entrepôt.`,
      prompts: [
        "Quelles trois questions poses-tu pour comprendre le problème avant de parler d’ERP ? Justifie chacune en une phrase.",
        "Formule le besoin principal sans nommer de solution, avec un indicateur et une cible.",
      ],
      criteria: [
        [
          "Questions ouvertes et factuelles",
          "Elles portent sur les causes des appels et des délais",
          "Chaque question est justifiée",
        ],
        [
          "Un bénéficiaire et un résultat observable",
          "Un indicateur chiffré avec une cible",
          "Aucune solution imposée (pas d’ERP, d’outil)",
        ],
      ],
      models: [
        "1) « Pour quelles raisons les clients appellent-ils, et à quel moment de leur commande ? » : savoir si les appels viennent du manque d’information ou d’erreurs. 2) « Où une commande attend-elle pendant ces 3 jours ? » : localiser le blocage entre service client et entrepôt. 3) « Que se passe-t-il quand une commande pose problème (adresse, rupture) ? » : faire émerger les exceptions qui coûtent du temps.",
        "Permettre aux clients de connaître à tout moment l’état de leur commande et recevoir leur colis plus vite : passer de 3 jours à 1 jour entre paiement et expédition, et diviser par deux les appels liés au suivi, sans dégrader le contrôle des adresses.",
      ],
    },
    "ba-acteurs": {
      title: "Dossier 2 · Qui associer, et comment",
      context: `${COMPANY} Tu dois organiser le recueil des besoins. La directrice veut aller vite. L’entrepôt travaille de 6 h à 14 h, le service client de 9 h à 18 h. Le transporteur est un prestataire externe. La comptabilité gère les remboursements.`,
      prompts: [
        "Liste au moins quatre parties prenantes et indique pour chacune la stratégie d’engagement (impliquer, tenir satisfait, tenir informé, surveiller) avec une justification.",
        "Comment recueilles-tu le vécu de l’entrepôt malgré les horaires décalés ? Propose une technique et ta première question.",
      ],
      criteria: [
        [
          "Au moins quatre parties prenantes pertinentes",
          "Une stratégie par partie prenante",
          "Justification par le pouvoir ou l’intérêt",
        ],
        [
          "Une technique adaptée aux horaires",
          "Une question ouverte qui fait raconter un cas réel",
        ],
      ],
      models: [
        "Directrice : impliquer étroitement (elle décide et finance). Service client : impliquer, car il subit les appels et connaît les motifs. Entrepôt : impliquer, car le délai se joue chez lui. Comptabilité : tenir satisfaite, elle peut bloquer les remboursements. Transporteur : tenir informé, ses statuts alimentent le suivi. Clients : tenir informés et écouter via les réclamations.",
        "Observation sur place à 7 h pendant la préparation, puis un court entretien en fin de poste. Première question : « Racontez-moi la dernière commande qui a pris du retard chez vous : que s’est-il passé, étape par étape ? »",
      ],
    },
    "ba-roles": {
      title: "Dossier 3 · Ta place dans la mission",
      context: `${COMPANY} Tu interviens en AMOA pour la directrice. Le prestataire informatique, qui installera la solution, te demande de « paramétrer directement les écrans de commande, ce sera plus rapide ».`,
      prompts: [
        "Que réponds-tu au prestataire ? Explique la frontière de ton rôle et le risque de dire oui.",
        "Cite trois éléments que tu inscris dans la note de cadrage pour éviter ce glissement.",
      ],
      criteria: [
        [
          "Distinction entre AMOA (besoin, validation) et MOE (réalisation)",
          "Le risque de glissement est expliqué",
          "Une réponse constructive au prestataire",
        ],
        [
          "Périmètre ou responsabilités du rôle",
          "Qui décide et qui valide",
          "Livrables attendus",
        ],
      ],
      models: [
        "Je refuse poliment de paramétrer : mon rôle est d’exprimer et de valider le besoin pour Maison Lumen, la réalisation revient au prestataire (MOE). Si je paramètre, je deviens juge et partie : plus personne ne vérifie que l’écran répond au besoin. En revanche, je fournis des spécifications précises et je participe à la recette.",
        "Le périmètre de mon rôle (expression du besoin, spécifications, recette, pas de paramétrage) ; les responsabilités et la gouvernance : la directrice décide, je prépare, le prestataire réalise ; les livrables attendus et leurs validateurs (expression de besoin, spécifications, cahier de recette).",
      ],
    },
    "ba-exigences": {
      title: "Dossier 4 · Prévenir le client de l’expédition",
      context: `${COMPANY} Besoin validé : « Le client sait à tout moment où en est sa commande. » Première fonctionnalité retenue : informer le client quand son colis est expédié.`,
      prompts: [
        "Rédige la user story et deux critères d’acceptation au format « Étant donné / Quand / Alors », dont un cas d’erreur.",
        "Ajoute une exigence non fonctionnelle mesurable pour cette fonctionnalité.",
      ],
      criteria: [
        [
          "Story au format rôle / action / bénéfice",
          "Critères « Étant donné / Quand / Alors » observables",
          "Un cas d’erreur ou alternatif",
        ],
        [
          "Une qualité (délai, disponibilité, sécurité…)",
          "Une valeur mesurable",
        ],
      ],
      models: [
        "En tant que client, je veux être prévenu de l’expédition de ma commande, afin de savoir quand je serai livré. CA1 : Étant donné une commande payée, quand l’entrepôt valide l’expédition, alors le client reçoit un e-mail avec le numéro de suivi dans les 15 minutes. CA2 : Étant donné une adresse e-mail invalide, quand l’envoi échoue, alors l’échec est tracé et un SMS est envoyé.",
        "La notification part au plus tard 15 minutes après la validation de l’expédition, pour 99 % des commandes sur un mois.",
      ],
    },
    "ba-processus": {
      title: "Dossier 5 · Où la commande attend-elle ?",
      context: `${COMPANY} Existant observé : la commande est payée en ligne ; le service client vérifie l’adresse à la main le lendemain ; il imprime un bon et le dépose à l’entrepôt ; l’entrepôt prépare quand il trouve le bon ; le transporteur enlève à 16 h ; le client n’est informé de rien.`,
      prompts: [
        "Indique le déclencheur, le résultat attendu et le passage de relais le plus critique, en justifiant.",
        "Propose une cible qui garde la vérification d’adresse mais supprime l’attente.",
      ],
      criteria: [
        [
          "Déclencheur et résultat",
          "Le relais critique est nommé (service client → entrepôt)",
          "Justification par l’attente ou la perte d’information",
        ],
        [
          "La vérification d’adresse est conservée",
          "La transmission devient immédiate ou automatique",
          "Le client est informé",
        ],
      ],
      models: [
        "Déclencheur : commande payée. Résultat : colis remis au transporteur et client informé. Relais critique : service client → entrepôt, car le bon papier attend le lendemain puis peut se perdre ; c’est là que se jouent la plupart des 3 jours.",
        "La vérification d’adresse devient automatique au paiement, avec contrôle manuel seulement pour les adresses douteuses ; la commande validée apparaît immédiatement dans la file de l’entrepôt ; une notification informe le client à la validation et à l’expédition.",
      ],
    },
    "ba-prioriser": {
      title: "Dossier 6 · La prochaine version",
      context: `${COMPANY} L’équipe dispose d’un mois. Quatre demandes : A) vérification d’adresse automatique (valeur forte, 1 semaine) ; B) notification d’expédition (valeur forte, 1 semaine) ; C) programme de fidélité (valeur incertaine, 3 semaines) ; D) nouveau design de la page d’accueil (valeur faible, 2 semaines).`,
      prompts: [
        "Classe les quatre demandes en MoSCoW pour ce mois et justifie chaque catégorie.",
        "Que consignes-tu dans le journal de décisions, et qui arbitre ?",
      ],
      criteria: [
        [
          "A et B prioritaires (Must ou Should)",
          "Un Won’t explicite",
          "Justification par la valeur, l’effort ou l’objectif",
        ],
        [
          "Critères et hypothèses",
          "Le décideur est nommé (la directrice)",
          "La date ou la possibilité de revoir",
        ],
      ],
      models: [
        "Must : A et B, car elles traitent directement les retards et les appels, pour deux semaines d’effort. Could : D si du temps reste, valeur faible. Won’t ce mois-ci : C, valeur incertaine et trois semaines d’effort qui ne tiennent pas avec A et B ; à réévaluer avec des données.",
        "Le choix, les critères (impact sur les délais et les appels, effort, confiance), les hypothèses d’estimation, la décision de la directrice qui arbitre, la date, et la condition pour revoir C.",
      ],
    },
    "ba-data": {
      title: "Dossier 7 · Mesurer le délai d’expédition",
      context: `${COMPANY} La directrice veut suivre « les commandes expédiées vite ». Les données : date et heure de paiement, date et heure de remise au transporteur, statut (annulée, en attente de stock…).`,
      prompts: [
        "Définis l’indicateur de façon reproductible : formule, période et exclusions.",
        "Quelle décision cet indicateur doit-il éclairer ?",
      ],
      criteria: [
        [
          "Formule précise (délai paiement → remise au transporteur, seuil)",
          "Période de mesure",
          "Exclusions (annulations, ruptures…)",
        ],
        ["Une décision concrète", "Un seuil ou un déclencheur d’action"],
      ],
      models: [
        "Taux d’expédition en 24 h = commandes remises au transporteur moins de 24 heures après le paiement ÷ commandes payées sur la semaine × 100. Exclusions : commandes annulées ; commandes en attente de stock comptées à part ; heures du week-end neutralisées si l’entrepôt est fermé.",
        "Décider des renforts à l’entrepôt et de l’horaire d’enlèvement du transporteur : sous 85 % deux semaines de suite, la directrice déclenche un renfort ou un second enlèvement.",
      ],
    },
    "ba-recette": {
      title: "Dossier 8 · Recetter la notification d’expédition",
      context: `${COMPANY} La notification d’expédition est livrée en environnement de test. Tu prépares la recette avant la mise en production.`,
      prompts: [
        "Écris un cas de test nominal complet : prérequis, étapes, résultat attendu.",
        "Ajoute un cas alternatif, puis explique comment tu vérifieras la valeur un mois après la mise en production.",
      ],
      criteria: [
        [
          "Prérequis reproductibles",
          "Étapes claires",
          "Résultat attendu observable",
        ],
        [
          "Un cas alternatif pertinent",
          "Un indicateur de valeur relié au besoin",
        ],
      ],
      models: [
        "Prérequis : commande payée avec une adresse e-mail valide, préparée par l’entrepôt. Étapes : valider l’expédition dans l’outil de l’entrepôt. Résultat attendu : le client reçoit dans les 15 minutes un e-mail contenant le numéro de suivi et la date de livraison estimée.",
        "Cas alternatif : adresse e-mail invalide, l’échec est tracé et un SMS part. Valeur : comparer les appels liés au suivi et le délai paiement → expédition un mois après, par rapport à la situation de départ (une commande sur six générait un appel).",
      ],
    },
  },
};
