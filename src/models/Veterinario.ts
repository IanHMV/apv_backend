import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helpers/generarID";


export interface IVeterinario extends mongoose.Document {
    nombre: string;
    password: string;
    email: string;
    telefono?: string;
    web?: string;
    token: string;
    confirmado: boolean;

    comprobarPassword(passwordFormulario: string): Promise<boolean>;
}

const verterinarioSchema = new mongoose.Schema({
        nombre:{
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        telefono:{
            type: String,
            default: null,
        },
        web:{
            type: String,
            default: null,
        },
        token:{
            type: String,
            default: generarID(),
        },
        confirmado:{
            type: Boolean,
            default: false,
        }
    });

    //metodo para hashear el password antes de guardarlo en la base de datos

    //pre 'save' es un hook de mongoose que se ejecuta antes de guardar el documento
verterinarioSchema.pre('save', async function(next){
    
    //si el password ya esta hasheado no volver a hashearlo
    if(!this.isModified('password')){
        next();
    }

    //generar el salt para hashear el password
    //10 rondas de hasheo
    const salt = await bcrypt.genSalt(10);

    //hashear el password con el salt generado
    this.password = await bcrypt.hash(this.password, salt);
});

//metodo para comprobar el password
verterinarioSchema.methods.comprobarPassword = async function(passwordFormulario: string): Promise<boolean>{

    //comparar el password del formulario con el password hasheado en la base de datos
    //retorna true o false
    return await bcrypt.compare(passwordFormulario, this.password);
}

//De esta forma queda registrado como un modelo en mongoose
const Veterinario = mongoose.model<IVeterinario>('Veterinario', verterinarioSchema);



export {
    Veterinario
};