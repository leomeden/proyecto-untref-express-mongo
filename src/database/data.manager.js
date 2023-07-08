const conexion = require('./db.conexions');

//Generar ID nuevo
async function generateID(collection) {   
    const documentMaxId = await collection.find().sort({ id: -1}).limit(1).toArray();
    const maxId = documentMaxId[0]?.id ?? 0;
    
    return maxId + 1;
}

async function gets(filtros) {
    let coches = [];
    const collection = await conexion.connectToDb('coches');
    coches = (await collection.find(filtros).sort({ id: 1 }).toArray());
    await conexion.disconnect();
    return coches;
}

async function getById(id) {
    const collection = await conexion.connectToDb('coches');
    const coche = await collection.findOne({ id: +id });
    await conexion.disconnect();
    return coche;
}

async function add(data) {
    const collection = await conexion.connectToDb('coches');
    let coche = { id: await generateID(collection), ...data};
    
    await collection.insertOne(coche);

    await conexion.disconnect();

    return coche;

}

async function put(id, data) {
    let coche = data;
    console.log('coche: ', coche);
    const collection = await conexion.connectToDb('coches');
    await collection.updateOne({ id: +id }, { $set: data });
    await conexion.disconnect();
    return coche
}

async function destroy(id) {
    const collection = await conexion.connectToDb('coches');
    await collection.deleteOne({ id: +id });
    await conexion.disconnect();
    return
}

module.exports = { gets, getById, add, put, destroy }