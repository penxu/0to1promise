const Promise  =  require('./promise.js')




const promise = new Promise((resolve, reject) => {
      resolve()
      // setTimeout(() =>{
      //   resolve(100)
      // }, 1000)
})

let promise2 = promise.then(() => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('ok')
            // console.log('内层...')
          }, 1000)
        }))
        // reject('no')
    }, 1000)
  })
})
promise2.then((data) => {
  console.log(data)
})

// promise2.then(data => {
//   console.log('第二次then', data)
// }, err => {
//   console.log(err, 'err')
// })
// .catch((e) => {
//   console.log(e)
// })