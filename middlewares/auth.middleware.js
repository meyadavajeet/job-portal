import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.getAuthorization;
  if (!authHeader || !authHeader.startWith("Bearer ")) {
    next("Authorization token is missing");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    next("Error in User Authentication middleware ", error.message);
  }
};
export default userAuth;
