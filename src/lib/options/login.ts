import inquirer from "inquirer";

import handleError from "../utils/handleError";

// Funciones de opciones
import list from "./list";

import Ebay from "../structures/Ebay";
import Oauth from "../structures/Oauth";

export default async function ejecutar() {
  // Limpia los mensajes de la consola
  console.clear();

  // Pregunta al usuario por el nombre de usuario
  const { usuario, contrasena } = await inquirer.prompt([
    {
      type: "input",
      name: "usuario",
      message: "Introduce el nombre de usuario de eBay",
    },
    {
      type: "password",
      mask: "*",
      name: "contrasena",
      message: "Introduce la contraseña de eBay",
    },
  ]);
  // Genera una nueva instancia de eBay
  const eBay = new Ebay(usuario);

  // Crea una nueva instancia de Oauth
  const oAuth = new Oauth(eBay);

  try {
    const code = await oAuth.obtenerAuthCode(usuario, contrasena);
    const token = await eBay.getInstancia().OAuth2.getToken(code);

    // Finaliza el proceso de inicio de sesión
    oAuth.finalizar(token);

    // Vuelve a mostrar la lista de opciones
    list();
  } catch (error) {
    handleError(error);
    oAuth.spinner.stop();

    await new Promise((resolve) => {
      setTimeout(() => {
        ejecutar();
        resolve(true);
      }, 5000);
    });
  }
}
