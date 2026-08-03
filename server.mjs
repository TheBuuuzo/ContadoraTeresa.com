import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    value = value.trim();
    if (!(key in process.env) || !String(process.env[key] || "").trim()) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT, ".env"));

function env(name, fallback = "") {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return fallback;
  return String(raw).trim();
}

const HOST = env("CONTADORATERESA_HOST", "192.168.15.101");
const PORT = Number(env("CONTADORATERESA_PORT", "5020"));
const MARRONE_API_URL = env("MARRONE_API_URL", "http://192.168.15.101:5000").replace(
  /\/$/,
  ""
);
const INTEGRATION_KEY =
  env("TERESA_INTEGRATION_KEY") ||
  env("CONECTA_INTEGRATION_KEY") ||
  env("MARRONE_INTEGRATION_KEY") ||
  "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function proxyOrcamento(req, res) {
  if (!INTEGRATION_KEY) {
    return sendJson(res, 500, {
      erro: "Chave de integração não configurada no ContadoraTeresa (.env).",
    });
  }

  let bodyText;
  try {
    bodyText = await readBody(req);
    JSON.parse(bodyText || "{}");
  } catch {
    return sendJson(res, 400, { erro: "JSON inválido" });
  }

  const target = `${MARRONE_API_URL}/api/integracao/propostas-eleitorais/lead`;
  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Integracao-Key": INTEGRATION_KEY,
      },
      body: bodyText || "{}",
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { erro: text || "Resposta inválida do Marrone" };
    }
    return sendJson(res, upstream.status, data);
  } catch (err) {
    return sendJson(res, 502, {
      erro: `Falha ao falar com o Marrone: ${err?.message || err}`,
    });
  }
}

function safeJoin(base, requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(base, cleaned);
  if (!full.startsWith(base)) return null;
  return full;
}

function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  let filePath = safeJoin(DIST, urlPath);
  if (!filePath) {
    res.writeHead(400);
    return res.end("Bad request");
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end("Not found");
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";
  if (req.method === "POST" && url.startsWith("/api/orcamento")) {
    return proxyOrcamento(req, res);
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }
  res.writeHead(405);
  res.end("Method not allowed");
});

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("Build ausente: rode npm run build antes de iniciar o servidor.");
  process.exit(1);
}

if (!Number.isFinite(PORT) || PORT <= 0) {
  console.error(`Porta inválida: ${process.env.CONTADORATERESA_PORT}`);
  process.exit(1);
}

server.on("error", (err) => {
  console.error(`Falha ao ouvir em ${HOST}:${PORT}`);
  console.error(err);
  if (err && err.code === "EADDRNOTAVAIL") {
    console.error(
      "Dica: este IP não existe nesta máquina. Use CONTADORATERESA_HOST=0.0.0.0 ou o IP local correto."
    );
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`ContadoraTeresa ouvindo em http://${HOST}:${PORT}`);
  console.log(`Domínio esperado: https://contadorateresa.com.br`);
  console.log(
    `Proxy Marrone: ${MARRONE_API_URL}/api/integracao/propostas-eleitorais/lead`
  );
});
