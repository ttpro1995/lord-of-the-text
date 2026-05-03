import { useState, useCallback } from 'react';

export function useMultiSelect(items) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectRange = useCallback((startId, endId, allIds) => {
    const startIndex = allIds.indexOf(startId);
    const endIndex = allIds.indexOf(endId);
    const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      for (let i = min; i <= max; i++) {
        next.add(allIds[i]);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback(() => {
    return items.filter(item => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const isMultiSelectMode = selectedIds.size > 0;

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    selectRange,
    clearSelection,
    getSelectedItems,
    isMultiSelectMode,
  };
}