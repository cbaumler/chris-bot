import { Role } from './role';

export class Harvester extends Role {

    public run() {
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            const sources = this.creep.room.find(FIND_SOURCES);
            if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            const targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}