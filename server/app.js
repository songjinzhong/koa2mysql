const logger = require('koa-logger')
const router = require('koa-router')()
const serve = require('koa-static')
const path = require('path')
const sql = require('./mysql')
const cors = require('koa-cors')
const Koa = require('koa')
const app = module.exports = new Koa()

app.use(logger())
app.use(cors())

app.use(serve(path.join(__dirname, '../public')))

// route definitions

router.get('/speed', speed)

app.use(router.routes())

app.use(async function (ctx) {
  ctx.throw(404, 'Not found!')
})
async function speed (ctx) {
  let sqlData
  try {
    sqlData = await sql.selectDate()
  } catch (e) {
    ctx.throw(404, '数据库执行发生错误')
  }
  ctx.body = sqlData
}

if (!module.parent) app.listen(8080)
console.log('listen at 8080')
