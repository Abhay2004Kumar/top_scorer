import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
    },
    event: {
      type: String,
      enum: ["Goal", "Red Card", "Yellow Card", "Substitution"],
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const HalfSchema = new mongoose.Schema(
  {
    events: [EventSchema],
  },
  { _id: false }
);

const FootballSchema = new mongoose.Schema(
  {
    team1: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
    },
    team2: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
    },
    finalScore: {
      team1: {
        type: Number,
        required: true,
      },
      team2: {
        type: Number,
        required: true,
      },
    },
    firstHalf: HalfSchema,
    secondHalf: HalfSchema,
  },
  { timestamps: true }
);

export const Football = mongoose.model("Football", FootballSchema);
