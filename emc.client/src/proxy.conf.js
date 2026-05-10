const { env } = require('process');

// EMC.Server runs in Docker. Update the port below to match the HOST port
// that Docker mapped to the container's 8081 (HTTPS). Find it in Docker Desktop
// under the EMC.Server_1 container's "Show all ports" link.
// EMC.Server runs natively on http://localhost:5270.
// Use 127.0.0.1 explicitly — Node may resolve "localhost" to ::1 (IPv6) which
// Kestrel doesn't always bind to, causing ECONNREFUSED.
const DOCKER_HTTPS_TARGET = 'http://127.0.0.1:5270';

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : DOCKER_HTTPS_TARGET;

const PROXY_CONFIG = [
  {
    context: ["/api", "/weatherforecast"],
    target,
    secure: false,
    changeOrigin: true
  }
]

module.exports = PROXY_CONFIG;
