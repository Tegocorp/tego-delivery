const fs = require("fs");
const https = require("https");
const express = require("express");
const inquirer = require("inquirer");
const eBayApi = require("@hendt/ebay-api");
const Spinner = require("cli-spinner").Spinner;

const config = require("../config");

// Crea una nueva instancia de eBayApi
const eBay = new eBayApi({
  appId: config.EBAY_APP_ID,
  certId: config.EBAY_CERT_ID,
  sandbox: true,

  siteId: eBayApi.SiteId.EBAY_ES,
  devId: config.EBAY_DEV_ID,
  ruName: config.EBAY_RU_NAME,
});

// Establece los scopes necesarios para realizar las operaciones
eBay.OAuth2.setScope([
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
]);

const spinner = new Spinner("%s Inicia sesión en eBay para continuar...");
spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");

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

  const code = await obtenerAuthCode();
  const token = await obtenerToken(code);

  guardarToken(usuario, token);

  // Cierra el spinner de inicio de sesión
  spinner.stop();

  // Limpia los mensajes de la consola
  console.clear();
};

const obtenerAuthCode = async () => {
  // Certificado y clave privada para entorno de desarrollo
  const key = fs.readFileSync(__dirname + "/../../certs/key.pem");
  const cert = fs.readFileSync(__dirname + "/../../certs/cert.pem");

  const app = express();

  const server = https.createServer({ key: key, cert: cert }, app);

  let resolve;
  const p = new Promise((_resolve) => {
    resolve = _resolve;
  });

  app.get("/oauth", (req, res) => {
    resolve(req.query.code);
    res.send(
      "Se ha obtenido el código de autorización, ya puedes cerrar esta ventana."
    );
  });

  await server.listen(3000);

  // Genera la URL de inicio de sesión
  const url = eBay.OAuth2.generateAuthUrl();
  // Abre la URL en una nueva pestaña del navegador
  console.log(`\nURL inicio de sesión: ${url}\n`);
  require("openurl").open(url);

  // Inicia el spinner de inicio de sesión
  spinner.start();

  const code = await p;

  await server.close();

  return code;
};

const obtenerToken = async (code) => {
  let token;

  try {
    token = await eBay.OAuth2.getToken(code);
    eBay.OAuth2.setCredentials(token);
  } catch (error) {
    console.log(error);
  }

  return token;
};

const guardarToken = async (usuario, token) => {
  const data = JSON.stringify(token);

  // Comprueba si el directorio de tokens existe
  if (!fs.existsSync(__dirname + "/../tokens")) {
    fs.mkdirSync(__dirname + "/../tokens");
  }

  // Guarda el token en el directorio de tokens con el nombre de usuario
  fs.writeFileSync(__dirname + `/../tokens/${usuario}.json`, data, "utf8");
};

module.exports = {
  ejecutar,
};
