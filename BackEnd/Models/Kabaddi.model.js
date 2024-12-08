import mongoose from "mongoose";

// const TeamSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     player: { type: String, required: true },
//     raidPoints: { type: [Number], default: [0,0,0] },
//     tacklePoints: { type: [Number], default: [0,0,0] },
//     touchPoints: { type: [Number], default: [0,0,0] },
//     bonusPoints: { type: [Number], default: [0,0,0] },
//     netPoints: { type: [Number], default: [0,0,0] },
//     totalPoints: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// const KabaddiSchema = new mongoose.Schema(
//   {
//     teamA: { type: TeamSchema, required: true },
//     teamB: { type: TeamSchema, required: true },
//     currentHalf: { type: Number, default: 1 }, // e.g., 1 for first half, 2 for second half
//     latestUpdate: { type: String, default: "No updates yet" },
//   },
//   { timestamps: true }
// );




// Kabaddi Match Schema
const kabaddiSchema = new mongoose.Schema({
  teamA: {
    name: { type: String, required: true },
    player: { type: String, required: true },
    set1Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    set2Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    set3Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    totalPoints: { type: Number, required: true }
  },
  teamB: {
    name: { type: String, required: true },
    player: { type: String, required: true },
    set1Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    set2Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    set3Points: {
      raidPoints: { type: Number, required: true },
      tacklePoints: { type: Number, required: true },
      touchPoints: { type: Number, required: true },
      bonusPoints: { type: Number, required: true },
      totalPoints: { type: Number, required: true }
    },
    totalPoints: { type: Number, required: true }
  },
  currentHalf: { type: Number, required: true },
  latestUpdate: { type: String, required: true },
}, { timestamps: true });

const Kabaddi = mongoose.model('Kabaddi', kabaddiSchema);

export { Kabaddi };



