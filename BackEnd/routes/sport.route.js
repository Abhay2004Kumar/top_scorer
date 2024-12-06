import express from 'express'
import { createBDSingle } from '../Controllers/BDSingle.controller.js'
import { createBDDoubles } from '../Controllers/BDDouble.controller.js';

const routes = express.Router();
 
routes.post('/bdsingle',createBDSingle);
routes.post('/bdDouble',createBDDoubles);


export{
    routes
}