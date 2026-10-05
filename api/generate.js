export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 const base=(process.env.SUNO_API_URL||'').replace(/\/$/,'');
 if(!base) return res.status(500).json({error:'SUNO_API_URL is not configured. Deploy gcui-art/suno-api and add its URL in Vercel.'});
 try{
  const {lyrics,genre,tempo,title}=req.body||{};
  if(!lyrics) return res.status(400).json({error:'Lyrics are required.'});
  const styles={afrobeats:'Afrobeats, rhythmic drums, warm bass, melodic guitar, catchy vocals',amapiano:'Amapiano, log drums, deep bass, piano chords, soulful vocals',trap:'Melodic trap, 808 bass, atmospheric synths, crisp hi-hats, expressive vocals',drill:'Drill, sliding 808s, dark piano, punchy drums, confident vocals',rnb:'R&B, lush chords, warm bass, intimate expressive vocals, modern groove',gospel:'Contemporary gospel, uplifting chords, live drums, choir harmonies, powerful vocals',dancehall:'Dancehall, Caribbean rhythm, deep bass, syncopated drums, energetic vocals'};
  const r=await fetch(base+'/api/custom_generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:lyrics,style:styles[genre]||genre||'Modern pop',title:title||'Song Studio',make_instrumental:false,wait_audio:false})});
  const initial=await r.json();
  if(!r.ok)return res.status(r.status).json({error:initial?.detail||initial?.error||'Suno API request failed.'});
  const ids=(Array.isArray(initial)?initial:[initial]).map(x=>x.id).filter(Boolean);
  if(!ids.length)return res.status(502).json({error:'Suno returned no generation IDs.'});
  for(let i=0;i<60;i++){
   await new Promise(x=>setTimeout(x,3000));
   const q=await fetch(base+'/api/get?ids='+encodeURIComponent(ids.join(',')));
   const tracks=await q.json();
   const list=Array.isArray(tracks)?tracks:[tracks];
   const ready=list.find(x=>x.audio_url && ['streaming','complete','completed'].includes(x.status));
   if(ready)return res.status(200).json({audioUrl:ready.audio_url,title:ready.title||title||'Suno Song',provider:'Suno'});
   const failed=list.find(x=>['error','failed'].includes(x.status));
   if(failed)return res.status(502).json({error:failed.error||'Suno generation failed.'});
  }
  return res.status(504).json({error:'Suno is still generating. Please try again shortly.'});
 }catch(e){return res.status(500).json({error:e.message||'Unexpected Suno API error.'})}
}