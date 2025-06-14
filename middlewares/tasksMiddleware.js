const setUserIds = (req, res, next) => {
  const tasksInfo = req.body;
  if (!tasksInfo.user) tasksInfo.user = req.user.id;
  next();
};

module.exports = { setUserIds };
