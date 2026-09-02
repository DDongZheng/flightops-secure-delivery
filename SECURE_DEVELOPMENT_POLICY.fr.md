# FlightOps Secure Delivery Factory — Politique de développement sécurisé

[English](SECURE_DEVELOPMENT_POLICY.md) | [Français](SECURE_DEVELOPMENT_POLICY.fr.md) | [中文](SECURE_DEVELOPMENT_POLICY.zh-CN.md)

> [!IMPORTANT]
> **Mode de fonctionnement actuel (02/09/2026) :** ce dépôt est uniquement destiné à la démonstration et ne comporte plus d’intégration AWS ni de cible de déploiement active. L’automatisation de release doit s’arrêter après le build local et les vérifications. Elle ne doit demander aucun identifiant cloud, contacter aucun environnement de staging ou de production, téléverser aucun artefact déployable ni effectuer de déploiement. Toute exigence AWS, Amplify, OIDC, d’approbation d’environnement, de test post-déploiement ou de surveillance de production figurant ailleurs dans ce document est conservée comme contexte historique et remplacée par le présent avis.

## 1. Gestion du document

| Champ | Valeur |
| --- | --- |
| Version | 1.1 |
| Date d’entrée en vigueur | 2026-07-17 |
| Responsable de la politique | ZHENG Qianyuan |
| Fréquence de révision | Trimestrielle et après toute évolution majeure |
| Périmètre | Code applicatif, dépendances et workflows CI/CD limités au build |

## 2. Objet

Cette politique définit la manière dont FlightOps Secure Delivery Factory doit être conçu, développé, testé, revu et livré de façon sécurisée.

Elle établit un cycle de développement logiciel sécurisé (SSDLC) dans lequel les contrôles de sécurité et de qualité s’appliquent pendant tout le développement, et non uniquement avant la mise en production.

Cette politique soutient des pratiques associées à l’ISO 27001, notamment la gestion des changements fondée sur les risques, le contrôle des accès, le développement sécurisé, la gestion des vulnérabilités, la séparation des environnements et la conservation des preuves.

Elle ne constitue pas, à elle seule, une certification ISO 27001.

## 3. Périmètre

Cette politique s’applique :

- au code React et TypeScript ;
- aux tests automatisés et aux données de test ;
- aux dépendances npm et au fichier de verrouillage ;
- aux workflows GitHub Actions ;
- au dépôt GitHub et aux règles de branches ;
- à l’automatisation de release limitée au build ;
- aux preuves de CI, de sécurité et de test ;
- aux preuves historiques de déploiement conservées à des fins d’audit et de présentation ;
- aux contributions assistées par l’IA.

L’application est un système de démonstration. Seules des données fictives et non sensibles sont autorisées. Les données réelles relatives aux vols, aéronefs, passagers, employés ou opérations sont hors du périmètre approuvé.

## 4. Vocabulaire normatif

- **DOIT** indique une exigence obligatoire.
- **NE DOIT PAS** indique une pratique interdite.
- **DEVRAIT** indique une pratique recommandée qui ne peut être omise que pour un motif documenté.
- **PEUT** indique une pratique facultative.

## 5. Rôles et responsabilités

### Propriétaire du dépôt

Le propriétaire du dépôt DOIT :

- maintenir cette politique ;
- gérer les accès au dépôt et aux Environments ;
- maintenir les protections de branches et les contrôles obligatoires ;
- revoir les changements sensibles pour la sécurité ;
- approuver ou refuser les dérogations ;
- qualifier les vulnérabilités identifiées ;
- s’assurer que les corrections sont réalisées et vérifiées ;
- suivre les indicateurs de sécurité et de qualité ;
- autoriser les mises en production.

### Contributeurs

Les contributeurs DOIVENT :

- travailler au moyen de branches et de pull requests ;
- respecter les règles de codage sécurisé ;
- ajouter les tests automatisés appropriés ;
- examiner les changements de dépendances ;
- traiter les résultats de la CI et des analyses de sécurité ;
- ne pas committer de secrets ni de données sensibles ;
- considérer le code généré par l’IA comme non fiable tant qu’il n’a pas été revu et testé.

### Contrôles automatisés

GitHub Actions automatise l’application des contrôles, mais ne remplace pas la responsabilité humaine. Les contrôles automatisés DOIVENT échouer de manière visible lorsqu’une exigence obligatoire de qualité, de sécurité, de test ou de déploiement n’est pas satisfaite.

### Limite de séparation des responsabilités

Ce projet étant personnel, le propriétaire du dépôt peut être à la fois développeur et approbateur de la production. Cette limite est acceptée pour le périmètre de démonstration. Un projet d’équipe ou un système réel de production DEVRAIT exiger une revue indépendante des changements sensibles et des mises en production.

