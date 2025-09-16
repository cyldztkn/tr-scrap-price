import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import fs from "fs";

function logToFile(data) {
  const line = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
  fs.appendFile("rate-limit.log", line, (err) => {
    if (err) console.error("rate-limit log yazılamadı:", err);
  });
}

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7", 
  legacyHeaders: false, 
  message: { error: "Too many requests" },
  skip: (req) => req.originalUrl.startsWith("/api/v1/api-docs"), 
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: (req, res /*, next*/) => {
    const info = req.rateLimit;
    const data = {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      limit: info.limit,
      used: info.used,
      remaining: info.remaining,
      resetTime: info.resetTime,
      ua: req.get("user-agent"),
    };
    console.info(data);
    logToFile(data);
    return res
      .status(429)
      .json({ error: "Too many requests on heavy endpoint" });
  },
});

export const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 250,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests on heavy endpoint" },
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: (req, res /*, next*/) => {
    const info = req.rateLimit;
    const data = {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      limit: info.limit,
      used: info.used,
      remaining: info.remaining,
      resetTime: info.resetTime,
      ua: req.get("user-agent"),
    };
    console.info(data);
    logToFile(data);
    return res
      .status(429)
      .json({ error: "Too many requests on heavy endpoint" });
  },
});
