const express = require('express')
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const prisma = new PrismaClient();

app.use(express.json())
app.use(express.urlencoded())
app.use((req,res,next)=>{
    console.log(`🔹 ${req.rawHeaders[13]}`);
    next()
})
app.use(helmet())
if (app.get("env") === "development") app.use(morgan('tiny'));

// GET all users
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

// GET single user by ID
app.get('/users/:id', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// گرفتن همه Taskها برای یک User
app.get('/users/:id/tasks', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const tasks = await prisma.user_tasks.findMany({
      where: { userId },
      include: { task: true } // include Task info
    });
    res.json(tasks.map(t => t.task));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/",(req,res)=>{
    res.send("OK")
})

app.get("/api/test",(req,res)=>{
    res.send(JSON.stringify({'status':'ok'}))
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`📡:${port}`);
})