# Buildings and Units

This document provides detailed information on buildings and military units in Lord of the Text.

## Buildings

### Resource Production

| Building | Purpose | Base Production | Upgrade Effects |
|----------|---------|-----------------|-----------------|
| Lumber Camp / Sawmill | Timber production | +5 Timber/min | +20% production/upgrade level |
| Quarry | Stone production | +4 Stone/min | +25% production/upgrade level |
| Iron Mine | Iron production | +3 Iron/min | +20% production/upgrade level |
| Farm / Orchard / Pasture | Food production | +8 Food/min | +15% production/upgrade level |
| Hunting Lodge | Food + rare pelts | Food + trade items | +15% production/upgrade level |
| Fishing Wharf | Steady food supply | Food production | Low seasonal fluctuation |
| Gold Mine | Gold production | +2 Gold/min | +15% production/upgrade level |

### Military & Training

| Building | Purpose | Features |
|----------|---------|----------|
| Barracks | Infantry training | Trains basic infantry units |
| Archery Range | Ranged unit training | Trains archers for defense/siege |
| Stable | Cavalry production | Trains mounted units for mobility |
| Siege Workshop | Siege engine construction | Builds catapults, trebuchets |
| Guard Tower | Base defense | Provides passive defense bonus |

### Infrastructure & Administration

| Building | Purpose | Effect |
|----------|---------|--------|
| Marketplace | Trade and conversion | Allows resource exchange |
| Blacksmith / Armorer | Equipment upgrades | Improves troop equipment |
| Town Hall | Tax income increase | Generates passive gold |
| Granary / Storehouse | Storage expansion | Increases food storage |
| Road Network | Trade efficiency | Boosts trade and movement |

### Cultural & Prestige

| Building | Purpose | Effect |
|----------|---------|--------|
| Temple / Shrine | Faith generation | Produces faith for blessings |
| Library / Scholar's Hall | Knowledge production | Generates knowledge for tech research |
| Monument / Statue | Prestige boost | Increases prestige passively |
| Guild Hall | Special perks | Unlocks mercenaries or bonuses |

## Building Details

### Lumber Camp
- **Production**: +5 Timber per minute at Level 1
- **Upgrade**: +20% per level
- **Cost**: 50 Timber, 30 Stone
- **Dependencies**: None

### Quarry
- **Production**: +4 Stone per minute at Level 1
- **Upgrade**: +25% per level
- **Cost**: 40 Timber, 50 Food
- **Dependencies**: None
- **Note**: Critical for defensive structures

### Iron Mine
- **Production**: +3 Iron per minute at Level 1
- **Upgrade**: +20% per level
- **Cost**: 60 Timber, 50 Stone
- **Dependencies**: Quarry Level 2

### Farm
- **Production**: +8 Food per minute at Level 1
- **Upgrade**: +15% per level
- **Cost**: 30 Timber
- **Note**: mantener population and armies

### Warehouse
- **Capacity Increase**: +500 units per level for Timber/Stone/Iron
- **Cost**: 60 Timber, 40 Stone
- **Dependencies**: Lumber Camp Level 2

### Granary
- **Capacity Increase**: +400 units per level for Food
- **Cost**: 40 Timber, 60 Stone
- **Dependencies**: Farm Level 2

### Barracks
- **Unit Cap Increase**: +5 per level for infantry
- **Cost**: 100 Timber, 80 Stone, 50 Food
- **Dependencies**: Farm Level 2

### Library
- **Production**: +1 Knowledge per minute at Level 1
- **Upgrade**: Unlocks tech, increases gain
- **Cost**: 80 Timber, 60 Stone, 40 Gold
- **Dependencies**: Marketplace Level 2

### Temple
- **Production**: +1 Faith per minute at Level 1
- **Upgrade**: Unlocks blessings, boosts faith
- **Cost**: 80 Timber, 80 Stone, 20 Gold

### Monument
- **Prestige**: +X Prestige score
- **Cost**: 200 Timber, 150 Stone, 100 Gold
- **Dependencies**: Temple Level 3

## Units

### Unit Stats Format
Each unit has Attack (ATK), Defense (DEF), costs, special abilities, and building requirements.

### Tier 0 Units
|(resume)
| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Peasant Spear  | 2   | 1   | 10 Food          | None            | Barracks Lv.1    |

### Tier 1 Units
| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Footman        | 5   | 4   | 15 Food, 5 Iron | None            | Barracks Lv.1    |
| Hunter         | 6   | 2   | 12 Food         | +25% vs Monsters | Archery Range Lv.1 |
| Scout          | 3   | 2   | 20 Food         | First-Strike    | Stable Lv.1      |

### Tier 2 Units
| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Swordsman      | 8   | 6   | 25 Food, 10 Iron | Shield-Wall     | Barracks Lv.2    |
| Longbowman     | 10  | 3   | 18 Food         | Pierce          | Archery Range Lv.2 |
| Light Cavalry  | 7   | 5   | 30 Food         | Flank           | Stable Lv.2      |
| Catapult       | 12  | 2   | 40 Food, 25 Stone| Siege           | Siege Workshop Lv.1 |

### Tier 3 Units
| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Knight         | 15  | 12 | 50 Food         | Charge          | Stable Lv.3      |
| Arbalester     | 14  | 5  | 35 Food         | Armor-Piercing  | Archery Range Lv.3 |
| Pikeman        | 10  | 15 | 30 Food         | Anti-Cavalry    | Barracks Lv.3    |
| Trebuchet      | 18  | 4  | 60 Food         | Devastate       | Siege Workshop Lv.2 |

### Tier 4 Units
| Unit Name      | ATK | DEF | Cost             | Special Ability | Source           |
|----------------|-----|-----|------------------|-----------------|------------------|
| Paladin        | 20  | 18 | 100 Food, Faith | Holy Aura       | Temple           |
| Forest Warden  | 18  | 12 | 80 Food, Pelts  | Guerrilla       | Deepwood Village |
| Dwarven Cannoneer | 22 | 8  | 120 Iron       | Explosive Shell | Mountain Hold    |
| Vampire Lord   | 25  | 15 | 100 Food, Faith | Life-Drain      | Haunted Castle   |
| Sand Striker   | 16  | 10 | 70 Food        | Sandstorm       | Desert Outpost   |

### Siege Units
| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Battering Ram  | 8   | 12 | 50 Timber      | +100% vs Gates | Siege Workshop Lv.1 |
| Siege Tower    | 6   | 20 | 40 Timber      | Wall Bypass     | Siege Workshop Lv.2 |
| Bombard        | 25  | 6  | 100 Iron       | Splash Damage   | Siege Workshop Lv.3 |

## Unit Caps and Upkeep

### Upkeep Formula
- **Cost**: 1 Food per minute per tier of the unit
- Tier 0 = 1, Tier 1 = 2, etc.

### Unit Caps
- Infantry: +5 per Barracks level (base 5)
- Ranged: +5 per Archery Range level (base 5)
- Cavalry: +5 per Stable level (base 5)
- Siege: Global cap tied to Siege Workshop level

### Training System
- Units train one at a time or in batches
- Training times vary by unit complexity
- Training consumes resources immediately