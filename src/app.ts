import express, { NextFunction, Request, Response } from 'express';
import mongoose from "mongoose";
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser } from './controllers/users'
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errors } from 'celebrate';
import { celebrate, Joi, Segments } from 'celebrate';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const url = 'mongodb://localhost:27017/mestodb';
mongoose.connect(url);

app.use(requestLogger);

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use(errors())

app.use(errorLogger);

interface ErrorExtended extends Error{
  statusCode: number;
}

app.use((err: ErrorExtended, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
