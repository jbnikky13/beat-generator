export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const token=process.env.REPLICATE_API_TOKEN;if(!token)return res.status(500).json({error:'REPLICATE_API_TOKEN is not configured on the server.'});
 try{
  const {lyrics,tempo,prompt}=req.body||{};if(!lyrics)return res.status(400).json({error:'Lyrics are required.'});
  const input={lyrics,prompt:prompt||`Original song, ${tempo} BPM`,sample_rate:44100,bitrate:256000,audio_format:'mp3',is_instrumental:false,lyrics_optimizer:false};
  const r=await fetch('https://api.replicate.com/v1/models/minimax/music-2.6/predictions',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','Prefer':'wait'},body:JSON.stringify({input})});
  let p=await r.json();if(!r.ok)return res.status(r.status).json({error:p.detail||p.error||'Music generation request failed.'});
  if(p.status==='starting'||p.status==='processing'){for(let i=0;i<90;i++){await new Promise(x=>setTimeout(x,2000));const q=await fetch(p.urls?.get||`https://api.replicate.com/v1/predictions/${p.id}`,{headers:{Authorization:`Bearer ${token}`}});p=await q.json();if(['succeeded','failed','canceled'].includes(p.status))break}}
  if(p.status!=='succeeded')return res.status(502).json({error:p.error||'Music generation did not complete.'});
  const output=Array.isArray(p.output)?p.output[0]:p.output;if(!output)return res.status(502).json({error:'No audio returned.'});
  return res.status(200).json({audioUrl:output,title:'AI Generated Song',provider:'MiniMax Music 2.6'});
 }catch(e){return res.status(500).json({error:e.message||'Unexpected generation error.'})}
}