// Calculate mean chord of the wing
export const calculateMeanChord = (rootChord, tipChord) => {
    return (rootChord + tipChord) / 2;
  };
  
  // Calculate wing area
  export const calculateArea = (span, meanChord) => {
    return span * meanChord;
  };
  
  // Calculate aspect ratio
  export const calculateAspectRatio = (span, area) => {
    return span ** 2 / area;
  };
  
  // Calculate skin weight
  export const calculateSkinWeight = (skinWeightFactor, area) => {
    return skinWeightFactor * area;
  };
  
  // Calculate structural weight
  export const calculateStructuralWeight = (structuralWeightFactor, wingWeightRoot, span, meanChord) => {
    return structuralWeightFactor * wingWeightRoot * (span ** 2) / meanChord;
  };
  
  // Calculate fuel volume
  export const calculateFuelVolume = (maxFuelVolume, fuelVolumeRatio, span, meanChord) => {
    return Math.min(maxFuelVolume, 7.5 * fuelVolumeRatio * span * (meanChord ** 2));
  };
  
  // Calculate fuel weight
  export const calculateFuelWeight = (fuelVolume) => {
    return 6.7 * fuelVolume;
  };
  
  // Calculate total weight
  export const calculateTotalWeight = (skinWeight, structuralWeight, fuelWeight, wingWeightRoot) => {
    return skinWeight + structuralWeight + fuelWeight + wingWeightRoot;
  };
  
  // Calculate best velocity (minimum drag velocity)
  export const calculateBestVelocity = (totalWeight, area, aspectRatio, oswaldEfficiency, zeroLiftCd, airDensity) => {
    return Math.sqrt(2) / Math.sqrt(Math.PI * oswaldEfficiency * aspectRatio * zeroLiftCd) * 
           Math.sqrt(totalWeight / (area * airDensity));
  };
  
  // Calculate Cm1 based on sweep
  export const calculateCm1 = (sweep) => {
    return (-0.00328 * sweep + 0.172473);
  };
  
  // Calculate Cm2 based on sweep
  export const calculateCm2 = (sweep) => {
    return -0.0097 * (sweep ** 2) + 0.604241 * sweep + 9.992653;
  };
  
  // Calculate the scaling factor based on Mach number
  export const calculateScalingFactor = (machNumber, c_m1, c_m2) => {
    return 1 + c_m1 * Math.pow(machNumber, c_m2);
  };
  
  // Calculate required lift coefficient
  export const calculateRequiredCL = (totalWeight, area, airDensity, velocity) => {
    return totalWeight / (0.5 * airDensity * area * Math.pow(velocity, 2));
  };
  
  // Adjust velocity considering Mach effects
  export const adjustVelocityForMachEffects = (bestVelocity, aspectRatio, zeroLiftCd, oswaldEfficiency, airDensity, totalWeight, area, speedOfSound, c_m1, c_m2) => {
    for (let i = 0; i < 10; i++) {
      let machNumber = bestVelocity / speedOfSound;
      let scalingFactor = calculateScalingFactor(machNumber, c_m1, c_m2);
      bestVelocity = Math.sqrt(2) / Math.sqrt(Math.PI * oswaldEfficiency * aspectRatio * zeroLiftCd * scalingFactor) * 
                     Math.sqrt(totalWeight / (area * airDensity));
    }
    return bestVelocity;
  };
  
  // Calculate Z-coordinate for the airfoil profile based on x-coordinate
  export const calculateAirfoilZ = (x, chordLength) => {
    const maxThickness = 0.12 * chordLength; // Assuming a 12% thickness ratio
    const z = 4 * maxThickness * x * (1 - x); // Simple parabolic thickness distribution
    return z;
  };
  