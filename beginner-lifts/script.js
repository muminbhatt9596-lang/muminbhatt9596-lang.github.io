(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // preloader
  window.addEventListener('load',function(){setTimeout(function(){$('#loader').classList.add('done')},reduce?0:900)});
  setTimeout(function(){$('#loader').classList.add('done')},3000);

  // nav, progress, back-to-top
  var nav=$('header.nav'),bar=$('#progress'),topBtn=$('#top');
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?y/h*100:0)+'%';
    nav.classList.toggle('stuck',y>30);
    topBtn.classList.toggle('show',y>700);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
  $('.menu').addEventListener('click',function(){var l=$('.links');var o=l.classList.toggle('open');this.setAttribute('aria-expanded',o)});
  $$('.links a').forEach(function(a){a.addEventListener('click',function(){$('.links').classList.remove('open')})});

  // active link
  var secs=$$('main section[id]'),links=$$('.links a');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){so.observe(s)});

  // reveal
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12});
  $$('.rv').forEach(function(el){ro.observe(el)});

  // counters
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;co.unobserve(e.target);
    var el=e.target,end=+el.dataset.to,t0=null,dur=1400;
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1&&!reduce)requestAnimationFrame(step);else el.textContent=end}
    requestAnimationFrame(step);
  })},{threshold:.6});
  $$('[data-to]').forEach(function(el){co.observe(el)});

  // typed line
  var words=['Build strength.','Move better.','Feel confident.','Start today.'],wi=0,ci=0,del=false,ty=$('#typed');
  function type(){
    var w=words[wi];
    ty.textContent=w.slice(0,ci);
    if(!del&&ci<w.length){ci++;setTimeout(type,70)}
    else if(!del){del=true;setTimeout(type,1400)}
    else if(ci>0){ci--;setTimeout(type,35)}
    else{del=false;wi=(wi+1)%words.length;setTimeout(type,300)}
  }
  if(reduce){ty.textContent=words[0]}else{type()}

  // cursor glow
  var glow=$('#glow');
  if(glow&&window.matchMedia('(pointer:fine)').matches&&!reduce){
    window.addEventListener('mousemove',function(e){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  }else if(glow){glow.style.display='none'}

  // hero particles
  var cv=$('#fx');
  if(cv&&!reduce){
    var cx=cv.getContext('2d'),W,H,ps=[];
    function size(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight}
    size();window.addEventListener('resize',size);
    for(var i=0;i<55;i++)ps.push({x:Math.random()*2000,y:Math.random()*1200,r:Math.random()*2+.6,v:Math.random()*.5+.15,a:Math.random()*.6+.2});
    (function loop(){
      cx.clearRect(0,0,W,H);
      ps.forEach(function(p){
        p.y-=p.v;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}
        cx.beginPath();cx.arc(p.x%W,p.y,p.r,0,6.283);cx.fillStyle='rgba(240,180,41,'+p.a+')';cx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  // tilt on hover
  if(window.matchMedia('(pointer:fine)').matches&&!reduce){
    $$('[data-tilt]').forEach(function(el){
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform=''});
    });
  }

  // slider
  var rail=$('#rail'),slides=$$('.slide',rail),dotsBox=$('#dots'),idx=0,auto;
  slides.forEach(function(_,i){var d=document.createElement('span');d.className='dot'+(i?'':' on');dotsBox.appendChild(d)});
  function go(i){
    idx=(i+slides.length)%slides.length;
    rail.scrollTo({left:slides[idx].offsetLeft-rail.offsetLeft,behavior:reduce?'auto':'smooth'});
  }
  rail.addEventListener('scroll',function(){
    var best=0,bd=1e9;
    slides.forEach(function(s,i){var d=Math.abs(s.offsetLeft-rail.offsetLeft-rail.scrollLeft);if(d<bd){bd=d;best=i}});
    idx=best;$$('.dot',dotsBox).forEach(function(d,i){d.classList.toggle('on',i===best)});
  },{passive:true});
  $('#prev').addEventListener('click',function(){go(idx-1);restart()});
  $('#next').addEventListener('click',function(){go(idx+1);restart()});
  rail.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(idx+1);e.preventDefault()}if(e.key==='ArrowLeft'){go(idx-1);e.preventDefault()}});
  function restart(){clearInterval(auto);if(!reduce)auto=setInterval(function(){go(idx+1)},4500)}
  rail.addEventListener('mouseenter',function(){clearInterval(auto)});
  rail.addEventListener('mouseleave',restart);
  restart();

  // plan tabs
  var tabs=$$('.tab'),panels=$$('.panel');
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false')});
      panels.forEach(function(p){p.classList.remove('on')});
      t.setAttribute('aria-selected','true');panels[i].classList.add('on');
    });
    t.addEventListener('keydown',function(e){
      var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;
      if(n!==null){n=(n+tabs.length)%tabs.length;tabs[n].focus();tabs[n].click()}
    });
  });

  // flip cards on tap
  $$('.flip').forEach(function(f){
    f.addEventListener('click',function(){f.classList.toggle('on')});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}});
  });

  // calculator
  function calc(){
    var w=+$('#wt').value,h=+$('#ht').value,a=+$('#age').value;
    if(!(w>0&&h>0&&a>0))return;
    var bmr=10*w+6.25*h-5*a+($('#sex').value==='m'?5:-161);
    var maint=Math.round(bmr*parseFloat($('#act').value)/10)*10;
    var target=maint+parseInt($('#goal').value,10);
    $('#r-maint').textContent=maint.toLocaleString();
    $('#r-target').textContent=target.toLocaleString();
    $('#r-prot').textContent=Math.round(w*1.6)+'-'+Math.round(w*2.2);
  }
  ['sex','age','wt','ht','act','goal'].forEach(function(id){var el=$('#'+id);el.addEventListener('input',calc);el.addEventListener('change',calc)});
  $('#calc').addEventListener('submit',function(e){e.preventDefault()});
  calc();

  // copy message
  $('#copy').addEventListener('click',function(){
    var s=$('#copystate'),t=$('#msg').textContent;
    function ok(){s.textContent='Copied. Paste it into WhatsApp or Instagram.'}
    function no(){s.textContent='Select the message above and copy it by hand.'}
    try{navigator.clipboard.writeText(t).then(ok,no)}catch(e){no()}
  });
})();
