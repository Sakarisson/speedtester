require('dotenv').config()
const mysql = require('mysql')
const speedTest = require('speedtest-net')
const async = require('async')

function connectToDatabase (callback) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  })

  connection.connect((err) => {
    if (err) {
      callback(err)
      return
    }
    callback(null, connection)
  })
}

function checkSpeed (connection, callback) {
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
    callback(null, data, connection)
  })

  test.on('error', (err) => {
    callback(err)
  })
}

function logSpeed (speedObject, connection, callback) {
  connection.query(`
  INSERT INTO measurements (server_id, ping, download_speed, upload_speed)
  VALUES(
    ${speedObject.server.id},
    ${speedObject.server.ping},
    ${speedObject.speeds.download},
    ${speedObject.speeds.upload}
  )
  `, (err) => {
    if (err) {
      callback(err)
      return
    }
    callback(null, 'success!')
  })
}

function log () {
  async.waterfall([
    connectToDatabase,
    checkSpeed,
    logSpeed
  ], (err, res) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(res)
  })
}

log()
setInterval(() => {
  log()
}, process.env.FREQ * 60000)
