import express from 'express';
 const router = express.Router();
 import {initiateSTKPush,getMpesaAccessToken} from '../Controllers/mpesaController.js';
 
 router.post('/stkpush',getMpesaAccessToken,initiateSTKPush );  

 
export default router