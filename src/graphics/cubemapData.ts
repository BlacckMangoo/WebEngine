export const CUBEMAPS = {
  skyBox: {
    px: "assets\\cubemaps\\skyBox\\px.jpg",
    nx: "assets\\cubemaps\\skyBox\\nx.jpg",
    py: "assets\\cubemaps\\skyBox\\py.jpg",
    ny: "assets\\cubemaps\\skyBox\\ny.jpg",
    pz: "assets\\cubemaps\\skyBox\\pz.jpg",
    nz: "assets\\cubemaps\\skyBox\\nz.jpg",
  },
} as const;

export type CubeMapName = keyof typeof CUBEMAPS;
export type CubeMapEntry = typeof CUBEMAPS[CubeMapName];
