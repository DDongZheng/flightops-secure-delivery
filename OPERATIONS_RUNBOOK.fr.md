# Guide d’exploitation de la production

[English](OPERATIONS_RUNBOOK.md) | [Français](OPERATIONS_RUNBOOK.fr.md) | [简体中文](OPERATIONS_RUNBOOK.zh-CN.md)

## Objectif du document

Ce guide décrit comment FlightOps Secure Delivery Factory surveille la disponibilité de la production et traite un contrôle en échec.

URL de production :

<https://main.d2lh4ktwzmstsc.amplifyapp.com/>

Le workflow de surveillance est défini dans `.github/workflows/smoke-test.yml`.

## Objectif de disponibilité

L’objectif opérationnel consiste à :

- exécuter un contrôle automatisé de la production chaque jour ;
- analyser chaque contrôle terminé en échec ;
- rétablir le service au moyen du processus de livraison contrôlé existant ;
- conserver les preuves de détection et de rétablissement dans une Issue GitHub.

Un contrôle réussi confirme que le point d’accès renvoie une réponse HTTP valide après les redirections et que le HTML contient l’élément racine React ainsi que des références aux ressources front-end.

Il s’agit d’un objectif interne au projet, et non d’un accord de niveau de service destiné aux utilisateurs.

## Planification et cycle de vie d’un incident

Le workflow s’exécute chaque jour à `07:23 UTC` et peut également être lancé manuellement.

Il gère une Issue portant le titre fixe suivant :

```text
[Operational Monitor] Production availability failure
```

Le cycle de vie est le suivant :

```text
Contrôle réussi
  → Aucun incident ouvert

Premier contrôle en échec
  → Création d’une Issue d’incident

Nouvel échec
  → Ajout de preuves à l’Issue existante

Contrôle rétabli
  → Ajout d’un commentaire de rétablissement
  → Fermeture de l’Issue
```

Une seule Issue ouverte portant ce titre doit exister à la fois.

## Preuves d’échec

Lorsqu’un contrôle échoue, le workflow enregistre :

- l’URL de production et l’heure UTC du contrôle ;
- l’événement déclencheur et l’indication d’une éventuelle simulation ;
- un lien vers l’exécution GitHub Actions ;
- les en-têtes de réponse, le HTML reçu et le journal du smoke test disponibles.

Les artefacts d’échec sont conservés pendant trois jours.

## Première réponse

Lorsqu’un incident est créé ou mis à jour :

1. Ouvrir l’exécution du workflow liée depuis l’Issue.
2. Vérifier si `Controlled simulation` vaut `true`.
3. Examiner l’étape en échec et `smoke-test.log`.
4. Déterminer si l’échec concerne la requête HTTP ou la validation de l’enveloppe applicative.
5. Examiner le dernier workflow Release et le dernier déploiement en production.
6. Relancer manuellement le Production Smoke Test sans simulation d’échec.
7. Laisser l’Issue ouverte jusqu’à ce qu’un contrôle automatisé réussi la ferme.

Ne pas fermer l’Issue sur la seule base d’une visite réussie depuis un navigateur.

## Investigation

Pour un échec HTTP :

1. Examiner le statut HTTP et l’erreur dans le journal du workflow.
2. Consulter `response-headers.txt` s’il est disponible.
3. Tester l’URL de production depuis un autre navigateur ou un autre réseau.
4. Examiner le dernier workflow Release.
5. Confirmer que la branche de production Amplify est toujours `main`.

Pour un échec de l’enveloppe applicative :

1. Examiner `production.html`.
2. Confirmer la présence de `id="root"` et d’une référence `/assets/`.
3. Vérifier si Amplify a renvoyé une page d’erreur avec un statut HTTP valide.
4. Examiner les modifications récentes de `index.html`, du build Vite et de la configuration Amplify.

## Rétablissement

Le rétablissement doit utiliser le processus de livraison contrôlé existant.

Ne pas :

