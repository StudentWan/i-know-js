const router = require('koa-router')()
const request = require('superagent');
const fs = require('fs');

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
    let result = res.text;
    let data = {};
    for (let jsLib of jsLibs) {
      if(result.toLowerCase().indexOf(jsLib.toLowerCase()) >= 0){
        data[jsLib] = {name: jsLib, isTrue: true};
      } else {
        data[jsLib] = {name: jsLib, isTrue: false};
      }
    }
    ctx.body = data;
    //TODO
  }).catch((err) => {
    ctx.body = err;
  })
})

module.exports = router