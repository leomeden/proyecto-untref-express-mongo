const manager = require('../database/data.manager');

async function handleGets(req, res) {
    const { marca, modelo, precio_mayor_que } = req.query;
    const filtros = {};

    if (marca) filtros.marca = marca;
    if(modelo) filtros.modelo = modelo;
    if(precio_mayor_que) filtros.precio = { $gt: +precio_mayor_que}

    let coches = [];

    coches = await manager.gets(filtros);
    
    if(coches.length == 0) return res.status(400).send('Error. No hay coches con la descripción dada');
    res.status(200).send(JSON.stringify(coches, null, '\t'));
    return
}

async function handleGetById(req, res) {
    const { id } = req.params;

    let coche = await manager.getById(+id)

    if(!coche) return res.status(400).send('Error. No hay coches con ese id');
    res.status(200).send(JSON.stringify(coche, null, '\t'));
    return
}

async function handlePost(req, res) {
    const { marca, modelo, anio, precio, descuento, velocidad_crucero, es_0km } = req.body;

    if(!marca || !modelo || !anio || !precio) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }

    let coche = { marca, modelo, anio, precio }
    if(descuento) coche.descuento = descuento;
    if(velocidad_crucero) coche.velocidad_crucero = velocidad_crucero;
    if(es_0km) coche.es_Okm = es_0km;
   
    coche = await manager.add(coche)
    
    res.status(200).send(JSON.stringify(coche, null, '\t'));
}

async function handlePut(req, res) {
    const { id } = req.params
    const { marca, modelo, anio, precio, descuento, velocidad_crucero, es_0km } = req.body;
    let coche = { marca, modelo, anio, precio};

    if(descuento) coche.descuento = descuento;
    if(velocidad_crucero) coche.velocidad_crucero = velocidad_crucero;
    if(es_0km) coche.es_Okm = es_0km;

    
    if(!id || !marca || !modelo || !anio || !precio) {
        return res.status(400).send('Error. Los datos no estan completos!!')
    }

    try {
        coche = await manager.put(+id, coche)
        res.status(200).send(JSON.stringify(coche, null, '\t'));

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error en el servidor');
    } 

}

async function handleDelete(req, res) {
    const { id } = req.params

    try {
        if(await manager.getById(+id)) {
            await manager.destroy(+id)
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