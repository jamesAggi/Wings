import React, { useState } from 'react';

const ControlPanel = ({ onChange }) => {
  const [parameters, setParameters] = useState({
    span: 10,
    root_chord: 2,
    tip_chord: 1,
    sweep: 20,
    dihedral: 5,
    washout: 2,
    nSeg: 10,
    nAFseg: 50,
  });

  const handleChange = (key, value) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    onChange(newParameters); // Send updated parameters to parent component
  };

  return (
    <div className="control-panel">
      <div>
        <label>Span</label>
        <input
          type="range"
          min="5"
          max="50"
          value={parameters.span}
          onChange={(e) => handleChange('span', e.target.value)}
        />
      </div>
      <div>
        <label>Root Chord</label>
        <input
          type="number"
          value={parameters.root_chord}
          onChange={(e) => handleChange('root_chord', e.target.value)}
        />
      </div>
      <div>
        <label>Tip Chord</label>
        <input
          type="number"
          value={parameters.tip_chord}
          onChange={(e) => handleChange('tip_chord', e.target.value)}
        />
      </div>
      {/* Add other controls similarly */}
    </div>
  );
};

export default ControlPanel;
