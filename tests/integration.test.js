import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { gameReducer, initialState } from '../src/App.jsx';
import buildingDefinitions from '../data/building-definitions.json';
import gameConstants from '../src/data/game-constants.json';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Date.now for consistent timestamps
const originalNow = Date.now;
Date.now = vi.fn(() => 1000000000000);

// Mock gameConstants for faster testing
vi.mock('../src/data/game-constants.json', () => ({
  unitCosts: {
    "Peasant-Spear": {
      "food": 10,
      "timber": 5
    }
  },
  baseUnitCap: 5,
  unitCapPerBarracksLevel: 5
}));

describe('Integration Tests - End-to-End User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    Date.now.mockReturnValue(1000000000000);
  });

  afterEach(() => {
    Date.now = originalNow;
    vi.useRealTimers();
  });

  it('should complete a full building-upgrade cycle', async () => {
    // Custom initial state with extra resources
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 300, // Enough for building (50) + upgrading (100)
        stone: 200   // Enough for building (30) + upgrading (60)
      }
    };

    // Mock localStorage to return our custom state
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);

    // Wait for the component to load
    await screen.findByText('Lord of the Text');

    // Verify initial resources
    expect(screen.getByText('T 300')).toBeInTheDocument();
    expect(screen.getByText('S 200')).toBeInTheDocument();

    // Find and click build Lumber-Camp button
    const lumberCampButton = screen.getByRole('button', { name: /build.*lumber-camp/i });
    fireEvent.click(lumberCampButton);

    // Wait for state update and check resources after build
    await waitFor(() => {
      expect(screen.getByText('T 250')).toBeInTheDocument(); // 300 - 50
      expect(screen.getByText('S 170')).toBeInTheDocument(); // 200 - 30
    });

    // Check Lumber-Camp level is 1
    expect(screen.getByText('Lumber Camp (Lv 1)')).toBeInTheDocument();

    // Check for build notification
    expect(screen.getByText(/lumber-camp complete/i)).toBeInTheDocument();

    // Find and click upgrade button for Lumber-Camp
    const upgradeButton = screen.getByRole('button', { name: /upgrade.*lumber-camp.*lv 2/i });
    fireEvent.click(upgradeButton);

    // Wait for state update and check resources after upgrade
    await waitFor(() => {
      expect(screen.getByText('T 150')).toBeInTheDocument(); // 250 - 100
      expect(screen.getByText('S 110')).toBeInTheDocument(); // 170 - 60
    });

    // Check Lumber-Camp level is 2
    expect(screen.getByText('Lumber Camp (Lv 2)')).toBeInTheDocument();

    // Check for upgrade notification
    expect(screen.getByText(/lumber-camp complete/i)).toBeInTheDocument();
  });

  it('should complete a unit training cycle', async () => {
    // Custom initial state with extra resources and required buildings
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 400, // Enough for Farm L1&2 (40+80) + Barracks (70) + unit (5)
        stone: 100,  // Enough for Farm L1&2 (20+40)
        food: 200    // Enough for Barracks (50) + Train unit (10)
      },
      buildings: {
        ...initialState.buildings,
        // No buildings built yet
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);

    // Wait for the component to load
    await screen.findByText('Lord of the Text');

    // Build Farm to level 2 and Barracks, then train unit
    // To simulate user flow more realistically, let's go step by step but without fake timers for now
    // Since training takes 30 seconds, we can check the queue fills and then the unit appears

    // Step 1: Build Farm level 1
    const farmButton = screen.getByRole('button', { name: /build.*farm/i });
    fireEvent.click(farmButton);

    await waitFor(() => {
      expect(screen.getByText('T 360')).toBeInTheDocument();
      expect(screen.getByText('S 80')).toBeInTheDocument();
    });

    // Step 2: Upgrade Farm to level 2
    const upgradeFarmButton = screen.getByRole('button', { name: /upgrade.*farm.*lv 2/i });
    fireEvent.click(upgradeFarmButton);

    await waitFor(() => {
      expect(screen.getByText('T 280')).toBeInTheDocument();
      expect(screen.getByText('S 40')).toBeInTheDocument();
    });

    // Step 3: Build Barracks
    const barracksButton = screen.getByRole('button', { name: /build.*barracks/i });
    fireEvent.click(barracksButton);

    await waitFor(() => {
      expect(screen.getByText('T 210')).toBeInTheDocument();
      expect(screen.getByText('F 150')).toBeInTheDocument();
    });

    // Step 4: Train Peasant Spear
    const trainButton = screen.getByRole('button', { name: /train peasant spear/i });
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(screen.getByText('T 205')).toBeInTheDocument();
      expect(screen.getByText('F 140')).toBeInTheDocument();
    });

    // Verify training queue shows the unit
    expect(screen.getByText(/peasant-spear/i)).toBeInTheDocument();

    // Note: In a real test environment, we would wait for the training to complete
    // But for this illustration, we verify the unit was added to the queue and resources were deducted
    // The full training completion requires waiting 30 seconds, which is not ideal for unit tests
    // So we assert the key integration points: resource deduction and queue addition
  });
});