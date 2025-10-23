// ページめくり（本をめくるようなイメージ）
/*

ローディングから画面遷移
================================================ */
const loadingAreaGrey = document.querySelector('#loading');
const loadingAreaGreen = document.querySelector('#loading-screen');
const loadingText = document.querySelector('#loading p');


document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.text-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  const textDisplay = document.querySelector('.text-display');
  let current = 0;
  let touchstartX = 0;
  let touchendX = 0;
  const threadhold = 50; // スワイプと認識する最小距離

  function showPage(idx) {
    items.forEach((el, i) => {
        if (i === idx) {
            el.classList.add('active');
            el.classList.remove('next', 'prev');
        } else {
            if (i < idx) {
                el.classList.add('prev');
                el.classList.remove('active', 'next');
            } else {
                el.classList.add('next');
                el.classList.remove('active', 'prev');
            }
        }
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + items.length) % items.length;
    showPage(current);
  });
  nextBtn.addEventListener('click', () => {
    current = (current + 1) % items.length;
    showPage(current);
  });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      current = parseInt(dot.dataset.index, 10);
      showPage(current);
    });
  });
  showPage(current);
  textDisplay.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
  },false);

  textDisplay.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
  },false)
function handleGesture(){
  const diff = touchendX - touchstartX;
  if (Math.abs(diff) < threadhold){
    return;
  }
  if(diff > 0){
    current = (current - 1 + items.length) % items.length;
    showPage(current);
  }
  else{
    current = (current + 1) % items.length;
    showPage(current);
  }  
};

bubbly();
});



/*
スクロールで要素を表示
================================================ */
// 監視対象が範囲内に現れたら実行する動作
const animateFade = (entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        {
          opacity: [0, 1],
          filter: ['blur(.4rem)', 'blur(0)'], 
          translate: ['0 4rem', 0],
        },
        {
          duration: 2000,
          easing: 'ease',
          fill: 'forwards',
        }
      );
      // 一度ふわっと表示されたら監視をやめる
      obs.unobserve(entry.target);
    }
  });
};

// 監視設定
const fadeObserver = new IntersectionObserver(animateFade);

// .fadeinを監視するよう指示
const fadeElements = document.querySelectorAll('.fadein');
fadeElements.forEach((fadeElement) => {
  fadeObserver.observe(fadeElement);
});