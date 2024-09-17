const Suggestion = require('../models/Suggestion');

// إضافة اقتراح جديد
const createSuggestion = async (req, res) => {
  try {
    const { text, submittedBy } = req.body;
    const newSuggestion = new Suggestion({ text, submittedBy });
    await newSuggestion.save();
    res.status(201).json(newSuggestion);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting suggestion', error });
  }
};

// جلب جميع الاقتراحات
const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions', error });
  }
};

// جلب الاقتراحات بناءً على حالتها
const getSuggestionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const suggestions = await Suggestion.find({ status });
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions by status', error });
  }
};

// تحديث حالة اقتراح من قبل الإدمن
const updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    suggestion.status = status;
    await suggestion.save();

    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({ message: 'Error updating suggestion status', error });
  }
};

module.exports = {
  createSuggestion,
  getAllSuggestions,
  getSuggestionsByStatus,
  updateSuggestionStatus,
};
