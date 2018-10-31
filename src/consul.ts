import { Builder } from "roles/builder";
import { Harvester } from "roles/harvester";
import { Upgrader } from "roles/upgrader";
import { Governor } from "./governor";

export class Consul {
  private governors: { [name: string]: Governor } = {};

  constructor() {
    this.assignGovernors();
  }

  private assignGovernors() {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        const name = "Govenor" + room.name;
        const governor = new Governor(Game.rooms[roomName], name);
        this.governors[name] = governor;
      }
    }
  }

  private maintainScreepsInRole(role: string, max: number) {
    const screeps = _.filter(Game.creeps, creep => creep.memory.role === role);
    console.log(role + ": " + screeps.length);

    for (const i in this.governors) {
      if (screeps.length < max) {
        this.governors[i].spawnCreep(role, [WORK, CARRY, MOVE]);
      }
    }
  }

  public run() {

    this.maintainScreepsInRole('harvester', 4);
    this.maintainScreepsInRole('upgrader', 4);
    this.maintainScreepsInRole('builder', 2);

    for (const i in this.governors) {
      this.governors[i].run();
    }

    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      switch (creep.memory.role) {
        case "harvester":
          const harvester = new Harvester(creep);
          harvester.run();
          break;
        case "upgrader":
          const upgrader = new Upgrader(creep);
          upgrader.run();
          break;
        case "builder":
          const builder = new Builder(creep);
          builder.run();
      }
    }
  }
}
