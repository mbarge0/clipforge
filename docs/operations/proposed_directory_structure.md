gauntlet-starter/
│
├── app/                           # Next.js 14+ App Router
│   ├── (auth)/                    # Route groups for auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/               # Route groups for main app
│   │   ├── page.tsx               # Dashboard home
│   │   └── layout.tsx             # Dashboard layout
│   ├── api/                       # API routes
│   │   ├── ai/                    # AI-specific endpoints
│   │   │   ├── chat/
│   │   │   ├── generate/
│   │   │   └── route.ts
│   │   ├── auth/                  # Authentication endpoints
│   │   └── data/                  # Data CRUD endpoints
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── loading.tsx                # Global loading UI
│   ├── error.tsx                  # Global error UI
│   └── not-found.tsx              # 404 page
│
├── components/                    # Shared UI components
│   ├── ui/                        # Base UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── index.ts               # Barrel exports
│   ├── forms/                     # Form components
│   ├── layout/                    # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── ai/                        # AI-specific components
│       ├── chat-interface.tsx
│       ├── ai-output.tsx
│       └── loading-states.tsx
│
├── lib/                           # Utility functions
│   ├── ai/                        # AI-specific utilities
│   │   ├── openai.ts              # OpenAI client
│   │   ├── prompts.ts             # Prompt templates
│   │   └── validation.ts          # AI response validation
│   ├── auth/                      # Authentication utilities
│   │   ├── firebase.ts            # Firebase auth
│   │   └── middleware.ts          # Auth middleware
│   ├── db/                        # Database utilities
│   │   ├── firestore.ts           # Firestore client
│   │   ├── queries.ts             # Database queries
│   │   └── types.ts               # Database types
│   ├── utils.ts                   # General utilities
│   ├── constants.ts               # App constants
│   └── validations.ts             # Zod schemas
│
├── config/                        # Configuration files
│   ├── env.ts                     # Environment validation
│   ├── database.ts                # Database config
│   ├── ai.ts                      # AI model configs
│   └── constants.ts               # App-wide constants
│
├── hooks/                         # Custom React hooks
│   ├── use-ai.ts                  # AI-related hooks
│   ├── use-auth.ts                # Authentication hooks
│   └── use-local-storage.ts       # Local storage hooks
│
├── types/                         # TypeScript type definitions
│   ├── ai.ts                      # AI-related types
│   ├── auth.ts                    # Authentication types
│   ├── database.ts                # Database types
│   └── index.ts                   # Barrel exports
│
├── docs/                          # Documentation
│   ├── templates/                 # Reusable templates
│   │   ├── PRD_template.md        # Product Requirements Doc
│   │   ├── README_template.md     # Project README
│   │   └── weekly_report_template.md
│   ├── context.md                 # Project context
│   ├── source_of_truth.md        # Single source of truth
│   └── weekly_report.md           # Current week's report
│
├── scripts/                       # Automation scripts
│   ├── setup.sh                   # Initial setup script
│   ├── deploy.sh                  # Deployment script
│   ├── archive.sh                 # Archive previous week
│   └── generate-weekly.sh         # Generate new week from template
│
├── public/                        # Static assets
│   ├── icons/                     # App icons
│   ├── images/                    # Images
│   └── favicon.ico
│
├── .env.local.example             # Environment template
├── .env.local                     # Local environment (gitignored)
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
├── firebase.json                  # Firebase configuration
└── README.md                      # Project README