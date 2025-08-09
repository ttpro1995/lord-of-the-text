Refer from unit-list.json in same folder.
---

# Unit List

This document provides a detailed list of units, categorized by tiers, along with their stats, costs, special abilities, and building requirements. Additionally, it includes information on upkeep and unit caps.

## Table of Contents
- [Tier 0 Units](#tier-0-units)
- [Tier 1 Units](#tier-1-units)
- [Tier 2 Units](#tier-2-units)
- [Tier 3 Units](#tier-3-units)
- [Tier 4 Units](#tier-4-units)
- [Siege Units](#siege-units)
- [Upkeep and Caps](#upkeep-and-caps)

---

## Tier 0 Units

| Unit Name      | ATK | DEF | Cost             | Special Ability | Building         |
|----------------|-----|-----|------------------|-----------------|------------------|
| Peasant Spear  | 2   | 1   | 10 Food          | None            | Barracks Lv.1    |

---

## Tier 1 Units

| Unit Name      | ATK | DEF | Cost                  | Special Ability                        | Building         |
|----------------|-----|-----|-----------------------|----------------------------------------|------------------|
| Footman        | 5   | 4   | 15 Food, 5 Iron       | None                                   | Barracks Lv.1    |
| Hunter         | 6   | 2   | 12 Food, 8 Timber     | +25% vs Monsters                       | Archery Range Lv.1 |
| Scout          | 3   | 2   | 20 Food, 10 Gold      | First-Strike (ignore 50% enemy DEF on first round) | Stable Lv.1 |

---

## Tier 2 Units

| Unit Name      | ATK | DEF | Cost                  | Special Ability                        | Building         |
|----------------|-----|-----|-----------------------|----------------------------------------|------------------|
| Swordsman      | 8   | 6   | 25 Food, 10 Iron      | Shield-Wall (+1 DEF per 5 Swordsmen)   | Barracks Lv.2    |
| Longbowman     | 10  | 3   | 18 Food, 12 Timber    | Pierce (ignore 25% DEF)                | Archery Range Lv.2 |
| Light Cavalry  | 7   | 5   | 30 Food, 15 Gold      | Flank (extra ATK if enemy has no cavalry) | Stable Lv.2   |
| Catapult       | 12  | 2   | 40 Food, 25 Stone, 20 Iron | Siege (double damage vs Castle territories) | Siege Workshop Lv.1 |

---

## Tier 3 Units

| Unit Name      | ATK | DEF | Cost                  | Special Ability                        | Building         |
|----------------|-----|-----|-----------------------|----------------------------------------|------------------|
| Knight         | 15  | 12  | 50 Food, 30 Iron, 20 Gold | Charge (first attack ignores 50% DEF) | Stable Lv.3      |
| Arbalester     | 14  | 5   | 35 Food, 15 Iron, 20 Timber | Armor-Piercing (25% chance to bypass DEF) | Archery Range Lv.3 |
| Pikeman        | 10  | 15  | 30 Food, 25 Iron      | Anti-Cavalry (x1.5 ATK vs mounted)     | Barracks Lv.3    |
| Trebuchet      | 18  | 4   | 60 Food, 40 Stone, 30 Iron | Devastate (each hit permanently reduces enemy DEF by 1) | Siege Workshop Lv.2 |

---

## Tier 4 Units

| Unit Name      | ATK | DEF | Cost                  | Special Ability                        | Source           |
|----------------|-----|-----|-----------------------|----------------------------------------|------------------|
| Paladin        | 20  | 18  | 100 Food, 60 Iron, 50 Faith | Holy Aura (+10% ATK/DEF to all human units) | Temple       |
| Forest Warden  | 18  | 12  | 80 Food, 40 Timber, 30 Pelts | Guerrilla (+50% ATK on Forest territories) | Deepwood Village |
| Dwarven Cannoneer | 22 | 8  | 120 Iron, 60 Stone, 50 Gold | Explosive Shell (20% chance for 2× damage) | Mountain Hold |
| Vampire Lord   | 25  | 15  | 100 Food, 80 Iron, 30 Faith | Life-Drain (heal 25% of damage dealt) | Haunted Castle |
| Sand Striker   | 16  | 10  | 70 Food, 35 Gold      | Sandstorm (–3 enemy ATK)               | Desert Outpost  |

---

## Siege Units

| Unit Name      | ATK | DEF | Cost                  | Special Ability                        | Building         |
|----------------|-----|-----|-----------------------|----------------------------------------|------------------|
| Battering Ram  | 8   | 12  | 50 Timber, 30 Iron    | +100% vs Gates                         | Siege Workshop Lv.1 |
| Siege Tower    | 6   | 20  | 40 Timber, 50 Stone   | Wall Bypass (ignore 30% DEF)           | Siege Workshop Lv.2 |
| Bombard        | 25  | 6   | 100 Iron, 80 Stone    | Splash (damage adjacent enemy stacks)  | Siege Workshop Lv.3 |

---

## Upkeep and Caps

### Upkeep Formula
- **Cost**: 1 Food per minute per tier of the unit.

### Unit Caps
The maximum number of units you can maintain is determined by the level of specific buildings:

| Unit Type   | Cap Increase Formula         |
|-------------|------------------------------|
| Infantry    | +5 per Barracks level        |
| Ranged      | +5 per Archery Range level   |
| Cavalry     | +5 per Stable level          |
| Siege       | Global cap tied to Siege Workshop level |

---

This Markdown document provides a clear, organized, and detailed view of the units, their stats, costs, special abilities, and upkeep requirements. You can copy this content into a `unit-list.md` file and use it as part of your project documentation. Let me know if you'd like further refinements or additional sections!