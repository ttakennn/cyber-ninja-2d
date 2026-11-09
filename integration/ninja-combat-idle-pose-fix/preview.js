const d=window.combatIdle;
const ui=Object.fromEntries(['ready','calm','play','prev','next','speed','background','status','stage','detail','seek','boards'].map(id=>[id,document.getElementById(id)]));
const ctx=ui.stage.getContext('2d'),dc=ui.detail.getContext('2d');
const images=[new Image(),new Image(),new Image()];
const labels=['IDLE10.47 · đã chốt','COMBAT10.49 · còn lỗi','COMBAT10.50 · bản sửa'];
let loaded=false,playing=true,calm=false,time=0,last=0,error='';
function index(){return Math.floor(time/140)%6}
function pause(){playing=false;ui.play.textContent='Phát'}
function seek(i){time=((i+6)%6)*140;pause()}
function fill(c,w,h){const bg=ui.background.value;if(bg==='checker'){for(let y=0;y<h;y+=24)for(let x=0;x<w;x+=24){c.fillStyle=(Math.floor(x/24)+Math.floor(y/24))%2?'#a9b7c9':'#d5dfe9';c.fillRect(x,y,24,24)}}else{c.fillStyle=bg==='light'?'#dce4ed':'#142337';c.fillRect(0,0,w,h)}}
function draw(){fill(ctx,1152,430);fill(dc,1152,500);if(!loaded)return;const i=index(),f=d.frames[i];ctx.imageSmoothingEnabled=false;dc.imageSmoothingEnabled=false;for(let s=0;s<3;s++){const ordinary=s===0||(calm&&s===2),im=images[ordinary?0:s],j=ordinary?i:s===1?f.previousFrame:i,cols=s===1?4:3,sx=(j%cols)*384,sy=Math.floor(j/cols)*320;ctx.drawImage(im,sx,sy,384,320,s*384,80,384,320);const title=calm&&s===2?'IDLE10.47 · so sánh':labels[s];ctx.fillStyle=dc.fillStyle=ui.background.value==='night'?'#ffd39c':'#203b57';ctx.font='17px system-ui';dc.font='16px system-ui';ctx.fillText(title,s*384+14,32);dc.fillText(title,s*384+14,26);dc.drawImage(im,sx+90,sy+20,200,210,s*384+12,48,360,378)}ui.seek.value=i;ui.status.textContent='Frame '+(i+1)+' / 6 · '+(playing?'đang phát':'tạm dừng')+' · '+(calm?'đối chiếu Idle10.47':'thế chiến đấu mới')}
ui.ready.onclick=()=>{calm=false;time=0;playing=true;ui.play.textContent='Tạm dừng'};
ui.calm.onclick=()=>{calm=true;time=0;playing=true;ui.play.textContent='Tạm dừng'};
ui.play.onclick=()=>{playing=!playing;ui.play.textContent=playing?'Tạm dừng':'Phát'};
ui.prev.onclick=()=>seek(index()-1);ui.next.onclick=()=>seek(index()+1);ui.seek.oninput=()=>seek(+ui.seek.value);
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
Promise.all(images.map((im,i)=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(new Error('Không tải được ảnh '+i));im.src=['idle47-reference.png','previous49-atlas.png','combat-idle-atlas.png'][i]}))).then(()=>{loaded=true;d.frames.forEach((f,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),s=document.createElement('span');c.width=384;c.height=320;c.getContext('2d').drawImage(images[2],f.x,f.y,384,320,0,0,384,320);s.textContent='Frame '+(i+1);b.append(c,s);b.onclick=()=>{calm=false;seek(i)};ui.boards.append(b)})}).catch(e=>{error=e.message;ui.status.textContent=error});
function tick(now){if(last&&loaded&&playing)time+=Math.min(100,now-last)*+ui.speed.value;last=now;if(!error)draw();requestAnimationFrame(tick)}requestAnimationFrame(tick);
