# Notes
---

## Rendering

From conversation with Göksel:

- It is just an inverse transformation applied to your coordinate system
- With matrices this becomes rather simple, it reduces translation, rotation and scaling operations to a single multiplication :)
- World has its own transformation, and your entities in your world would each have their respective local transformations
- You then do: `finalTransform = worldTransform * entityTransform`

### NEXT STEPS

- Try to refactor `editcanvas` out, we should have a better interface
- Only certain things should be affected by the isometric `toScreen` calculations, how do we define this? On drawables themselves?
- Implement Sprite drawables
- Implement Tilemap drawable (reduce amount of Entities we have, currently for a 30x30 sprite sheet we are running 900 entities in memory! If we can reduce that down to just 1 tilemap entity that handles drawing the entirety of a tile map, that would be rad)
  + Will need some sort of interface for retrieving what "type" of tile a certain coordinate is, so we can react to things like different surface types

## Networking

- Use Protobuf: https://github.com/protocolbuffers/protobuf
- authoratative! (Dumb client tells smart server "Hey! I am facing this way and moving forward," server validates, returns it's position)
  + Slideshow at https://docs.colyseus.io/ is good

### NEXT STEPS

(Probably after tilemap?)
- 


## Runtime

- Runtime should handle the actual creation/manaagement of entities; NOT the client or server directly
- Runtime should manage the world and game state

### NEXT STEPS

- Expose coordinate transformation functions for/from World (transform from normal to isometric)
- Define proper interface for `InputManager` (in `runtime/runtime.ts`)
  + This should be an interface that things such as Player character controllers can use to react to inputs
  + Should work for both client inputs and server inputs
  + Command based? ie. `MoveForward`, `StrafeLeft`, `StrafeRight`?

## Client/Server

- Client should only focus on forwarding input/local interactions to the renderer and runtime
- Server should only focus on forwarding/synching networking with the runtime