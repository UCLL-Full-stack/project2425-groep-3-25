import { Project as ProjectPrisma, Employee, Category } from "@prisma/client";

export class Project {
  readonly id?: number;
  readonly naam: string;
  readonly bedrijf_id: number;
  readonly categorie_id: number;
  readonly beschrijving: string;
  readonly datum_voltooid: Date;
  readonly employees: Employee[];
  readonly category?: { id: number; naam: string };// Include employees

  constructor(project: {
    id?: number;
    bedrijf_id: number;
    categorie_id: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: Date;
    employees?: Employee[];
    category?: { id: number; naam: string };// Include employees in the constructor
  }) {
    this.id = project.id;
    this.bedrijf_id = project.bedrijf_id;
    this.categorie_id = project.categorie_id;
    this.naam = project.naam;
    this.beschrijving = project.beschrijving;
    this.datum_voltooid = project.datum_voltooid;
    this.employees = project.employees ?? [];
    this.category = project.category;// Assign employees
    this.validate(project);
  }

  private validate(project: {
    id?: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: Date;
  }) {
    if (!project.naam?.trim()) {
      throw new Error("Project name is required.");
    }

    if (!project.beschrijving?.trim()) {
      throw new Error("Project description is required.");
    }

    if (!project.datum_voltooid) {
      throw new Error("Completion date is required.");
    }
  }

  static from(data: ProjectPrisma & { category?: Category }): Project {
    return new Project({
      id: data.id,
      bedrijf_id: data.bedrijf_id,
      categorie_id: data.categorie_id,
      naam: data.naam,
      beschrijving: data.beschrijving,
      category: data.category ? { id: data.category.id, naam: data.category.naam } : undefined,
      datum_voltooid: data.datum_voltooid,
    });
  }
}
