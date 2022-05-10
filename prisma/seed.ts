import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    email: "besim@gmail.com",
    password: bcrypt.hashSync("besim123"),
    fullName: "Besim Sokoli",
    isDoctor: false,
  },
  {
    password: bcrypt.hashSync("nicolas123"),
    fullName: "Nicolas Marcora",
    email: "nicolas@gmail.com",
    isDoctor: true,
  },
  {
    email: "ed@gmail.com",
    password: bcrypt.hashSync("ed123"),
    fullName: "Ed Putans",
    isDoctor: true,
  },
];
async function createStuff() {
  for (const user of users) {
    await prisma.user.create({ data: user });
  }
}
createStuff();
