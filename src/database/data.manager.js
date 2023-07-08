const conexion = require('./db.conexions');

//Generar ID nuevo
async function generateID(collection) {   
    const documentMaxId = await collection.find().sort({ id: -1}).limit(1).toArray();
    const maxId = documentMaxId[0]?.id ?? 0;
    
    return maxId + 1;
}

//Traer documentos con filtro por "querys"
async function gets(filtros, coll) {
    let docs = [];
    const collection = await conexion.connectToDb(coll);
    docs = (await collection.find(filtros).sort({ id: 1 }).toArray());
    await conexion.disconnect();
    return docs;
}

//Traer documento por ID
async function getById(id, coll) {
    const collection = await conexion.connectToDb(coll);
    const doc = await collection.findOne({ id: +id });
    await conexion.disconnect();
    return doc;
}

// Agregar usuario a la coleccion
async function add(data, coll) {
    const collection = await conexion.connectToDb(coll);
    let doc = { id: await generateID(collection), ...data};
    
    await collection.insertOne(doc);

    await conexion.disconnect();

    return doc;

}

// Modificar Usuario
async function put(id, data, coll) {
    let doc = data;
    const collection = await conexion.connectToDb(coll);
    await collection.updateOne({ id: +id }, { $set: data });
    await conexion.disconnect();
    return doc
}

// Eliminar Usuario
async function destroy(id, coll) {
    const collection = await conexion.connectToDb(coll);
    await collection.deleteOne({ id: +id });
    await conexion.disconnect();
    return
}

module.exports = { gets, getById, add, put, destroy }