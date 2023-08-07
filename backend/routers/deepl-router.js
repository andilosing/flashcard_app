const express = require('express');
const deeplService = require('../services/deepl-service');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {

      const { text, targetLang } = req.query;
      const translatedText = await deeplService.translateText(text, targetLang);
      res.json({ translatedText });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;