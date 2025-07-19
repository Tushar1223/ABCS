export const buildPollResult = (responses) => {
  const result = {};
  responses.forEach((r) => {
    result[r.selectedOption] = (result[r.selectedOption] || 0) + 1;
  });
  return result;
};
