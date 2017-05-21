const router = require('koa-router')();
const request = require('superagent');
const cheerio = require('cheerio');

router.prefix('/top')

router.get('/', async(ctx, next) => {
  await ctx.render('top', {
    title: 'iKnowJS|Top'
  })
})

router.post('/geturls', async(ctx, next) => {
  const count = ctx.request.body.count;
  let
    pageCount = Math.floor(count / 20),
    lastPage = count % 20,
    pageNumber,
    domains,
    data = [];
  for (let i = 0; i <= pageCount; i++) {
    pageNumber = i + 1;
    if (i < pageCount) {
      await request.get(`http://www.alexa.cn/siterank/${pageNumber}`).then((res) => {
        $ = cheerio.load(res.text);
        domains = $('.domain');
        for (let j = 0; j < domains.length; j++) {
          // console.log(domains[j].children[0].children[0].data);
          // console.log(domains[j].children[2].children[0].attribs['href']);
          let site = {
            name: domains[j].children[0].children[0].data,
            url: domains[j].children[2].children[0].attribs['href']
          }
          data.push(site);
        }
      }).catch((err) => {
        ctx.body = err;
      })
    } else {
      await request.get(`http://www.alexa.cn/siterank/${pageNumber}`).then((res) => {
        $ = cheerio.load(res.text);
        domains = $('.domain');
        for (let j = 0; j < lastPage; j++) {
          let site = {
            name: domains[j].children[0].children[0].data,
            url: domains[j].children[2].children[0].attribs['href']
          }
          data.push(site);
        }
      }).catch((err) => {
        ctx.body = err;
      })
    }
  }
  ctx.body = data;
})

router.post('/searchlibs', async(ctx, next) => {
  let url = ctx.request.body.url;
  let data = [];
  await request.get(url).then((res) => {
    let $ = cheerio.load(res.text);
    let scripts = $('script');
    for(let i = 0; i < scripts.length; i++ ) {
      let src = scripts[i].attribs.src;
      if(src) {
        data.push(src + '');
      }
    }
  }).catch((err) => {
    ctx.body = err;
  })
  ctx.body = data;
})

module.exports = router;