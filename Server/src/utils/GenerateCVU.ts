import { Usuario } from "../models/Usuario";

function generateRandomCVU(): string {
  const prefix = '000000'; // entidad ficticia
  const random = Math.floor(Math.random() * 10 ** 16)
    .toString()
    .padStart(16, '0');
  return prefix + random;
}

export async function generateUniqueCVU(): Promise<string> {
  let cvu: string;
  let exists: boolean;

  do {
    cvu = generateRandomCVU();
    const found = await Usuario.findOne({ where: { cvu } });
    exists = !!found;
  } while (exists);

  return cvu;
}