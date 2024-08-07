import { Router } from 'express';
import { getUsers, getUserById, updateUser, updateUsersAvatar, getCurrentUser, createUser } from '../controllers/users'
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

const regexPattern = /^(http|https):\/\/([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

router.get('/', getUsers);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexPattern)
  }).min(1),
}), createUser);

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  }).min(1),
}), updateUser);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().regex(regexPattern)
  }),
}), updateUsersAvatar);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24)
  }),
}), getUserById);

export default router;