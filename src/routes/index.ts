import { Router } from 'express'
import { apiSecret, apiSignIn, tokenCheck } from '../api';

const router: Router = Router()


// api
router.post('/api/v1/access_check', tokenCheck)
router.get('/api/v1/secret', apiSecret)
router.post('/api/v1/signin', apiSignIn)
export default router
