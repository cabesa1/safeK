(() => {
  'use strict';
  const menu=document.querySelector('#mobile-menu');
  const openButton=document.querySelector('.menu-toggle');
  const closeButton=document.querySelector('.menu-close');
  openButton.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');openButton.setAttribute('aria-expanded','true');closeButton.focus();});
  const closeMenu=()=>menu.close();
  closeButton.addEventListener('click',closeMenu);
  menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');openButton.setAttribute('aria-expanded','false');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  const dropdownToggle=document.querySelector('.nav-dropdown-toggle');
  const dropdown=document.querySelector('#applications-menu');
  function closeDropdown(returnFocus=false){dropdown.hidden=true;dropdownToggle.setAttribute('aria-expanded','false');if(returnFocus)dropdownToggle.focus();}
  dropdownToggle.addEventListener('click',()=>{const expanded=dropdownToggle.getAttribute('aria-expanded')==='true';dropdown.hidden=expanded;dropdownToggle.setAttribute('aria-expanded',String(!expanded));});
  document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))closeDropdown();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dropdown.hidden)closeDropdown(true);});
  document.addEventListener('focusin',event=>{if(!event.target.closest('.nav-group'))closeDropdown();});
  matchMedia('(min-width:1050px)').addEventListener('change',event=>{if(event.matches&&menu.open)menu.close();if(!event.matches)closeDropdown();});

  const search=document.querySelector('#application-search');
  if(search){
    let group='all';const cards=[...document.querySelectorAll('.application-grid .application-card')];
    const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const apply=()=>{const query=normalize(search.value.trim());let count=0;for(const card of cards){const show=(group==='all'||card.dataset.group===group)&&normalize(card.textContent).includes(query);card.hidden=!show;if(show)count++;}document.querySelector('#directory-count').textContent=`${count} ${count===1?'ambiente para explorar':'ambientes para explorar'}`;document.querySelector('#empty-state').hidden=count>0;};
    document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));apply();}));
    search.addEventListener('input',apply);
    document.querySelector('#reset-filters').addEventListener('click',()=>{search.value='';document.querySelector('[data-filter="all"]').click();search.focus();});
  }

  const form=document.querySelector('#contact-form');
  if(form){
    const segment=form.querySelector('#segment');
    const selected=new URLSearchParams(location.search).get('ambiente');
    if([...segment.options].some(o=>o.value===selected))segment.value=selected;
    const draft=document.querySelector('#draft-text');
    let subject='Conhecer a SAFE-K';
    const updateDraftLink=()=>{document.querySelector('#draft-email').href=`mailto:safek@safek.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.value)}`;};
    draft.addEventListener('input',updateDraftLink);
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form);subject='SAFE-K — '+String(data.get('institution')).trim();
      draft.value=`Olá, equipe SAFE-K!\n\nGostaria de conhecer a solução para o meu espaço.\n\nNome: ${String(data.get('name')).trim()}\nE-mail: ${data.get('email')}\nInstituição: ${String(data.get('institution')).trim()}\nAmbiente: ${data.get('segment')}\nParticipantes estimados: ${data.get('participants')||'A definir'}\n\n${String(data.get('message')).trim()}`;
      updateDraftLink();document.querySelector('#message-preview').hidden=false;document.querySelector('#form-status').textContent='Mensagem preparada. O envio será feito pelo seu aplicativo de e-mail.';draft.focus({preventScroll:true});document.querySelector('#message-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
    });
    document.querySelector('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(draft.value);document.querySelector('#form-status').textContent='Mensagem copiada. Cole no seu aplicativo de e-mail e envie para safek@safek.com.br.';}catch{draft.focus();draft.select();document.querySelector('#form-status').textContent='Selecione e copie a mensagem acima para enviar a safek@safek.com.br.';}});
  }

  const visual=document.querySelector('.hero-visual');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(visual){const photo=visual.querySelector('.hero-photo-frame');const fine=matchMedia('(hover:hover) and (pointer:fine)');let frame=0;visual.addEventListener('pointermove',event=>{if(motion.matches||!fine.matches)return;if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const box=visual.getBoundingClientRect();const x=(event.clientX-box.left)/box.width-.5;const y=(event.clientY-box.top)/box.height-.5;photo.style.transform=`rotate(1.5deg) rotateY(${x*4}deg) rotateX(${-y*3}deg)`;});});visual.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);photo.style.transform='';});motion.addEventListener('change',()=>{if(motion.matches)photo.style.transform='';});}
})();
