import { Role } from "./role";

interface BuilderMemory extends CreepMemory {
  building: boolean;
}

export class Builder extends Role {
  private creep: Creep;
  private memory: BuilderMemory;

  constructor(creep: Creep) {
    super();
    this.creep = creep;
    this.memory = creep.memory as BuilderMemory;
  }

  public init(creep: Creep) {
    console.log("Initializing " + creep.name);
  }

  public run(creep: Creep) {
    if (this.memory.building && creep.carry.energy === 0) {
      this.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!this.memory.building && creep.carry.energy === creep.carryCapacity) {
      this.memory.building = true;
      creep.say("🚧 build");
    }

    if (this.memory.building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}
