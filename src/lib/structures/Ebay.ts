import fs = require("fs");
import eBayApi from "@hendt/ebay-api";

import config from "../config";
import login from "../options/login";

export default class Ebay {
  private usuario?: string;
  private instancia: eBayApi;

  constructor(usuario?: string) {
    this.usuario = usuario;

    // Crea una nueva instancia de eBayApi
    this.instancia = new eBayApi({
      appId: config.EBAY_APP_ID ? config.EBAY_APP_ID : "",
      certId: config.EBAY_CERT_ID ? config.EBAY_CERT_ID : "",
      sandbox: true,

      siteId: eBayApi.SiteId.EBAY_ES,
      devId: config.EBAY_DEV_ID,
      ruName: config.EBAY_RU_NAME,
    });

    // Establece los scopes necesarios para realizar las operaciones
    this.instancia.OAuth2.setScope([
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    ]);
  }

  // Método para obtener la instancia
  getInstancia(): eBayApi {
    return this.instancia;
  }

  // Comprueba si existe el fichero token
  existeToken() {
    return fs.existsSync(__dirname + "/../../token.json");
  }

  establecerCredenciales() {
    if (!this.existeToken()) {
      // Si no existe, se ejecuta el proceso de inicio de sesión
      login.ejecutar();

      return;
    }

    // Lee el fichero token
    const token = fs.readFileSync(__dirname + "/../../token.json");

    // Convierte el fichero en un objeto
    const tokenObj = JSON.parse(token.toString());

    // Establece el nombre de usuario
    this.usuario = tokenObj.usuario;

    // Establece las credenciales
    this.instancia.OAuth2.setCredentials(tokenObj);

    // Comprueba si el token ha expirado
    this.instancia.OAuth2.on("refreshAuthToken", (token) => {
      this.guardarToken(token);
    });
  }

  guardarToken(token: any) {
    const data = {
      usuario: this.usuario,
      token,
    };

    const rawdata = JSON.stringify(data);

    // Guarda el token en la raíz del proyecto
    fs.writeFileSync(__dirname + `/../../token.json`, rawdata, "utf8");
  }
}
