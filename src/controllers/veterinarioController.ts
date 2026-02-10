import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Veterinario } from "../models/Veterinario";
import generarJWT from "../helpers/generarJWT";
import generarID from "../helpers/generarID";
import emailRegistro from "../helpers/emailRegistro";
import emailOlvideMiPassword from "../helpers/emailOlvidePassword";

//funcion para registrar un nuevo veterinario *****
const registrar = async (req: Request, res: Response) => {
  // const { nombre, email, password } = req.body;

  // //prevenir usuarios duplicados
  // const existeUsuario = await Veterinario.findOne({ email });

  // //si existe el usuario
  // if (existeUsuario) {
  //   const error = new Error("Usuario ya registrado anteriormente");

  //   //detiene la ejecucion y manda el error
  //   return res.status(400).json({ msg: error.message });
  // }

  // try {
  //   //guardar un nuevo veterinario
  //   const veterinario = new Veterinario(req.body);

  //   //guardar en la base de datos
  //   //await para esperar a que se guarde
  //   const veterinarioGuardado = await veterinario.save();

  //   //Enviar el email de confirmacion *****
  //   //await para esperar a que se envie
  //   emailRegistro({
  //     nombre: veterinarioGuardado.nombre,
  //     email: veterinarioGuardado.email,
  //     token: veterinarioGuardado.token
  //   });

  //   //imprime en consola el veterinario guardado
  //   //console.log(veterinarioGuardado);

  //   res.json({ msg: "Registrando veterinario" });
  // } catch (error) {
  //   console.log(error);
  // }

  console.log("The 'Register' function has been disabled to prevent possible spam registrations. / La funcion de Registrar ha sido deshabilitada para evitar posibles registros basura.")
};

//funcion para el perfil del veterinario ******
const perfil = (req: Request, res: Response) => {
  const { veterinario } = req;
  res.json({ perfil: veterinario });
};

//funcion para confirmar cuenta de veterinario mediante token ******
const confirmar = async (req: Request, res: Response) => {
  //extraer el token de la url
  const { token } = req.params;

  //buscar el usuario con ese token
  const usuarioConfirmar = await Veterinario.findOne({ token });

  //si no existe el usuario
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //si existe el usuario confirmar su cuenta
    usuarioConfirmar.confirmado = true;
    //el token se vacia para que no se pueda volver a usar
    usuarioConfirmar.token = "";
    //guardar los cambios en la base de datos
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario confirmado correctamente" });

  } catch (error) {
    console.log("Algo salio mal en el guardado de los cambios: " + error);
  }
};

//funcion para autenticar al veterinario ******
const autenticar = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //comprobar su password
  if (await usuario.comprobarPassword(password)) {

    //autenticar al usuario
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id)
    });


  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }

};

const olvidePassword = async (req: Request, res: Response) => {
  
  const { email } = req.body;

  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //generar un token id y guardarlo sen la base de datos
    usuario.token = generarID();
    await usuario.save();

    //Enviar el email con las instrucciones para reestablecer el password
    emailOlvideMiPassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    });    

    res.json({ msg: "Hemos enviado un email con las instrucciones" }); 

  } catch (error) {

    console.log("Error al generar el token de recuperacion: " + error);
  }
}

const comprobarToken = async (req: Request, res: Response) => {
  const token = req.params.token;

  const usuario = await Veterinario.findOne({ token });

  if (usuario) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

}

const nuevoPassword = async (req: Request, res: Response) => {
  const token = req.params.token;
  const { password } = req.body;

  //1. buscar el usuario con ese token
  const usuario = await Veterinario.findOne({ token });

  //2. si no existe el usuario
  if (!usuario) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //3. si existe el usuario, guardar el nuevo password y vaciar el token
    usuario.password = password;
    usuario.token = "";
    await usuario.save();

    res.json({ msg: "Password modificado correctamente" });

  } catch (error) {
    console.log("Error al modificar el password: " + error);
  }

}


const actualizarPerfil = async(req: Request, res: Response)=>{
  const veterinario = await Veterinario.findById(req.params.id);

  if(!veterinario){
    const error = new Error('Hubo un Error');
    return res.status(400).json({msg:error.message});
  }

  const {email} = req.body;
  if(veterinario.email !== req.body.email){
    const existeEmail = await Veterinario.findOne({email});
    if(existeEmail){
      const error = new Error('El email colocado ya esta en uso');
      return res.status(400).json({msg:error.message});
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();

    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
}

const actualizaPassword = async(req: Request, res: Response) =>{
  //Leer datos
  const {id} = req.veterinario;
  const {pwd_actual, pwd_nuevo}= req.body;

  //comprobar que el veterinario exista
  const veterinario = await Veterinario.findById(id);

  if(!veterinario){
    const error = new Error('Hubo un Error');
    return res.status(400).json({msg:error.message});
  }

  //comprobar su password
  if(await veterinario.comprobarPassword(pwd_actual)){
    //almacenar el nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({msg:"Password Almacenado Correctamente"})
  }else{
    const error = new Error('El Password actual es Incorrecto ');
    return res.status(400).json({msg:error.message});
  }

  
}



export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizaPassword };