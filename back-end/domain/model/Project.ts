export class Project {
    readonly id: number;
    readonly naam: string;
    readonly beschrijving: string;
    readonly datum_voltooid: Date;

    constructor(project: { id: number; naam: string; beschrijving: string; datum_voltooid: Date }) {
        this.validate(project);

        this.id = project.id;
        this.naam = project.naam;
        this.beschrijving = project.beschrijving;
        this.datum_voltooid = project.datum_voltooid;
    }

    private validate(project: {
        id: number;
        naam: string;
        beschrijving: string;
        datum_voltooid: Date;
    }) {
        if (!project.naam?.trim() || !project.beschrijving?.trim() || !project.datum_voltooid) {
            throw new Error('All fields are required.');
        }
    }
}
