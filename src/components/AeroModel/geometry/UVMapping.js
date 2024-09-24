import * as THREE from 'three';

function applyPlanarUVs(geometry) {
    // Get the position attribute from the geometry (i.e., vertices)
    const position = geometry.attributes.position;
    
    // Find the extents (bounding box) of the geometry in the X and Z directions
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    
    const minX = boundingBox.min.x;
    const maxX = boundingBox.max.x;
    const minZ = boundingBox.min.z;
    const maxZ = boundingBox.max.z;

    const width = maxX - minX;
    const depth = maxZ - minZ;

    // Create an array to store UV coordinates
    const uvs = [];

    // Iterate over each vertex and calculate the UV coordinates
    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const z = position.getZ(i);

        // Normalize X and Z to be between 0 and 1 for UV mapping
        const u = (x - minX) / width;
        const v = (z - minZ) / depth;

        uvs.push(u, v);
    }

    // Apply UVs to the geometry
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
}

export { applyPlanarUVs };