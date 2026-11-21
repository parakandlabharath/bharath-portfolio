(() => {
 const body=document.body, menu=document.querySelector('.menu'), mobile=document.querySelector('.mobile-nav'), theme=document.querySelector('.theme');
 const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
 theme?.addEventListener('click',()=>{body.classList.toggle('dark');theme.textContent=body.classList.contains('dark')?'☀':'◐';theme.setAttribute('aria-label',body.classList.contains('dark')?'Switch to light theme':'Switch to dark theme')});
 const closeMenu=()=>{mobile?.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu){menu.textContent='☰';menu.setAttribute('aria-label','Open menu')}};
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobile?.classList.toggle('open',open);menu.textContent=open?'×':'☰';menu.setAttribute('aria-label',open?'Close menu':'Open menu')});
 mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 document.querySelector('#copyEmail')?.addEventListener('click',async()=>{const b=document.querySelector('#copyEmail');try{await navigator.clipboard.writeText('parakandlabharath@gmail.com');b.textContent='Copied ✓'}catch{b.textContent='Email: parakandlabharath@gmail.com'}setTimeout(()=>b.textContent='Copy email',2000)});
 const canvas=document.querySelector('#network'),ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let pts=[];
 function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:Math.min(50,Math.floor(innerWidth/24))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.24,vy:(Math.random()-.5)*.24}))}
 function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(let i=0;i<pts.length;i++){let p=pts[i];if(!reduced){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1}for(let j=i+1;j<pts.length;j++){let q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<150){ctx.strokeStyle='rgba(225,100,64,'+(0.12*(1-d/150))+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}ctx.fillStyle='rgba(225,100,64,.38)';ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill()}if(!reduced)requestAnimationFrame(draw)}
 resize();draw();addEventListener('resize',resize);
})();