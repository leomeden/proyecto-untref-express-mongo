const conexion = require('./db.conexions');

async function gets(filtros) {
    let coches = [];
    const collection = await conexion.connectToDb('coches');
    coches = (await collection.find(filtros).sort({ id: 1 }).toArray());
    await conexion.disconnect();
    return coches;
}

module.exports = { gets }