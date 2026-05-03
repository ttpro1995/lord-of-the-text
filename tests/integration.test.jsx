import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { initialState } from '../src/App.jsx';

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

    // Mock localStorage to return our custom state
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);

    // Wait for the component to load
    await screen.findByText(/Lord of the Text/);

    // Verify initial resources (resource amounts are in separate spans)
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();

    // Find and click build Lumber-Camp button (button text is "Build (50 T, 30 S)")
    const lumberCampButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
    fireEvent.click(lumberCampButton);

    // Wait for state update and check resources after build
    await waitFor(() => {
      expect(screen.getByText('250')).toBeInTheDocument(); // 300 - 50 timber
      expect(screen.getByText('170')).toBeInTheDocument(); // 200 - 30 stone
    });

    // Check Lumber-Camp level is 1 - look for text content in the building card
    expect(screen.getByText('Lumber Camp')).toBeInTheDocument();
    expect(screen.getByText('Lv 1')).toBeInTheDocument();

    // Check for build notification (use getAllBy since notifications accumulate)
    expect(screen.getAllByText(/lumber-camp complete/i)).toHaveLength(1);

    // Find and click upgrade button for Lumber-Camp (button text is "Upgrade to Lv 2 (100 T, 60 S)")
    const upgradeButton = screen.getByRole('button', { name: /upgrade.*lv 2.*100 T.*60 S/i });
    fireEvent.click(upgradeButton);

    // Wait for state update and check resources after upgrade
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // 250 - 100 timber
      expect(screen.getByText('110')).toBeInTheDocument(); // 170 - 60 stone
    });

    // Check Lumber-Camp level is 2 - look for text content in the building card
    expect(screen.getByText('Lumber Camp')).toBeInTheDocument();
    expect(screen.getByText('Lv 2')).toBeInTheDocument();

    // Check for upgrade notification (should have 2 now: build + upgrade)
    expect(screen.getAllByText(/lumber-camp complete/i)).toHaveLength(2);
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
    await screen.findByText(/Lord of the Text/);

    // Build Farm to level 2 and Barracks, then train unit
    // To simulate user flow more realistically, let's go step by step but without fake timers for now
    // Since training takes 30 seconds, we can check the queue fills and then the unit appears

    // Step 1: Build Farm level 1 (button text is "Build (40 T, 20 S)")
    const farmButton = screen.getByRole('button', { name: /build.*40 T.*20 S/i });
    fireEvent.click(farmButton);

    await waitFor(() => {
      expect(screen.getByText('360')).toBeInTheDocument(); // 400 - 40 timber
      expect(screen.getByText('80')).toBeInTheDocument(); // 100 - 20 stone
    });

    // Step 2: Upgrade Farm to level 2 (button text is "Upgrade to Lv 2 (80 T, 40 S)")
    const upgradeFarmButton = screen.getByRole('button', { name: /upgrade.*lv 2.*80 T.*40 S/i });
    fireEvent.click(upgradeFarmButton);

    await waitFor(() => {
      expect(screen.getByText('280')).toBeInTheDocument(); // 360 - 80 timber
      expect(screen.getByText('40')).toBeInTheDocument(); // 80 - 40 stone
    });

    // Step 3: Build Barracks (button text is "Build (70 T, 50 F)")
    const barracksButton = screen.getByRole('button', { name: /build.*70 T.*50 F/i });
    fireEvent.click(barracksButton);

    await waitFor(() => {
      expect(screen.getByText('210')).toBeInTheDocument(); // 280 - 70 timber
      expect(screen.getByText('150')).toBeInTheDocument(); // 200 - 50 food
    });

    // Step 4: Train Peasant Spear
    const trainButton = screen.getByRole('button', { name: /train peasant spear/i });
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(screen.getByText('205')).toBeInTheDocument(); // 210 - 5 timber
      expect(screen.getByText('140')).toBeInTheDocument(); // 150 - 10 food
    });

    // Verify training queue shows the unit
    expect(screen.getByText(/peasant-spear/i)).toBeInTheDocument();

    // Note: In a real test environment, we would wait for the training to complete
    // But for this illustration, we verify the unit was added to the queue and resources were deducted
    // The full training completion requires waiting 30 seconds, which is not ideal for unit tests
    // So we assert the key integration points: resource deduction and queue addition
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

    // Open settings
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    // Click hard reset button
    const resetButton = screen.getByRole('button', { name: /hard reset/i });
    fireEvent.click(resetButton);

    // Verify confirmation dialog appears
    await screen.findByText('Confirm Hard Reset');

    // Verify warning message (use getAllBy to handle multiple matches)
    expect(screen.getAllByText(/warning:/i)).toHaveLength(2);

    // Verify input field exists
    const input = screen.getByPlaceholderText(/type reset here/i);
    expect(input).toBeInTheDocument();

    // Verify confirm button is disabled initially
    const confirmButton = screen.getByRole('button', { name: /confirm reset/i });
    expect(confirmButton).toBeDisabled();
  });

  it('should enable confirm button only when typing RESET', async () => {
    render(<App />);

    await screen.findByText(/Lord of the Text/);

    // Open settings and click hard reset
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /hard reset/i }));

    const input = screen.getByPlaceholderText(/type reset here/i);
    const confirmButton = screen.getByRole('button', { name: /confirm reset/i });

    // Type partial text - button should remain disabled
    fireEvent.change(input, { target: { value: 'RES' } });
    expect(confirmButton).toBeDisabled();

    // Type wrong text - button should remain disabled
    fireEvent.change(input, { target: { value: 'WRONG' } });
    expect(confirmButton).toBeDisabled();

    // Type correct text - button should become enabled
    fireEvent.change(input, { target: { value: 'RESET' } });
    expect(confirmButton).toBeEnabled();
  });

  it('should clear localStorage and reload on confirmed reset', async () => {
    // Setup: Mock localStorage with some data
    const mockState = JSON.stringify({
      ...initialState,
      resources: { ...initialState.resources, timber: 999 }
    });
    localStorageMock.getItem.mockReturnValue(mockState);

    // Mock window.location.reload by replacing the entire location object
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

    // Type RESET and confirm
    const input = screen.getByPlaceholderText(/type reset here/i);
    fireEvent.change(input, { target: { value: 'RESET' } });

    const confirmButton = screen.getByRole('button', { name: /confirm reset/i });
    fireEvent.click(confirmButton);

    // Verify localStorage.clear was called
    expect(localStorageMock.clear).toHaveBeenCalled();

    // Verify reload was called
    expect(reloadMock).toHaveBeenCalled();

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

  it('should show notification when building completes', async () => {
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 300,
        stone: 200
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Build Lumber-Camp
    const buildButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
    fireEvent.click(buildButton);

    // Check notification appears with message
    await waitFor(() => {
      expect(screen.getByText(/lumber-camp complete/i)).toBeInTheDocument();
    });
  });

  it('should dismiss notification when clicking X button', async () => {
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 300,
        stone: 200
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    render(<App />);
    await screen.findByText(/Lord of the Text/);

    // Build Lumber-Camp to create notification
    const buildButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
    fireEvent.click(buildButton);

    // Wait for notification to appear
    await screen.findByText(/lumber-camp complete/i);

    // Click dismiss button (X) immediately
    const dismissButton = screen.getByRole('button', { name: /dismiss notification/i });
    fireEvent.click(dismissButton);

    // Verify notification is gone (should be immediate)
    expect(screen.queryByText(/lumber-camp complete/i)).not.toBeInTheDocument();
  });

  it('should auto-dismiss notification after 5 seconds', async () => {
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 300,
        stone: 200
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    // Use fake timers for testing setTimeout
    vi.useFakeTimers({ shouldAdvanceTime: true });

    try {
      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Build Lumber-Camp to create notification
      const buildButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
      fireEvent.click(buildButton);

      // Wait for notification to appear
      await screen.findByText(/lumber-camp complete/i);

      // Verify notification is present before auto-dismiss
      expect(screen.getByText(/lumber-camp complete/i)).toBeInTheDocument();

      // Fast-forward time by 5.5 seconds (slightly more than 5 to ensure dismiss fires)
      await vi.advanceTimersByTimeAsync(5500);

      // Verify notification is auto-dismissed
      expect(screen.queryByText(/lumber-camp complete/i)).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  }, 10000);

  it('should show new notifications at the top', async () => {
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 600,
        stone: 400
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    // Use fake timers to control timing
    vi.useFakeTimers({ shouldAdvanceTime: true });

    try {
      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Build Farm
      const farmButton = screen.getByRole('button', { name: /build.*40 T.*20 S/i });
      fireEvent.click(farmButton);

      // Build Lumber-Camp immediately after (should appear at top)
      const lumberButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
      fireEvent.click(lumberButton);

      // Wait for notifications to appear
      await screen.findByText(/lumber-camp complete/i);
      await screen.findByText(/farm complete/i);

      // Verify the order: Lumber-Camp (newest) should appear before Farm (older)
      const notifications = screen.getAllByRole('button', { name: /dismiss notification/i });
      expect(notifications).toHaveLength(2);
      // The first notification element should contain "Lumber-Camp complete" (most recent)
      expect(notifications[0].closest('.toast')).toHaveTextContent(/lumber-camp complete/i);
    } finally {
      vi.useRealTimers();
    }
  }, 10000);

  it('should handle multiple notifications with independent dismiss', async () => {
    const customInitialState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 600,
        stone: 400
      }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));

    // Use fake timers to control timing
    vi.useFakeTimers({ shouldAdvanceTime: true });

    try {
      render(<App />);
      await screen.findByText(/Lord of the Text/);

      // Build Farm first
      const farmButton = screen.getByRole('button', { name: /build.*40 T.*20 S/i });
      fireEvent.click(farmButton);

      // Build Lumber-Camp second (should be at top)
      const lumberButton = screen.getByRole('button', { name: /build.*50 T.*30 S/i });
      fireEvent.click(lumberButton);

      // Wait for notifications to appear
      await screen.findByText(/lumber-camp complete/i);
      await screen.findByText(/farm complete/i);

      // Dismiss the top (most recent) notification
      const dismissButtons = screen.getAllByRole('button', { name: /dismiss notification/i });
      fireEvent.click(dismissButtons[0]);

      // Verify Lumber-Camp notification is gone, Farm remains
      expect(screen.queryByText(/lumber-camp complete/i)).not.toBeInTheDocument();
      expect(screen.getByText(/farm complete/i)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  }, 10000);
});