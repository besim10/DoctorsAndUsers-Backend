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
    title: "Besim wants to visit Nico",
    start: "2022-05-20T10:00:00",
    end: "2022-05-20T16:00:00",
    doctor: { connect: { email: "nicolas@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },
  {
    title: "Besim wants to visit Ed",
    start: "2022-05-19T10:00:00",
    end: "2022-05-19T11:00:00",
    doctor: { connect: { email: "ed@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },
  {
    title: "Besim wants to visit Nico 2",
    start: "2022-05-20T13:00:00",
    end: "2022-05-20T16:00:00",
    doctor: { connect: { email: "nicolas@gmail.com" } },
    normalUser: { connect: { email: "besim@gmail.com" } },
  },
  {
    title: "Ed free time to visit me",
    start: "2022-05-27T10:00:00",
    end: "2022-05-27T12:00:00",
    doctorPosted: { connect: { email: "ed@gmail.com" } },
  },
  {
    title: "Nico free time to visit",
    start: "2022-05-31T10:00:00",
    end: "2022-05-31T16:00:00",
    doctorPosted: { connect: { email: "nicolas@gmail.com" } },
  },
  {
    title: "Ed free time to visit 2",
    start: "2022-05-25T08:00:00",
    end: "2022-05-25T11:00:00",
    doctorPosted: { connect: { email: "ed@gmail.com" } },
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
