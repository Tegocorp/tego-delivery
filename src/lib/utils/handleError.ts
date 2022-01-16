import chalk from "chalk";

export default function handleError(error: any) {
  if (error instanceof Error) {
    console.error(chalk.bold.red("Ha ocurrido un error:"), `${error.message}.`);
  } else {
    console.error(error);
  }
}
