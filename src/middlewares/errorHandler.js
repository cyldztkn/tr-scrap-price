import fs from "fs";

function logToFile(data) {
  //   console.log("logToFile", data);
  const line = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
  fs.appendFile("error.log", line, (err) => {
    if (err) console.error("rate-limit log yazılamadı:", err);
  });
}

const errorHandler = (err, req, res, _next) => {


  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const logData = {
    status: statusCode,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    ua: req.get("user-agent"),
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
  };

  logToFile(logData);
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, 
  });
};

export default errorHandler;
