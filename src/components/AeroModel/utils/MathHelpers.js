import * as THREE from 'three';

// Compute the normal of a triangle defined by points V1, V2, V3 and store it in ans
function math_compute_normal(V1, V2, V3, ans) {
    const u = new THREE.Vector3(V2.x - V1.x, V2.y - V1.y, V2.z - V1.z);
    const v = new THREE.Vector3(V3.x - V2.x, V3.y - V2.y, V3.z - V2.z);

    ans.x = (u.y * v.z) - (u.z * v.y);
    ans.y = -(u.x * v.z) + (u.z * v.x);
    ans.z = (u.x * v.y) - (u.y * v.x);
    ans.normalize();
}

// Rotate vector V around the x-axis by an angle th (in radians)
function math_rot_x(V, th) {
    const x = V.x, y = V.y, z = V.z;
    const c = Math.cos(th);
    const s = Math.sin(th);

    V.y = y * c - z * s;
    V.z = y * s + z * c;
}

// Rotate vector V around the y-axis by an angle th (in radians)
function math_rot_y(V, th) {
    const x = V.x, y = V.y, z = V.z;
    const c = Math.cos(th);
    const s = Math.sin(th);

    V.x = x * c + z * s;
    V.z = -x * s + z * c;
}

// Rotate vector V around the z-axis by an angle th (in radians)
function math_rot_z(V, th) {
    const x = V.x, y = V.y, z = V.z;
    const c = Math.cos(th);
    const s = Math.sin(th);

    V.x = x * c - y * s;
    V.y = x * s + y * c;
}

// Apply twist (rotation around y-axis) and dihedral (rotation around x-axis) to vertex
function applyTwistAndDihedral(vertex, twist, dihedral, side) {
    // Apply twist (rotation around y-axis)
    math_rot_y(vertex, twist * Math.PI / 180.0);

    // Apply dihedral (rotation around x-axis)
    if (side === 'right') {
        math_rot_x(vertex, -dihedral * Math.PI / 180.0);
    } else {
        math_rot_x(vertex, dihedral * Math.PI / 180.0);
    }
}

// Export the functions for use in other modules
export { math_compute_normal, math_rot_x, math_rot_y, math_rot_z, applyTwistAndDihedral };
