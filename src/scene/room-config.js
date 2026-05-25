// Coordinate system:
//   X: east-west (positive = east).
//   Y: up.
//   Z: north-south (positive = south).
// Camera will sit at SE corner (+X, +Z) looking toward (-X, -Z).
// Window is in the NORTH wall (-Z side).

export const ROOM = {
  width: 16,   // X
  height: 8,   // Y
  depth: 12,   // Z
};

export const MATERIALS = {
  floor: { color: 0x8b6b3f, roughness: 0.95 },
  wallWood: { color: 0xa07a4a, roughness: 0.9 },
  beam: { color: 0x4a3520, roughness: 0.9 },
  shelf: { color: 0x6b3f1f, roughness: 0.85 },
  book: { color: 0xc4985a, roughness: 0.7 },
  desk: { color: 0x4a3520, roughness: 0.85 },
  monitor: { color: 0x1a1410, roughness: 0.4, emissive: 0x6a8aff, emissiveIntensity: 0.4 },
  cork: { color: 0xb87a3f, roughness: 0.95 },
  paper: { color: 0xf4e8d3, roughness: 0.95 },
  banner: { color: 0x7a3f1f, roughness: 0.9 },
  windowGlass: { color: 0xfff0c0, roughness: 0.1, transparent: true, opacity: 0.4, emissive: 0xffa86a, emissiveIntensity: 0.6 },
  torchHead: { color: 0xff7a2a, emissive: 0xffaa4a, emissiveIntensity: 1.0 },
};

// Each block: { mat: key of MATERIALS, pos: [x, y, z] (center), size: [w, h, d] }
export const BLOCKS = [
  // Floor
  { mat: "floor", pos: [0, -0.1, 0], size: [16, 0.2, 12] },

  // North wall (with window cutout — we simulate by building wall in 3 chunks)
  { mat: "wallWood", pos: [-5.5, 4, -6], size: [5, 8, 0.4] },         // N wall left of window
  { mat: "wallWood", pos: [5.5, 4, -6], size: [5, 8, 0.4] },          // N wall right
  { mat: "wallWood", pos: [0, 7, -6], size: [6, 2, 0.4] },            // N wall above window
  { mat: "wallWood", pos: [0, 1, -6], size: [6, 2, 0.4] },            // N wall below window
  { mat: "windowGlass", pos: [0, 4, -6], size: [6, 4, 0.1] },         // glass

  // West wall (left in frame)
  { mat: "wallWood", pos: [-8, 4, 0], size: [0.4, 8, 12] },

  // Ceiling beam suggestion (just two beams)
  { mat: "beam", pos: [-4, 7.6, 0], size: [0.5, 0.5, 12] },
  { mat: "beam", pos: [4, 7.6, 0], size: [0.5, 0.5, 12] },

  // Bookshelf (W wall, north half)
  { mat: "shelf", pos: [-7.4, 3, -3], size: [1, 6, 4] },
  // Shelf books (decoration; not individually clickable per spec)
  { mat: "book", pos: [-6.8, 1.5, -4.5], size: [0.3, 0.8, 0.4] },
  { mat: "book", pos: [-6.8, 1.5, -4], size: [0.3, 1.0, 0.4] },
  { mat: "book", pos: [-6.8, 1.5, -3.5], size: [0.3, 0.9, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -4.5], size: [0.3, 0.7, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -4], size: [0.3, 0.9, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -3.5], size: [0.3, 1.1, 0.4] },
  { mat: "book", pos: [-6.8, 4.5, -4.5], size: [0.3, 0.8, 0.4] },
  { mat: "book", pos: [-6.8, 4.5, -4], size: [0.3, 1.0, 0.4] },

  // Corkboard (W wall, south half)
  { mat: "cork", pos: [-7.7, 3, 2.5], size: [0.2, 4, 4] },
  // Diploma + Sahur banner on corkboard
  { mat: "paper", pos: [-7.55, 3.7, 1.6], size: [0.05, 1.2, 1.6] },     // diploma
  { mat: "banner", pos: [-7.55, 2.4, 3.4], size: [0.05, 1.5, 2.0] },    // Sahur banner

  // Desk against N wall, east of window
  { mat: "desk", pos: [4.5, 1.5, -5], size: [4, 0.2, 2] },              // desk surface
  { mat: "desk", pos: [3, 0.75, -5], size: [0.3, 1.5, 1.5] },           // leg L
  { mat: "desk", pos: [6, 0.75, -5], size: [0.3, 1.5, 1.5] },           // leg R
  // Monitor
  { mat: "desk", pos: [4.5, 2.4, -5.5], size: [2.0, 1.4, 0.15] },       // monitor frame
  { mat: "monitor", pos: [4.5, 2.4, -5.42], size: [1.8, 1.2, 0.05] },   // monitor screen
  { mat: "desk", pos: [4.5, 1.75, -5.5], size: [0.3, 0.3, 0.3] },       // stand

  // Torch on N wall, far east
  { mat: "beam", pos: [7.5, 5, -5.8], size: [0.2, 1.5, 0.2] },          // torch stick
  { mat: "torchHead", pos: [7.5, 5.9, -5.8], size: [0.5, 0.5, 0.5] },   // torch head
];
