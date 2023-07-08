const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env')});

const client = new MongoClient(process.env.DATABASE_URL);

//Conexion con el cluster de MongoDB
async function connect(){
    console.log('Conectando...');
    let connection = null;

    try {
        connection = await client.connect();
        console.log('\tConectado');
    } catch (error) {
        console.log(error.message);
    } 
    
    return connection;
}

//Desconexion del cluster de MongoDB
async function disconnect(){
   
    try {
        await client.close();
        console.log('\tDesconectado');
    } catch (error) {
        console.log(error.message);
    }
    
}

//Conexion con la coleccion requerida
async function connectToDb(collectionName) {   
    const connection = await connect();
    //console.log(process.env.DATABASE_NAME);
    const db = connection.db(process.env.DATABASE_NAME);
    const collection = db.collection(collectionName);

    return collection;
}



module.exports = { connectToDb, disconnect }