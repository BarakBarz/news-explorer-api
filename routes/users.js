const router = require('express').Router();

const { getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);

module.exports = router;
