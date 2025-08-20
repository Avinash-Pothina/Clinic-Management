
const History = require('../models/history-model');

const getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ archivedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getHistory };