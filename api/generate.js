export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const token=process.env.REPLICATE_API_TOKEN;
 if(!token)return res.status(500).json({error:'REPLICATE_API_TOKEN is not configured on the server.'});
 try{
  const {lyrics,genre,tempo,prompt}=req.body||{};
  if(!lyrics||typeof lyrics!=='string')return res.status(400).json({error:'Lyrics are required.'});
  const input={prompt:prompt||`Create an original ${genre} song at ${tempo} BPM with these lyrics:\n${lyrics}`,duration:180};
  const create=await fetch('https://api.replicate.com/v1/models/google/lyria-3-pro/predictions',{method:'POST',headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json','Prefer':'wait'},body:JSON.stringify({input})});
  const prediction=await create.json();
  if(!create.ok)return res.status(create.status).json({error:prediction.detail||prediction.error||'Music generation request failed.'});
  let p=prediction;
  if(p.status==='starting'||p.status==='processing'){
   for(let i=0;i<60;i++){
    await new Promise(r=>setTimeout(r,2000));
    const poll=await fetch(p.urls?.get||`https://api.replicate.com/v1/predictions/${p.id}`,{headers:{Authorization:`Bearer ${token}`}});
    p=await poll.json();
    if(p.status==='succeeded'||p.status==='failed'||p.status==='canceled')break;
   }
  }
  if(p.status!=='succeeded')return res.status(502).json({error:p.error||'Music generation did not complete.'});
  const output=Array.isArray(p.output)?p.output[0]:p.output;
  if(!output)return res.status(502).json({error:'The music provider returned no audio.'});
  return res.status(200).json({audioUrl:output,title:'AI Generated Song',provider:'Lyria 3 Pro'});
 }catch(e){return res.status(500).json({error:e.message||'Unexpected generation error.'})}
}