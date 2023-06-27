const { Router } = require('express');
const router = Router();

const CHATBOT_ANSWER = require('./controllers/chatbot/getAnswer.js');

router.get('/chatbot/getAnswer', CHATBOT_ANSWER);


module.exports = router;