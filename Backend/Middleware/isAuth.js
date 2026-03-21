import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;