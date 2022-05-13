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
    email: "grigor@gmail.com",
    password: bcrypt.hashSync("grigor123"),
    fullName: "Grigor Godole",
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
const events: Prisma.EventCreateInput[] = [
  {
    title: "Visit me please!",
    start: "2022-05-14T10:00:00",
    end: "2022-05-14T16:00:00",
    doctor: { connect: { email: "nicolas@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },
  {
    title: "Visit me AGIN!",
    start: "2022-05-16T10:00:00",
    end: "2022-05-16T16:00:00",
    doctor: { connect: { email: "ed@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },
  {
    title: "Visit me AGIN AGIN!",
    start: "2022-05-15T10:00:00",
    end: "2022-05-15T16:00:00",
    doctor: { connect: { email: "nicolas@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },

  {
    title: "Grigor want to visit Ed",
    start: "2022-05-15T10:00:00",
    end: "2022-05-15T16:00:00",
    doctor: { connect: { email: "ed@gmail.com" } },
    normalUser: { connect: { email: "grigor@gmail.com" } },
  },
];
async function createStuff() {
  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  for (const event of events) {
    await prisma.event.create({ data: event });
  }
}
createStuff();
