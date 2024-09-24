const calculateReferenceValues = (editor) => {
    analysis.reference.area = 0.0;
    analysis.reference.lateral_length = 0.0;

    addWingReferenceValues(editor.scene);

    // Calculate the longitudinal length
    analysis.reference.longitudinal_length = analysis.reference.area / analysis.reference.lateral_length;

    // Handle NaN cases
    if (isNaN(analysis.reference.longitudinal_length)) {
        analysis.reference.longitudinal_length = 0.0;
    }

    console.log(analysis.reference);
};

const addWingReferenceValues = (myObject) => {
    myObject.children.forEach((childObject) => {
        if (childObject.type === "Mesh" && childObject.geometry.type === "WingGeometry") {
            const { parameters } = childObject.geometry;
            if (parameters.is_main) {
                console.log('Including area of', childObject.name);

                let length = parameters.span;
                let area = length * 0.5 * (parameters.root_chord + parameters.tip_chord);

                // Handle elliptic wing
                if (parameters.tip_chord < 0.0) {
                    const cbar = Math.PI * parameters.root_chord / 4.0;
                    area = length * cbar;
                }

                // Handle both sides
                if (parameters.side === 'both') {
                    length *= 2.0;
                    area *= 2.0;
                }

                // Update reference values
                analysis.reference.area += area;
                analysis.reference.lateral_length += length;
            }
        }

        // Recurse through the children
        addWingReferenceValues(childObject);
    });
};