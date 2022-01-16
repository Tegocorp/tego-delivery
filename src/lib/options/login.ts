import inquirer from "inquirer";
import Oauth from "../structures/Oauth";
import Ebay from "../structures/Ebay";
import list from "./list";

const ejecutar = async () => {
  // Limpia los mensajes de la consola
  console.clear();

  // Pregunta al usuario por el nombre de usuario
  const { usuario } = await inquirer.prompt([
    {
      type: "input",
      name: "usuario",
      message: "Introduce el nombre de usuario de eBay",
    },
  ]);

  // Genera una nueva instancia de eBay
  const eBay = new Ebay(usuario);

  // Crea una nueva instancia de Oauth
  const oAuth = new Oauth(eBay);

  const code = await oAuth.obtenerAuthCode();
  const token = await eBay.getInstancia().OAuth2.getToken(code);

  // Finaliza el proceso de inicio de sesión
  oAuth.finalizar(token);

  // Vuelve a mostrar la lista de opciones
  list.ejecutar();
};

export default { ejecutar };
