import express from 'express'
import { createBDSingle } from '../Controllers/BDSingle.controller.js'

const routes = express.Router();

routes.post('/bdsingle',createBDSingle);

export{
    routes
}