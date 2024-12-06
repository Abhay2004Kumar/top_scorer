import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    player: { type: String, required: true },
    raidPoints: { type: [Number], default: [] },
    tacklePoints: { type: [Number], default: [] },
    touchPoints: { type: [Number], default: [] },
    bonusPoints: { type: [Number], default: [] },
    totalPoints: { type: Number, default: 0 },
  },
  { _id: false }
);

const KabaddiSchema = new mongoose.Schema(
  {
    teamA: { type: TeamSchema, required: true },
    teamB: { type: TeamSchema, required: true },
    currentHalf: { type: Number, default: 1 }, // e.g., 1 for first half, 2 for second half
    latestUpdate: { type: String, default: "No updates yet" },
  },
  { timestamps: true }
);

export const Kabaddi = mongoose.model("Kabaddi", KabaddiSchema);
