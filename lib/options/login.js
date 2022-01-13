const inquirer = require("inquirer");

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
  const eBay = new (require("../structures/EBay"))(usuario);

  // Crea una nueva instancia de Oauth
  const oAuth = new (require("../structures/Oauth"))(eBay);

  const code = await oAuth.obtenerAuthCode();
  const token = await eBay.getInstancia().OAuth2.getToken(code);

  // Finaliza el proceso de inicio de sesión
  oAuth.finalizar(token);

  // Establece el token de autorización en la instancia de Ebay
  eBay.establecerCredenciales();

  // Limpia los mensajes de la consola
  console.clear();
};

module.exports = {
  ejecutar,
};
