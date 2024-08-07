import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import IncorrectInputError from '../errors/incorrectInput'
import NoItemError from '../errors/noItemError'
import IncorrectUserData from '../errors/incorrectUserData';
import passwordMatchError from '../errors/incorrectLogin';
import RequestExtended from 'interfaces/userInterfaceExtended';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import 'dotenv/config'

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then(users => res.send({data: users}))
    .catch(next)
}

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId
  return User.findById(id)
    .then(user => {
      if (!user) {
        throw new NoItemError('Пользователь по указанному _id не найден')
      }

      res.send({data: user})
    })
    .catch(next)
}

export const userInputValidationEmail = (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body;

  if (!validator.isEmail(email)) {
    next(new IncorrectInputError('Переданы некорректные данные при создании пользователя'))
  } else {
    next()
  }
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {name, about, avatar, password, email} = req.body;
  return bcrypt.hash(password, 10)
  .then(hash => {
    return User.create({email, password: hash, name, about, avatar})
  })
  .then(user => res.send({data: user}))
  .catch(next)
}

export const updateUser = (req: RequestExtended, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new passwordMatchError('Пользователь не авторизован')
  }

  const {_id} = req.user;
  const {name, about} = req.body;
  return User.findByIdAndUpdate(_id, { name, about }, {new: true})
  .then(user => {
    if (!user) {
      throw new NoItemError('Пользователь по указанному _id не найден')
    }

    if (_id != user._id) {
      throw new IncorrectUserData('Нет прав на изменение данных других пользователей')
    }

    res.send({data: user})
  })
  .catch(next);
}

export const getCurrentUser = (req: RequestExtended, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new passwordMatchError('Пользователь не авторизован')
  }
  const {_id} = req.user;

  return User.findById(_id)
    .then(user => {
      if (!user) {
        throw new NoItemError('Пользователь по указанному _id не найден')
      }

      res.send({data: user})
    })
    .catch(next)
}

export const updateUsersAvatar = (req: RequestExtended, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new passwordMatchError('Пользователь не авторизован')
  }

  const {_id} = req.user;
  const {avatar} = req.body;
  return User.findByIdAndUpdate(_id, { avatar }, {new: true})
  .then(user => {
    if (!user) {
      throw new NoItemError('Пользователь по указанному _id не найден')
    }

    res.send({data: user})
  })
  .catch(next);
}