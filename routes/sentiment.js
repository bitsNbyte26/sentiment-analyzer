const express = require('express');
const router = express.Router();
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Sentiment analysis endpoint
router.post('/analyze', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const result = sentiment.analyze(text);
    let sentimentResult = 'neutral';

    if (result.score > 0) {
        sentimentResult = 'positive';
    } else if (result.score < 0) {
        sentimentResult = 'negative';
    }

    res.json({ sentiment: sentimentResult, scores: result });
});

module.exports = router;
