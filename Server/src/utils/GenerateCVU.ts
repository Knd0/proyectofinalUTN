// Importa el modelo de Usuario para poder consultar la base de datos
import { Usuario } from "../models/Usuario";

// Función que genera un número de CVU aleatorio con un prefijo fijo
function generateRandomCVU(): string {
  const prefix = '000000'; // Prefijo que representa una entidad bancaria ficticia (6 dígitos)
  
  // Genera un número aleatorio de 16 dígitos como string, completando con ceros a la izquierda si es necesario
  const random = Math.floor(Math.random() * 10 ** 16)
    .toString()
    .padStart(16, '0');

  // Devuelve el CVU completo: 6 dígitos fijos + 16 aleatorios = 22 dígitos
  return prefix + random;
}

// Función asincrónica que garantiza que el CVU generado sea único
export async function generateUniqueCVU(): Promise<string> {
  let cvu: string;
  let exists: boolean;

  do {
    // Genera un nuevo CVU
    cvu = generateRandomCVU();

    // Verifica si ya existe un usuario con ese CVU
    const found = await Usuario.findOne({ where: { cvu } });

    // Si encontró uno, repetimos el ciclo
    exists = !!found;
  } while (exists);

  // Devuelve un CVU único
  return cvu;
}
