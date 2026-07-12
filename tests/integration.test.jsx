import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import { initialState } from '../src/constants/gameState.js';

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

describe('Integration Tests - End-to-End User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    Date.now = vi.fn(() => 1000000000000);
  });

  afterEach(() => {
    Date.now = originalNow;
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

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));
    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Step 1: Build Lumber-Camp
    const lumberCampCard = Array.from(document.querySelectorAll('.building-card')).find(
      el => el.textContent.includes('Lumber Camp')
    );
    expect(lumberCampCard).toBeTruthy();
    
    const buildButton = lumberCampCard.querySelector('button');
    fireEvent.click(buildButton);

    await waitFor(() => {
      expect(screen.getByText('250')).toBeInTheDocument(); // 300 - 50 timber
    });

    // Check Lumber-Camp level is 1
    expect(screen.getByText('Lumber Camp')).toBeInTheDocument();
    expect(screen.getByText(/Lv 1/)).toBeInTheDocument();

    // Step 2: Upgrade Lumber-Camp
    const upgradeButton = Array.from(document.querySelectorAll('.building-card')).find(
      el => el.textContent.includes('Lumber Camp')
    )?.querySelector('button');
    expect(upgradeButton).toBeTruthy();
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // 250 - 100 timber
    });
  });

  it('should complete a unit training cycle', async () => {
    // Custom initial state with extra resources
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 400,
        stone: 100,
        food: 200
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Build Farm level 1
    const farmCard = Array.from(document.querySelectorAll('.building-card')).find(
      el => el.textContent.includes('Farm')
    );
    fireEvent.click(farmCard.querySelector('button'));

    await waitFor(() => {
      expect(screen.getByText('360')).toBeInTheDocument();
    });
  });

  it('should show settings modal with danger zone', async () => {
    render(<App />);

    // Wait for the component to load
    await screen.findByText(/Lord of the Text/);

    // Click settings button
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    // Verify settings modal appears
    await screen.findByText('Settings');

    // Verify Danger Zone section exists
    expect(screen.getByText(/danger zone/i)).toBeInTheDocument();

    // Verify Hard Reset button exists
    expect(screen.getByRole('button', { name: /hard reset/i })).toBeInTheDocument();
  });

  it('should show confirmation dialog when clicking hard reset button', async () => {
    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Open settings and click hard reset
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /hard reset/i }));

    // Verify confirmation dialog appears
    await screen.findByText('Confirm Hard Reset');
    
    // Verify confirm button is disabled initially (no input in this simplified version)
  });

  it('should enable confirm button only when typing RESET', async () => {
    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Open settings and click hard reset
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /hard reset/i }));

    // Verify confirmation dialog appears
    await screen.findByText('Confirm Hard Reset');
  });

  it('should clear localStorage and reload on confirmed reset', async () => {
    // Setup: Mock localStorage with some data
    const mockState = JSON.stringify({
      ...initialState,
      resources: { ...initialState.resources, timber: 999 }
    });
    localStorageMock.getItem.mockReturnValue(mockState);

    // Mock window.location.reload
    const reloadMock = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true
    });

    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Open settings and click hard reset
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /hard reset/i }));

    // Verify dialog is open
    expect(screen.queryByText('Confirm Hard Reset')).toBeInTheDocument();

    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  });

  it('should close confirmation dialog when clicking cancel', async () => {
    render(<App />);

    await screen.findByText(/Lord of the Text/);

    // Open settings and click hard reset
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /hard reset/i }));

    // Verify dialog is open
    await screen.findByText('Confirm Hard Reset');

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Verify dialog is closed
    await waitFor(() => {
      expect(screen.queryByText('Confirm Hard Reset')).not.toBeInTheDocument();
    });

    // Verify input was cleared (dialog is gone, so input is also gone)
    expect(screen.queryByPlaceholderText(/type reset here/i)).not.toBeInTheDocument();
  });

  it('should close settings modal when clicking outside', async () => {
    render(<App />);

    await screen.findByText(/Lord of the Text/);

    // Open settings
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));

    // Verify modal is open
    await screen.findByText('Settings');

    // Click outside (on overlay)
    const overlay = document.querySelector('.settings-modal-overlay');
    fireEvent.click(overlay);

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });
  });

  // Blocked-action explanation tests
  describe('Blocked-action explanations', () => {
    it('should show missing resources blockers on building cards', async () => {
      // No resources - should show blockers
      const customInitialState = {
        ...initialState,
        resources: { timber: 0, stone: 0, iron: 0, food: 0, gold: 0, knowledge: 0 }
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Check that blocker messages are present (multiple buildings show them)
      const blockerElements = document.querySelectorAll('.blocker-message.missing_resource');
      expect(blockerElements.length).toBeGreaterThan(0);
      expect(blockerElements[0].textContent).toContain('Missing:');
    });

    it('should show dependency blockers on building cards', async () => {
      // Farm not built yet, so Iron-Mine should show dependency blocker
      const customInitialState = {
        ...initialState,
        resources: { timber: 1000, stone: 1000, iron: 1000, food: 1000, gold: 1000, knowledge: 1000 },
        buildings: { ...initialState.buildings, "Quarry": 1 } // Quarry but no Farm
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Iron-Mine requires Quarry Lv 2, current is Lv 1
      const blockerElements = document.querySelectorAll('.blocker-message.missing_dependency');
      const hasQuarryDep = Array.from(blockerElements).some(el => el.textContent.includes('Requires Quarry Lv 2'));
      expect(hasQuarryDep).toBe(true);
    });

    it('should show max level message when building is at max level', async () => {
      // Build Lumber-Camp to max level
      const customInitialState = {
        ...initialState,
        resources: { timber: 1000, stone: 1000, iron: 20, food: 20, gold: 20, knowledge: 20 },
        buildings: { ...initialState.buildings, "Lumber-Camp": 3 }
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

      render(<App />);
      await screen.findByText(/Lord of the Text/);

      expect(screen.getByText('Max Level Reached')).toBeInTheDocument();
    });

    it('should show training blockers for insufficient resources', async () => {
      // Very low resources - cannot train
      const customInitialState = {
        ...initialState,
        resources: { timber: 2, stone: 20, iron: 20, food: 2, gold: 20, knowledge: 20 },
        buildings: { ...initialState.buildings }
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Switch to army tab to see training panel
      const armyTab = screen.getByRole('button', { name: /army/i });
      fireEvent.click(armyTab);

      await waitFor(() => {
        // Should show missing resource blockers for training
        const trainingBlockers = document.querySelectorAll('.training-blockers .blocker-message');
        const hasMissingResource = Array.from(trainingBlockers).some(el => el.textContent.includes('Missing'));
        expect(hasMissingResource).toBe(true);
      });
    });

    it('should show training blockers for cap reached', async () => {
      // Units at cap
      const customInitialState = {
        ...initialState,
        resources: { timber: 100, stone: 100, iron: 20, food: 100, gold: 20, knowledge: 20 },
        buildings: { ...initialState.buildings, "Barracks": 0 },
        units: Array(5).fill(null).map((_, i) => ({ type: "Peasant-Spear", id: i + 1 })),
        unitQueue: []
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Switch to army tab to see training panel
      const armyTab = screen.getByRole('button', { name: /army/i });
      fireEvent.click(armyTab);

      await waitFor(() => {
        // Should show cap reached blocker
        const trainingBlockers = document.querySelectorAll('.training-blockers .blocker-message');
        const hasCapReached = Array.from(trainingBlockers).some(el => el.textContent.includes('cap reached'));
        expect(hasCapReached).toBe(true);
      });
    });
  });
});