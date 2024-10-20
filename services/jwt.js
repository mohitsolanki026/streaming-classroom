import jwt from "jsonwebtoken";

export const sign = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn });
};

export const verify = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

export const signRefresh = (payload, expiresIn) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, refreshSecret, { expiresIn });
};

export const verifyRefresh = (token) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  return jwt.verify(token, refreshSecret);
};

export default { sign, verify, signRefresh, verifyRefresh };