## 6. Cycle de développement logiciel sécurisé

### 6.1 Planification

Avant l’implémentation, chaque changement DEVRAIT préciser :

- son objectif et son comportement attendu ;
- les composants et environnements concernés ;
- l’introduction éventuelle de données, dépendances, secrets ou permissions ;
- les tests nécessaires ;
- les conséquences possibles pour la sécurité ;
- les critères d’acceptation.

Tout changement introduisant une authentification, un stockage persistant, une API backend, des données personnelles ou des données opérationnelles réelles DOIT faire l’objet d’une nouvelle revue de sécurité avant son implémentation.

### 6.2 Conception

Les décisions de conception DOIVENT respecter les principes suivants :

- moindre privilège ;
- collecte minimale de données ;
- paramètres sécurisés par défaut ;
- séparation du staging et de la production ;
- frontières de confiance explicites ;
- builds reproductibles ;
- traçabilité entre le commit source et la version déployée ;
- défense en profondeur ;
- échec empêchant une livraison non sûre.

Les contrôles de sécurité DEVRAIENT être proportionnés à la sensibilité et à l’impact opérationnel du composant.

### 6.3 Implémentation

Les travaux d’implémentation DOIVENT :

- être réalisés sur une branche dédiée ;
- être soumis par pull request ;
- rester ciblés et faciles à revoir ;
- utiliser les mécanismes de sûreté de TypeScript lorsqu’ils sont applicables ;
- valider les entrées non fiables ;
- éviter le rendu non sécurisé de HTML brut ;
- éviter d’exposer des secrets ou des détails internes dans les erreurs ;
- ajouter ou mettre à jour les tests du comportement modifié ;
- éviter les changements de dépendances ou de workflows sans rapport avec l’objectif.

Les modifications directes de la branche `main` protégée NE DOIVENT PAS constituer le processus normal de développement.

### 6.4 Vérification

Chaque pull request DOIT réussir les contrôles automatisés applicables avant sa fusion :

- installation reproductible avec `npm ci` ;
- ESLint ;
- tests unitaires et de composants ;
- seuils de couverture ;
- build de production ;
- analyse SonarQube et Quality Gate ;
- analyse CodeQL ;
- revue des dépendances ;
- `npm audit` ;
- détection de secrets avec Gitleaks ;
- tests de bout en bout Playwright.

Tout échec DOIT être analysé. Un contrôle NE DOIT PAS être désactivé ou affaibli uniquement pour obtenir un résultat positif.

### 6.5 Livraison

Une démonstration de livraison DOIT être lancée manuellement, utiliser un commit revu, installer les dépendances depuis le fichier de verrouillage, exécuter les contrôles définis et créer un build optimisé uniquement dans le runner éphémère.

Elle DOIT s’arrêter après les vérifications. Elle NE DOIT PAS demander d’identifiants cloud, pousser une branche de déploiement, contacter un environnement hébergé, téléverser un artefact déployable ni effectuer un déploiement.

### 6.6 Exploitation et maintien en conditions opérationnelles et de sécurité

Le projet DOIT surveiller :

- les échecs de CI et de démonstration de livraison ;
- les mises à jour Dependabot ;
- les analyses de sécurité planifiées ;
- les résultats du Quality Gate SonarQube ;
- les vulnérabilités non résolues.

Les dépendances, actions et versions d’exécution DEVRAIENT être mises à jour avant de devenir non supportées ou significativement obsolètes.

## 7. Gestion du code source et revues

La branche `main` DOIT rester protégée.

Une pull request DOIT décrire le changement, conserver un périmètre compréhensible, réussir les contrôles obligatoires, recevoir la revue imposée par les règles du dépôt et résoudre les commentaires pertinents avant fusion.

Sont notamment sensibles pour la sécurité : les workflows, permissions, secrets, configurations OIDC ou IAM, GitHub Environments, dépendances, traitements d’entrées, mécanismes d’authentification et d’autorisation, logique de déploiement et configuration des outils de sécurité.

Ces changements DEVRAIENT recevoir une revue manuelle supplémentaire portant sur les permissions, les frontières de confiance, les possibilités de contournement et les divulgations involontaires.

## 8. Exigences de qualité

Tout comportement modifié DOIT être couvert par une combinaison adaptée de tests unitaires, de composants, de bout en bout et de smoke tests après déploiement. Les tests DOIVENT être déterministes et NE DOIVENT PAS dépendre de données opérationnelles réelles.

