
import mongoose from "mongoose";


// Función para conectar a la base de datos MongoDB
const conectarDB = async () => {

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');

        const url = `${db.connection.host}:${db.connection.port}`;

        console.log(`MongoDB conectado en: ${url}`);

    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error}`);
        process.exit(1);
    }

}

export default conectarDB;