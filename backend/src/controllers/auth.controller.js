import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../lib/validate.js";
import { signToken } from "../lib/jwt.js";
import { badRequest, unauthorized } from "../lib/errors.js";

const registerSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
});

const toAuthResponse = (user) => ({
  token: signToken({ sub: user.id, email: user.email }),
  user: { id: user.id, email: user.email, name: user.name },
});

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = validate(registerSchema, req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw badRequest("An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name ?? null },
  });

  res.status(201).json({
    success: true,
    message: "Account created",
    data: toAuthResponse(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validate(loginSchema, req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw unauthorized("Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw unauthorized("Invalid email or password");

  res.status(200).json({
    success: true,
    message: "Logged in",
    data: toAuthResponse(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true },
  });
  if (!user) throw unauthorized();
  res.json({ success: true, data: user });
});
