import * as THREE from "three";

// All targets share fov 45. Override per target as needed.
export const FOCUS_POINTS = {
  main: {
    position: new THREE.Vector3(8, 6, 8),
    lookAt: new THREE.Vector3(0, 2.5, -1),
    duration: 1200,
    parallax: true,
  },
  desk: {
    position: new THREE.Vector3(6, 3, -1),
    lookAt: new THREE.Vector3(4.5, 2.3, -5),
    duration: 1500,
    parallax: false,
  },
  shelf: {
    position: new THREE.Vector3(-4, 3, 0),
    lookAt: new THREE.Vector3(-7.4, 3, -3),
    duration: 1500,
    parallax: false,
  },
  corkboard: {
    position: new THREE.Vector3(-4, 3, 4),
    lookAt: new THREE.Vector3(-7.7, 3, 2.5),
    duration: 1500,
    parallax: false,
  },
  creditsWall: {
    position: new THREE.Vector3(0, 4, 4),
    lookAt: new THREE.Vector3(-7.7, 3, 2.5),
    duration: 2000,
    parallax: false,
  },
};
