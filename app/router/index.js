import express from "express"

import providerRouter from "./providers.js";
import patientsRouter from "./patients.js";
import usersRouter from "./users.js"

const router = express.Router()

router.use(usersRouter)
router.use(patientsRouter)
router.use(providerRouter)

export default router
