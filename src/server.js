
const express = require("express");
const server = express();

const controller = require('./controllers/coches.controllers');

// Middleware: Establece el manejo de datos en formato JSON
/*You NEED express.json() and express.urlencoded() for POST and PUT requests, 
because in both these requests you are sending data (in the form of some data object)
to the server and you are asking the server to accept or store that data (object), */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener usuarios con params en forma dinamica: 
// Ruta GET http://127.0.0.1:PORT/users
server.get('/users/', async (req, res) => controller.handleGets(req, res));

// Obtener un usuario por ID: Ruta GET http://127.0.0.1:PORT/users/:id
server.get('/users/:id', async (req, res) => controller.handleGetById(req, res));

// Crear un usuario: Ruta POST http://127.0.0.1:PORT/users/
server.post('/users', async (req, res) => controller.handlePost(req, res));

// Modificar un usuario: Ruta PUT http://127.0.0.1:PORT/users/:id
server.put('/users/:id', async (req, res) => controller.handlePut(req, res));

// Borrar un usuario: Ruta DELETE http://127.0.0.1:PORT/users/:id
server.delete('/users/:id', async (req, res) => controller.handleDelete(req, res));

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/users`);
});