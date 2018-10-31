export class Governor {
  private room: Room;
  private name: string;
  private spawns: StructureSpawn[];

  constructor(room: Room, name: string) {
    this.room = room;
    this.name = name;
    this.spawns = this.room.find(FIND_MY_SPAWNS);
  }

  private printSpawnMessage(spawn: StructureSpawn) {
    if (spawn && spawn.spawning) {
      const spawningCreep = spawn.spawning.name;
      spawn.room.visual.text(
        "🛠️" + Game.creeps[spawningCreep].memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: "left", opacity: 0.8 }
      );
    }
  }

  private bodyCost(body: BodyPartConstant[]) {
    return body.reduce((cost, part) => {
      return cost + BODYPART_COST[part];
    }, 0);
  }

  public run() {
    for (const spawn of this.spawns) {
      this.printSpawnMessage(spawn);
    }
  }

  public getName() {
    return this.name;
  }

  public spawnCreep(role: string, body: BodyPartConstant[]) {
    for (const spawn of this.spawns) {
      if (!spawn.spawning && this.room.energyAvailable >= this.bodyCost(body)) {
        const newName = role + Game.time;
        const options: SpawnOptions = { memory: { 'role': role } };
        console.log('Spawning new ' + role + ': '  + newName);
        spawn.spawnCreep(body, newName, options);
      }
    }
  }
}
