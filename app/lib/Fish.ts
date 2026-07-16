import mongoose, { Schema, Document } from "mongoose";

export interface IFish extends Document {
  name: string;
  drawing: string;
  weight: number;
  size: number;
  baseSize: number;
  ate: number;
  createdAt: Date;
}

const FishSchema = new Schema<IFish>({
  name: { type: String, required: true },
  drawing: { type: String, required: true },
  weight: { type: Number, default: 10 },
  size: { type: Number, default: 40 },
  baseSize: { type: Number, default: 40 },
  ate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Fish = mongoose.models.Fish || mongoose.model<IFish>("Fish", FishSchema);
export default Fish;