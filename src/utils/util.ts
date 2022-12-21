export class Utils {
  public responseSuccess = (res, message, data, code) => {
    const responseMessage = {};

    Object.assign(responseMessage, {
      status: code,
      message,
      data,
    });

    return res.status(code).json(responseMessage);
  };

  public responseFailed = (res, error, errorCode) => {
    return res.status(errorCode).json({
      status: errorCode,
      message: error,
    });
  };

  public responseErrorValidate = (res, error, errorCode) => {
    return res.status(errorCode).json({
      message: error,
    });
  };
}
