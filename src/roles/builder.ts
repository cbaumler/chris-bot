import { Role } from "./role";

const enum BuilderAction {
  Harvest = "🔄 Harvest",
  Build = "🚧 Build",
  Repair = "🛠 Repair"
}

type BuilderActionMap = { [P in BuilderAction]: () => void };

interface BuilderMemory extends CreepMemory {
  action: BuilderAction;
}

export class Builder extends Role {
  private memory: BuilderMemory;
  private takeAction: BuilderActionMap;

  constructor(creep: Creep) {
    super(creep);
    this.memory = this.creep.memory as BuilderMemory;
    this.takeAction = {
      [BuilderAction.Harvest]: this.harvest,
      [BuilderAction.Build]: this.build,
      [BuilderAction.Repair]: this.repair
    };
  }

  private changeAction(action: BuilderAction) {
    if (this.memory.action !== action) {
      this.memory.action = action;
      this.creep.say(action);
    }
  }

  private harvest = () => {
    const sources = this.creep.room.find(FIND_SOURCES);
    if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(sources[0], {
        visualizePathStyle: { stroke: "#ffaa00" }
      });
    }
  };

  private build = () => {
    const targets = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (targets.length) {
      if (this.creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    }
  };

  private repair = () => {
    // TODO: Prioritize structures
    const targets = this.creep.room.find(FIND_MY_STRUCTURES, {
      filter: structure => {
        return structure.hits < structure.hitsMax;
      }
    });
    if (targets.length) {
      if (this.creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    }
  };

  public run() {
    if (this.creep.carry.energy === 0) {
      this.changeAction(BuilderAction.Harvest);
    } else if (this.creep.carry.energy === this.creep.carryCapacity) {
      if (this.creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
        this.changeAction(BuilderAction.Build);
      } else {
        this.changeAction(BuilderAction.Repair);
      }
    }

    this.takeAction[this.memory.action]();
  }
}
