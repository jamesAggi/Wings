const deleteDuplicateComponents = (editor) => {
    console.log('Checking for duplicate components...');

    // Search for specific components by name rather than index
    const CG = editor.scene.getObjectByName('Center of Gravity');
    const aerodynamicCenter = editor.scene.getObjectByName('Aerodynamic Center');
    const pointLight = editor.scene.getObjectByName('PointLight');

    editor.scene.children.forEach((childObject, index) => {
        if (index < 3) return; // Skip the first three children

        if (childObject.name === 'Center of Gravity' && CG) {
            CG.position.copy(childObject.position);
            deleteComponent(editor, childObject);
        }

        if (childObject.name === 'Aerodynamic Center') {
            deleteComponent(editor, childObject);
        }

        if (childObject.name === 'PointLight' && pointLight) {
            pointLight.position.copy(childObject.position);
            deleteComponent(editor, childObject);
        }
    });
};

const deleteComponent = (editor, object) => {
    if (!object || !object.parent) return; // Ensure object and its parent exist

    console.log('Deleting extra ', object.name);

    object.traverse((child) => {
        editor.removeHelper(child);
    });

    object.parent.remove(object); // Safely remove the object from the parent

    // Notify the editor of changes
    editor.signals.objectRemoved.dispatch(object);
    editor.signals.sceneGraphChanged.dispatch();
};

export { deleteDuplicateComponents, deleteComponent };