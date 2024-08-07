import mongoose, {Schema, Types} from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId | Types.ObjectId;
  likes: Schema.Types.ObjectId[] | Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: [Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<ICard>('card', cardSchema);