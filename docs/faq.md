# Frequently Asked Questions

Common questions about Lord of the Text.

## Getting Started

### Q: What is Lord of the Text?
A: Lord of the Text is an incremental base-building game where you manage a kingdom as a lord. Build structures, gather resources, train armies, and conquer territories in a medieval fantasy setting.

### Q: How do I start playing?
A: Clone the repository, run `npm install` then `npm run dev`. Open your browser to the dev server URL and start building!

### Q: Is the game hard to learn?
A: The game has a gentle learning curve. Start by building a Lumber Camp and Warehouse, then expand systematically. The core loop is intuitive once you grasp resource management.

### Q: Where does my progress save?
A: LocalStorage automatically saves your progress every 10 seconds. No account needed!

## Resources

### Q: What do the 7 resources do?
- **Timber**: Construction material for most buildings
- **Stone**: Used for fortifications and advanced buildings
- **Iron**: Required for weapons, armor, and military upgrades
- **Food**: Consumed by troops and population
- **Gold**: Premium currency for high-tier content
- **Knowledge**: Used to research technologies
- **Faith**: Powers holy units and spiritual bonuses

### Q: Why do my resources stop producing?
A: You're likely hitting storage caps. Build/upgrade Warehouses (for Timber/Iron/Stone) or Granaries (for Food) to increase capacity.

### Q: How do I get more Gold?
A: Build Gold Mines (after research), conquer towns/cities, or build Marketplace for trading.

## Buildings

### Q: Why can't I build a building?
A: Check dependencies. For example:
- Iron Mine requires Quarry Level 2
- Barracks requires Farm Level 2
- Higher-tier buildings need specific prerequisites

### Q: How do building upgrades work?
A: Upgrades increase production by 15-25% and occasionally unlock new features. Costs scale exponentially.

### Q: What's the difference between Granary and Warehouse?
A: Warehouse stores Timber/Stone/Iron. Granary stores Food only.

## Military & Units

### Q: How do unit training costs work?
A: Base costs vary by unit. Upkeep is 1 Food per minute per tier (Tier 0 = 1 Food, Tier 1 = 2 Food, etc.).

### Q: What's a "unit cap" and how do I increase it?
A: Maximum troops you can maintain. Increase by upgrading military buildings (+5 per Barracks level for infantry, etc.).

### Q: How do I conquer territories?
A: Build army in Army Manager tab, select target, attack if your strength > their defense. Success gives rewards!

### Q: What units should I train?
A: Mixed composition:
- Infantry for defense/conquest
- Archers for ranged support
- Cavalry for flanking mobility
- Siege for fortified targets

## Progression

### Q: How do I unlock new content?
A: Research technologies with Knowledge (from Libraries) to unlock higher-tier buildings, units, and features.

### Q: Are there different base types?
A: Yes! Conquered territories become specialized bases:
- City: Economic bonuses
- Castle: Military focus
- Village: Agricultural hub
- Temple: Faith generation
- Fortress Outpost: Conquest bonuses

## Technical Issues

### Q: The game freezes/onisn't responsive?
A: Try refreshing the page or clearing browser cache. If it persists, check console for errors and report.

### Q: Why do I lose progress when reopening browser?
A: Ensure localStorage is enabled. Pop-up blockers may interfere. Try in incognito mode.

### Q: Can I play offline?
A: Yes! Resources accumulate up to storage caps when offline. Progress saves locally.

### Q: Is there mobile support?
A: The UI is responsive but optimized for desktop. Mobile features are planned.

## Gameplay Tips

### Q: How do I get better at the game?
A: Focus on dependency chains. Build Quarries early for Iron Mines. Upgrade storage frequently. Diversify unit types.

### Q: What's the best early strategy?
A: Build dependency unlock order: Farm → Barracks → basic troops → conquer → expand bases.

### Q: How do I achieve "prestige"?
A: Conquer territories and build monuments. Higher prestige unlocks cosmetics and multipliers.

### Q: Are there achievements?
A: Not in current version (v0.3), but planned for future milestones.

## Development & Community

### Q: Where can I report bugs?
A: Create issues on the GitHub repository with steps to reproduce.

### Q: Can I contribute to development?
A: Absolutely! See our [Contributing Guide](getting-started-for-contributors.md) for setup and coding standards.

### Q: Will there be more features?
A: Yes! Roadmap includes events, policies, technologies, achievements, and prestige rebirth.

### Q: What's the planned release version?
A: Targeting v1.0 with full features, polish, and deployment. Currently at v0.3.

## Advanced Questions

### Q: How does the autosave system work technically?
A: Uses browser localStorage to serialize game state every 10s and on critical changes. Loads on game start.

### Q: Can I reset my progress?
A: Ja, planned feature in Settings panel for prestige rebirth with permanent multipliers.

### Q: What's future content?
A: Random events, multiple policies per base, expanded tech tree, holy units, merchant system.