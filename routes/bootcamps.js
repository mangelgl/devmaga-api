const express = require('express');
const router = express.Router();

// We're not going to use anymore the '/api/v1/bootcamps' prefix
router.get('', (req, res) => {
    res.status(200).json({ data: 'Show all bootcamps' });
});

router.get('/:id', (req, res) => {
    res.status(200).json({ data: `Show bootcamp ${req.params.id}` });
});

router.post('', (req, res) => {
    res.status(200).json({ data: 'Create new bootcamp' });
});

router.put('/:id', (req, res) => {
    res.status(200).json({ data: `Update bootcamp ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.status(200).json({ data: `Delete bootcamp ${req.params.id}` });
});

// Export router object with routes
module.exports = router;