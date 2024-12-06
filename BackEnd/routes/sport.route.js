import express from 'express'
import { createBDSingle, getBDSingle } from '../Controllers/BDSingle.controller.js'
import { createBDDoubles, getBDDoubles } from '../Controllers/BDDouble.controller.js';
import { createKabaddiMatch, getKabaddiMatches } from '../Controllers/Kabaddi.controller.js';

const routes = express.Router();
 
routes.post('/bdsingle',createBDSingle);
routes.post('/bdDouble',createBDDoubles);
routes.post('/Createkabaddi',createKabaddiMatch)
routes.get('/getbdsingle',getBDSingle);
routes.get('/getBDDouble',getBDDoubles);
routes.get('/getKabaddi', getKabaddiMatches)




export{
    routes
}