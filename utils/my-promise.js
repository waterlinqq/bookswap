const myPromise = new Proxy(Promise, {
  construct(target, argArray, newTarget) {
    let _resolve, _reject;
    const [executor = () => {}] = argArray;
    const newExecutor = new Proxy(executor, {
      apply(target, thisArg, argArray) {
        const [resolve, reject] = argArray;
        _resolve = resolve;
        _reject = reject;
        try {
          Reflect.apply(target, thisArg, argArray);
        } catch (e) {
          reject(e);
        }
      },
    });
    const promise = Reflect.construct(target, [newExecutor], newTarget);
    promise.resolve = _resolve;
    promise.reject = _reject;
    return promise;
  },
});

module.exports = myPromise;
