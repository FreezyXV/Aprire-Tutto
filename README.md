# Aprire Tutto

Un espace personnel pour comprendre, pratiquer et retenir. Application web en français, pensée pour l’iPhone et utilisable sur ordinateur.

## Ce qui fonctionne

- Choix quotidien de séances de 5, 10, 20 ou 30 minutes, avec des étapes réellement différentes.
- Premier parcours Business Analysis : 8 leçons originales, BA/MOA/AMOA/MOE, parties prenantes, exigences, processus, priorisation, données et recette.
- Rappel avant la leçon, exemples commentés, exercices corrigés, productions écrites, autoévaluation et test final distinct.
- Cartes de révision avec espacement selon la difficulté du rappel. Cet algorithme simple est un point de départ, pas une mesure scientifique de maîtrise.
- Brouillons et progression sur l’appareil, export JSON, compte personnel Supabase, synchronisation avec contrôle de version et choix explicite en cas de conflit.
- Création de parcours sur d’autres sujets et tuteur avec DeepSeek V4 Pro, une fois la clé API configurée. La génération recherche des références web puis vérifie le format et les liens de la réponse.
- Installation sur l’écran d’accueil via le menu de partage de Safari. Pas de notifications ni de chargement initial hors connexion dans cette version.

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

## Supabase

1. Sur un projet dédié, exécuter `supabase/schema.sql` une seule fois. Ce fichier initialise les tables et les fonctions ; ce n’est pas une migration incrémentale à rejouer sur une base existante.
2. Ajouter l’adresse autorisée dans `private.app_owner` via le SQL Editor :

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

Le modèle est fixé à `deepseek-v4-pro`, effort `max` pour les parcours, `high` pour le tuteur. Les tarifs et le schéma API ont été vérifiés dans la documentation officielle au moment de l’implémentation (novembre 2026).

Avant tout appel payant, une réservation atomique en base limite l’enveloppe à 1 USD/jour et 5 USD/mois (UTC). Chaque parcours réserve 0,15 USD, chaque réponse du tuteur 0,08 USD. Ces montants prudents couvrent les limites de taille configurées ; ils ne représentent pas la facture réelle. Les erreurs gardent leur réservation pour éviter des boucles payantes. Un identifiant de requête ne peut pas être facturé deux fois par l’application. Une demande toutes les 20 secondes maximum.

Une création fait au plus une recherche et un appel de génération, sans boucle autonome. Entrée texte plafonnée à 45 000 octets ; sortie plafonnée à 16 000 tokens (parcours) ou 4 000 (tuteur). Les références sont celles renvoyées par la recherche, puis sélectionnées par le modèle. Cela ne garantit pas leur autorité ni l’exactitude de toutes les affirmations : les références et la date de génération sont accessibles. Le tuteur n’effectue pas de nouvelle recherche web.

Aucun appel payant réel n’a été validé tant que la clé n’a pas été ajoutée. Les tests couvrent le contrat API avec réponses simulées, les échecs de recherche et les réponses incomplètes.

## Choix pédagogiques et limites

Les séances privilégient le rappel actif, la correction et le transfert. Le temps choisi est un format estimé, sans chronomètre coercitif. La progression distingue une étape explorée d’une compétence durable. Le socle BA ne remplace pas une expérience professionnelle ni une formation exhaustive ; les spécialisations peuvent être créées ensuite.

Les extraits privés fournis pour le cadrage ne sont pas publiés. Aucun suivi publicitaire ni analytique tiers n’est ajouté.

Références : [IIBA Business Analysis Standard](https://www.iiba.org/standards-and-resources/the-business-analysis-standard/), [AERO : espacement et rappel](https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication), [DeepSeek API](https://api-docs.deepseek.com/api/create-chat-completion/), [DeepSeek Search](https://api-docs.deepseek.com/guides/search/), [DeepSeek tarifs](https://api-docs.deepseek.com/quick_start/pricing/).
