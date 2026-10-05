const $=s=>document.querySelector(s);
let genre='afrobeats', audioUrl='', audio=null, generated=false;
const GENRES={
 afrobeats:'Afrobeats — rhythmic drums, warm bass, melodic guitar, catchy modern vocals',
 amapiano:'Amapiano — log drums, deep bass, piano chords, smooth soulful vocals',
 trap:'Melodic Trap — 808 bass, atmospheric synths, crisp hi-hats, expressive vocals',
 drill:'Drill — sliding 808s, dark piano, punchy drums, confident vocals',
 rnb:'R&B — lush chords, warm bass, intimate expressive vocals, modern groove',
 gospel:'Contemporary Gospel — uplifting chords, live-feeling drums, choir harmonies, powerful vocals',
 dancehall:'Dancehall — Caribbean rhythm, deep bass, syncopated drums, energetic vocals'
};
const TEMPOS={afrobeats:108,amapiano:112,trap:138,drill:142,rnb:92,gospel:104,dancehall:100};
function wordCount(t){return t.trim()?t.trim().split(/\s+/).length:0}
function setStatus(t,ready=false){$('#status').textContent=t;$('#status').className='badge'+(ready?' ready':'')}
function setProgress(n){$('#progressBar').style.width=n+'%'}
function promptFor(lyrics){
 return `Create an original complete song using the EXACT USER-PROVIDED LYRICS below. Do not rewrite, summarize, or replace the lyrics. Perform the lyrics as sung vocals.
Genre/style: ${GENRES[genre]}.
Tempo: ${$('#bpm').value} BPM.
Structure: [Intro] [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Chorus] [Bridge] [Final Chorus] [Outro].
Make the arrangement polished, musical and radio-ready, with a clear hook, dynamic sections and a professional mix. No spoken explanation.
USER LYRICS:
${lyrics}`;
}
async function generate(){
 const lyrics=$('#lyrics').value.trim();
 if(!lyrics){$('#lyrics').focus();$('#songTitle').textContent='Add your lyrics first.';return}
 if(wordCount(lyrics)>1000){alert('Please keep lyrics under 1,000 words for this generator.');return}
 if(audio){audio.pause();audio=null}
 $('#generate').disabled=true;$('#play').disabled=true;$('#download').disabled=true;
 $('#generate').textContent='Generating…';setStatus('GENERATING');setProgress(8);
 $('#songTitle').textContent='Creating your song…';$('#songMeta').textContent='AI is composing vocals, instruments and arrangement.';
 try{
  setProgress(25);
  const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lyrics,genre,tempo:Number($('#bpm').value),prompt:promptFor(lyrics)})});
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||'Generation failed');
  setProgress(75);
  audioUrl=data.audioUrl;
  $('#songTitle').textContent=data.title||'Generated Song';
  $('#songMeta').textContent=`${GENRES[genre].split(' — ')[0]} · ${$('#bpm').value} BPM · AI vocals`;
  $('#lyricsPreview').textContent=lyrics;
  $('#arrangement').innerHTML=['INTRO','VERSE 1','PRE','CHORUS','VERSE 2','BRIDGE','FINAL','OUTRO'].map(x=>'<div><span>'+x+'</span></div>').join('');
  audio=new Audio(audioUrl);audio.preload='auto';
  audio.onended=()=>{$('#play').textContent='Play';setStatus('READY',true)};
  $('#play').disabled=false;$('#download').disabled=false;generated=true;
  setProgress(100);setStatus('READY',true);
 }catch(e){console.error(e);setStatus('ERROR');$('#songTitle').textContent='Generation failed';$('#songMeta').textContent=e.message||'Check your provider configuration and try again.';setProgress(0)}
 finally{$('#generate').disabled=false;$('#generate').textContent='Generate AI Song'}
}
$('#lyrics').oninput=()=>$('#wordCount').textContent=wordCount($('#lyrics').value)+' words';
$('#lyricsFile').onchange=e=>{const f=e.target.files[0];if(!f)return;$('#fileName').textContent=f.name;const r=new FileReader();r.onload=()=>{$('#lyrics').value=r.result;$('#wordCount').textContent=wordCount(r.result)+' words'};r.readAsText(f)};
$('#bpm').oninput=e=>$('#bpmValue').textContent=e.target.value+' BPM';
$('#genres').innerHTML=Object.entries(GENRES).map(([k,v])=>'<button type="button" data-g="'+k+'">'+v.split(' — ')[0]+'</button>').join('');
function mark(){document.querySelectorAll('#genres button').forEach(b=>b.classList.toggle('on',b.dataset.g===genre))}
$('#genres').onclick=e=>{const b=e.target.closest('button');if(!b)return;genre=b.dataset.g;$('#bpm').value=TEMPOS[genre];$('#bpmValue').textContent=TEMPOS[genre]+' BPM';mark()};
$('#generate').onclick=generate;
$('#play').onclick=()=>{if(!audio)return;if(audio.paused){audio.play();$('#play').textContent='Pause';setStatus('PLAYING')}else{audio.pause();$('#play').textContent='Play';setStatus('PAUSED')}};
$('#download').onclick=()=>{if(!audioUrl)return;const a=document.createElement('a');a.href=audioUrl;a.download=(($('#songTitle').textContent||'generated-song').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'generated-song')+'.wav';a.target='_blank';a.click()};
mark();$('#bpmValue').textContent=$('#bpm').value+' BPM';