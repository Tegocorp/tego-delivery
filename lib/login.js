const inquirer = require("inquirer");

const ejecutar = () => {
  // Limpia los mensajes de la consola
  console.clear();

  // Pregunta al usuario por el usuario y la contraseña
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Ingresa el usuario",
      },
      {
        type: "password",
        name: "password",
        message: "Ingresa la contraseña",
        mask: "*",
      },
    ])
    .then((res) => {
      console.log(res);
    });
};

module.exports = {
  ejecutar,
};
