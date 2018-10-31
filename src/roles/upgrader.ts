import { Role } from "./role";

interface UpgraderMemory extends CreepMemory {
  upgrading: boolean;
}

export class Upgrader extends Role {
  private memory: UpgraderMemory;

  constructor(creep: Creep) {
    super(creep);
    this.memory = creep.memory as UpgraderMemory;
  }

  public run() {
    if (!this.creep.room.controller) {
      this.creep.say("💤 idle");
      return;
    }

    if (this.memory.upgrading && this.creep.carry.energy === 0) {
      this.memory.upgrading = false;
      this.creep.say("🔄 harvest");
    }
    if (
      !this.memory.upgrading &&
      this.creep.carry.energy === this.creep.carryCapacity
    ) {
      this.memory.upgrading = true;
      this.creep.say("⚡ upgrade");
    }

    if (this.memory.upgrading) {
      if (
        this.creep.upgradeController(this.creep.room.controller) ===
        ERR_NOT_IN_RANGE
      ) {
        this.creep.moveTo(this.creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      const sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: "#ffaa00" }
        });
      }
    }
  }
}
