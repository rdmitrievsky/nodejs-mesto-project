import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passwordMatchError from '../errors/incorrectLogin'
import 'dotenv/config'
import RequestExtended, {JwtPayloadExt} from '../interfaces/userInterfaceExtended';

const extractBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

const { NODE_ENV, JWT_SECRET } = process.env;

export default (req: RequestExtended, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new passwordMatchError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload: JwtPayloadExt;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET! : 'secret_key') as JwtPayloadExt;
  } catch (err) {
    throw new passwordMatchError('Необходима авторизация');
  }

  req.user = payload;
  next();
};