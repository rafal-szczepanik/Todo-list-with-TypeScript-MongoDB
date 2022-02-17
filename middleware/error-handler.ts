class ValidationError extends Error {
  message: string;
  statusCode: number
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createCustomError = (msg, statusCode) => {
  return new ValidationError(msg, statusCode);
};

export const handleError = (err, req, res, next) => {
//   if (err instanceof ValidationError) {
//     return res.status(err.statusCode).json({msg: err.message});
//   }
//   return res.status(500).json({msg: 'Something went wrong, please try again'});
// };
//   console.log(res.status());
  return err instanceof ValidationError
    ? res.status(err.statusCode).json({msg: err.message})
    : res.status(500).json({msg: 'Something went wrong, please try again'});
};


