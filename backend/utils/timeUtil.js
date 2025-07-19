export const hasPollExpired = (poll) => {
  const pollEndTime = new Date(poll.createdAt).getTime() + (poll.duration * 1000);
  return Date.now() > pollEndTime;
};

export const getRemainingTime = (poll) => {
  const pollEndTime = new Date(poll.createdAt).getTime() + (poll.duration * 1000);
  const remaining = Math.max(0, Math.floor((pollEndTime - Date.now()) / 1000));
  return remaining;
};

export const formatTimestamp = (date) => {
  return new Date(date).toLocaleTimeString();
};
