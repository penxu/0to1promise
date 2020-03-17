const PENDING = 'pending'; // 等待状态
const FULFILLED = 'fulfilled'; // 完成状态
const REJECTED = 'rejected'; // 拒绝状态

const resolvePromise = (promise2, x, resolve, reject) => { 
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<promise'));
  }
  // 接下来要判断是promise还是普通值
  // 如果x不是对象也不是函数，是string boolean等情况
  let called
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 如何判断是不是一个promise ，promise必须有then方法
    try {
      let then = x.then;
      // console.log('then', then)
      // 有可能这个then是别人通过definepropety定义,就是返回异常即可
      if (typeof then === 'function') {
        // 如果有then方法，证明返回的是一个promise
        then.call(x, y => {
          // resolve(y)
          if(called){
            return
          }
          called = true
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if(called){
            return
          }
          called = true
          reject(r)
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if(called){
        return
      }
      called = true        
      reject(e);
    }
  } else {
    // x 就是普通值
    resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      // if() {

      // }
      console.log(value, this.onResolvedCallbacks, 'value')
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.map(cb => cb(this.value));
      }
    };
    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.map(cb => cb(this.reason));
      }
    };
    if (typeof executor === 'function') {
      executor(resolve, reject);
    }
  }

  then(onFulfilled, onRejected) {
    // console.log(onFulfilled, 'onFulfilled')
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw this.reason;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => { // 加定时器就是为了拿到promise2
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject); 
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;
