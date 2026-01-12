import { Veterinario } from "../models/Veterinario";

declare global {
  namespace Express {
    interface Request {
      veterinario?: typeof Veterinario.prototype;
    }
  }
}