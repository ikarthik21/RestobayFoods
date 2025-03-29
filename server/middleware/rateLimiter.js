import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 1* 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
});

export default rateLimiter;
