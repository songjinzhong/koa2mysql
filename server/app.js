const logger = require('koa-logger')
const router = require('koa-router')()
const serve = require('koa-static')
const path = require('path')
const sql = require('./mysql')
const cors = require('koa-cors')
const koaBody = require('koa-body')
const Koa = require('koa')
const app = module.exports = new Koa()
const staticCache = require('koa-static-cache')

app.use(logger())
app.use(cors())
app.use(koaBody())
app.use(staticCache(path.join(__dirname, '../public'), {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(serve(path.join(__dirname, '../public')))


// route definitions

router.get('/getAll', getAll)
  .get('/timer/:timer', timer)

app.use(router.routes())

app.use(async function (ctx) {
  ctx.throw(404, 'Not found!')
})
async function getAll (ctx) {
  let sqlData
  try {
    sqlData = await sql.selectDate()
  } catch (e) {
    ctx.throw(500, '发生错误')
  }
  ctx.body = sqlData.map(v => {
    return parseInt(v['timer'])
  })
}
async function timer (ctx) {
  let sqlData
  try {
    const { timer } = ctx.params
    sqlData = await sql.selectOnce(timer)
  } catch (e) {
    ctx.throw(500, '发生错误')
  }
  ctx.body = sqlData.map(v => {
    v.speed = parseInt(v.speed)
    v.distance = parseInt(v.distance)
    v.heartrate = parseInt(v.heartrate)
    v.oxygen = parseInt(v.oxygen)
    return v
  })
}

if (!module.parent) app.listen(80)
console.log('listen at 80')
