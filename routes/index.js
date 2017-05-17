const router = require('koa-router')()
const request = require('superagent');


router.get('/', async(ctx, next) => {
  await ctx.render('index', {
    title: 'iKnowJs'
  })
})

router.post('/search', async(ctx, next) => {
  const
    jsLibs = ctx.request.body.values,
    url = ctx.request.body.url;

  await request.get(url).then((res) => {
    ctx.body = res.text;
    //TODO
  }).catch((err) => {
    ctx.body = err;
  })
})

module.exports = router