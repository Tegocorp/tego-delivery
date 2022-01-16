import fs from "fs";
import https from "https";
import express from "express";
import puppeteer from "puppeteer";
import { Spinner } from "cli-spinner";
import { Token } from "@hendt/ebay-api/lib/auth/oAuth2";

import Ebay from "./Ebay";
import login from "../options/login";
import handleError from "../utils/handleError";

export default class Oauth {
  private eBay: Ebay;
  private spinner: any;

  constructor(eBay: Ebay) {
    this.eBay = eBay;

    this.spinner = new Spinner(
      "%s Iniciando sesión en eBay, por favor espere..."
    );
    this.spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
  }

  // Método para iniciar sesión
  private async iniciarSesion(
    url: string,
    usuario: string,
    contrasena: string
  ) {
    // {ignoreHTTPSErrors: true} es necesario para que no muestre un error
    const navegador = await puppeteer.launch({ headless: false });

    const pagina = await navegador.newPage();

    await pagina.goto(url);

    // Selecciona el input del usuario y lo rellena
    await pagina.focus("#userid");
    await pagina.keyboard.type(usuario);

    // Clicka el botón de continuar
    await pagina.keyboard.press("Enter");

    // Espera a que se cargue la página
    await pagina.waitForResponse((response) => {
      return response.url().includes("/signin/srv/identifer");
    });

    // Comprueba si el usuario existe
    const errorUsuario = await pagina.$("#signin-error-msg");

    if (errorUsuario) {
      await navegador.close();
      throw new Error("El usuario introducido no existe");
    }

    // Selecciona el input de la contraseña y lo rellena
    await pagina.focus("#pass");
    await pagina.keyboard.type(contrasena);

    // Clicka el botón de iniciar sesión
    await pagina.keyboard.press("Enter");

    // Espera a que se cargue la página
    await pagina.waitForNavigation();

    // Comprueba si la contraseña introducida es correcta
    const errorContrasena = await pagina.$("#signin-error-msg");

    if (errorContrasena) {
      await navegador.close();
      throw new Error("La contraseña introducida es incorrecta");
    }

    // Comprueba si estamos en la pagina de consentimiento
    const consentimiento = await pagina.$("form[action='consentSubmit']");

    if (consentimiento) {
      // Hace click sobre el botón de enviar
      await pagina.click("input[type='submit']");
      await pagina.waitForNavigation();
    }

    // Obtener query param "code" de la URL
    const redirectUrl = new URL(await pagina.url());

    console.log(redirectUrl.searchParams.get("code"));

    await navegador.close();

    return redirectUrl.searchParams.get("code");
  }

  public async obtenerAuthCode(
    usuario: string,
    contrasena: string
  ): Promise<string> {
    let resolve: any;

    const p = new Promise<string>((_resolve) => {
      resolve = _resolve;
    });

    try {
      // Inicia el spinner de inicio de sesión
      this.spinner.start();

      // Genera la URL de inicio de sesión
      const url = this.eBay.getInstancia().OAuth2.generateAuthUrl();

      const code = await this.iniciarSesion(url, usuario, contrasena);
      resolve(code);
    } catch (error) {
      this.spinner.stop();

      handleError(error);

      await new Promise((resolve) => {
        setTimeout(() => {
          login.ejecutar();
          resolve(true);
        }, 5000);
      });
    }

    const code = await p;

    return code;
  }

  finalizar(token: Token) {
    // Guarda el token en un fichero
    this.eBay.guardarToken(token);

    // Cierra el spinner de inicio de sesión
    this.spinner.stop();
  }
}
