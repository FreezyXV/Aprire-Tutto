# Aprire Tutto

Un espace personnel pour comprendre, pratiquer et retenir. Application web en français, pensée pour l’iPhone et utilisable sur ordinateur.

## Ce qui fonctionne

- Trois espaces qui partagent le même contenu et la même progression :
  - **Cours** : un chapitre de référence par leçon, en lecture libre — objectif et prérequis, explication progressive, schémas commentés placés près du texte, exemple entièrement expliqué, confusions fréquentes avec contre-exemples, fiche de synthèse, glossaire et sources. Reprise automatique à la section quittée ; bouton « Mettre en pratique » toujours disponible sans perdre la lecture.
  - **Pratique** : trois niveaux par chapitre — accompagné (exemple résolu pas à pas, questions avec indice), moins d’aide (exercice rédigé corrigé), autonomie (fil rouge « Maison Lumen » : un dossier BA construit chapitre après chapitre, corrigé par l’IA).
  - **Révisions** : cartes espacées.
  - La progression distingue lu, pratiqué (niveaux réussis) et révisé ; l’accueil propose de lire ou pratiquer selon le temps choisi.
- Schémas générés à partir de données (`src/components/diagram.tsx`) : flux, quadrant, tableau comparatif, couloirs, interface. Rendus en HTML/CSS, ils se réorganisent à la verticale sur iPhone, restent sélectionnables et disposent d’un équivalent texte.
- Cours BA : 8 chapitres originaux (`src/data/ba-chapters-*.ts`), fondés sur le référentiel privé du propriétaire (non publié, non recopié), l’IIBA, BPMN 2.0 et ISO/IEC 25010. Fil rouge : `src/data/ba-case.ts`.
- **Tout le contenu est rédigé dans l’app** (cours, schémas, exercices, fil rouge, grilles et réponses modèles) : aucun cours ni exercice n’est généré par l’IA. « Demander un sujet » enregistre une demande (liste « Sujets demandés ») ; le sujet est ensuite rédigé et ajouté au code.
- Choix quotidien de séances de 5, 10, 20 ou 30 minutes, avec des étapes réellement différentes.
- Premier parcours Business Analysis : 8 leçons originales, BA/MOA/AMOA/MOE, parties prenantes, exigences, processus, priorisation, données et recette.
- Rappel avant la leçon, exemples commentés, exercices corrigés, productions écrites et test final distinct.
- Correction des réponses écrites, arbitrée par l’IA : à la correction, le verdict hors ligne s’affiche aussitôt (grille d’idées clés, erreur typique, réponse modèle ; `src/lib/grading.ts`, grilles dans `src/data/ba-grading.ts`), puis DeepSeek rend le verdict officiel avec une explication et une réponse améliorée. Sans clé, hors connexion, sans compte connecté ou budget atteint, le verdict hors ligne fait foi et c’est indiqué. Le verdict IA est conservé avec la réponse jugée : une réponse modifiée repasse en hors ligne jusqu’à une nouvelle demande. Pour économiser les tokens, l’IA ne reçoit que les réponses douteuses : une réponse vide ou validée par la grille (toutes les idées clés, aucune erreur typique) est tranchée localement, et une réponse inchangée n’est jamais renvoyée.
- Cartes de révision avec espacement selon la difficulté du rappel. Cet algorithme simple est un point de départ, pas une mesure scientifique de maîtrise.
- Brouillons et progression sur l’appareil, export JSON, compte personnel Supabase, synchronisation avec contrôle de version et choix explicite en cas de conflit.
- L’IA (DeepSeek V4.1 Flash) sert uniquement à juger les réponses rédigées et à répondre au tuteur. L’API refuse toute demande de création de contenu.
- Installation sur l’écran d’accueil via le menu de partage de Safari. Après une première visite en ligne, l’app s’ouvre hors connexion (service worker) : parcours BA, séances et révisions restent utilisables ; cloud et IA reprennent au retour du réseau. Pas de notifications dans cette version.

## Développement

Node.js 22 LTS recommandé (minimum compatible avec Next.js : 20.9).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

L’application répond sur http://127.0.0.1:3000. Sans configuration cloud, les cours et la progression locale fonctionnent. Sans clé DeepSeek, les nouvelles générations restent indisponibles et ne sont pas simulées.

```sh
npm test
npm run typecheck
npm run build
```

La CI GitHub Actions (`.github/workflows/ci.yml`) rejoue ces trois commandes à chaque push sur `main` et sur chaque pull request.

## Supabase

Le schéma est une migration Supabase CLI : `supabase/migrations/20261106000000_initial_schema.sql`.

