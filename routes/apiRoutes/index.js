// index is the central hub  to pull all the js file together
const express = require('express')
const router = express.Router();


router.use(require('./candidateRoutes'))
router.use(require('./partyRoutes'))
router.use(require('./voterRoutes'))
router.use(require('./voteRoutes'))





module.exports = router;