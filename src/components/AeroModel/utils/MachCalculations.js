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
