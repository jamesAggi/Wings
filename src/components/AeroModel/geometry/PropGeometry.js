
THREE.PropGeometry = function (nblades, rotation, diameter, pitch, hub_radius, rootChord, tipChord, root_airfoil, tip_airfoil, nSeg, nAFseg) {
    THREE.BufferGeometry.call(this);
    this.type = 'PropGeometry';

    // Default Parameters
    nblades = nblades || 3;
    rotation = rotation || 'CCW';
    diameter = diameter || 1.0;
    pitch = pitch || 0.4;
    hub_radius = hub_radius || 0.05;
    rootChord = rootChord || 0.1;
    tipChord = tipChord || 0.02;
    nSeg = nSeg || 10;
    nAFseg = nAFseg || 50;

    // Load airfoil data (ensure `read_airfoil` is updated for BufferGeometry)
    var root_airfoil = root_airfoil || default_airfoil();
    var tip_airfoil = tip_airfoil || default_airfoil();
    
    // Initialize position, normal, and uv arrays
    const positions = [];
    const normals = [];
    const uvs = [];

    const root = new THREE.Vector3(0, 0, 0);
    const span = diameter / 2.0 - hub_radius;
    const dtheta = Math.PI / nSeg;

    // Blade creation logic
    for (let iblade = 0; iblade < nblades; iblade++) {
        const theta = (iblade * 2.0 * Math.PI) / nblades;
        createBlade(theta, positions, normals, uvs, rotation, span, pitch, hub_radius, rootChord, tipChord, root_airfoil, tip_airfoil, nSeg, nAFseg);
    }

    // Set up BufferGeometry attributes
    this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    this.computeBoundingSphere();

    function createBlade(theta, positions, normals, uvs, rotation, span, pitch, hub_radius, rootChord, tipChord, root_airfoil, tip_airfoil, nSeg, nAFseg) {
        // Same logic from the original function but using buffers for positions, normals, and UVs
        // Example: Interpolate airfoils, calculate twist and geometry, then add positions/normals.
        
        for (let y = 0; y <= nSeg; y++) {
            const percent = 0.5 * (1.0 - Math.cos(dtheta * y));
            const chord = rootChord + percent * (tipChord - rootChord);
            const r1 = hub_radius + percent * span;
            const twist = Math.atan(pitch / (2.0 * Math.PI * r1));

            for (let x = 0; x <= nAFseg; x++) {
                const airfoilX = root_airfoil[1][x] + percent * (tip_airfoil[1][x] - root_airfoil[1][x]);
                const airfoilY = root_airfoil[2][x] + percent * (tip_airfoil[2][x] - root_airfoil[2][x]);

                const vertex = new THREE.Vector3(chord * (-airfoilX + 0.25), 0, chord * (-airfoilY));
                rotateAroundY(vertex, twist);
                positions.push(vertex.x, vertex.y, vertex.z);

                // Calculate normals and uvs (similar to original function)
                const normal = calculateNormal(); // Define this based on geometry
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(x / nAFseg, y / nSeg);
            }
        }
    }

    function rotateAroundY(vertex, angle) {
        // Update this helper function for rotating vectors around the Y-axis
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = vertex.x;
        const z = vertex.z;
        vertex.x = x * cos - z * sin;
        vertex.z = x * sin + z * cos;
    }

    function default_airfoil() {
        return {
            "NACA 2412": {
                "properties": {
                    "type": "linear",
                    "alpha_L0": -0.036899751,
                    "CL_alpha": 6.283185307,
                    "Cm_L0": -0.0527,
                    "Cm_alpha": -0.08,
                    "CD0": 0.0055,
                    "CD0_L": -0.0045,
                    "CD0_L2": 0.01,
                    "CL_max": 1.4
                }
            }
        };
    }

    function calculateNormal() {
        // Implement normal calculation based on the vertices.
        // Return a normalized vector.
        return new THREE.Vector3(0, 1, 0); // Example normal, replace with actual calculations.
    }
};

THREE.PropGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
THREE.PropGeometry.prototype.constructor = THREE.PropGeometry;