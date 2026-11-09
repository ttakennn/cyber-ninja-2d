import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const plan=JSON.parse(await fs.readFile(path.join(root,'integration/ninja-idle-fabric-restore/plan.json'),'utf8'));
const output=path.join(root,plan.reviewDirectory);
function parse(buffer){
  const globalPacked=buffer[10],globalSize=globalPacked&128?3*(1<<((globalPacked&7)+1)):0,globalPalette=buffer.subarray(13,13+globalSize);
  let pos=13+globalSize;
  function skipBlocks(){while(buffer[pos])pos+=buffer[pos]+1;pos++}
  while(pos<buffer.length){
    const marker=buffer[pos++];
    if(marker===0x21){pos++;skipBlocks();continue}
    if(marker===0x3b)break;
    if(marker!==0x2c)throw new Error('Unexpected GIF block');
    const descriptor=Buffer.from(buffer.subarray(pos-1,pos+9));pos+=9;
    let palette=globalPalette,packed=globalPacked;
    if(descriptor[9]&128){packed=descriptor[9];const count=3*(1<<((packed&7)+1));palette=buffer.subarray(pos,pos+count);pos+=count}
    const start=pos++;skipBlocks();
    descriptor[9]=(descriptor[9]&0x78)|0x80|(packed&7);
    return {header:buffer.subarray(0,13+globalSize),descriptor,palette,data:buffer.subarray(start,pos)};
  }
  throw new Error('GIF frame missing');
}
const frames=[];
for(let i=0;i<6;i++)frames.push(parse(await fs.readFile(path.join(output,'motion-frames',`frame-${i}.gif`))));
const delay=14;
const blocks=[frames[0].header,Buffer.from([0x21,0xff,0x0b]),Buffer.from('NETSCAPE2.0','ascii'),Buffer.from([3,1,0,0,0])];
for(const frame of frames)blocks.push(Buffer.from([0x21,0xf9,4,4,delay&255,delay>>8,0,0]),frame.descriptor,frame.palette,frame.data);
blocks.push(Buffer.from([0x3b]));
await fs.writeFile(path.join(output,'motion-preview.gif'),Buffer.concat(blocks));
await fs.writeFile(path.join(output,'motion-preview.json'),JSON.stringify({frames:6,delayMilliseconds:140,loop:true,source:'motion-frames/frame-0..5.gif',purpose:'Art review only; PNG atlas remains source quality.'},null,2)+'\n');
console.log('Authored six-frame motion review GIF.');
