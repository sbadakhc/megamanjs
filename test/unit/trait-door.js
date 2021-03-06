'use strict';

const expect = require('expect.js');
const sinon = require('sinon');

const env = require('../env.js');
const World = env.Engine.World;
const Door = env.Game.traits.Door;
const Physics = env.Game.traits.Physics;
const Solid = env.Game.traits.Solid;
const THREE = env.THREE;

describe('Door Trait', function() {
  function createDoor()
  {
    const door = new env.Engine.Object;
    const model = new THREE.Mesh(new THREE.PlaneGeometry(8, 2, 4, 2), new THREE.MeshBasicMaterial());
    door.setModel(model);
    door.addCollisionRect(10, 10);
    door.applyTrait(new Door);
    return door;
  }

  function createPlayer()
  {
    const player = new env.Engine.Object;
    player.applyTrait(new Physics);
    player.applyTrait(new Solid);
    player.addCollisionRect(10, 10);
    player.isPlayer = true;
    return player;
  }

  it('should accept entry from set direction', function() {
    const player = createPlayer();
    const door = createDoor();
    const world = new World;
    world.addObject(player);
    world.addObject(door);

    door.position.set(0, 0, 0);
    door.door.direction.set(-1, 0);
    player.position.set(-10, 0, 0);
    player.velocity.set(10, 0, 0);

    world.simulateTime(0.1);
    expect(player.position.x).to.be(-9.5);
    expect(door.door._traverseObject).to.be(player);
  });

  it('should block entry from opposite direction', function() {
    const player = createPlayer();
    const door = createDoor();
    const world = new World;
    world.addObject(player);
    world.addObject(door);

    door.position.set(0, 0, 0);
    door.door.direction.set(-1, 0);
    player.position.set(10, 0, 0);
    player.velocity.set(-10, 0, 0);

    world.simulateTime(0.1);
    expect(player.position.x).to.be(10);
    expect(door.door._traverseObject).to.be(null);
  });
});
