const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({ email: email, displayName: displayName });
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}
