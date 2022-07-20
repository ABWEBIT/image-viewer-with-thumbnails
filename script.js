'use strict';
let galleries = document.getElementsByClassName('gallery');

for(let gallery of galleries){
  let counter,frame,loader,error,viewer,thumbs,nav,prev,next,vItm,tItm,index=0,pIndex=0;
  counter = gallery.getElementsByClassName('counter');
  frame = `<div class="frame"></div>`;
  loader = `<div class="loader"></div>`;
  error = `<span>ошибка</span>`;

  viewer = gallery.getElementsByClassName('viewer');
  for(let item of viewer){item.insertAdjacentHTML('afterbegin',loader);}
  thumbs = gallery.querySelector('.thumbs');

// viewer height
  let viewerHeight=()=>viewer[0].style.height = Math.round(viewer.offsetWidth * 0.5625)+'px';
  window.addEventListener('resize',viewerHeight);

// viewer
  for(let item of viewer){
    vItm = item.getElementsByClassName('vItm');
    if(vItm.length < 1) throw new Error('изображения отсутствуют');

    for(let i = 0; i < vItm.length; i++){
      i === 0 ? vItm[i].dataset.current = 1 : vItm[i].dataset.current = 0;
      let img = vItm[i].querySelector('img');

      function vError(){
        vItm[i].dataset.state = 'error';
        vItm[i].insertAdjacentHTML('afterbegin',error);
      };

      if(img === null) vError()
      else if(img.dataset.src === '') vError()
      else{
        img.addEventListener('error',()=>{
          vError()
        },{once:true});
      };

      if(img !== null  && img.dataset.src !== ''){
        vItm[i].dataset.state = 'ready';
        if(img.decoding) img.decoding = 'async';
      };
    };
  };

// thumbs
  tItm = thumbs.getElementsByClassName('tItm');
  if(tItm.length < 1) throw new Error('миниатюры отсутствуют');
  tItm[index].insertAdjacentHTML('beforeend',frame);

  for(let i = 0;i < tItm.length; i++){
    tItm[i].dataset.nav = 'thumbs';
    let img = tItm[i].querySelector('img');

    if(img === null){
      tItm[i].insertAdjacentHTML('afterbegin',error)
    }
    else if(!img.getAttribute('src')){
      tItm[i].insertAdjacentHTML('afterbegin',error);
    };

    if(img !== null && img.getAttribute('src')){
      if(img.decoding) img.decoding = 'async';
      tItm[i].insertAdjacentHTML('afterbegin',loader);
      let time = Math.round(1000*Math.random());

      setTimeout(()=>{
        tItm[i].querySelector('.loader').remove();
        img.style.animationName = 'fadeIn';
      },time);
    };

    tItm[i].addEventListener('click',(e)=>{
      if(e.target.dataset.nav === 'thumbs'){
        nav = e.target.dataset.nav;
        index = i;
        action();
      };
    });
  };

// fullscreen
  let full,fullscreen;
  fullscreen = gallery.querySelector('.fullscreen');
  let cloneCounter = counter[0].cloneNode(true);
  fullscreen.appendChild(cloneCounter);
  let cloneViewer = viewer[0].cloneNode(true);
  fullscreen.prepend(cloneViewer);

  full = gallery.getElementsByClassName('full');
  for(let item of full){
    item.addEventListener('click',()=>{
      fullscreen.classList.toggle('on');
    });
  };

  prev = gallery.getElementsByClassName('prev');
  next = gallery.getElementsByClassName('next');
  
  for(let item of prev){
    item.dataset.nav = 'prev';
    item.addEventListener('click',(e)=>{
      if(e.target.dataset.nav === 'prev'){
        nav = e.target.dataset.nav;
        if(index > 0 && index < vItm.length){
          index--;
          action();
        };
      };
    });
  };

  for(let item of next){
    item.dataset.nav = 'next';
    item.addEventListener('click',(e)=>{
      if(e.target.dataset.nav === 'next'){
        nav = e.target.dataset.nav;
        if(index >= 0 && index < vItm.length - 1){
          index++;
          action();
        };
      };
    });
  };

window.addEventListener('keyup',(e)=>checkKey(e));

function checkKey(e){
  if(e.keyCode == '37'){
    if(index > 0 && index < vItm.length){
      nav = 'prev';
      index--;
      action();
    };
  }
  else if (e.keyCode == '39'){
    if(index >= 0 && index < vItm.length - 1){
      nav = 'next';
      index++;
      action();
    };
  }
}

// action
  function action(){
    // counter
    for(let item of counter){
      item.innerHTML = (index + 1)+' / '+vItm.length;
    };
    // arrows nav
    for(let item of prev){
      index === 0 ? item.classList.remove('on') : item.classList.add('on');
    };
    for(let item of next){
      index === vItm.length - 1 ? item.classList.remove('on') : item.classList.add('on');
    };

    if(vItm[index].dataset.state === 'ready'){
      for(let item of viewer){
        vItm = item.getElementsByClassName('vItm');
        let img = vItm[index].querySelector('img');
        img.src = img.dataset.src;
        img.addEventListener('load',()=>loadImg(),{once:true});
      };

      function loadImg(){
        for(let item of viewer){
          vItm = item.getElementsByClassName('vItm');
          let img = vItm[index].querySelector('img');
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if(w > 0 && h > 0){
            vItm[index].dataset.state = 'loaded';
            img.style.transitionProperty = 'opacity';
          };
        };
      };
     };

    if(vItm[index].dataset.state === 'error') vItm[index].insertAdjacentHTML('afterbegin',error);
    function selector(){
      for(let item of viewer){
        vItm = item.getElementsByClassName('vItm');
        vItm[index].dataset.current = 1;
        if(index !== pIndex) vItm[pIndex].dataset.current = 0;
      };
      tItm[index].insertAdjacentHTML('beforeend',frame);
      if(index !== pIndex){
        tItm[pIndex].querySelector('.frame').remove();
        pIndex = index;
      };
    };

    if(nav === 'prev' || nav === 'next' || nav === 'thumbs') selector();
  };
  action()
};
