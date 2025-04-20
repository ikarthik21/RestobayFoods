import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req) => req.ip // this uses the real IP, considering trust proxy
});

export default rateLimiter;
