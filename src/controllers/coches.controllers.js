const manager = require('../database/data.manager');

// defino el nombre de la coleccion de la BD que voy a usar
const coleccion = 'usuarios';

// Función para manejar la ruta get para traer usuarios (con filtro)
// Filtros posibles --> Sin query params trae todos
//                  --> ?nombre = "x"  => trae todos los que nombre = x
//                  --> ?apellido = "x"  => trae todos los que apellido = x
//                  --> ?dni = "x"  => trae todos los que dni = x
//                  --> ?edad_mayor_que = "x"  => trae todos los que edad > x
async function handleGets(req, res) {
    
    const { nombre, apellido, dni, edad_mayor_que } = req.query;
    const filtros = {};

    if (nombre) filtros.nombre = nombre;
    if(apellido) filtros.apellido = apellido;
    if(dni) filtros.dni = +dni;
    if(edad_mayor_que) filtros.edad_mayor_que = { $gt: +edad_mayor_que}

    let users = [];

    try {
        users = await manager.gets(filtros, coleccion);
        if(users.length == 0) return res.status(400).send('Error. No hay usuarios con la descripción dada');
        res.status(200).send(JSON.stringify(users, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    }
}

// Función para manejar la ruta get para traer usuario por id
async function handleGetById(req, res) {
    const { id } = req.params;
    
    try {
        let user = await manager.getById(+id, coleccion)   
        if(!user) return res.status(400).send('Error. No hay usuarios con ese id');
        res.status(200).send(JSON.stringify(user, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    }
}

// Función para manejar la ruta post de agregar usuarios
async function handlePost(req, res) {
    
    const { nombre, apellido, dni, email, edad, altura, peso, sueldo } = req.body;
    
    if(!nombre || !apellido || !email || !dni) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }
    
    let user = { nombre, apellido, email, dni };
    if(edad) user.edad = edad;
    if(altura) user.altura = altura;
    if(peso) user.peso = peso;
    if(sueldo) user.sueldo = sueldo;

    try {
        user = await manager.add(user, coleccion);
        res.status(200).send(JSON.stringify(user, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    }
}

// Función para manejar la ruta put para modificar un usuario por id
// parameros requeridos ( nombre, apellido, email, dni)
async function handlePut(req, res) {
    
    const { id } = req.params
    const { nombre, apellido, dni, email, edad, altura, peso, sueldo } = req.body;
    let user = { nombre, apellido, email, dni};

    if(edad) user.edad = edad;
    if(altura) user.altura = altura;
    if(peso) user.peso = peso;
    if(sueldo) user.sueldo = sueldo;

    
    if(!id || !nombre || !apellido || !dni || !email) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }

    try {
        user = await manager.put(+id, user, coleccion)
        res.status(200).send(JSON.stringify(user, null, '\t'));

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    } 

}

// Función para manejar la ruta delete para eliminar un usuario por id
async function handleDelete(req, res) {
    const { id } = req.params

    try {
        if(await manager.getById(+id, coleccion)) {
            await manager.destroy(+id, coleccion)
            res.status(200).send('Eliminado');
        } else {
            res.status(400).send('No existe el recurso a eliminar!');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    } 
}


module.exports = { handleGets, handleGetById, handlePost, handlePut, handleDelete }