const inquirer = require("inquirer");

// Funciones de opciones
const login = require("../lib/login");

const ejecutar = () => {
  // Limpia los mensajes de la consola
  console.clear();

  // Pregunta al usuario por la opción que desea ejecutar
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "Selecciona una opción",
        choices: [
          "Inicio de sesión",
          "Monitoreo de entregas",
          "Consultar entregas",
          "Configuración",
        ],
      },
    ])
    .then((res) => {
      // Ejecuta la opción seleccionada
      switch (res.option) {
        case "Inicio de sesión":
          login.ejecutar();
          break;
        default:
          console.log("Ha ocurrido un error obteniendo la opción");
          break;
      }
    });
};

module.exports = {
  ejecutar,
};
