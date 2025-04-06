import express from 'express'
import { createBDSingle, getBDSingle } from '../Controllers/BDSingle.controller.js'
import { createBDDoubles, getBDDoubles } from '../Controllers/BDDouble.controller.js';
import { createKabaddiMatch, getKabaddiMatches } from '../Controllers/Kabaddi.controller.js';
import { createTennisSingle, getTennisSingles } from '../Controllers/Tennis.controller.js';
import { createTennisDoubles, getTennisDoubles } from '../Controllers/TTDoubles.controller.js';

import {
    createMatch,
    getMatch,
    updateInnings,
    finishMatch,
    getLiveMatches
  } from "../Controllers/Cricket.controller.js"

const routes = express.Router();
 
routes.post('/bdsingle',createBDSingle);
routes.post('/bdDouble',createBDDoubles);
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




export{
    routes
}