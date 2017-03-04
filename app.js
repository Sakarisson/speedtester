const speedTest = require('speedtest-net')

const test = speedTest({
  maxTime: 60000, // 1 minute
  serverId: 462   // Faroese Telecom server
})

test.on('downloadprogress', (progress) => {
  console.log('Download progress:', progress)
})

test.on('uploadprogress', (progress) => {
  console.log('Upload progress:', progress)
})

test.on('data', (data) => {
  console.dir(data)
})

test.on('error', (err) => {
  console.error(err)
})
