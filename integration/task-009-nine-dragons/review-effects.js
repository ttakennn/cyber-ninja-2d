// Chỉ dùng trong art preview; không chỉnh pixel atlas gốc hoặc import vào runtime.
window.nineDragonsEffects = {
  prepareThickness(image, frames, factors) {
    const size=frames[0].rect[2],center=(size-1)/2,bins=1024,tau=Math.PI*2;
    const scratch=document.createElement('canvas');scratch.width=scratch.height=size;
    const read=scratch.getContext('2d',{willReadFrequently:true}),geometry=new Float32Array(size*size*3);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const dx=x-center,dy=y-center,r=Math.hypot(dx,dy),i=(y*size+x)*3;
      geometry[i]=r;geometry[i+1]=r?dx/r:0;geometry[i+2]=r?dy/r:0;
    }
    const variants=new Map(factors.map(factor=>[factor,[]]));
    for(const frame of frames){
      read.clearRect(0,0,size,size);read.drawImage(image,...frame.rect,0,0,size,size);
      const source=read.getImageData(0,0,size,size).data,outer=new Float32Array(bins),angles=new Uint16Array(size*size);
      for(let y=0;y<size;y++)for(let x=0;x<size;x++){
        const p=y*size+x,angle=Math.round((Math.atan2(y-center,x-center)+tau)/tau*bins)%bins;
        angles[p]=angle;if(source[p*4+3]>=8)outer[angle]=Math.max(outer[angle],geometry[p*3]);
      }
      // Lấy bán kính ngoài theo từng hướng để giữ silhouette; mở rộng lân cận cho sợi lửa mảnh.
      const edge=outer.map((r,i)=>Math.max(r,outer[(i+bins-1)%bins],outer[(i+1)%bins],outer[(i+bins-2)%bins],outer[(i+2)%bins]));
      for(const factor of factors){
        const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
        const context=canvas.getContext('2d'),output=context.createImageData(size,size),target=output.data;
        if(factor===1){context.drawImage(scratch,0,0);variants.get(factor).push(canvas);continue;}
        for(let p=0;p<size*size;p++){
          const r=geometry[p*3],limit=edge[angles[p]],sample=limit-(limit-r)/factor;
          if(!limit||r>limit||sample<0)continue;
          const sx=center+geometry[p*3+1]*sample,sy=center+geometry[p*3+2]*sample,x=Math.floor(sx),y=Math.floor(sy);
          if(x<0||y<0||x>=size-1||y>=size-1)continue;
          const fx=sx-x,fy=sy-y,offset=(y*size+x)*4;
          let a=0,red=0,green=0,blue=0;
          for(let k=0;k<4;k++){
            const i=offset+(k&1)*4+(k>>1)*size*4,w=((k&1)?fx:1-fx)*((k>>1)?fy:1-fy)*source[i+3];
            a+=w;red+=source[i]*w;green+=source[i+1]*w;blue+=source[i+2]*w;
          }
          if(a){const i=p*4;target[i]=red/a;target[i+1]=green/a;target[i+2]=blue/a;target[i+3]=a;}
        }
        context.putImageData(output,0,0);variants.get(factor).push(canvas);
      }
    }
    return variants;
  },
  glowStrength(time,settings) {
    if(time<settings.startMs||time>=settings.endMs)return 0;
    const pulse=settings.pulseMinimum+(1-settings.pulseMinimum)*(Math.sin(time/1000*Math.PI*2*settings.pulseHz)+1)/2;
    return pulse*Math.min(1,(settings.endMs-time)/settings.fadeOutMs);
  },
  drawCharacter(context,image,source,destination,power,settings) {
    context.save();
    if(power>0)context.filter=`brightness(${1+(settings.brightness-1)*power}) saturate(${1+(settings.saturation-1)*power}) drop-shadow(0 0 ${settings.rimBlurPx*power}px ${settings.rimColor}) drop-shadow(0 0 ${settings.haloBlurPx*power}px ${settings.haloColor})`;
    context.drawImage(image,...source,...destination);context.restore();
  },
};
