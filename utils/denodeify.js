module.exports = (fn) => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) reject(err);
        else resolve(data);
      };
      fn.call(this, ...args, callback);
    });
  };
};
