import React, { useState, useEffect } from 'react';

const ControlPanel = ({ parameters, onChange }) => {
  const [localParameters, setLocalParameters] = useState(parameters); // Use the passed initial parameters

  useEffect(() => {
    setLocalParameters(parameters); // Sync the local state if parameters change
  }, [parameters]);

  const handleChange = (key, value) => {
    const newParameters = { ...localParameters, [key]: value };
    setLocalParameters(newParameters);
    onChange(newParameters); // Send updated parameters to the parent component
  };

  return (
    <div className="control-panel">
      <div>
        <label>Span</label>
        <input
          type="range"
          min="5"
          max="50"
          value={localParameters.span || 24}
          onChange={(e) => handleChange('span', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Root Chord</label>
        <input
          type="number"
          value={localParameters.rootChord || 3.5}
          onChange={(e) => handleChange('rootChord', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Tip Chord</label>
        <input
          type="number"
          value={localParameters.tipChord || 1.75}
          onChange={(e) => handleChange('tipChord', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Sweep</label>
        <input
          type="number"
          value={localParameters.sweep || 0}
          onChange={(e) => handleChange('sweep', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Dihedral</label>
        <input
          type="number"
          value={localParameters.dihedral || 0}
          onChange={(e) => handleChange('dihedral', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Washout</label>
        <input
          type="number"
          value={localParameters.washout || 0}
          onChange={(e) => handleChange('washout', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Number of Segments (nSeg)</label>
        <input
          type="number"
          value={localParameters.nSeg || 10}
          onChange={(e) => handleChange('nSeg', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Number of Airfoil Segments (nAFseg)</label>
        <input
          type="number"
          value={localParameters.nAFseg || 20}
          onChange={(e) => handleChange('nAFseg', Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
