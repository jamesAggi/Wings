const getCGObject = (myObject) => {
    // Check if the current object is the CG object
    if (myObject.name === 'Center of Gravity') return myObject;

    // Recursively check the children
    for (let ichild = 0; ichild < myObject.children.length; ichild++) {
        const foundObject = getCGObject(myObject.children[ichild]);
        if (foundObject.name === 'Center of Gravity') return foundObject;
    }

    // Return null if no CG object is found
    return null;
};

export default getCGObject;