const fs = require("fs");
const https = require("https");
const express = require("express");
const Spinner = require("cli-spinner").Spinner;

class Oauth {
  constructor(eBay) {
    this.eBay = eBay;

    this.spinner = new Spinner("%s Inicia sesión en eBay para continuar...");
    this.spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
  }

  async obtenerAuthCode() {
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
    const url = this.eBay.getInstancia().OAuth2.generateAuthUrl();
    // Abre la URL en una nueva pestaña del navegador
    console.log(`\nURL inicio de sesión: ${url}\n`);
    require("openurl").open(url);

    // Inicia el spinner de inicio de sesión
    this.spinner.start();

    const code = await p;

    await server.close();

    return code;
  }

  finalizar(token) {
    // Guarda el token en un fichero
    this.eBay.guardarToken(token);

    // Cierra el spinner de inicio de sesión
    this.spinner.stop();
  }
}

module.exports = Oauth;
