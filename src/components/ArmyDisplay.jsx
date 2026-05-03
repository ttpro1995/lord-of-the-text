import { useState } from 'react';
import { useMultiSelect } from '../hooks/useMultiSelect';

export default function ArmyDisplay({
  units,
  unitCap,
  onDismissUnit,
  onBulkDismiss
}) {
  const {
    selectedIds,
    isSelected,
    toggleSelect,
    clearSelection,
    getSelectedItems,
    isMultiSelectMode
  } = useMultiSelect(units);

  const [lastSelectedId, setLastSelectedId] = useState(null);

  const handleUnitClick = (unitId, e) => {
    if (e.ctrlKey || e.metaKey) {
      toggleSelect(unitId);
    } else if (e.shiftKey && lastSelectedId) {
      const unitIds = units.map(u => u.id);
      const lastIndex = unitIds.indexOf(lastSelectedId);
      const currentIndex = unitIds.indexOf(unitId);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      
      const rangeIds = unitIds.slice(start, end + 1);
      rangeIds.forEach(id => toggleSelect(id));
    } else {
      if (selectedIds.size > 0 && isSelected(unitId)) {
        clearSelection();
      } else {
        clearSelection();
        toggleSelect(unitId);
      }
    }
    setLastSelectedId(unitId);
  };

  const handleBulkDismiss = () => {
    const selectedUnits = getSelectedItems();
    if (selectedUnits.length > 0 && window.confirm(`Dismiss ${selectedUnits.length} unit(s)?`)) {
      onBulkDismiss(selectedUnits.map(u => u.id));
      clearSelection();
    }
  };

  if (units.length === 0) {
    return (
      <div className="units">
        <h3>Your Army</h3>
        <div className="unit-cap-display">
          <p>Total Units: 0/{unitCap}</p>
        </div>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No units trained yet</p>
      </div>
    );
  }

  return (
    <div className="units">
      <h3>Your Army</h3>
      <div className="unit-cap-display">
        <p>Total Units: {units.length}/{unitCap}</p>
      </div>
      
      {isMultiSelectMode && (
        <div className="bulk-actions">
          <button 
            className="bulk-dismiss-button"
            onClick={handleBulkDismiss}
          >
            🗑️ Dismiss Selected ({selectedIds.size})
          </button>
          <button 
            className="clear-selection-button"
            onClick={clearSelection}
          >
            ✕ Clear Selection
          </button>
        </div>
      )}
      
      <div className="unit-list">
        {units.map((unit) => (
          <div 
            key={unit.id} 
            className={`unit-item ${isSelected(unit.id) ? 'selected' : ''}`}
            onClick={(e) => handleUnitClick(unit.id, e)}
          >
            <span>🗡️ {unit.type.replace('-', ' ')}</span>
            <button
              className="dismiss-unit-button"
              onClick={(e) => {
                e.stopPropagation();
                onDismissUnit(unit.id);
              }}
              title="Dismiss this unit"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}