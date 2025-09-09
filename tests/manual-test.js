/**
 * Manual test script for Milestone 2 - Growing Estate (v0.3)
 *
 * This script provides step-by-step instructions for testing all acceptance criteria.
 * Run this in the browser console to test the application.
 */

console.log("=== Starting Milestone 2 Test ===");

// Test 1: Verify version badge
const versionBadge = document.querySelector('.version-badge');
if (versionBadge && versionBadge.textContent.includes('v0.3')) {
  console.log("✅ Version badge shows v0.3");
} else {
  console.error("❌ Version badge not showing v0.3");
}

// Test 2: Verify all Tier-0/1 buildings have functional cards
const buildingNames = ["Farm", "Quarry", "Iron-Mine", "Barracks", "Warehouse"];
buildingNames.forEach(name => {
  const buildingCard = document.querySelector(`.building-card:has(h3:contains('${name}'))`);
  if (buildingCard) {
    console.log(`✅ ${name} building card found`);
  } else {
    console.error(`❌ ${name} building card not found`);
  }
});

// Test 3: Test dependency gating
console.log("\n=== Testing Dependency Gating ===");

// Check Iron Mine dependency on Quarry Lv 2
const quarryCard = document.querySelector('.building-card:has(h3:contains("Quarry"))');
const ironMineCard = document.querySelector('.building-card:has(h3:contains("Iron-Mine"))');
const ironMineButton = ironMineCard?.querySelector('button');

if (ironMineButton && ironMineButton.disabled) {
  console.log("✅ Iron Mine build button is initially disabled (Quarry dependency)");
} else {
  console.error("❌ Iron Mine build button should be disabled initially");
}

// Check Barracks dependency on Farm Lv 2
const farmCard = document.querySelector('.building-card:has(h3:contains("Farm"))');
const barracksCard = document.querySelector('.building-card:has(h3:contains("Barracks"))');
const barracksButton = barracksCard?.querySelector('button');

if (barracksButton && barracksButton.disabled) {
  console.log("✅ Barracks build button is initially disabled (Farm dependency)");
} else {
  console.error("❌ Barracks build button should be disabled initially");
}

// Test 4: Test unit training
console.log("\n=== Testing Unit Training ===");

// Check initial resources
const resources = {};
document.querySelectorAll('.resource').forEach(res => {
  const name = res.querySelector('.resource-icon').textContent.toLowerCase();
  const amount = parseInt(res.querySelector('.resource-amount').textContent);
  resources[name] = amount;
});

console.log("Initial resources:", resources);

// Test 5: Test unit cap
console.log("\n=== Testing Unit Cap ===");

const unitCapElement = document.querySelector('.unit-training p');
if (unitCapElement && unitCapElement.textContent.includes('Unit Cap:')) {
  console.log("✅ Unit cap is displayed");
} else {
  console.error("❌ Unit cap not displayed");
}

// Test 6: Test toast notifications
console.log("\n=== Testing Toast Notifications ===");

// This would need manual interaction to trigger notifications
console.log("Toast notifications will be tested during manual interaction");

// Test 7: Play test scenario
console.log("\n=== Play Test Scenario ===");
console.log("Follow these steps manually:");
console.log("1. Build Quarry to Lv 2");
console.log("2. Build Iron Mine");
console.log("3. Build Barracks");
console.log("4. Train 5 Peasant Spears");
console.log("5. Close tab for 5 minutes");
console.log("6. Reopen and check persistence");

console.log("\n=== Test Complete ===");
console.log("Please check the console for any errors and verify all functionality manually.");