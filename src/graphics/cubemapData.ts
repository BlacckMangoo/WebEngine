export const CUBEMAPS = {
  Lycksele3: {
    px: "./assets/cubemaps/Lycksele3/px.jpg",
    nx: "./assets/cubemaps/Lycksele3/nx.jpg",
    py: "./assets/cubemaps/Lycksele3/py.jpg",
    ny: "./assets/cubemaps/Lycksele3/ny.jpg",
    pz: "./assets/cubemaps/Lycksele3/pz.jpg",
    nz: "./assets/cubemaps/Lycksele3/nz.jpg",
  },
  skybox: {
    px: "./assets/cubemaps/skybox/px.jpg",
    nx: "./assets/cubemaps/skybox/nx.jpg",
    py: "./assets/cubemaps/skybox/py.jpg",
    ny: "./assets/cubemaps/skybox/ny.jpg",
    pz: "./assets/cubemaps/skybox/pz.jpg",
    nz: "./assets/cubemaps/skybox/nz.jpg",
  },
} as const;

export type CubeMapName = keyof typeof CUBEMAPS;
export type CubeMapEntry = typeof CUBEMAPS[CubeMapName];
