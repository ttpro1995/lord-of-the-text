import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../src/hooks/useKeyboardShortcuts';
import { useMultiSelect } from '../src/hooks/useMultiSelect';
import { useHapticFeedback } from '../src/hooks/useHapticFeedback';

describe('useKeyboardShortcuts hook', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should register keydown event listener on mount', () => {
    const shortcuts = { 'b': vi.fn() };
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should call handler when correct key is pressed', () => {
    const handler = vi.fn();
    const shortcuts = { 'b': handler };
    
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    // Get the handler from the spy
    const keydownHandler = addEventListenerSpy.mock.calls[0][1];
    
    act(() => {
      keydownHandler({ key: 'b', target: { tagName: 'BODY' }, preventDefault: vi.fn() });
    });
    
    expect(handler).toHaveBeenCalled();
  });

  it('should not call handler when input element is focused', () => {
    const handler = vi.fn();
    const shortcuts = { 'b': handler };
    
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    const keydownHandler = addEventListenerSpy.mock.calls[0][1];
    
    act(() => {
      keydownHandler({ key: 'b', target: { tagName: 'INPUT' }, preventDefault: vi.fn() });
    });
    
    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const shortcuts = { 'b': vi.fn() };
    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('useMultiSelect hook', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.isMultiSelectMode).toBe(false);
  });

  it('should toggle selection', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    act(() => {
      result.current.toggleSelect('1');
    });
    
    expect(result.current.selectedIds.size).toBe(1);
    expect(result.current.isSelected('1')).toBe(true);
    
    act(() => {
      result.current.toggleSelect('1');
    });
    
    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.isSelected('1')).toBe(false);
  });

  it('should select range of items', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    act(() => {
      result.current.selectRange('1', '3', ['1', '2', '3']);
    });
    
    expect(result.current.selectedIds.size).toBe(3);
    expect(result.current.isSelected('1')).toBe(true);
    expect(result.current.isSelected('2')).toBe(true);
    expect(result.current.isSelected('3')).toBe(true);
  });

  it('should clear selection', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    act(() => {
      result.current.toggleSelect('1');
      result.current.toggleSelect('2');
    });
    
    expect(result.current.selectedIds.size).toBe(2);
    
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('should get selected items', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    act(() => {
      result.current.toggleSelect('1');
      result.current.toggleSelect('2');
    });
    
    const selectedItems = result.current.getSelectedItems();
    expect(selectedItems).toHaveLength(2);
    expect(selectedItems[0].id).toBe('1');
    expect(selectedItems[1].id).toBe('2');
  });

  it('should update isMultiSelectMode when selection changes', () => {
    const { result } = renderHook(() => useMultiSelect(mockItems));
    
    expect(result.current.isMultiSelectMode).toBe(false);
    
    act(() => {
      result.current.toggleSelect('1');
    });
    
    expect(result.current.isMultiSelectMode).toBe(true);
  });
});

describe('useHapticFeedback hook', () => {
  let vibrateMock;

  beforeEach(() => {
    vibrateMock = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vibrateMock.mockRestore?.();
  });

  it('should have isSupported property', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    expect(result.current.isSupported).toBe(true);
  });

  it('should call vibrate with pattern', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    act(() => {
      result.current.vibrate([10, 20, 30]);
    });
    
    expect(vibrateMock).toHaveBeenCalledWith([10, 20, 30]);
  });

  it('should call impactLight with default pattern', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    act(() => {
      result.current.impactLight();
    });
    
    expect(vibrateMock).toHaveBeenCalledWith(10);
  });

  it('should call impactMedium with longer pattern', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    act(() => {
      result.current.impactMedium();
    });
    
    expect(vibrateMock).toHaveBeenCalledWith(20);
  });

  it('should call impactHeavy with longest pattern', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    act(() => {
      result.current.impactHeavy();
    });
    
    expect(vibrateMock).toHaveBeenCalledWith(30);
  });
});