import { Kabaddi } from "../Models/Kabaddi.model.js";

// const createKabaddiMatch = async (req, res) => {
//   try {
//     const { teamA, teamB } = req.body;

//     const newMatch = await Kabaddi.create({
//       teamA,
//       teamB,
//     });

//     res.status(201).json(newMatch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const updateKabaddiMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { teamA, teamB, currentHalf, latestUpdate } = req.body;

//     const updatedMatch = await Kabaddi.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           teamA,
//           teamB,
//           currentHalf,
//           latestUpdate,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json(updatedMatch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getKabaddiMatches = async (req, res) => {
//   try {
//     const matches = await Kabaddi.find();
//     res.status(200).json(matches);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getKabaddiMatchById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const match = await Kabaddi.findById(id);

//     if (!match) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json(match);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const deleteKabaddiMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedMatch = await Kabaddi.findByIdAndDelete(id);

//     if (!deletedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json({ message: "Match deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// Create Kabaddi Match

const createKabaddiMatch = async (req, res) => {
  try {
    const { teamA, teamB, currentHalf, latestUpdate } = req.body;
    const calculateTotalPoints = (team) => {
      const totalPoints = ['set1Points', 'set2Points', 'set3Points'].reduce((acc, set) => {
        const setPoints = team[set];
        return acc + setPoints.raidPoints + setPoints.tacklePoints + setPoints.touchPoints + setPoints.bonusPoints;
      }, 0);
      return totalPoints;
    };

    teamA.totalPoints = calculateTotalPoints(teamA);
    teamB.totalPoints = calculateTotalPoints(teamB);
    
    const newMatch = await Kabaddi.create({
      teamA,
      teamB,
      currentHalf,
      latestUpdate,
    });

    res.status(201).json(newMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Kabaddi Match
const updateKabaddiMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamA, teamB, currentHalf, latestUpdate } = req.body;

    const calculateTotalPoints = (team) => {
      const totalPoints = ['set1Points', 'set2Points', 'set3Points'].reduce((acc, set) => {
        const setPoints = team[set];
        return acc + setPoints.raidPoints + setPoints.tacklePoints + setPoints.touchPoints + setPoints.bonusPoints;
      }, 0);
      return totalPoints;
    };

    teamA.totalPoints = calculateTotalPoints(teamA);
    teamB.totalPoints = calculateTotalPoints(teamB);

    const updatedMatch = await Kabaddi.findByIdAndUpdate(
      id,
      { $set: { teamA, teamB, currentHalf, latestUpdate }},
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(updatedMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Kabaddi Matches
const getKabaddiMatches = async (req, res) => {
  try {
    const matches = await Kabaddi.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Kabaddi Match by ID
const getKabaddiMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Kabaddi.findById(id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Kabaddi Match
const deleteKabaddiMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await Kabaddi.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createKabaddiMatch,
  updateKabaddiMatch,
  getKabaddiMatches,
  getKabaddiMatchById,
  deleteKabaddiMatch,
};



