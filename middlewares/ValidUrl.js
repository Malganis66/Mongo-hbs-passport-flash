import { URL } from "url";

export const ValidUrl = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlClient = new URL(origin);
    if (urlClient.origin !== "null") {
      if (urlClient.protocol === "http:" || urlClient.protocol === "https:") {
        return next();
      }
    } else {
      throw new Error("invalid");
    }
  } catch (error) {
    req.flash('messages', [{msg: error.message}]);
    return res.redirect('/')
  }
};
