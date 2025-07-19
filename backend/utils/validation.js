export const validatePollData = (data) => {
  const { question, options, duration } = data;
  if (!question || typeof question !== 'string' || question.trim().length === 0) return false;
  if (!Array.isArray(options) || options.length < 2) return false;
  if (duration && (isNaN(duration) || duration <= 0)) return false;
  return true;
};

export const validateResponseData = (data) => {
  const { pollId, studentName, selectedOption } = data;
  if (!pollId || !studentName || !selectedOption) return false;
  return true;
};

export const validateMessage = (data) => {
  const { sender, message } = data;
  if (!sender || !message || typeof message !== 'string') return false;
  return true;
};
