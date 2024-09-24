// Analysis.js

class Analysis {
    constructor() {
        this.reference = {
            area: 0.0,
            longitudinal_length: 0.0,
            lateral_length: 0.0
        };
        this.condition = {
            alpha: 1.0,  // Angle of attack (degrees or radians)
            beta: 0.0   // Sideslip angle (degrees or radians)
        };
        this.solver = {
            type: 'linear',  // Solver type
            convergence: 1.0e-6,  // Convergence criterion
            relaxation: 0.9  // Relaxation parameter
        };
        this.run = {
            forces: ""  // Forces acting on the geometry (runtime fill)
        };
        this.controls = {
            elevator: { is_symmetric: 1, deflection: 0.0 },  // Elevator control deflection
            rudder: { is_symmetric: 0, deflection: 0.0 },    // Rudder control deflection
            aileron: { is_symmetric: 0, deflection: 0.0 },   // Aileron control deflection
            flap: { is_symmetric: 1, deflection: 0.0 }       // Flap control deflection
        };
    }

    // You can add methods to interact with the analysis object
    setControlSurfaceDeflection(surface, value) {
        if (this.controls[surface]) {
            this.controls[surface].deflection = value;
        } else {
            console.error(`Control surface ${surface} does not exist.`);
        }
    }

    getControlSurfaceDeflection(surface) {
        return this.controls[surface]?.deflection || 0;
    }

    // You can add more methods to interact with reference or condition properties as needed
}

export default Analysis;
