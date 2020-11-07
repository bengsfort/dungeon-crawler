export enum TiledCustomObjectTypes {
  NpcSpawn = "npc_spawn",
  StaticEntitySpawn = "static_entity_spawn",
}

export type CustomObject = {
  entity: string;
  width: number;
  height: number;
};

export type ObjectNpcSpawn = CustomObject & Record<string, unknown>;

export type ObjectStaticEntitySpawn = CustomObject & {
  destructible: boolean;
};
