const d=window.ninjaRun;
const ui=Object.fromEntries(['run','ready','play','prev','next','speed','zoom','background','status','stage','detail','seek','boards'].map(id=>[id,document.getElementById(id)]));
const ctx=ui.stage.getContext('2d'),dc=ui.detail.getContext('2d'),images=[new Image(),new Image(),new Image()];
let loaded=false,playing=true,mode='run',time=0,last=0,error='';
function index(){return Math.floor(time*d.fps/1000)%12}
function pause(){playing=false;ui.play.textContent='Phát'}
function seek(i){mode='run';time=((i+12)%12)*1000/d.fps+0.001;pause()}
function fill(c,w,h){if(ui.background.value==='checker'){for(let y=0;y<h;y+=24)for(let x=0;x<w;x+=24){c.fillStyle=(Math.floor(x/24)+Math.floor(y/24))%2?'#b9c8d9':'#dce6f0';c.fillRect(x,y,24,24)}}else{c.fillStyle=ui.background.value==='night'?'#142337':'#dce4ed';c.fillRect(0,0,w,h)}}
function draw(){
 fill(ctx,1152,390);fill(dc,1152,390);if(!loaded)return;
 const i=index(),f=d.frames[i],bi=Math.floor(time*d.reference.combatFps/1000)%6,oi=Math.floor(time*d.reference.oldRunFps/1000)%8,cf=d.reference.combatIdleFrames[bi];
 const rects=[cf,{x:(oi%4)*384,y:Math.floor(oi/4)*320},mode==='ready'?cf:f],titles=['Chuẩn 10.51 · đã chốt','Run production · 8 frame',mode==='ready'?'Chuẩn 10.51':('Chạy 10.55 · '+(i+1)+'/12')],z=+ui.zoom.value;
 ctx.imageSmoothingEnabled=false;dc.imageSmoothingEnabled=false;
 for(let s=0;s<3;s++){
  const im=images[s===2&&mode==='ready'?0:s],r=rects[s];
  ctx.fillStyle=dc.fillStyle=ui.background.value==='night'?'#ffd29c':'#243b56';ctx.font='17px system-ui';dc.font='16px system-ui';
  ctx.fillText(titles[s],s*384+12,27);dc.fillText(titles[s],s*384+12,25);
  ctx.save();ctx.beginPath();ctx.rect(s*384,32,384,355);ctx.clip();ctx.drawImage(im,r.x,r.y,384,320,s*384+192-192*z,345-289*z,384*z,320*z);ctx.restore();
  ctx.strokeStyle='#6d829d';ctx.beginPath();ctx.moveTo(s*384+12,345);ctx.lineTo(s*384+372,345);ctx.stroke();
  dc.save();dc.beginPath();dc.rect(s*384,35,384,355);dc.clip();dc.drawImage(im,r.x+95,r.y+20,200,180,s*384+12,45,360,324);dc.restore();
 }
 ui.seek.value=i;ui.status.textContent=(mode==='ready'?'Đối chiếu chuẩn 10.51':('Frame '+(i+1)+'/12 · '+f.label))+' · '+(playing?'đang phát':'tạm dừng');
}
ui.run.onclick=()=>{mode='run';time=0;playing=true;ui.play.textContent='Tạm dừng'};
ui.ready.onclick=()=>{mode='ready';time=0;playing=true;ui.play.textContent='Tạm dừng'};
ui.play.onclick=()=>{playing=!playing;ui.play.textContent=playing?'Tạm dừng':'Phát'};
ui.prev.onclick=()=>seek(index()-1);ui.next.onclick=()=>seek(index()+1);ui.seek.oninput=()=>seek(+ui.seek.value);
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
Promise.all(images.map((im,i)=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(new Error('Không tải được ảnh cột '+(i+1)));im.src=['combat51-atlas.png','old-run-reference.png','run-atlas.png'][i]}))).then(()=>{
 loaded=true;d.frames.forEach((f,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),s=document.createElement('span');c.width=384;c.height=320;c.getContext('2d').drawImage(images[2],f.x,f.y,384,320,0,0,384,320);s.textContent=(i+1)+'. '+f.label;b.append(c,s);b.onclick=()=>seek(i);ui.boards.append(b)});
}).catch(e=>{error=e.message;ui.status.textContent=error});
function tick(now){if(last&&loaded&&playing)time+=Math.min(100,now-last)*+ui.speed.value;last=now;if(!error)draw();requestAnimationFrame(tick)}
requestAnimationFrame(tick);
