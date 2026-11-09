const data=window.idleReview,ui=Object.fromEntries(['play','restart','prev','next','speed','zoom','background','guides','overlay','axis','status','stage','seek','boards','waist','attachment'].map(id=>[id,document.getElementById(id)])),ctx=ui.stage.getContext('2d'),candidate=new Image(),production=new Image();
let ready=false,playing=true,time=0,last=0;
const frameDuration=1000/data.fps,duration=6*frameDuration,frameIndex=()=>Math.floor(time/frameDuration)%6;
function pause(){playing=false;ui.play.textContent='Phát'}
function seek(index){time=((index+6)%6)*frameDuration;pause()}
function sprite(image,index,x,floor,z){const f=data.frames[index];ctx.drawImage(image,f.x,f.y,384,320,x-192*z,floor-289*z,384*z,320*z)}
function draw(){
  const light=ui.background.value!=='night';if(ui.background.value==='checker'){for(let y=0;y<500;y+=25)for(let x=0;x<1200;x+=25){ctx.fillStyle=(x/25+y/25)%2?'#c8d2df':'#e1e7ef';ctx.fillRect(x,y,25,25)}}else{ctx.fillStyle=light?'#dce4ed':'#12243e';ctx.fillRect(0,0,1200,500)}
  if(!ready)return;const z=+ui.zoom.value,floor=385,index=frameIndex(),centers=[300,900];
  ctx.font='16px system-ui';ctx.fillStyle=light?'#2c4059':'#dceafa';ctx.fillText('Idle production',190,38);ctx.fillText('Idle sửa · kiếm thẳng sau lưng',760,38);
  if(ui.guides.checked){ctx.save();ctx.setLineDash([5,6]);ctx.strokeStyle=light?'#8c9caf':'#48617f';for(const y of [38,224,264,289]){const gy=floor+(y-289)*z;ctx.beginPath();ctx.moveTo(40,gy);ctx.lineTo(1160,gy);ctx.stroke()}ctx.restore()}
  sprite(production,index,centers[0],floor,z);sprite(candidate,index,centers[1],floor,z);
  if(ui.overlay.checked){ctx.save();ctx.globalAlpha=.35;sprite(production,index,centers[1],floor,z);ctx.restore()}
  if(ui.axis.checked){ctx.save();ctx.strokeStyle=light?'#00766c':'#77ebbf';ctx.setLineDash([5,4]);ctx.lineWidth=1.5;ctx.beginPath();data.axis.forEach((base,i)=>{const a=data.attachments[index],pt=[base[0]+a.shoulderOffset[0],base[1]+a.shoulderOffset[1]];const x=centers[1]+(pt[0]-192)*z,y=floor+(pt[1]-289)*z;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.restore()}
  ui.status.textContent='Idle đứng / thở · Frame '+(index+1)+' / 6 · '+data.fps+'fps · '+(playing?'Đang phát':'Tạm dừng');ui.seek.value=index;const wctx=ui.waist.getContext('2d'),f=data.frames[index];wctx.fillStyle='#142337';wctx.fillRect(0,0,1000,360);wctx.imageSmoothingEnabled=false;wctx.drawImage(production,f.x+95,f.y+112,125,85,0,10,500,340);wctx.drawImage(candidate,f.x+95,f.y+112,125,85,500,10,500,340);const a=data.attachments[index];ui.attachment.textContent='Mốc lưng frame '+(index+1)+': Δx '+a.shoulderOffset[0]+'px / Δy '+a.shoulderOffset[1]+'px · Kiếm đi cùng thân, phần dưới được che.';
}
function tick(now){const dt=last?Math.min(100,now-last):0;last=now;if(ready&&playing)time=(time+dt*+ui.speed.value)%duration;draw();requestAnimationFrame(tick)}
ui.play.onclick=()=>{playing=!playing;ui.play.textContent=playing?'Tạm dừng':'Phát'};ui.restart.onclick=()=>{time=0;playing=true;ui.play.textContent='Tạm dừng'};ui.prev.onclick=()=>seek(frameIndex()-1);ui.next.onclick=()=>seek(frameIndex()+1);ui.seek.oninput=()=>seek(+ui.seek.value);
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function load(image,path){return new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Không tải được '+path));image.src=path})}
Promise.all([load(candidate,'idle-atlas.png'),load(production,'production-idle-atlas.png')]).then(()=>{ready=true;data.frames.forEach((f,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),label=document.createElement('span');c.width=384;c.height=320;c.getContext('2d').drawImage(candidate,f.x,f.y,384,320,0,0,384,320);label.textContent='Frame '+(i+1);b.append(c,label);b.onclick=()=>seek(i);ui.boards.append(b)})}).catch(error=>{ui.status.textContent=error.message});requestAnimationFrame(tick);