La couverture des instructions, branches, fonctions et lignes DOIT rester supérieure ou égale au seuil configuré de 80 %. La couverture est un seuil minimal et ne prouve pas que l’application est correcte ou sécurisée. Les comportements critiques DOIVENT être testés même lorsque le seuil numérique est déjà atteint.

Le nouveau code NE DOIT PAS introduire de problème inacceptable de fiabilité, maintenabilité ou sécurité au regard du Quality Gate SonarQube. La dette technique et les composants obsolètes DEVRAIENT être examinés régulièrement et traités avant de créer un risque significatif.

## 9. Sécurité applicative

Le code applicatif DOIT :

- valider et normaliser les valeurs contrôlées par l’utilisateur ;
- utiliser l’échappement fourni par le framework ;
- éviter `dangerouslySetInnerHTML` sauf justification et revue spécifiques ;
- éviter l’exécution dynamique de code ;
- ne pas intégrer de secrets dans les bundles frontend ;
- ne pas journaliser de valeurs sensibles ;
- traiter les erreurs sans exposer de secrets ni de détails de sécurité internes ;
- utiliser des dépendances sûres et maintenues.

L’application actuelle étant publique et sans authentification, elle DOIT rester limitée à des données fictives conservées uniquement en mémoire dans le navigateur.

L’ajout de persistance, d’authentification ou de services backend impose une revue de l’autorisation, des sessions, de la protection des données, de la journalisation, de la prévention des abus et de la conservation des données.

## 10. Secrets et identifiants

Les secrets NE DOIVENT PAS être :

- commités dans le dépôt ;
- stockés dans le code applicatif ;
- placés dans la documentation publique ;
- exposés dans les variables de build frontend ;
- affichés dans les logs de workflows ;
- inclus dans les rapports ou artefacts ;
- transmis à des outils d’IA non approuvés.

Les secrets du dépôt et des Environments DOIVENT être limités aux workflows et environnements qui en ont besoin.

Les identifiants de déploiement cloud NE DOIVENT PAS être configurés tant que le projet ne possède aucune cible de déploiement. Les anciennes variables, secrets et relations de confiance AWS DEVRAIENT être supprimés de GitHub et d’AWS après vérification de leur propriété.

En cas d’exposition possible, le secret DOIT être immédiatement révoqué ou renouvelé. L’historique, les logs et les artefacts concernés DOIVENT être examinés et l’incident documenté.

## 11. Sécurité CI/CD

Les permissions des workflows DOIVENT être explicitement déclarées, être en lecture seule par défaut et rester limitées à l’opération concernée.

Les workflows actifs NE DOIVENT PAS demander `id-token: write`, des identifiants cloud ou un accès d’écriture de déploiement. La démonstration de livraison DOIT rester manuelle et limitée au build.

Les GitHub Actions tierces DOIVENT provenir d’une source réputée et maintenue, utiliser une version explicite, être revues avant leur introduction ou une mise à niveau majeure, et fonctionner avec des permissions minimales. L’épinglage des actions de livraison à un SHA complet DEVRAIT être envisagé lorsqu’une assurance renforcée de la chaîne d’approvisionnement est nécessaire.

## 12. Gestion des dépendances

Les workflows automatisés DOIVENT installer les dépendances au moyen du fichier `package-lock.json` commité et de `npm ci`.

Les changements de dépendances DOIVENT être examinés au regard de leur nécessité, maintenance, origine, éditeur, vulnérabilités connues, impact transitif, licence et compatibilité avec la version Node.js supportée.

Dependabot DOIT rester configuré pour npm et GitHub Actions. Une vulnérabilité High ou Critical DOIT bloquer la livraison normale jusqu’à sa correction ou l’approbation d’une dérogation temporaire. Les dépendances inutilisées DEVRAIENT être supprimées.

## 13. Gestion des vulnérabilités

Les constats de sécurité peuvent provenir de CodeQL, SonarQube, la revue des dépendances, `npm audit`, Dependabot, Gitleaks, une revue manuelle, un test d’intrusion, une divulgation responsable ou une observation en production.

Chaque vulnérabilité confirmée DOIT avoir une sévérité, un responsable, une décision de traitement, une échéance, une preuve de correction et une vérification avant clôture.

| Sévérité | Réponse requise |
| --- | --- |
| Critical | Qualification et confinement immédiats ; correction visée sous 72 heures |
| High | Correction visée sous 7 jours calendaires |
| Medium | Correction visée sous 30 jours calendaires |
| Low | Correction visée sous 90 jours calendaires ou acceptation après revue |

Une exploitation active, une exposition d’identifiants ou un accès non autorisé à la production DOIT être traité comme Critical, quelle que soit la classification initiale de l’outil.

