import mongoose from "mongoose";

export interface IPaciente extends mongoose.Document {
    nombre: string;
    propietario: string;
    email: string;
    fechaAlta: Date;
    sintomas: string;
    veterinario: mongoose.Schema.Types.ObjectId;
}

const pacienteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    propietario:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    fechaAlta:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        required: true,
        trim: true
    },
    veterinario:{
        // type sirve para definir el tipo de dato
        type: mongoose.Schema.Types.ObjectId,
        //ref sirve para relacionar dos modelos
        ref: "Veterinario"
    }
}, {
    //para que mongoose cree automaticamente los campos de createdAt y updatedAt
    timestamps: true
});

const Paciente = mongoose.model<IPaciente>("Paciente", pacienteSchema);

export default Paciente;