1. Appliquer le schéma, au choix :
   - **CLI** (depuis la racine du dépôt) :

     ```sh
     npx supabase login
     npx supabase init        # crée supabase/config.toml, conserve les migrations
     npx supabase link --project-ref kwyexsbyzeihhjlrgvpm
     npx supabase db push
     ```

     Si le schéma a déjà été appliqué à la main (SQL Editor), marquer la migration comme appliquée au lieu de la rejouer : `npx supabase migration repair --status applied 20261106000000`.

   - **SQL Editor** : coller le contenu du fichier de migration et l’exécuter une seule fois.
2. Ajouter l’adresse autorisée dans `private.app_owner` via le SQL Editor (non versionnée : le dépôt est public) :

```sql
insert into private.app_owner(email) values ('you@example.com');
```

3. Définir les deux variables publiques Supabase et `OWNER_EMAIL` côté serveur. L’adresse doit correspondre à celle de `private.app_owner`.
4. Dans Authentication → URL Configuration, définir l’URL de production comme Site URL et l’ajouter aux Redirect URLs. Ajouter localhost seulement pour le développement.
5. Dans l’application → Réglages → Première visite, créer le compte réservé à cette adresse. Confirmer l’e-mail puis se connecter. Le mot de passe est choisi par le propriétaire et n’entre jamais dans le dépôt.

Les opérations utilisent la clé publiable et le JWT utilisateur. **Aucune clé secrète Supabase n’est nécessaire.** RLS protège les sauvegardes ; les fonctions privilégiées sont dans le schéma privé avec contrôle du propriétaire et droits d’exécution restreints. Les tables privées n’ont volontairement aucune politique d’accès client.

`supabase/verify.sql` vérifie le contrôle d’accès, les révisions concurrentes, l’idempotence et le budget dans une transaction annulée. Il ne laisse ni compte ni données de test.

## Vercel

Importer le dépôt GitHub, choisir le preset Next.js, Node.js 22, `npm ci`, `npm run build`, puis configurer :

| Variable                               | Portée                                              |
| -------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Publique                                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publique                                            |
| `OWNER_EMAIL`                          | Serveur                                             |
| `NEXT_PUBLIC_APP_URL`                  | URL stable de production                            |
| `DEEPSEEK_API_KEY`                     | Serveur, sensible ; facultative pour le parcours BA |

Après ajout ou modification d’une variable, redéployer. Utiliser les formules gratuites Vercel Hobby et Supabase Free dans leurs quotas ; DeepSeek est facturé séparément. Le sous-domaine Vercel ne nécessite pas l’achat d’un domaine.

## IA et coût

Modèle choisi par mesure sur la vraie API (novembre 2026, 9 réponses au verdict connu) : `deepseek-flash`. Correction : effort `high`, 9/9 verdicts justes, ~800 tokens par réponse avec la consigne courte, ~7 s (V4 Pro : 8/9, deux à trois fois plus de tokens, 47 s). Tuteur : effort `low`, ~400-550 tokens, ~5 s.

Avant tout appel payant, une réservation atomique en base limite l’enveloppe à 1 USD/jour et 5 USD/mois (UTC). Chaque correction ou réponse du tuteur réserve 0,02 USD (migration `20261107000000_realistic_ai_reservations.sql`). Ce montant reste au-dessus du coût réel mesuré (~0,003 USD par correction) ; il ne représente pas la facture. Les erreurs gardent leur réservation pour éviter des boucles payantes. Un identifiant de requête ne peut pas être facturé deux fois par l’application. Une demande toutes les 20 secondes maximum : le serveur renvoie alors `Retry-After` et l’app relance seule une fois (ce refus ne réserve rien). Pendant les appels, l’app garde l’écran allumé (Wake Lock) pour que l’iPhone ne coupe pas la requête ; les coupures réseau et délais dépassés affichent un message clair (`src/lib/ai-client.ts`).

Chaque demande à l’IA est un appel unique, sans recherche web ni boucle autonome. Entrée texte plafonnée à 45 000 octets ; sortie plafonnée à 8 000 tokens (correction) ou 4 000 (tuteur), réflexion du modèle comprise.

Les appels réels ont été mesurés avec la clé du projet ; les tests automatiques couvrent le contrat API avec réponses simulées et les réponses incomplètes.

## Choix pédagogiques et limites

Les séances privilégient le rappel actif, la correction et le transfert. Le temps choisi est un format estimé, sans chronomètre coercitif. La progression distingue une étape explorée d’une compétence durable. Le socle BA ne remplace pas une expérience professionnelle ni une formation exhaustive ; les spécialisations peuvent être créées ensuite.

Les extraits privés fournis pour le cadrage ne sont pas publiés. Aucun suivi publicitaire ni analytique tiers n’est ajouté.

Références : [IIBA Business Analysis Standard](https://www.iiba.org/standards-and-resources/the-business-analysis-standard/), [AERO : espacement et rappel](https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication), [DeepSeek API](https://api-docs.deepseek.com/api/create-chat-completion/), [DeepSeek Search](https://api-docs.deepseek.com/guides/search/), [DeepSeek tarifs](https://api-docs.deepseek.com/quick_start/pricing/).
