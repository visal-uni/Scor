const store = {};

export const saveOTP = (email, code) => {
  store[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000
  };
};

export const verifyOTP = (email, code) => {
  const record = store[email];

  if (!record) return false;
  if (record.code !== code) return false;
  if (Date.now() > record.expires) return false;

  delete store[email];
  return true;
};