Un constat NE DOIT PAS être clôturé au seul motif que le code a changé. La correction DOIT être vérifiée par une nouvelle analyse, un test automatisé, une revue manuelle ou un nouveau test de sécurité adapté.

## 14. Incidents de sécurité

Lorsqu’un incident est suspecté, le propriétaire du dépôt DOIT :

1. contenir l’accès ou le chemin de livraison affecté ;
2. arrêter les déploiements non sûrs si nécessaire ;
3. révoquer ou renouveler les identifiants concernés ;
4. préserver les logs et preuves utiles ;
5. identifier les commits, workflows et environnements affectés ;
6. corriger la cause ;
7. relancer les tests et contrôles concernés ;
8. vérifier la version déployée ;
9. documenter les enseignements et les améliorations nécessaires.

Le rétablissement de la production NE DOIT PAS contourner les vérifications obligatoires, sauf dérogation d’urgence approuvée et documentée.

## 15. Développement assisté par l’IA

Les outils d’IA PEUVENT aider à la conception, l’implémentation, aux tests, à la documentation et aux revues, mais NE DOIVENT PAS remplacer la responsabilité humaine.

Leurs utilisateurs DOIVENT :

- ne pas transmettre de secrets, identifiants ou données opérationnelles sensibles ;
- respecter la confidentialité du code et les paramètres de protection des données ;
- revoir le code généré avant de l’accepter ;
- vérifier les dépendances et commandes proposées ;
- appliquer les mêmes tests et contrôles que pour le code humain ;
- rechercher les hypothèses non sûres, API inventées et permissions excessives ;
- rester responsables du changement final.

Le code généré par l’IA DOIT être considéré comme une contribution tierce non fiable jusqu’à sa revue, son test et son analyse. Une sortie d’IA NE DOIT PAS servir à contourner les revues, Quality Gates ou approbations de production.

## 16. Preuves et indicateurs

Les preuves suivantes DEVRAIENT être conservées ou référencées :

- résultats des revues et contrôles des pull requests ;
- logs des workflows CI et sécurité ;
- rapports de couverture ;
- résultats SonarQube ;
- constats CodeQL et de dépendances ;
- résultats Gitleaks ;
- rapports Playwright ;
- dossiers de correction des vulnérabilités.

Le responsable DEVRAIT suivre la couverture, le Quality Gate, le taux de succès de la CI, les vulnérabilités ouvertes par sévérité et ancienneté, le temps de correction, l’état des dépendances, la dette technique et la complexité.

Les artefacts conservés actuellement pendant sept jours fournissent des preuves à court terme. Une durée supérieure DEVRAIT être mise en place si des exigences contractuelles, réglementaires ou d’audit l’imposent.

## 17. Dérogations

Un contrôle obligatoire ne peut être contourné que si le retard du changement crée un risque documenté plus important.

Une dérogation DOIT préciser l’exigence concernée, le motif, l’impact de sécurité, les mesures compensatoires, le responsable, l’approbation, la date d’expiration et l’action de suivi.

Les dérogations DOIVENT être temporaires et revues avant expiration. La commodité ou la pression du calendrier ne constitue pas, à elle seule, une justification suffisante.

## 18. Formation et amélioration continue

Les contributeurs DEVRAIENT comprendre les bases du codage sécurisé, la gestion des secrets, les risques liés aux dépendances, les permissions CI/CD, l’interprétation des constats, la correction des vulnérabilités et l’utilisation sûre des outils d’IA.

Les exigences de sécurité et de qualité DEVRAIENT être expliquées au moyen des retours de revue, de la documentation et de contrôles réutilisables dans les pipelines.

Le responsable de la politique DOIT vérifier périodiquement que les contrôles restent efficaces à mesure que les outils, menaces, architectures et besoins évoluent.

## 19. Déclencheurs de révision

Cette politique DOIT être révisée :

- au moins chaque trimestre ;
- après un incident de sécurité ;
- après une évolution majeure d’un workflow ou de l’architecture ;
- lors de l’ajout d’une authentification, de persistance ou de services backend ;
- lorsque de nouvelles données sensibles entrent dans le périmètre ;
- lorsque les rôles de déploiement ou les politiques de confiance OIDC changent ;
- lors de l’introduction d’un nouveau cloud ou d’une nouvelle plateforme ;
- lors du remplacement d’un outil de sécurité obligatoire ;
- lorsque les exigences organisationnelles ou réglementaires applicables évoluent.

## 20. Application de la politique

Les changements qui ne respectent pas cette politique NE DOIVENT PAS suivre le processus normal de livraison, sauf dérogation documentée et approuvée.

Le propriétaire du dépôt est responsable de la cohérence entre cette politique et les contrôles réellement mis en œuvre dans GitHub et AWS.
