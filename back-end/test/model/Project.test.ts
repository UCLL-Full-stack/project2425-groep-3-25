import { Project } from "../../domain/model/Project";

describe("Project", () => {
  it("should create a project with valid data", () => {
    const project = new Project({
      id: 1,
      bedrijf_id: 101,
      categorie_id: 202,
      naam: "New Project",
      beschrijving: "This is a test project",
      datum_voltooid: new Date("2023-12-31"),
      employees: [],
      category: { id: 1, naam: "Technology" },
    });

    expect(project.id).toBe(1);
    expect(project.bedrijf_id).toBe(101);
    expect(project.categorie_id).toBe(202);
    expect(project.naam).toBe("New Project");
    expect(project.beschrijving).toBe("This is a test project");
    expect(project.datum_voltooid).toEqual(new Date("2023-12-31"));
    expect(project.employees).toEqual([]);
    expect(project.category).toEqual({ id: 1, naam: "Technology" });
  });

  it("should throw an error if naam is empty", () => {
    expect(() => {
      new Project({
        id: 1,
        bedrijf_id: 101,
        categorie_id: 202,
        naam: "",
        beschrijving: "This is a test project",
        datum_voltooid: new Date("2023-12-31"),
      });
    }).toThrow("Project name is required.");
  });

  it("should throw an error if beschrijving is empty", () => {
    expect(() => {
      new Project({
        id: 1,
        bedrijf_id: 101,
        categorie_id: 202,
        naam: "New Project",
        beschrijving: "",
        datum_voltooid: new Date("2023-12-31"),
      });
    }).toThrow("Project description is required.");
  });

  it("should throw an error if datum_voltooid is not provided", () => {
    expect(() => {
      new Project({
        id: 1,
        bedrijf_id: 101,
        categorie_id: 202,
        naam: "New Project",
        beschrijving: "This is a test project",
        datum_voltooid: undefined as any,
      });
    }).toThrow("Completion date is required.");
  });

  

  it("should allow projects without employees", () => {
    const project = new Project({
      id: 2,
      bedrijf_id: 101,
      categorie_id: 202,
      naam: "Project Without Employees",
      beschrijving: "This project has no employees",
      datum_voltooid: new Date("2023-12-31"),
    });

    expect(project.employees).toEqual([]);
  });

  it("should allow projects without a category", () => {
    const project = new Project({
      id: 3,
      bedrijf_id: 101,
      categorie_id: 202,
      naam: "Project Without Category",
      beschrijving: "This project has no category",
      datum_voltooid: new Date("2023-12-31"),
    });

    expect(project.category).toBeUndefined();
  });
});
