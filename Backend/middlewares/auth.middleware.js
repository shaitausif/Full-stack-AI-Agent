import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({authenticated : false,  errors: "Access Denied. No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next();
  } catch (error) {
    res.status(500).json({authenticated: false, error : "Invalid token", details : error.message})
  }
};
