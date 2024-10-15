import React, { useState, useEffect } from 'react';

const ControlPanel = ({ parameters, onChange }) => {
  const [localParameters, setLocalParameters] = useState(parameters || {});

  useEffect(() => {
    if (parameters) {
      setLocalParameters(parameters); // Sync local state if parent parameters change
    }
  }, [parameters]);

  const handleChange = (key, value, min, max) => {
    value = Math.max(min, Math.min(max, value)); // Clamp value between min and max
  
    const newParameters = { ...localParameters, [key]: value };
    setLocalParameters(newParameters);
    onChange(newParameters); // Send updated parameters to the parent component
  };

  const createSliderWithTextbox = (label, key, minKey, maxKey, step, defaultKey) => {
    const min = localParameters[minKey] ?? 0; // Default to 0 if undefined
    const max = localParameters[maxKey] ?? 50; // Default to 50 if undefined
    const defaultValue = localParameters[defaultKey] ?? 0; // Default to 0 if undefined

    return (
      <div className="control-row" key={key}>
        <label>{label}</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localParameters[key] ?? defaultValue}
          onChange={(e) => handleChange(key, Number(e.target.value), min, max)}
          className="control-slider"
        />
        <input
          type="number"
          value={localParameters[key] ?? defaultValue}
          onChange={(e) => handleChange(key, Number(e.target.value), min, max)}
          step={step}
          className="control-textbox"
        />
      </div>
    );
  };

  return (
    <div className="control-panel">
      {createSliderWithTextbox("Span", "span", "spanMin", "spanMax", 1, "span")}
      {createSliderWithTextbox("Root Chord", "rootChord", "rootChordMin", "rootChordMax", 0.1, "rootChord")}
      {createSliderWithTextbox("Tip Chord", "tipChord", "tipChordMin", "tipChordMax", 0.01, "tipChord")}
      {createSliderWithTextbox("Sweep", "sweep", "sweepMin", "sweepMax", 1, "sweep")}
      {createSliderWithTextbox("Dihedral", "dihedral", "dihedralMin", "dihedralMax", 1, "dihedral")}
      {createSliderWithTextbox("Washout", "washout", "washoutMin", "washoutMax", 0.1, "washout")} {/* Adjusted to 0.1 for more precision */}
    </div>
  );
};

export default ControlPanel;
