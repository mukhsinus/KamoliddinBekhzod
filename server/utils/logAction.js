// server/utils/logAction.js
const ActionLog = require('../models/ActionLog');

async function logAction({
  userId = null,
  action,
  target = null,
  meta = {}
}) {

  const payload = {
    user: userId,
    action,
    target,
    meta
  };

  await ActionLog.create(payload);
}

module.exports = logAction;