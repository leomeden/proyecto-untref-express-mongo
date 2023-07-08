
const express = require("express");
const server = express();

//const { connectToDb, disconnect, generateID} = require('./database/db.conexions');

const conexion = require('./database/db.conexions');
const manager = require('./database/data.manager')

// Middleware: Establece el manejo de datos en formato JSON
/*You NEED express.json() and express.urlencoded() for POST and PUT requests, 
because in both these requests you are sending data (in the form of some data object)
to the server and you are asking the server to accept or store that data (object), */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener coches con params en forma dinamica: 
// Ruta GET http://127.0.0.1:3000/coches
server.get('/coches/', async (req, res) => {
    const { marca, modelo, precio_mayor_que } = req.query;
    const filtros = {};

    if (marca) filtros.marca = marca;
    if(modelo) filtros.modelo = modelo;
    if(precio_mayor_que) filtros.precio = { $gt: +precio_mayor_que}

    let coches = [];

    coches = await manager.gets(filtros);
    
    if(coches.length == 0) return res.status(400).send('Error. No hay coches con la descripción dada');
    res.status(200).send(JSON.stringify(coches, null, '\t'));

});

// Obtener un coche: Ruta GET http://127.0.0.1:3000/coches
server.get('/coches/:id', async (req, res) => {
    const { id } = req.params;

    const collection = await conexion.connectToDb('coches');
    const coche = await collection.findOne({ id: +id });

    await conexion.disconnect();

    if(!coche) return res.status(400).send('Error. No hay coches con ese id');
    res.status(200).send(JSON.stringify(coche, null, '\t'));

});

// Obtener un coche: Ruta GET http://127.0.0.1:3000/coches
server.post('/coches', async (req, res) => {
    const { marca, modelo, anio, precio, descuento, velocidad_crucero, es_0km } = req.body;

    if(!marca || !modelo || !anio || !precio) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }

    const collection = await conexion.connectToDb('coches');
    const coche = { id: await conexion.generateID(collection), marca, modelo, anio, precio};
    if(descuento) coche.descuento = descuento;
    if(velocidad_crucero) coche.velocidad_crucero = velocidad_crucero;
    if(es_0km) coche.es_Okm = es_0km;

    await collection.insertOne(coche);

    await conexion.disconnect();

    res.status(200).send(JSON.stringify(coche, null, '\t'));

});

// Modificar un coche: Ruta GET http://127.0.0.1:3000/coches
server.put('/coches/:id', async (req, res) => {
    const { id } = req.params
    const { marca, modelo, anio, precio, descuento, velocidad_crucero, es_0km } = req.body;
    const coche = { marca, modelo, anio, precio};

    if(!id || !marca || !modelo || !anio || !precio) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }

    if(descuento) coche.descuento = descuento;
    if(velocidad_crucero) coche.velocidad_crucero = velocidad_crucero;
    if(es_0km) coche.es_Okm = es_0km;

    try {
        const collection = await conexion.connectToDb('coches');
        await collection.updateOne({ id: +id }, { $set: coche });
        res.status(200).send(JSON.stringify(coche, null, '\t'));

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await conexion.disconnect();
    }
});

// Borrar un coche: Ruta GET http://127.0.0.1:3000/coches
server.delete('/coches/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const collection = await conexion.connectToDb('coches');
        await collection.deleteOne({ id: +id });
        res.status(200).send('Eliminado');

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    } finally {
        await conexion.disconnect();
    }
});


// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/coches`);
});