import * as THREE from "three";

const SKIN = 0xd4a574;
const SHIRT = 0x4a6a8a;
const PANTS = 0x2a2a3a;
const HAIR = 0x3a2510;

const mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.7 });

export const buildCharacter = () => {
  const group = new THREE.Group();
  group.name = "Character";

  // Sitting on chair-height, in front of desk at x=4.5, z=-5
  // Body parts use Minecraft-ish proportions (head:body:legs ≈ 1:1.5:1.5)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat(SKIN));
  head.position.set(0, 2.2, 0);
  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.85), mat(HAIR));
  hair.position.set(0, 2.55, 0);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.5), mat(SHIRT));
  torso.position.set(0, 1.4, 0);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mat(SHIRT));
  armL.position.set(-0.6, 1.4, 0.15);
  armL.rotation.x = -1.0;  // forward, toward keyboard
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mat(SHIRT));
  armR.position.set(0.6, 1.4, 0.15);
  armR.rotation.x = -1.0;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.5), mat(PANTS));
  legL.position.set(-0.25, 0.5, 0.3);
  legL.rotation.x = -1.2; // forward (sitting)
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.5), mat(PANTS));
  legR.position.set(0.25, 0.5, 0.3);
  legR.rotation.x = -1.2;

  for (const m of [head, hair, torso, armL, armR, legL, legR]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  // Position seated facing N (so back is to camera)
  group.position.set(4.5, 0.4, -3.5);
  group.rotation.y = Math.PI; // face -Z

  return group;
};
