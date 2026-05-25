import * as THREE from "three";
import { BLOCKS, MATERIALS } from "./room-config.js";

const cachedMaterials = new Map();

const getMaterial = (key) => {
  if (cachedMaterials.has(key)) return cachedMaterials.get(key);
  const def = MATERIALS[key];
  if (!def) throw new Error(`Material '${key}' not in MATERIALS`);
  const mat = new THREE.MeshStandardMaterial(def);
  cachedMaterials.set(key, mat);
  return mat;
};

export const buildRoom = () => {
  const group = new THREE.Group();
  group.name = "Room";

  for (const block of BLOCKS) {
    const [w, h, d] = block.size;
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, getMaterial(block.mat));
    mesh.position.set(...block.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return group;
};
