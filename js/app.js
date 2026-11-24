(() => {
  const data = window.PORTFOLIO_DATA || {works:[],gallery:[],videos:[],services:[]};
  const $ = (selector, root=document) => root.querySelector(selector);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const worksGrid = $('#worksGrid');
  const galleryGrid = $('#galleryGrid');
  const workFilters = $('#worksFilterBar');
  const galleryFilters = $('#galleryFilterBar');
  let workFilter = 'All Works';
  let galleryFilter = 'All Stills';
  let activeGallery = [];
  let galleryIndex = 0;

  const workCategories = ['All Works', ...new Set(data.works.map(item => item.category))];
  workFilters.innerHTML = workCategories.map((name, index) => `<button class="filter-btn${index===0?' active':''}" data-work-filter="${escapeHTML(name)}">${escapeHTML(name)} <span>(${name==='All Works'?data.works.length:data.works.filter(item=>item.category===name).length})</span></button>`).join('');
  const galleryCategories = ['All Stills', ...new Set(data.gallery.map(item => item[1]))];
  galleryFilters.innerHTML = galleryCategories.map((name, index) => `<button class="filter-btn${index===0?' active':''}" data-gallery-filter="${escapeHTML(name)}">${escapeHTML(name)} <span>(${name==='All Stills'?data.gallery.length:data.gallery.filter(item=>item[1]===name).length})</span></button>`).join('');

  function renderWorks(){
    const items = data.works.filter(item=>workFilter==='All Works'||item.category===workFilter);
    worksGrid.innerHTML = items.map((item,index)=>`<article class="work-card" tabindex="0" role="button" data-work-index="${data.works.indexOf(item)}"><div class="work-art" data-mark="${escapeHTML(item.mark)}" style="--art-color:${escapeHTML(item.color)}"></div><div class="work-info"><div><span>${escapeHTML(item.type)} // ${escapeHTML(item.year)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.category)}</p></div><span class="work-arrow">↗</span></div></article>`).join('');
  }
  function renderGallery(){
    activeGallery=data.gallery.filter(item=>galleryFilter==='All Stills'||item[1]===galleryFilter);
    galleryGrid.innerHTML=activeGallery.map((item,index)=>`<article class="gallery-card" tabindex="0" role="button" data-gallery-index="${index}"><div class="gallery-art" data-mark="${escapeHTML(item[3])}" style="--art-color:${escapeHTML(item[4])}"></div><div class="gallery-info"><strong>${escapeHTML(item[0])}</strong><span>${escapeHTML(item[1].toUpperCase())} // YOGYAKARTA</span></div></article>`).join('');
  }
  renderWorks(); renderGallery();
  workFilters.addEventListener('click',event=>{const btn=event.target.closest('[data-work-filter]');if(!btn)return;workFilter=btn.dataset.workFilter;workFilters.querySelectorAll('.filter-btn').forEach(el=>el.classList.toggle('active',el===btn));renderWorks();});
  galleryFilters.addEventListener('click',event=>{const btn=event.target.closest('[data-gallery-filter]');if(!btn)return;galleryFilter=btn.dataset.galleryFilter;galleryFilters.querySelectorAll('.filter-btn').forEach(el=>el.classList.toggle('active',el===btn));renderGallery();});
  const videoGrid=$('#videoGrid');
  videoGrid.innerHTML=data.videos.map((item,index)=>`<article class="video-card" tabindex="0" role="button" data-video-index="${index}"><div class="video-art" style="--art-color:rgba(213,182,120,.25)"></div><div class="video-info"><span>${escapeHTML(item.type)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div></article>`).join('');
  $('#servicesList').innerHTML=data.services.map(item=>`<div class="service-row"><span>${escapeHTML(item[0])}</span><h3>${escapeHTML(item[1])}</h3><p>${escapeHTML(item[2])}</p><span>↗</span></div>`).join('');

  const mediaModal=$('#mediaModal'), modalContent=$('#modalContent');
  function openGallery(index){galleryIndex=index;showGalleryItem();mediaModal.classList.add('open');mediaModal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');$('#modalPrev').focus();}
  function showGalleryItem(){const item=activeGallery[galleryIndex];modalContent.innerHTML=`<div class="gallery-art modal-art" data-mark="${escapeHTML(item[3])}" style="width:min(80vw,700px);height:min(65vh,600px);position:relative;--art-color:${escapeHTML(item[4])}"></div>`;$('#modalCaption').textContent=item[0]+' · '+item[1];$('#modalCounter').textContent=String(galleryIndex+1).padStart(2,'0')+' / '+String(activeGallery.length).padStart(2,'0');}
  function closeModal(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modal.querySelector('.modal-content').innerHTML='';document.body.classList.remove('no-scroll');}
  galleryGrid.addEventListener('click',event=>{const card=event.target.closest('[data-gallery-index]');if(card)openGallery(Number(card.dataset.galleryIndex));});
  $('#modalPrev').addEventListener('click',()=>{galleryIndex=(galleryIndex-1+activeGallery.length)%activeGallery.length;showGalleryItem();});
  $('#modalNext').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%activeGallery.length;showGalleryItem();});
  mediaModal.querySelector('.modal-close').addEventListener('click',()=>closeModal(mediaModal));
  mediaModal.addEventListener('click',event=>{if(event.target===mediaModal)closeModal(mediaModal);});

  const videoModal=$('#videoModal');
  function playVideo(index){const item=data.videos[index];const src=item.src||'';$('#videoContent').innerHTML=src?`<video controls autoplay playsinline src="${escapeHTML(src)}"></video>`:`<div class="video-art" style="width:min(80vw,900px);height:min(60vh,520px);display:grid;place-items:center"><p style="position:relative;color:#eee;font:14px var(--mono);padding:24px;text-align:center">ADD A VIDEO FILE PATH TO THE “${escapeHTML(item.title.toUpperCase())}” ENTRY IN <code>js/data.js</code></p></div>`;$('#videoCaption').textContent=item.title;videoModal.classList.add('open');videoModal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');}
  videoGrid.addEventListener('click',event=>{const card=event.target.closest('[data-video-index]');if(card)playVideo(Number(card.dataset.videoIndex));});
  videoModal.querySelector('.modal-close').addEventListener('click',()=>closeModal(videoModal));
  videoModal.addEventListener('click',event=>{if(event.target===videoModal)closeModal(videoModal);});
  worksGrid.addEventListener('click',event=>{const card=event.target.closest('[data-work-index]');if(!card)return;const item=data.works[Number(card.dataset.workIndex)];$('#videoContent').innerHTML=`<div class="video-art" style="width:min(80vw,900px);height:min(60vh,520px);display:grid;place-items:center;--art-color:${escapeHTML(item.color)}"><p style="position:relative;color:#eee;max-width:500px;text-align:center;padding:24px">${escapeHTML(item.description)}</p></div>`;$('#videoCaption').textContent=item.title+' · '+item.category+' · '+item.year;videoModal.classList.add('open');videoModal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');});

  const menuToggle=$('#menuToggle'), drawer=$('#mobileDrawer');
  function toggleMenu(open){drawer.classList.toggle('open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('no-scroll',open);}
  menuToggle.addEventListener('click',()=>toggleMenu(!drawer.classList.contains('open')));
  drawer.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>toggleMenu(false)));
  window.addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',window.scrollY>30),{passive:true});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(mediaModal.classList.contains('open'))closeModal(mediaModal);if(videoModal.classList.contains('open'))closeModal(videoModal);toggleMenu(false);}if(mediaModal.classList.contains('open')&&event.key==='ArrowRight')$('#modalNext').click();if(mediaModal.classList.contains('open')&&event.key==='ArrowLeft')$('#modalPrev').click();});
  function updateClock(){const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());$('#heroClock').textContent='YOGYAKARTA '+time+' WIB';$('#footerClock').textContent='YOGYAKARTA '+time+' WIB';$('#currentYear').textContent=new Date().getFullYear();}
  updateClock();setInterval(updateClock,1000);
  const preloader=$('#preloader');let progress=0;const progressTimer=setInterval(()=>{progress=Math.min(100,progress+Math.ceil(Math.random()*17));$('#preloaderBar').style.width=progress+'%';$('#preloaderCounter').textContent=String(progress).padStart(2,'0')+'%';if(progress>=100){clearInterval(progressTimer);$('#preloaderStatus').textContent='ROLL CAMERA...';setTimeout(()=>preloader.classList.add('done'),250);}},70);
  window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('done'),1500),{once:true});
  document.querySelectorAll('[data-play-reel]').forEach(button=>button.addEventListener('click',()=>playVideo(1)));
  $('#contactForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const fields=new FormData(form);const subject=encodeURIComponent(`Portfolio inquiry: ${fields.get('service')}`);const body=encodeURIComponent(`Name / Organization: ${fields.get('name')}\nEmail: ${fields.get('email')}\nService: ${fields.get('service')}\n\nProject vision & timeline:\n${fields.get('message')}`);$('#formFeedback').textContent='Opening your email application…';window.location.href=`mailto:bayusstzy@gmail.com?subject=${subject}&body=${body}`;});
})();
