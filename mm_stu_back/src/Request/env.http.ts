const URL = {
  development : {
    uri : "http://localhost", // api url
    port : 80
  }, 
  production: {
    uri : "http://124.220.176.205",
    port: 8080
  }
}
// try_files $uri $uri/ /index.html;
// view url http://192.168.159.25:3000

export const baseURL = {
  //Api Url
  Api : process.env.NODE_ENV === "production" ? URL.production : URL.development 
}