import { Employee } from "../../domain/model/Employee";

describe("Employee", () => {
  it("should create an employee with valid data", () => {
    const employee = new Employee({
      id: 1,
      naam: "John Doe",
      email: "johndoe@example.com",
      telefoonnummer: "123456789",
      bedrijf_id: 101,
    });

    expect(employee.id).toBe(1);
    expect(employee.naam).toBe("John Doe");
    expect(employee.email).toBe("johndoe@example.com");
    expect(employee.telefoonnummer).toBe("123456789");
    expect(employee.bedrijf_id).toBe(101);
  });

  it("should throw an error if naam is empty", () => {
    expect(() => {
      new Employee({
        id: 1,
        naam: "",
        email: "johndoe@example.com",
        telefoonnummer: "123456789",
        bedrijf_id: 101,
      });
    }).toThrow("Employee name is required.");
  });

  it("should throw an error if email is empty", () => {
    expect(() => {
      new Employee({
        id: 1,
        naam: "John Doe",
        email: "",
        telefoonnummer: "123456789",
        bedrijf_id: 101,
      });
    }).toThrow("Employee email is required.");
  });

  it("should throw an error if telefoonnummer is empty", () => {
    expect(() => {
      new Employee({
        id: 1,
        naam: "John Doe",
        email: "johndoe@example.com",
        telefoonnummer: "",
        bedrijf_id: 101,
      });
    }).toThrow("Employee phone number is required.");
  });


});
