import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import NoItemError from '../errors/noItemError';
import RequestExtended from '../interfaces/userInterfaceExtended';
import IncorrectInputError from '../errors/incorrectInput';
import IncorrectUserData from '../errors/incorrectUserData';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(next)
}

export const deleteCard = async (req: RequestExtended, res: Response, next: NextFunction) => {
  const {_id} = req.user!;
  const {cardId} = req.params;

  try {
    const card = await Card.findById(cardId)
    if (!card) {
      throw new NoItemError('Передан несуществующий _id карточки')
    }

    if (card?.owner == _id) {
      res.send({data: card, message: 'Карточка удалена'})
      return card.deleteOne().exec()
    } else {
      throw new IncorrectUserData('Можно удалять только свои карточки')
    }
  } catch (error) {
    next(error)
  }
}

export const createCard = (req: RequestExtended, res: Response, next: NextFunction) => {
  const {_id} = req.user!;
  const {name, link} = req.body;

  return Card.create({name, link, owner: _id})
    .then(card => {
      if (!name || !link) {
        throw new IncorrectInputError('Переданы некорректные данные при создании карточки')
      }

      res.send({data: card})
    })
    .catch(next)
}

export const addLikeToCard = (req: RequestExtended, res: Response, next: NextFunction) => {
  const {_id} = req.user!;
  const {cardId} = req.params;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NoItemError('Передан несуществующий _id карточки')
      }
      res.send({data: card})
    })
    .catch(next)
}

export const removeLikeFromCard = (req: RequestExtended, res: Response, next: NextFunction) => {
  const {_id} = req.user!;
  const {cardId} = req.params;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {

      if (!card) {
        throw new NoItemError('Передан несуществующий _id карточки')
      }

      res.send({data: card})
    })
    .catch(next)
}