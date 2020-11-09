// import { Entity } from "../entities";

// // Unclear if this is really even necessary (tracking all of the actors in a singular dictionary)
// // (Since stuff like rendering is going to be done on a map coordinate level)

// // @todo: This could be better split up, like, on a chunk by chunk basis.
// // Example: All actors within a certain zone, rather than every single actor ever.
// const actorsDirectory = new Map<string, Entity>();

// export const addActor = (actor: Entity): void => {
//   if (actorsDirectory.has(actor.id)) {
//     console.error(`Actor ${actor.id} already active! Skipping.`);
//     return;
//   }
//   actorsDirectory.set(actor.id, actor);
// };

// export const removeActor = (actor: string | Entity): void => {
//   if (typeof actor === "string") {
//     actorsDirectory.delete(actor);
//     return;
//   }
//   actorsDirectory.delete(actor.id);
// };

// export const flush = (): void => {
//   actorsDirectory.clear();
// };

// export const getActor = (id: string): Entity | undefined => {
//   return actorsDirectory.get(id);
// };

// export const getAll = (): Iterable<Entity> => {
//   return actorsDirectory.values();
// };
