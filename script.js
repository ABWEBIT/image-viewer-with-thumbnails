'use strict';
class ImageViewer{
  constructor(id){
    this.element = document.getElementById(id);
    this.imagesContainer = this.element.querySelector('.imagesContainer');
    this.images = this.imagesContainer.querySelectorAll('.images');
    this.thumbsView = this.element.querySelector('.thumbsView');
    this.thumbs = this.thumbsView.querySelectorAll('.thumbs');
    this.counter = this.element.querySelector('.counter');
    this.navigation = this.element.querySelector('.navigation');
    this.prev = this.navigation.querySelector('.prev');
    this.next = this.navigation.querySelector('.next');
    this.prev.addEventListener('click',()=>this._prev());
    this.next.addEventListener('click',()=>this._next());
    this.helper = this.element.querySelector('.helper');
    this.download = this.helper.querySelector('.download');
    this.download.addEventListener('click',()=>this._download());

    this.fullWindowOpen = this.helper.querySelector('.fullWindowOpen');
    this.fullWindowOpen.addEventListener('click',()=>this._fullWindowOpen());

    this.fullWindowClose = this.helper.querySelector('.fullWindowClose');
    this.fullWindowClose.addEventListener('click',()=>this._fullWindowClose());

    this.index = 0;
    window.addEventListener('keyup',(e)=>this._keyboard(e));
    this.loader = `<div class="loader"></div>`;
    this._init();
  };
  
  _init(){
    if(this.images.length < 1)
      throw new Error('изображения отсутствуют');

    if(this.thumbs.length < 1)
      throw new Error('миниатюры отсутствуют');

    if(this.images.length !== this.thumbs.length)
      throw new Error('кол-во изображений и миниатюр не совпадает');

    this._images();
    this._thumbs();
    this._counter();
  };

  _images(){
    for(let item of this.images){
      item.insertAdjacentHTML('afterbegin',this.loader);
    };

    for(let i = 0; i < this.images.length; i++){
      i === 0 ? this.images[i].dataset.current = 1 : this.images[i].dataset.current = 0;
      let img = this.images[i].querySelector('img');

      if(img.decoding) img.decoding = 'async';
      img.src = img.dataset.src;

      window.addEventListener('load',()=>{
        if(img.naturalWidth > 0 && img.naturalHeight > 0)
          this.images[i].querySelector('.loader').remove();
      });

    };
  };

  _thumbs(){
    for(let item of this.thumbs){
      item.insertAdjacentHTML('afterbegin',this.loader);
    };

    for(let i = 0; i < this.thumbs.length; i++){
      i === 0 ? this.thumbs[i].dataset.current = 1 : this.thumbs[i].dataset.current = 0;
      let img = this.thumbs[i].querySelector('img');

      if(img.decoding) img.decoding = 'async';

      setTimeout(()=>{
        this.thumbs[i].querySelector('.loader').remove();
        img.style.animationName = 'fadeIn';
      },Math.round(1000*Math.random()));


      this.thumbs[i].addEventListener('click',(e)=>{
        if(e.target.classList.contains('thumbs')){
          this.index = i;
          this._action();
        };
      });
    };
  };

  _prev(){
    this.index--;
    if(this.index < 0){
      this.index = this.images.length - 1;
      this._action();
    }
    else this._action();
  };

  _next(){
    this.index++;
    if(this.index > this.images.length - 1){
      this.index = 0;
      this._action();
    }
    else this._action();
  };

  _fullWindowOpen(){
    this.element.classList.add('fullWindow');
  };

  _fullWindowClose(){
    this.element.classList.remove('fullWindow');
  };

  _download(){
    let url = this.images[this.index].querySelector('img').dataset.src;
    let link = document.createElement('a');
    document.documentElement.append(link);

    let d = new Date();
    let time = d.getTime();

    fetch(url)
      .then(res => res.blob())
      .then(blob =>{
        let objectURL = URL.createObjectURL(blob);
        link.setAttribute('download','image_'+time);
        link.href = objectURL;
        link.click();})
      .then(()=>link.remove());
  };

  _keyboard(e){
    if(e.keyCode == '37') this._prev()
    else if(e.keyCode == '39') this._next()
    else if(e.keyCode == '27') this._fullWindowClose()
  };

  _counter(){
    this.counter.innerHTML = (this.index + 1)+' / '+this.images.length;
  };

  _action(){
    this._counter();
    for(let i = 0; i < this.images.length; i++){
      this.images[i].dataset.current = 0;
      this.thumbs[i].dataset.current = 0;
    };
    this.images[this.index].dataset.current = 1;
    this.thumbs[this.index].dataset.current = 1;
  };

};
new ImageViewer('newItem');
