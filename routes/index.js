const router = require('koa-router')()
const request = require('superagent');
const cheerio = require('cheerio');
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
    let $ = cheerio.load(result);
    let scripts = $('script');
    let data = {};
    for (let i = 0; i < scripts.length; i++) {
      let src = scripts[i].attribs.src;
      if (src) {
        for (let jsLib of jsLibs) {
          if ((!data[jsLib]) || (data[jsLib].isTrue == false)) {
            if (src.toLowerCase().indexOf(jsLib.toLowerCase()) >= 0) {
              data[jsLib] = {
                name: jsLib,
                isTrue: true
              };
            } else {
              data[jsLib] = {
                name: jsLib,
                isTrue: false
              };
            }
          }
        }
      }
    }
    ctx.body = data;
  }).catch((err) => {
    ctx.body = err;
  })
})

module.exports = router