const request = require("request-promise");
const cheerio = require("cheerio");

(async () => {
  try {
    let initialRequest = await request({
      uri: "https://iol.juscorrientes.gov.ar:8443/iurix-online/LogOut",
      method: "GET",
      headers: {
        Host: "iol.juscorrientes.gov.ar:8443",
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Sec-Fetch-Site": "none",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "es-AR,es-419;q=0.9,es;q=0.8"
      },
      gzip: true,
      resolveWithFullResponse: true
    });

    // PARSING THE COOKIES -> obtengo la cookie inicial que la web me pasa dentro de la response header
    let cookie = initialRequest.headers["set-cookie"]
      .map(value => value.split(";")[0])
      .join(" ");
    // let $ = cheerio.load(initialRequest.body);

    let loginRequest = await request({
      uri: "https://iol.juscorrientes.gov.ar:8443/iurix-online/LoginServlet",
      method: "POST",
      headers: {
        Host: "iol.juscorrientes.gov.ar:8443",
        Connection: "keep-alive",
        //"Content-Length": "51",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Origin: "https://iol.juscorrientes.gov.ar:8443",
        "Upgrade-Insecure-Requests": "1",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Sec-Fetch-Site": "same-origin",
        Referer: "https://iol.juscorrientes.gov.ar:8443/iurix-online/LogOut",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "es-AR,es-419;q=0.9,es;q=0.8",
        Cookie: cookie
      },
      form: {
        txtUser: "",
        txtPassword: "",
        anonymous: "false"
      },
      resolveWithFullResponse: true
    });

    // Renuevo la cookie por la ultima que me asigna la web y con la cual se va a hacer las restantes
    // consultas
    cookie = loginRequest.headers["set-cookie"]
      .map(value => value.split(";")[0])
      .join(" ");

    let loggedInResponse = await request({
      uri:
        "https://iol.juscorrientes.gov.ar:8443/iurix-online/jsp/QueryNotific.jsp",
      method: "GET",
      headers: {
        Host: "iol.juscorrientes.gov.ar:8443",
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Sec-Fetch-Site": "same-origin",
        Referer:
          "https://iol.juscorrientes.gov.ar:8443/iurix-online/jsp/QueryNotific.jsp",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "es-AR,es-419;q=0.9,es;q=0.8",
        Cookie: cookie
      },
      resolveWithFullResponse: true
    });

    let $ = cheerio.load(loggedInResponse.body);
    let dia = $(`select[name="cmbDia"] option[selected]`)
      .text()
      .trim();
    let anio = $(`input[name="txtAnioFecha"]`)
      .val()
      .trim();
    let mes = $(`select[name="cmbMes"] option[selected]`)
      .text()
      .trim();
    console.log(
      `la ultima actualizacion de iurix fue el dia: ${dia}, del mes de ${mes} de ${anio}`
    );
  } catch (error) {
    console.log(error);
  }
})();
