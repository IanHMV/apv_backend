import { Request, Response } from "express";
import Paciente from "../models/Paciente";

const agregarPaciente = async (req: Request, res: Response) => {
  // Crear un nuevo paciente
  const paciente = new Paciente(req.body);

  // Asignar el veterinario que crea el paciente
  //obtener el id del veterinario desde el request porque el middleware authMiddleware lo asigna
  paciente.veterinario = req.veterinario._id;

  try {
    const pacienteGuardado = await paciente.save();
    return res.status(201).json(pacienteGuardado);
  } catch (error) {
    return res.status(500).json({ msg: "Error al guardar el paciente" });
  }
};

const obtenerPacientes = async (req: Request, res: Response) => {
  // Lógica para obtener la lista de pacientes
  try {
    // Buscar pacientes del veterinario autenticado
    const pacientes = await Paciente.find()
      .where("veterinario")
      .equals(req.veterinario._id);

    // Retornar la lista de pacientes
    return res.status(200).json(pacientes);
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener los pacientes" });
  }
};

const obtenerPaciente = async (req: Request, res: Response) => {
  // Lógica para obtener un paciente por ID

  // Obtener el ID del paciente desde los parámetros de la ruta
  const { id } = req.params;
  try {
    // Buscar el paciente por ID
    const paciente = await Paciente.findById(id);

    // Si no existe el paciente
    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    // Verificar que el paciente pertenezca al veterinario autenticado
    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    // Retornar el paciente
    return res.status(200).json(paciente);
  } catch (error) {
    // Error en la consulta
    return res.status(500).json({ msg: "Error al obtener el paciente" });
  }
};

const actualizarPaciente = async (req: Request, res: Response) => {
  // Lógica para actualizar un paciente por ID
  const { id } = req.params;

  // Buscar el paciente por ID
  const paciente = await Paciente.findById(id);

  // Si no existe el paciente
  if (!paciente) {
    return res.status(404).json({ msg: "Paciente no encontrado" });
  }

  // Verificar que el paciente pertenezca al veterinario autenticado
  if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
    return res.status(403).json({ msg: "Acción no válida" });
  }

// Actualizar los campos del paciente
// Si no se envía un campo, mantener el valor actual
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fechaAlta = req.body.fechaAlta || paciente.fechaAlta;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;

  try {
    // Guardar los cambios
    const pacienteActualizado = await paciente.save();
    return res.status(200).json(pacienteActualizado);

  } catch (error) {
    return res.status(500).json({ msg: "Error al actualizar el paciente" });
  }
};

const eliminarPaciente = async (req: Request, res: Response) => {
  // Lógica para eliminar un paciente por ID
    const { id } = req.params;
    // Buscar el paciente por ID
    const paciente = await Paciente.findById(id);

    // Si no existe el paciente
    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }
    // Verificar que el paciente pertenezca al veterinario autenticado
    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    try {
      // Eliminar el paciente
      await paciente.deleteOne();
      return res.status(200).json({ msg: "Paciente eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ msg: "Error al eliminar el paciente" });
    }
};

export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