- modifier manuellement les fichiers de production ;
- contourner les contrôles obligatoires ou l’approbation de l’environnement de production ;
- forcer la mise à jour d’une branche de déploiement ;
- créer de nouvelles ressources AWS ;
- utiliser des identifiants AWS de longue durée.

Après l’action corrective :

1. Lancer manuellement le Production Smoke Test sans simulation d’échec.
2. Confirmer que le contrôle réussit.
3. Confirmer qu’un commentaire de rétablissement est ajouté à l’incident.
4. Confirmer que l’incident est fermé.
5. Conserver les liens vers l’Issue et le workflow comme preuves.

Un workflow de retour arrière contrôlé sera ajouté séparément. D’ici là, ne pas improviser de retour arrière non revu.

## Exercice contrôlé de surveillance

Le cycle de vie d’un incident peut être testé sans interrompre la production.

Pour simuler la détection :

1. Lancer manuellement le Production Smoke Test.
2. Définir `simulate_failure` sur `true`.
3. Confirmer que l’exécution échoue volontairement.
4. Confirmer la création d’une Issue d’incident et d’un artefact d’échec.

Pour simuler le rétablissement :

1. Relancer le workflow avec `simulate_failure` défini sur `false`.
2. Confirmer que le contrôle de production réussit.
3. Confirmer que l’incident reçoit un commentaire de rétablissement et est fermé.

La simulation modifie uniquement le résultat du contrôle. Elle ne modifie pas la production.

## Échec de l’automatisation

Si le workflow ne peut pas gérer l’Issue :

1. Examiner l’étape GitHub API en échec.
2. Confirmer que le workflow accorde `issues: write`.
3. Confirmer que la politique du dépôt autorise le jeton du workflow à modifier les Issues.
4. Créer ou mettre à jour manuellement l’incident si la production est indisponible.
5. Corriger l’automatisation au moyen du processus normal de pull request.

Le workflow utilise le `GITHUB_TOKEN` limité au dépôt ; aucun jeton d’accès personnel n’est requis.

## Limites connues

- Les planifications GitHub Actions ne constituent pas une surveillance en temps réel et peuvent être retardées ou abandonnées.
- Les workflows planifiés s’exécutent uniquement depuis la branche par défaut.
- Dans un dépôt public, ils peuvent être désactivés après 60 jours sans activité.
- Un contrôle quotidien ne permet pas de mesurer une disponibilité continue.
- Le contrôle valide l’accessibilité et l’enveloppe applicative, pas tous les parcours utilisateur.
- Une panne GitHub peut affecter la surveillance et le signalement par Issue.
- Les Issues GitHub ne garantissent ni astreinte ni délai de réponse.
- Ce projet personnel ne dispose ni d’une équipe d’astreinte indépendante ni d’une séparation des responsabilités opérationnelles.

La réussite du workflow ne prouve pas une disponibilité continue et aucun SLA d’entreprise n’est revendiqué.

## Contraintes de coût

Ce contrôle utilise un dépôt public, un runner GitHub standard, GitHub Actions, GitHub Issues, le `GITHUB_TOKEN` du dépôt et des outils en ligne de commande gratuits.

Il n’introduit aucune plateforme commerciale de surveillance, aucun runner payant, aucune nouvelle ressource AWS, aucun service payant de gestion d’incidents et aucun service dépendant d’une période d’essai. Les artefacts sont créés uniquement en cas d’échec et conservés trois jours.

Références GitHub :

- <https://docs.github.com/en/actions/concepts/billing-and-usage>
- <https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows>
- <https://docs.github.com/en/actions/concepts/security/github_token>

## Liste des preuves

Conserver les liens vers :

- l’exécution de surveillance en échec ;
- l’Issue d’incident opérationnel ;
- les commentaires d’échecs répétés, le cas échéant ;
- l’exécution de rétablissement réussie ;
- le commentaire de rétablissement et l’Issue fermée ;
- l’exécution corrective de Release ou de retour arrière, le cas échéant.
