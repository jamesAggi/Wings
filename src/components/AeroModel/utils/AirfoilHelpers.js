// NACA airfoil geometry calculation
export const naca_geometry = function (code, x) {
    let ymc, xmc, tm, yc, dydx, thick;
    let xu, yu, xl, yl;

    // Parse NACA code: 
    ymc = parseInt(code.substring(0, 1)) / 100.0;   // Max camber
    xmc = parseInt(code.substring(1, 2)) / 10.0;    // Location of max camber
    tm = parseInt(code.substring(2, 4)) / 100.0;    // Max thickness

    // Initialize values at leading edge
    if (x === 0.0) {
        xu = 0.0; yu = 0.0; xl = 0.0; yl = 0.0;
    } else {
        // Calculate camber line and slope
        if (x < xmc) {
            yc = ymc * (2.0 * (x / xmc) - Math.pow(x / xmc, 2));
            dydx = 2.0 * ymc / xmc * (1.0 - x / xmc);
        } else {
            yc = ymc * (2.0 * (1.0 - x) / (1.0 - xmc) - Math.pow((1.0 - x) / (1.0 - xmc), 2));
            dydx = -2.0 * ymc / (1.0 - xmc) * (1.0 - (1.0 - x) / (1.0 - xmc));
        }

        // Thickness calculation (trailing edge closed)
        thick = tm * (2.969 * Math.sqrt(x) - 1.260 * x - 3.523 * Math.pow(x, 2) + 
                      2.836 * Math.pow(x, 3) - 1.022 * Math.pow(x, 4));

        // Calculate upper and lower surface coordinates
        let thicknessFactor = thick / (2.0 * Math.sqrt(1.0 + Math.pow(dydx, 2)));
        xu = x - thicknessFactor * dydx;
        yu = yc + thicknessFactor;
        xl = x + thicknessFactor * dydx;
        yl = yc - thicknessFactor;
    }

    return [xu, yu, xl, yl];
};

// Airfoil name validation
export const check_airfoil = function (airfoilName) {
    var retAirfoil = '';
    var problem = false;
    
    // Check for 'Circle' airfoil
    if (airfoilName.toLowerCase() === 'circle') {
        return 'Circle';
    }

    // Check for 'NACA' airfoils
    var code = '';
    if (airfoilName.toLowerCase().startsWith('naca')) {
        code = airfoilName.substring(4).trim();
    } else {
        code = airfoilName.trim();
    }

    // Validate the airfoil code
    if (code.length !== 4 || isNaN(parseInt(code))) {
        problem = true;
    } else {
        retAirfoil = 'NACA ' + code;
    }

    // Handle invalid airfoil names
    if (problem) {
        console.error("Unrecognizable airfoil name. Defaulting to 'NACA 2412'.");
        return 'NACA 2412';
    }
    
    return retAirfoil;
};

// Read airfoil data based on type (NACA or Circle)
export const read_airfoil = function (airfoil, nairfoilpts) {
    let airfoilx = [];
    let airfoily = [];

    // If airfoil is an object, extract the airfoil name
    if (typeof airfoil === 'object' && airfoil !== null) {
        for (let key in airfoil) {
            airfoil = key;  // Extract the airfoil name (e.g., 'NACA 2412')
            break;  // Only use the first key
        }
    }

    // Ensure airfoil is now a string
    if (typeof airfoil === 'string' && airfoil.substring(0, 4) === 'NACA') {
        let code = airfoil.substring(4).trim();
        let dtheta = 2.0 * Math.PI / (nairfoilpts - 1);

        for (let i = 1; i <= nairfoilpts / 2; i++) {
            let x = 0.5 * (1.0 - Math.cos((i - 0.5) * dtheta));
            let result = naca_geometry(code, x);

            airfoilx[nairfoilpts / 2 - 1 + i] = result[0];  // xu (upper x)
            airfoily[nairfoilpts / 2 - 1 + i] = result[1];  // yu (upper y)
            airfoilx[nairfoilpts / 2 - i] = result[2];      // xl (lower x)
            airfoily[nairfoilpts / 2 - i] = result[3];      // yl (lower y)
        }
    }

    if (airfoil === 'Circle') {
        let dtheta = 2.0 * Math.PI / (nairfoilpts - 1);

        for (let i = 1; i <= nairfoilpts / 2; i++) {
            let x = 0.5 * (1.0 - Math.cos((i - 0.5) * dtheta));
            let theta = Math.acos(2.0 * (x - 0.5));
            let y = 0.5 * Math.sin(theta);

            airfoilx[nairfoilpts / 2 - 1 + i] = x;
            airfoily[nairfoilpts / 2 - 1 + i] = y;
            airfoilx[nairfoilpts / 2 - i] = x;
            airfoily[nairfoilpts / 2 - i] = -y;
        }
    }

    return [nairfoilpts, airfoilx, airfoily];
};

// Calculate Z-coordinate for the airfoil profile based on x-coordinate
export const calculateAirfoilZ = (x, chordLength) => {
    const maxThickness = 0.12 * chordLength; // Assuming a 12% thickness ratio
    const z = 4 * maxThickness * x * (1 - x); // Simple parabolic thickness distribution
    return z;
};
