const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkIfProjectAlreadyExists(req, res, next) {
  const { id, title } = req.body;
  const project = projects.find(proj => proj.id === id && proj.title === title);

  if (project) {
    return res.status(400).json({ error: 'This project already exists.' });
  }

  return next();
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(proj => +proj.id === +id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists.' });
  }

  req.project = project;

  return next();
}

function logRequests(req, res, next) {
  console.count(`Quantidade de requisições`);

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', checkIfProjectAlreadyExists, (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

server.post('/projects/:id/:tasks', checkIfProjectExists, (req, res) => {
  const { tasks } = req.params;

  req.project.tasks.push(tasks);

  return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(proj => +proj.id === +id);

  projects.splice(projectIndex, 1);

  return res.json(projects)
});

server.listen(3000);