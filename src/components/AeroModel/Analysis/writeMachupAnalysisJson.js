import { getCGObject } from "../utils/CGobject";

const writeAnalysisWingsJson = (myObject, connectID) => {
    myObject.children.forEach(childObject => {
        if (childObject.type === "Mesh" && childObject.geometry.type === "WingGeometry") {
            global_wing_ID += 1;
            console.log('Adding Wing #', global_wing_ID);

            const { parameters } = childObject.geometry;

            // Setup control surfaces
            const myControl = parameters.control.has_control_surface ? parameters.control : {};

            // Determine if it's the main wing
            const isMainWing = parameters.is_main ? 1 : 0;

            // Extract airfoil names
            const [rootName] = Object.keys(parameters.root_airfoil);
            const [tipName] = Object.keys(parameters.tip_airfoil);

            // Populate global_wings with current wing data
            global_wings[childObject.name] = {
                name: childObject.name,
                ID: global_wing_ID,
                is_main: isMainWing,
                side: parameters.side,
                connect: {
                    ID: connectID,
                    location: "tip",
                    dx: childObject.position.x,
                    dy: childObject.position.y,
                    dz: childObject.position.z,
                    yoffset: 0, // originally yoffset: parameters.dy
                },
                span: parameters.span,
                sweep: parameters.sweep / 30, // Adjusting sweep for reduced drag
                dihedral: parameters.dihedral,
                mounting_angle: parameters.mount,
                washout: parameters.washout,
                rootChord: parameters.rootChord,
                tipChord: parameters.tipChord,
                airfoils: {
                    af1: parameters.root_airfoil[rootName],
                    af2: parameters.tip_airfoil[tipName],
                },
                grid: parameters.nSeg,
                control: myControl,
                sameAsRoot: parameters.same_as_root, // DFH
            };

            // Recursively call the function to handle nested objects
            writeAnalysisWingsJson(childObject, global_wing_ID);
        }
    });
};

const writeMachupAnalysisJson = (editor) => {
    // Find CG location
    const CGobject = getCGObject(editor.scene);
    const { x: CGx, y: CGy, z: CGz } = CGobject.position;

    // Reset wing ID and wings collection
    global_wing_ID = 0;
    global_wings = {};

    // Write wing data
    writeAnalysisWingsJson(editor.scene, 0);

    // Prepare the JSON object for analysis
    const data_json = {
        tag: {
            UUID: THREE.Math.generateUUID(),
            date: new Date(),
            version: "MachUp 4.0"
        },
        run: analysis.run,
        solver: analysis.solver,
        plane: {
            name: "MyAirplane",
            CGx,
            CGy,
            CGz
        },
        reference: analysis.reference,
        condition: analysis.condition,
        controls: analysis.controls,
        airfoil_DB: ".",
        wings: global_wings
    };

    console.log(data_json);

    return data_json;
};