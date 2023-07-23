import loginAuth from '../authenticates/login.authenticate';

const postUserAccount = (req, res, next) => {
  loginAuth.loginUserAccount(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export default {
  postUserAccount,
};
