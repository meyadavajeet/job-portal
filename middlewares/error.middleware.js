//error middleware || NEXT function
const errorMiddleware = (err, req, res, next) => {
  console.log(err, "error response");
  const defaultErrors = {
    statusCode: 500,
    success: false,
    message: err,
    data: [],
  };

  // missing filed error
  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 422;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  // duplicate error
  if (err.code && err.code === 11000) {
    console.log("err.code ", err.code);
    defaultErrors.statusCode = 409;
    defaultErrors.message = `${Object.keys(
      err.keyValue
    )} field has to be unique`;
  }
  res.status(defaultErrors.statusCode).json({
    success: false,
    message: defaultErrors.message,
    data: [],
  });
};

export default errorMiddleware;
