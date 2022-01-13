const fs = require("fs");
const eBayApi = require("@hendt/ebay-api");

const config = require("../config");
const login = require("../options/login");

class Ebay {
  constructor(usuario) {
    this.usuario = usuario;

    // Crea una nueva instancia de eBayApi
    this.instancia = new eBayApi({
      appId: config.EBAY_APP_ID,
      certId: config.EBAY_CERT_ID,
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
  getInstancia() {
    return this.instancia;
  }

  // Comprueba si existe el fichero token
  existeToken() {
    return fs.existsSync(__dirname + "/../../token.json");
  }

  establecerCredenciales() {
    if (!this.existeToken()) {
      // Si no existe, se ejecuta el proceso de inicio de sesión
      login.iniciarSesion();

      return;
    }

    // Lee el fichero token
    const token = fs.readFileSync(__dirname + "/../../token.json");

    // Convierte el fichero en un objeto
    const tokenObj = JSON.parse(token);

    // Establece el nombre de usuario
    this.usuario = tokenObj.usuario;

    // Establece las credenciales
    this.instancia.OAuth2.setCredentials(tokenObj);

    // Comprueba si el token ha expirado
    this.instancia.OAuth2.on("refreshAuthToken", (token) => {
      this.guardarToken(token);
    });
  }

  guardarToken(token) {
    const data = {
      usuario: this.usuario,
      token,
    };

    const rawdata = JSON.stringify(data);

    // Guarda el token en la raíz del proyecto
    fs.writeFileSync(__dirname + `/../../token.json`, rawdata, "utf8");
  }
}

module.exports = Ebay;
