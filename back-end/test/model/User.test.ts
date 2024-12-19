import { User } from "../../domain/model/User";
import { Role } from "../../types";

describe("User", () => {
  it("should create a User object with valid data", () => {
    const user = new User({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "User",
    });

    expect(user.id).toBe(1);
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password).toBe("password123");
    expect(user.role).toBe("User");
  });

  it("should throw an error if id is negative", () => {
    expect(() => {
      new User({
        id: -1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "User",
      });
    }).toThrow("Id cannot be negative.");
  });

  it("should throw an error if email is missing", () => {
    expect(() => {
      new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "",
        password: "password123",
        role: "User",
      });
    }).toThrow("Email is required.");
  });

  it("should throw an error if email format is invalid", () => {
    expect(() => {
      new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "password123",
        role: "User",
      });
    }).toThrow("Invalid email format. Please provide a valid email address.");
  });

  it("should throw an error if password is missing", () => {
    expect(() => {
      new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "",
        role: "User",
      });
    }).toThrow("Password is required.");
  });

  it("should throw an error if role is missing", () => {
    expect(() => {
      new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: undefined as unknown as Role, // Casting to simulate missing role
      });
    }).toThrow("Role is required.");
  });

  it("should correctly map a Prisma object to a User domain object using the static from method", () => {
    const prismaUser = {
      id: 2,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      role: "Admin" as Role,
    };

    const user = User.from(prismaUser);

    expect(user.id).toBe(2);
    expect(user.firstName).toBe("Jane");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("jane.doe@example.com");
    expect(user.password).toBe("password123");
    expect(user.role).toBe("Admin");
  });

  it("should log an error if User creation fails during the from method", () => {
    const prismaUser = {
      id: 2,
      firstName: "Jane",
      lastName: "Doe",
      email: "",
      password: "password123",
      role: "Admin" as Role,
    };

    expect(() => User.from(prismaUser)).toThrow("Email is required.");
  });
});
