const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      const authenticated = await user.checkPassword(password);
      if (!authenticated) {
        return done(null, false, 'Неверный пароль');
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
