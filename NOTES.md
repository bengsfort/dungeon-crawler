# Notes
---

## Rendering

From conversation with Göksel:

- It would make your life way easier if you render things in layers
- Camera itself usually doesn't render anything
- It is just an inverse transformation applied to your coordinate system
- So you would have an entity you call World or whatever, really
- And every other entity would be a child of this World
- All coordinate transforms would then be applied progressively
- As in, moving World would move pretty much all of its children
- With matrices this becomes rather simple, it reduces translation, rotation and scaling operations to a single multiplication :)
- World has its own transformation, and your entities in your world would each have their respective local transformations
- You then do: `finalTransform = worldTransform * entityTransform`
- So the camera itself doesn't need to do anything
- It's just another name for a transform applied in reverse
- Making the camera go right, makes the whole world go left etc
- Keep in mind that nothing is really moving :slightly_smiling_face:
- It's just that you change your origin
- At first absolute (0, 0) was your origin, after applying the camera transform it's now absolute (-10, 0) (edited) 
- And as such you get to see the world as if its local (10, 0) point would be at the absolute (0, 0)
- Every abstract layer, entity, object, whatever has their own coordinate systems
- Graphics programming is mostly just making sure they make sense in relation to each other :)
- A good starting point would indeed be having a simple Transform,Scene or World entity with its own position, rotation and scale attributes
- Yeah, so each tile is kind of an entity as well
- Here's the trick:
- You don't go parent-to-child
- Instead when you wanna render a child entity
- It queries its parent's transform (which in turn queries its parent's transform and so on) and adds its own transform on it and you draw this entity using that final transform
- This way moving the entire coordinate system becomes a simple operation and doesn't require iterating through entire hierarchies which would be super slow
- Something like: function getPosition() { return parent.getPosition() + this.position; }
- And parent.getPosition does the exact same thing
- So it would be logical to simply refactor these into a common base class

### NEXT STEPS

- I think definition is completely unnecessary
- The entity itself should contain that information
```
let renderable = entity.getRenderable();
renderer.render(renderable);
```
- Try to go for an architecture like this
- If you can abstract it out to a render-queue it would be even more amazing
- Then you can simply push command buffers into a render-queue and get shit rendered
- The renderer should not need to know anything about the nature of your entities
- It only knows what a renderable is, it gets something it can render and renders it as is

Time for some refactoring :smile:
Right now all of the tilemap stuff is brute forced in the rendering package, I think I'll export renderables from there and move that tilemap stuff into like the runtime so I can more closely tie the visual map to the actual world and switch it so I render each tile via a renderable instead of going through the entire tilemap definition and just throwing the tile for a position into the context

I guess a tilemap actually should live in the client, and I should be aiming in the client to translate the json map definition into runtime objects. Rendering package shouldn't care about tiles, just about primitives and attributes

## Networking

- Use Protobuf: https://github.com/protocolbuffers/protobuf
- authoratative! (Dumb client tells smart server "Hey! I am facing this way and moving forward," server validates, returns it's position)
  + Slideshow at https://docs.colyseus.io/ is good


## Runtime

- Runtime should handle the actual creation/manaagement of entities; NOT the client or server directly
- Runtime should manage the world and game state

## Client/Server

- Client should only focus on forwarding input/local interactions to the renderer and runtime
- Server should only focus on forwarding/synching networking with the runtime