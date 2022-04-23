module.exports = {
  confirmSignup: (nickname, password, confirmPassword, dbNickname) => {
    if (password !== confirmPassword) {
      return false;
    }
    if (password.indexOf(nickname) !== -1) {
      return false;
    }
    const a = dbNickname.filter((dbnick) => nickname === dbnick);
    if (a.length) {
      return false;
    }

    return true;
  },
};
