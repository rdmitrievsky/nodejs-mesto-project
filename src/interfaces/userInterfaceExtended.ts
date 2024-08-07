import { Request } from 'express';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface JwtPayloadExt extends JwtPayload {
  _id: Types.ObjectId;
  iat: number;
  exp: number;
}
interface RequestExtended extends Request {
  user?: JwtPayloadExt
}

export default RequestExtended