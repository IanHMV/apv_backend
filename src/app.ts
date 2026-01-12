import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db';
import veterinarioRoutes from './routes/veterinarioRoutes';
import pacientesRoutes from './routes/pacientesRoutes';
import cors from 'cors';



// Cargar variables de entorno
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

//Le indicamos a express que lea los json
app.use(express.json());

// Conectar a la base de datos
conectarDB();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL as string];
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);


const corsOptions = {
  origin: function (origin: any, callback: any) {
    console.log('ORIGIN:', origin);
    if (whitelist.includes(origin) || !origin) {
      //el !origin es para que postman pueda hacer las peticiones tambien 

      //El callback es una funcion que recibe un error y un booleano
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    } 
  }
};

app.use(cors(corsOptions));

// Definir las rutas
// Rutas para veterinarios
app.use('/api/veterinarios', veterinarioRoutes);

//Rutas para pacientes
app.use('/api/pacientes', pacientesRoutes);


// Definir el puerto
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
