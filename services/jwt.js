import jwt from "jsonwebtoken";


const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export const sign = (payload, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verify = (token) => {
  return jwt.verify(token, secret);
};

export const signRefresh = (payload, expiresIn) => {
  return jwt.sign(payload, refreshSecret, { expiresIn });
};

export const verifyRefresh = (token) => {
  return jwt.verify(token, refreshSecret);
};

export default { sign, verify, signRefresh, verifyRefresh };
