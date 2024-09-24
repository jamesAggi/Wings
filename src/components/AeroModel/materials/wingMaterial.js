import * as THREE from 'three';

export const WingMaterials = (texturePath = null) => {
  let material;

  if (texturePath) {
    try {
      // Attempt to load the texture
      const texture = new THREE.TextureLoader().load(texturePath);
      material = new THREE.MeshStandardMaterial({ map: texture });
    } catch (error) {
      console.warn("Texture not found or error loading texture, applying default material.");
      // If texture loading fails, fall back to gray material
      material = new THREE.MeshStandardMaterial({ color: 'gray' });
    }
  } else {
    // No texture provided, fall back to gray material
    material = new THREE.MeshStandardMaterial({ color: 'gray' });
  }

  return material;
};
