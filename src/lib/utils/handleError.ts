import chalk from "chalk";

export default function handleError(error: any) {
  if (error instanceof Error) {
    console.error(
      "\n" + chalk.bold.red("Ha ocurrido un error:"),
      `${error.stack}.`
    );
  } else {
    console.error(error);
  }
}
