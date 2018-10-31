export abstract class Role {

    protected creep: Creep;

    constructor(creep: Creep) {
        this.creep = creep;
    }

    public abstract run(creep: Creep): void;
}