import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader, "auth header");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next("Authorization token is missing");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    console.log(error);
    next("Error in User Authentication middleware!!");
  }
};
export default userAuth;
