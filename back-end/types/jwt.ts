import  Jwt  from "jsonwebtoken";

const generateJwtToken = (payload: { id: number; email: string; role: string }) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  console.log("JWT Generation Payload:", payload); // Debugging
  const token = Jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
    issuer: "Leon",
  });
  console.log("Generated JWT:", token); // Debugging
  return token;
};

export { generateJwtToken };