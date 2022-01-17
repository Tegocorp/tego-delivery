import inquirer from "inquirer";

// Funciones de opciones
import login from "./login";

export default async function ejecutar() {
  // Limpia los mensajes de la consola
  console.clear();

  // Pregunta al usuario por la opción que desea ejecutar
  const { opcion } = await inquirer.prompt([
    {
      type: "list",
      name: "opcion",
      message: "Selecciona una opción",
      choices: [
        "Inicio de sesión",
        "Monitoreo de entregas",
        "Consultar entregas",
        "Configuración",
        "Salir de la aplicación",
      ],
    },
  ]);

  // Ejecuta la opción seleccionada
  switch (opcion) {
    case "Inicio de sesión":
      login();
      break;
    case "Salir de la aplicación":
      console.clear();

      process.exit();
    default:
      console.log("Ha ocurrido un error obteniendo la opción");
      break;
  }
}
