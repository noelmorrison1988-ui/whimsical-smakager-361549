exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') return {statusCode:405,body:'Method not allowed'};
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return {statusCode:503, headers:{'Content-Type':'application/json'}, body:JSON.stringify({error:{message:'Netlify is missing YOUTUBE_API_KEY. Add it in Site configuration → Environment variables, then redeploy.'}})};
  const p=event.queryStringParameters||{};
  const endpoint=p.endpoint;
  const news=p.news==='1';
  if (!['search','videos'].includes(endpoint))return {statusCode:400,body:'Invalid endpoint'};
  const u=new URL('https://www.googleapis.com/youtube/v3/'+endpoint);
  if(endpoint==='search') {
    if(!p.q || p.q.length>160) return {statusCode:400,body:'Invalid search'};
    Object.entries({part:'snippet',q:p.q,type:'video',videoEmbeddable:'true',videoDuration:'short',maxResults:'35',safeSearch:'moderate',order:news?'date':'relevance'}).forEach(([k,v])=>u.searchParams.set(k,v));
    if(news)u.searchParams.set('publishedAfter',new Date(Date.now()-48*3600000).toISOString());
  } else {
    if(!p.id || !/^[a-zA-Z0-9_,-]+$/.test(p.id) || p.id.length>600) return {statusCode:400,body:'Invalid video IDs'};
    Object.entries({part:'contentDetails,status,snippet',id:p.id}).forEach(([k,v])=>u.searchParams.set(k,v));
  }
  u.searchParams.set('key',key);
  try {
    const r=await fetch(u,{signal:AbortSignal.timeout(11000)});
    const result=await r.text();
    return {statusCode:r.status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'},body:result};
  }catch(e){return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:{message:'YouTube request failed. Try again later.'}})};}
};
