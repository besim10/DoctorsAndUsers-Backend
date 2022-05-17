import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8000;

function createToken(id: number) {
  //@ts-ignore
  const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
    expiresIn: "3days",
  });
  return token;
}
async function getUserFromToken(token: string) {
  //@ts-ignore
  const data = jwt.verify(token, process.env.SECRET_KEY);

  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: data.id },
    include: {
      postedEvents: { include: { doctor: true } },
      recivedEvents: { include: { normalUser: true } },
      doctorPostedEvents: { include: { doctorPosted: true } },
    },
  });
  return user;
}
app.post("/authentication/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    //@ts-ignore
    if (user) {
      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (passwordMatches) {
        res.send({ token: createToken(user.id) });
      } else {
        throw Error("Email or Password Invalid!");
      }
    } else {
      throw Error("Email or Password Invalid!");
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/authentication/validate-token", async (req, res) => {
  const token = req.query.token;

  try {
    //@ts-ignore
    const user = await getUserFromToken(token);
    res.send(user);
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { normalUser: true, doctor: true, doctorPosted: true },
    });

    res.send(events);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/events", async (req, res) => {
  const { title, start, end, userId, doctorId, doctorPostedId } = req.body;
  const token = req.headers.authorization;
  try {
    await prisma.event.create({
      data: { title, start, end, userId, doctorId, doctorPostedId },
    });
    const user = await getUserFromToken(token as string);

    let updatedDoctor;
    if (doctorPostedId) {
      updatedDoctor = await prisma.user.findUnique({
        where: { id: doctorPostedId },
        include: { doctorPostedEvents: true },
      });
    } else {
      updatedDoctor = await prisma.user.findUnique({
        where: { id: doctorId },
        include: { recivedEvents: true, doctorPostedEvents: true },
      });
    }
    if (user && updatedDoctor) {
      res.send({ updatedUser: user, updatedDoctor });
    }
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
});
app.delete("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  const token = req.headers.authorization;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (event && token) {
      const event = await prisma.event.delete({
        where: { id },
      });
      const updatedUser = await getUserFromToken(token as string);

      let updatedDoctor;
      if (event.doctorPostedId) {
        updatedDoctor = await prisma.user.findUnique({
          //@ts-ignore
          where: { id: event.doctorPostedId },
          include: { doctorPostedEvents: true },
        });
      } else {
        updatedDoctor = await prisma.user.findUnique({
          //@ts-ignore
          where: { id: event.doctorId },
          include: { recivedEvents: true, doctorPostedEvents: true },
        });
      }
      res.send({
        msg: "Event deleted succesfully",
        updatedUser,
        updatedDoctor,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.put("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  const token = req.headers.authorization;
  const { status } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (event && token) {
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: { status },
        include: { doctor: true, normalUser: true, doctorPosted: true },
      });
      const updatedUser = await getUserFromToken(token as string);

      res.send({ updatedEvent, updatedUser });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        postedEvents: true,
        recivedEvents: true,
        doctorPostedEvents: true,
      },
    });
    res.send(users);
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/doctors", async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { isDoctor: true },
      include: { recivedEvents: true, doctorPostedEvents: true },
    });
    res.send(doctors);
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
