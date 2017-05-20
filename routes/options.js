const router = require('koa-router')();

router.get('/top', async(ctx, next) => {
  await ctx.render('top', {
    title: 'iKnowJS|Top'
  })
})

module.exports = router;