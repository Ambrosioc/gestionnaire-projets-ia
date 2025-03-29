# AI Project Manager

Une application web moderne de gestion de projet avec assistance IA, construite avec Next.js, Supabase et Tailwind CSS.

## 🌟 Fonctionnalités

### Gestion de Projets
- Création et gestion de projets
- Description générée par IA pour chaque projet
- Upload de fichiers (brief, documents)
- Suivi de l'avancement

### Gestion des Tâches
- Système Kanban avec drag & drop
- Priorités et étiquettes personnalisables
- Deadlines et rappels
- Filtrage avancé (statut, date, priorité)
- Génération automatique de tâches via IA

### Dashboard & Analytics
- Vue d'ensemble des projets
- Graphiques de progression
- Statistiques de productivité
- Résumé hebdomadaire

### Intelligence Artificielle
- Suggestions de tâches basées sur le nom du projet
- Résumé hebdomadaire intelligent
- Conseils d'amélioration personnalisés

### Notifications
- Notifications push pour les deadlines
- Rappels de tâches importantes
- Résumé hebdomadaire par email

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Style**: Tailwind CSS, shadcn/ui
- **Base de données**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **IA**: OpenAI GPT-3.5
- **Notifications**: OneSignal, EmailJS
- **Drag & Drop**: dnd-kit
- **Graphiques**: Recharts

## 📋 Prérequis

- Node.js 18+
- Compte Supabase
- Compte OpenAI
- Compte OneSignal
- Compte EmailJS

## ⚙️ Configuration

1. Clonez le repository
```bash
git clone <repository-url>
cd ai-project-manager
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env` avec les variables suivantes :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
NEXT_PUBLIC_OPENAI_API_KEY=votre_clé_api_openai
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=votre_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_clé_publique
NEXT_PUBLIC_ONESIGNAL_APP_ID=votre_app_id
NEXT_PUBLIC_ONESIGNAL_REST_API_KEY=votre_clé_api
```

4. Initialisez la base de données Supabase avec les migrations
```bash
npx supabase migration up
```

## 🚀 Démarrage

1. Lancez le serveur de développement
```bash
npm run dev
```

2. Ouvrez [http://localhost:3000](http://localhost:3000)

## 📱 Fonctionnalités Mobile

- Interface responsive
- Navigation adaptée au mobile
- Gestion du touch pour le drag & drop
- PWA ready

## 🔒 Sécurité

- Authentification sécurisée via Supabase
- Row Level Security (RLS) pour la base de données
- Protection CSRF
- Validation des données avec Zod
- Gestion sécurisée des fichiers

## 🎨 Personnalisation

### Thèmes
- Mode clair/sombre automatique
- Couleurs personnalisables via Tailwind
- Components UI réutilisables

### Étiquettes
- Création d'étiquettes personnalisées
- Couleurs personnalisables
- Association aux tâches

## 📊 Structure de la Base de Données

### Tables Principales
- `users`: Informations utilisateur
- `projects`: Projets
- `tasks`: Tâches
- `tags`: Étiquettes
- `task_tags`: Association tâches-étiquettes

### Tables de Configuration
- `task_statuses`: Statuts prédéfinis
- `task_priorities`: Priorités prédéfinies

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.