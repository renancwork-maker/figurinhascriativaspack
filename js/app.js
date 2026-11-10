(function(){
  var BASE = '/pack-figurinhas/images/';

  // Datas automáticas: primeiro e último dia do mês atual
  var now = new Date();
  function fmt(d){ return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear(); }
  var f = document.getElementById('tr-upd-first'), l = document.getElementById('tr-upd-last');
  if (f) f.textContent = fmt(new Date(now.getFullYear(), now.getMonth(), 1));
  if (l) l.textContent = fmt(new Date(now.getFullYear(), now.getMonth()+1, 0));

  // Grade de figurinhas (46 imagens)
  var grid = document.getElementById('tr-preview-grid');
  if (grid) {
    var html = '';
    for (var i = 1; i <= 46; i++) {
      var n = ('0'+i).slice(-2);
      html += '<div class="preview-tile"><img src="'+BASE+'packprofi-fig-'+n+'.webp" alt="Figurinha '+i+'" loading="lazy" decoding="async"></div>';
    }
    grid.innerHTML = html;
  }

  // FAQ
  var qs = document.querySelectorAll('.tr-pack .faq-q');
  for (var q = 0; q < qs.length; q++) {
    qs[q].addEventListener('click', function(){ this.closest('.faq-item').classList.toggle('open'); });
  }

  // Lightbox
  var lb = document.getElementById('tr-lightbox');
  if (!lb) return;
  var lbImg = lb.querySelector('img'), lbCounter = lb.querySelector('.lb-counter');
  var tiles = document.querySelectorAll('.tr-pack .preview-tile img'), current = 0;
  function show(idx){ if (idx < 0) idx = tiles.length-1; if (idx >= tiles.length) idx = 0; current = idx; lbImg.src = tiles[idx].src; lbCounter.textContent = (idx+1)+' / '+tiles.length; }
  function open(idx){ show(idx); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
  for (var t = 0; t < tiles.length; t++) { (function(idx){ tiles[idx].addEventListener('click', function(){ open(idx); }); })(t); }
  lb.querySelector('.lb-close').addEventListener('click', function(e){ e.stopPropagation(); close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); show(current-1); });
  lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); show(current+1); });
  lb.addEventListener('click', function(e){ if (e.target === lb || e.target === lbImg) close(); });
  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(current-1); else if (e.key === 'ArrowRight') show(current+1);
  });
})();


// Carregamento do vídeo apenas próximo da área visível.
(function(){
  var v=document.querySelector('.tr-pack video[data-src]');
  if(!v) return;
  function loadVideo(){
    if(!v.dataset.src)return;
    v.src=v.dataset.src;
    delete v.dataset.src;
    v.load();
    var p=v.play();
    if(p&&p.catch)p.catch(function(){});
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      if(es.some(function(e){return e.isIntersecting;})){io.disconnect();loadVideo();}
    },{rootMargin:'200px'});
    io.observe(v);
  }else{loadVideo();}
})();
