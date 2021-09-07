
const log4js = require('log4js')
const config = __static + '/log4js.json'
log4js.configure(config)
let profile = process.env.NODE_ENV !== 'development' ? 'prod' : 'default'
const log = log4js.getLogger(profile)

export default log
