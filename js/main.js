(function () {
  const { categories, videos, profile } = window.PORTFOLIO_DATA;
  let activeCategory = '全部';

  const icon = (name) => ({
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 7 8 5-8 5V7Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  })[name];

  const mediaSource = (video) => video.playUrl || video.url;
  const previewMedia = (video) => {
    if (video.cover) return `<img src="${video.cover}" alt="${video.title} 封面" loading="lazy">`;
    if (video.type === 'gif') return `<img src="${mediaSource(video)}" alt="${video.title}">`;
    return `<div class="video-placeholder" aria-label="${video.title} 视频封面"><strong>${video.category}</strong><span>${video.title}</span></div>`;
  };
  const playerMedia = (video) => {
    if (video.type === 'gif') return `<img src="${mediaSource(video)}" alt="${video.title}">`;
    return `<video src="${mediaSource(video)}" controls autoplay playsinline preload="metadata" ${video.cover ? `poster="${video.cover}"` : ''}></video>`;
  };
  const card = (video) => `
    <article class="work-card" data-id="${video.id}" tabindex="0" aria-label="播放 ${video.title}">
      <div class="work-media">
        ${previewMedia(video)}
        <span class="play">${icon('play')}</span>
        <span class="work-index">${String(video.id).padStart(2, '0')}</span>
      </div>
      <div class="work-info">
        <div><p>${video.category}</p><h3>${video.title}</h3></div>
        <span>${video.date}</span>
      </div>
      <div class="work-extra">${video.extra || ''}</div>
    </article>`;

  document.getElementById('root').innerHTML = `
    <div id="top" class="hero-stage">
      <video class="hero-video" src="./assets/videos/hero-intro.mp4" autoplay muted loop playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5-page" preload="auto" aria-label="zhang 的作品集首屏视频"></video>
      <header class="header wrap">
        <a class="brand" href="#top">ZHANG<span>®</span></a>
        <nav><a href="#works">作品</a><a href="#about">关于</a><a href="#contact">联系</a></nav>
      </header>
        <section class="hero wrap">
          <div class="hero-copy">
            <p class="eyebrow">PORTFOLIO / 2026</p>
            <h1>三秒抓住注意力<br><em>一帧留下记忆点</em></h1>
            <p class="intro">我是 zhang，一名新媒体短视频创作者。<br>聚焦 IP、动画、口播信息流、品牌宣传与 AI 内容，用节奏、镜头和视觉完成度，把内容的重点说清楚，把情绪留在画面里。</p>
            <a class="round-link" href="#works">查看作品 ${icon('arrow')}</a>
          </div>
        </section>
    </div>
      <main>
        <section class="works wrap" id="works">
          <div class="section-label"><p>SELECTED WORKS</p><span id="work-count"></span></div>
          <div class="work-heading">
            <h2>部分作品<br><em>展示</em></h2>
          </div>
          <div class="category-nav" role="tablist" aria-label="作品分类">
            ${categories.map((category) => `<button class="filter-button${category === '全部' ? ' active' : ''}" type="button" role="tab" aria-selected="${category === '全部'}" data-category="${category}">${category}</button>`).join('')}
          </div>
          <div class="work-grid" id="work-grid"></div>
        </section>
        <section class="about" id="about">
          <div class="wrap about-grid">
            <div><p class="eyebrow">ABOUT ME</p><h2>把节奏感<br><em>藏进每一帧里</em></h2></div>
            <div class="about-text"><img class="avatar" src="./assets/images/zhang-avatar.jpg" alt="zhang 的头像"><p>3 年内容制作经验（含 2 年全职剪辑），擅长信息流快剪、品牌宣传片、IP 短视频及口播类内容的剪辑与后期包装。兼具 UI 设计背景带来的视觉审美功底，对画面构图、色彩节奏有敏锐把控力，能通过剪辑语言精准传递品牌调性与产品卖点。</p></div>
          </div>
        </section>
        <section class="contact wrap" id="contact">
          <p class="eyebrow">LET'S CONNECT</p>
          <h2>下一个项目<br><em>一起搞点动静</em></h2>
          <div class="contact-details"><a href="tel:${profile.phone}"><small>电话</small>${profile.phone}</a><div><small>微信</small>${profile.wechat}</div></div>
        </section>
      </main>
    <footer class="wrap"><span>© 2026 ZHANG</span><a href="#top">回到顶部 ↑</a></footer>
    <div id="modal-root"></div>`;

  const heroVideo = document.querySelector('.hero-video');
  const startHeroVideo = () => {
    if (!heroVideo) return;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    const playback = heroVideo.play();
    if (playback) playback.catch(() => {});
  };
  heroVideo.addEventListener('canplay', startHeroVideo, { once: true });
  document.addEventListener('WeixinJSBridgeReady', startHeroVideo, false);
  window.addEventListener('pageshow', startHeroVideo);
  document.addEventListener('touchstart', startHeroVideo, { once: true, passive: true });
  startHeroVideo();

  const renderWorks = () => {
    const visibleVideos = activeCategory === '全部' ? videos : videos.filter((video) => video.category === activeCategory);
    document.getElementById('work-count').textContent = `${videos.length.toString().padStart(2, '0')} / 作品`;
    document.getElementById('work-grid').innerHTML = visibleVideos.length
      ? visibleVideos.map(card).join('')
      : `<p class="work-empty">${activeCategory} 分类的作品正在整理中。</p>`;
  };

  const close = () => {
    document.getElementById('modal-root').innerHTML = '';
    document.body.classList.remove('locked');
  };
  const open = (id) => {
    const video = videos.find((item) => item.id === Number(id));
    if (!video) return;
    document.getElementById('modal-root').innerHTML = `
      <div class="modal">
        <section>
          <button class="close" type="button" aria-label="关闭">${icon('close')}</button>
          <div class="modal-media">${playerMedia(video)}</div>
          <div class="modal-info"><p>${video.category} · ${video.date}</p><h3>${video.title}</h3><span>${video.description}</span></div>
        </section>
      </div>`;
    document.body.classList.add('locked');
    document.querySelector('.close').onclick = close;
    document.querySelector('.modal').onclick = (event) => { if (event.target === event.currentTarget) close(); };
  };

  document.querySelector('.category-nav').onclick = (event) => {
    const button = event.target.closest('.filter-button');
    if (!button) return;
    activeCategory = button.dataset.category;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    renderWorks();
  };
  document.getElementById('work-grid').onclick = (event) => {
    const item = event.target.closest('.work-card');
    if (item) open(item.dataset.id);
  };
  document.getElementById('work-grid').onkeydown = (event) => {
    if (event.key === 'Enter' && event.target.classList.contains('work-card')) open(event.target.dataset.id);
  };
  document.onkeydown = (event) => { if (event.key === 'Escape') close(); };
  renderWorks();
})();
