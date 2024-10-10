const Suggestion = require('../models/Suggestion');
// إضافة اقتراح جديد

const createSuggestion = async (req, res) => {
  try {
    const { text, name, phone } = req.body; // استقبل الاسم ورقم الهاتف
    const newSuggestion = new Suggestion({ text, name, phone });
    await newSuggestion.save();
    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error('Error submitting suggestion:', error);
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
const getApprovedSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ status: 'approved' }); // Changed '=' to ':'
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved suggestions', error });
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
  getApprovedSuggestions
};
