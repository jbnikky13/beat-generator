const $=s=>document.querySelector(s);
let genre='afrobeats',audioUrl='',audio=null,generated=false,mode='song',uploadedAudioUrl='',videoUrl='',videoBlobUrl='';
const GENRES={afrobeats:'Afrobeats — rhythmic drums, warm bass, melodic guitar, catchy modern vocals',amapiano:'Amapiano — log drums, deep bass, piano chords, smooth soulful vocals',trap:'Melodic Trap — 808 bass, atmospheric synths, crisp hi-hats, expressive vocals',drill:'Drill — sliding 808s, dark piano, punchy drums, confident vocals',rnb:'R&B — lush chords, warm bass, intimate expressive vocals, modern groove',gospel:'Contemporary Gospel — uplifting chords, live-feeling drums, choir harmonies, powerful vocals',dancehall:'Dancehall — Caribbean rhythm, deep bass, syncopated drums, energetic vocals'};
const TEMPOS={afrobeats:108,amapiano:112,trap:138,drill:142,rnb:92,gospel:104,dancehall:100};
function wordCount(t){return t.trim()?t.trim().split(/\s+/).length:0}
function setStatus(t,ready=false){$('#status').textContent=t;$('#status').className='badge'+(ready?' ready':'')}
function setProgress(n){$('#progressBar').style.width=n+'%'}
function promptFor(lyrics){return `Create an original complete song using the EXACT USER-PROVIDED LYRICS below. Perform the lyrics as sung vocals. Genre/style: ${GENRES[genre]}. Tempo: ${$('#bpm').value} BPM. Structure: [Intro] [Verse] [Pre Chorus] [Chorus] [Verse 2] [Bridge] [Final Chorus] [Outro]. Polished professional mix. USER LYRICS:\n${lyrics}`}
async function generate(){
 const lyrics=$('#lyrics').value.trim();if(!lyrics){$('#lyrics').focus();$('#songTitle').textContent='Add your lyrics first.';return}
 if(lyrics.length>3500){alert('MiniMax Music 2.6 accepts up to 3,500 lyric characters. Please shorten your lyrics.');return}
 if(audio){audio.pause();audio=null}
 $('#generate').disabled=true;$('#play').disabled=true;$('#download').disabled=true;$('#generate').textContent='Generating…';setStatus('GENERATING');setProgress(8);
 try{const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lyrics,genre,tempo:Number($('#bpm').value),prompt:promptFor(lyrics)})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Generation failed');audioUrl=data.audioUrl;$('#songTitle').textContent=data.title||'AI Generated Song';$('#songMeta').textContent=`${GENRES[genre].split(' — ')[0]} · ${$('#bpm').value} BPM · MiniMax Music 2.6`;$('#lyricsPreview').textContent=lyrics;$('#arrangement').innerHTML=['INTRO','VERSE 1','PRE','CHORUS','VERSE 2','BRIDGE','FINAL','OUTRO'].map(x=>'<div><span>'+x+'</span></div>').join('');audio=new Audio(audioUrl);audio.preload='auto';audio.onended=()=>{$('#play').textContent='Play';setStatus('READY',true)};$('#play').disabled=false;$('#download').disabled=false;generated=true;setProgress(100);setStatus('READY',true);$('#audioName').textContent='Use generated song: '+($('#songTitle').textContent||'song')}catch(e){console.error(e);setStatus('ERROR');$('#songTitle').textContent='Generation failed';$('#songMeta').textContent=e.message||'Check your provider configuration.';setProgress(0)}finally{$('#generate').disabled=false;$('#generate').textContent='Generate AI Song'}
}
async function generateVideo(){
 const prompt=$('#videoPrompt').value.trim()||`Cinematic ${GENRES[genre].split(' — ')[0]} music video, stylish Nigerian/African visual storytelling, dynamic camera movement, rich lighting, artist performance energy`;
 const music=uploadedAudioUrl||audioUrl;if(!music){alert('Generate a song first or upload an audio file you own/licensed.');return}
 $('#generateVideo').disabled=true;$('#generateVideo').textContent='Generating…';setStatus('VIDEO GENERATING');setProgress(15);
 try{const res=await fetch('/api/video',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,audioUrl:music})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Video generation failed');videoUrl=data.videoUrl;const v=document.createElement('video');v.controls=true;v.playsInline=true;v.src=videoUrl;$('#videoStage').replaceChildren(v);$('#composeVideo').disabled=false;setProgress(100);setStatus('VIDEO READY',true)}catch(e){console.error(e);setStatus('VIDEO ERROR');alert(e.message||'Video generation failed')}finally{$('#generateVideo').disabled=false;$('#generateVideo').textContent='Generate MiniMax Video'}
}
async function composeMusicVideo(){
 if(!videoUrl)return;const audioSrc=uploadedAudioUrl||audioUrl;if(!audioSrc)return;
 $('#composeVideo').disabled=true;$('#composeVideo').textContent='Composing…';
 try{
  const v=document.createElement('video');v.src=videoUrl;v.crossOrigin='anonymous';v.muted=true;v.playsInline=true;v.loop=true;await v.play().catch(()=>{});
  const a=document.createElement('audio');a.src=audioSrc;a.crossOrigin='anonymous';await a.play().catch(()=>{});
  const vs=v.captureStream();const as=a.captureStream();const tracks=[...vs.getVideoTracks(),...as.getAudioTracks()];const stream=new MediaStream(tracks);
  const chunks=[];const rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9,opus'});rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);rec.onstop=()=>{videoBlobUrl=URL.createObjectURL(new Blob(chunks,{type:'video/webm'}));$('#downloadVideo').href=videoBlobUrl;$('#downloadVideo').classList.remove('hidden');$('#composeVideo').disabled=false;$('#composeVideo').textContent='Make Music Video';setStatus('VIDEO READY',true)};rec.start(250);
  const duration=Math.min(180,Number.isFinite(a.duration)&&a.duration>0?a.duration:60);setTimeout(()=>{rec.stop();v.pause();a.pause()},duration*1000);
 }catch(e){console.error(e);$('#composeVideo').disabled=false;$('#composeVideo').textContent='Make Music Video';alert('Your browser could not combine the video and audio. You can still download the generated video.')}
}
$('#lyrics').oninput=()=>$('#wordCount').textContent=wordCount($('#lyrics').value)+' words';
$('#lyricsFile').onchange=e=>{const f=e.target.files[0];if(!f)return;$('#fileName').textContent=f.name;const r=new FileReader();r.onload=()=>{$('#lyrics').value=r.result;$('#wordCount').textContent=wordCount(r.result)+' words'};r.readAsText(f)};
$('#audioFile').onchange=e=>{const f=e.target.files[0];if(!f)return;uploadedAudioUrl=URL.createObjectURL(f);$('#audioName').textContent=f.name};
$('#bpm').oninput=e=>$('#bpmValue').textContent=e.target.value+' BPM';
$('#genres').innerHTML=Object.entries(GENRES).map(([k,v])=>'<button type="button" data-g="'+k+'">'+v.split(' — ')[0]+'</button>').join('');
function mark(){document.querySelectorAll('#genres button').forEach(b=>b.classList.toggle('on',b.dataset.g===genre))}
$('#genres').onclick=e=>{const b=e.target.closest('button');if(!b)return;genre=b.dataset.g;$('#bpm').value=TEMPOS[genre];$('#bpmValue').textContent=TEMPOS[genre]+' BPM';mark()};
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('.mode').forEach(x=>x.classList.toggle('on',x===b));$('#videoOptions').classList.toggle('hidden',mode!=='video')});
$('#generate').onclick=generate;$('#generateVideo').onclick=generateVideo;$('#composeVideo').onclick=composeMusicVideo;
$('#play').onclick=()=>{if(!audio)return;if(audio.paused){audio.play();$('#play').textContent='Pause';setStatus('PLAYING')}else{audio.pause();$('#play').textContent='Play';setStatus('PAUSED')}};
$('#download').onclick=()=>{if(!audioUrl)return;const a=document.createElement('a');a.href=audioUrl;a.download=(($('#songTitle').textContent||'generated-song').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'generated-song')+'.mp3';a.target='_blank';a.click()};
mark();$('#bpmValue').textContent=$('#bpm').value+' BPM';
