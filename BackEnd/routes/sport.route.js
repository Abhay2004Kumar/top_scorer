import express from 'express'
import { createBDSingle, getBDSingle, getRecentBDSingle } from '../Controllers/BDSingle.controller.js'
import { createBDDoubles, getBDDoubles } from '../Controllers/BDDouble.controller.js';
import { 
  createKabaddiMatch, 
  getKabaddiMatches, 
  getKabaddiMatchById, 
  updateKabaddiMatch, 
  deleteKabaddiMatch,
  updatePlayerStats,
  updateMatchStatus
} from '../Controllers/Kabaddi.controller.js';
import { createTennisSingle, getTennisSingles } from '../Controllers/Tennis.controller.js';
import { createTennisDoubles, getTennisDoubles } from '../Controllers/TTDoubles.controller.js';

import {
    createMatch,
    getMatch,
    updateInnings,
    finishMatch,
    getLiveMatches
  } from "../Controllers/Cricket.controller.js"
import { CricketMatch } from "../Models/Cricket.model.js" 

const routes = express.Router();
 //bd single routes
routes.post('/bdsingle',createBDSingle);
routes.post('/bdDouble',createBDDoubles);
routes.get('/getRecentBDSingle',getRecentBDSingle);

routes.post('/Createkabaddi',createKabaddiMatch)
routes.get('/getbdsingle',getBDSingle);
routes.get('/getBDDouble',getBDDoubles);
routes.get('/getKabaddi', getKabaddiMatches) 
routes.post('/tennisSingle',createTennisSingle)
routes.get('/tennisSingles',getTennisSingles)
routes.post('/tennisDoubles', createTennisDoubles)
routes.get('/tennisDoubles',getTennisDoubles)

// 🏏 Cricket Match Routes
routes.post('/cricketMatch', createMatch);
routes.get('/cricketMatch/live', getLiveMatches);
routes.get('/cricketMatch/:id', getMatch);
routes.patch('/cricketMatch/innings', updateInnings);
routes.patch('/cricketMatch/finish', finishMatch);

// General sports update endpoint
routes.post('/update', async (req, res) => {
  try {
    const { sportType, data } = req.body;
    
    if (sportType === 'cricket') {
      // Handle cricket match update
      const { _id, ...updateData } = data;
      
      if (_id) {
        // Update existing match
        const updatedMatch = await CricketMatch.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedMatch) {
          return res.status(404).json({ success: false, message: 'Match not found' });
        }
        res.json({ success: true, match: updatedMatch });
      } else {
        // Create new match
        const newMatch = await CricketMatch.create(updateData);
        res.status(201).json({ success: true, match: newMatch });
      }
    } else {
      res.status(400).json({ success: false, message: 'Unsupported sport type' });
    }
  } catch (error) {
    console.error('Error updating match data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🏃 Kabaddi Match Routes
routes.get('/kabaddi/:id', getKabaddiMatchById);
routes.put('/kabaddi/:id', updateKabaddiMatch);
routes.delete('/kabaddi/:id', deleteKabaddiMatch);
routes.patch('/kabaddi/player-stats', updatePlayerStats);
routes.patch('/kabaddi/match-status', updateMatchStatus);

export{
    routes
}