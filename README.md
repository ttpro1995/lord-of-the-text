# Lord of the Text

Lord of the Text is an incremental base-building game where you manage a kingdom as a lord. Start with your central manor and expand your domain by constructing buildings, gathering resources, training armies, and conquering neighboring territories. Inspired by strategy games like Crusader Kings III, this game focuses on resource management, military expansion, and long-term progression through idle mechanics.

## Features

- **Base Building**: Manage your lord's manor and construct various buildings for resource production, military training, and infrastructure.
- **Resource Management**: Collect and allocate essential resources like timber, stone, iron, food, gold, knowledge, and faith.
- **Military Expansion**: Train diverse units including infantry, archers, cavalry, and siege engines to conquer territories.
- **Territory Conquest**: Raid villages, towns, castles, temples, and monster dens for passive buffs, unique items, and new manageable bases.
- **Technology Research**: Invest in knowledge to unlock technologies that enhance production, military strength, and strategic options.
- **Idle Mechanics**: Resources accumulate automatically with auto-save functionality allowing offline progress.
- **Random Events**: Respond to dynamic events that can boost production or pose challenges requiring strategic decisions.
- **Multi-Base Management**: Conquer and manage multiple specialized territories with unique bonuses.

## Core Gameplay

Lord of the Text features a strategic incremental system where you manage a kingdom's growth through resource collection, building construction, military expansion, and territory conquest. Progress through milestones to unlock higher-tier content and increasingly complex mechanics.

## Documentation

- **[Game Mechanics](docs/game-mechanics.md)**: Detailed overview of core mechanics and features
- **[Resources](docs/resources.md)**: Complete resource types, production, and management
- **[Buildings and Units](docs/buildings-and-units.md)**: Full catalog of buildings and military units
- **[Architecture](docs/architecture.md)**: System design and component relationships
- **[Development Plan](docs/development-plan.md)**: Roadmap, milestones, and timelines
- **[User Guide](docs/user-guide.md)**: Step-by-step gameplay walkthrough
- **[Getting Started for Contributors](docs/getting-started-for-contributors.md)**: Development setup and contribution guidelines
- **[FAQ](docs/faq.md)**: Answers to common questions
- **[Release Notes](docs/release-notes.md)**: Change log between versions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lord-of-the-text
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

For development setup and contribution guidelines, see [Getting Started for Contributors](docs/getting-started-for-contributors.md).

### Other Scripts

- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm test`: Executes tests using Vitest.
