module.exports = function (asyncFn) {
  const ret = (...args) => {
    let toResolve, toReject;
    const promise = new Promise((resolve, reject) => {
      toResolve = resolve;
      toReject = reject;
    });
    captured.reduce((p, [method, r, j]) => p[method](r, j), promise);
    return asyncFn(...args).then(toResolve, toReject);
  };
  const captured = [];
  const capture = (method) => (r, j) => {
    captured[captured.length] = [method, r, j];
    return ret;
  };
  ret.then = capture("then");
  ret.catch = capture("catch");
  ret.finally = capture("finally");
  return ret;
};
