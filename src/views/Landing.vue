<template>
  <div class="lp">
    <div class="bgfx" aria-hidden="true">
      <div class="aurora"></div>
      <div class="grid"></div>
    </div>

    <div class="wrap">
      <nav class="nav">
        <div class="logo"><span class="dot"></span>Zhufy</div>
        <router-link to="/editor" class="nav-cta">開始製作</router-link>
      </nav>

      <main>
      <section class="hero">
        <div class="pill"><span class="g"></span>免費 · 免註冊 · 開啟即用</div>
        <h1>把祝福，<span class="grad">做得更好看</span></h1>
        <p class="sub">選一張底圖，寫上想說的話，秒速下載。<br />早安圖、晚安圖，從此不再俗氣。</p>
        <div class="btns">
          <router-link to="/editor" class="primary">開始製作 →</router-link>
          <a href="#preview" class="ghost">看看範例</a>
        </div>
        <p class="trust">圖片只在你的瀏覽器處理，不會上傳</p>
      </section>

      <section id="preview" class="show">
        <div class="halo" aria-hidden="true"></div>
        <div class="browser">
          <div class="bar" aria-hidden="true">
            <i></i><i></i><i></i><span class="url">zhufy.app/editor</span>
          </div>
          <img
            :src="`${baseUrl}showcase/desktop.webp`"
            alt="Zhufy 編輯器桌面版畫面"
            width="1200"
            height="826"
          />
        </div>
        <div class="phone">
          <img
            :src="`${baseUrl}showcase/mobile.webp`"
            alt="Zhufy 編輯器手機版畫面"
            width="720"
            height="1357"
          />
        </div>
      </section>

      <section class="feats">
        <article class="card">
          <div class="ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
            </svg>
          </div>
          <h2>開了就能用</h2>
          <p>純前端、零等待。靈感一來，馬上開工。</p>
        </article>
        <article class="card">
          <div class="ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2.5" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          </div>
          <h2>桌機手機都順</h2>
          <p>同一套介面自動適應，手機也能細修。</p>
        </article>
        <article class="card">
          <div class="ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
            </svg>
          </div>
          <h2>底圖字型都備好</h2>
          <p>內建質感素材，不必自己找圖配字。</p>
        </article>
      </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = import.meta.env.BASE_URL

defineOptions({
  name: 'LandingPage',
})
</script>

<style scoped>
.lp {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: #fbfbfd;
  color: #14171f;
  font-family: 'Noto Sans TC', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* dawn aurora glow + faint grid (pure CSS, ties to the morning-greeting theme) */
.bgfx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.aurora {
  position: absolute;
  top: -260px;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
  max-width: 140vw;
  height: 640px;
  background:
    radial-gradient(44% 60% at 36% 42%, rgba(240, 152, 42, 0.22), rgba(240, 152, 42, 0) 70%),
    radial-gradient(44% 56% at 66% 46%, rgba(251, 111, 132, 0.2), rgba(251, 111, 132, 0) 70%),
    radial-gradient(40% 50% at 52% 62%, rgba(139, 107, 255, 0.13), rgba(139, 107, 255, 0) 72%);
  filter: blur(16px);
}
.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(18, 23, 40, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 23, 40, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(68% 52% at 50% 26%, #000 0%, transparent 76%);
  mask-image: radial-gradient(68% 52% at 50% 26%, #000 0%, transparent 76%);
}

.wrap {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.01em;
}
.logo .dot {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(135deg, #f0982a, #fb6f84);
  box-shadow: 0 4px 14px rgba(251, 111, 132, 0.4);
}
.nav-cta {
  font-size: 14px;
  font-weight: 600;
  color: #14171f;
  text-decoration: none;
  border: 1px solid rgba(18, 23, 40, 0.09);
  padding: 8px 16px;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(18, 23, 40, 0.04);
}

.hero {
  text-align: center;
  padding: 68px 0 52px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #5a6472;
  font-weight: 500;
  border: 1px solid rgba(18, 23, 40, 0.09);
  background: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 30px;
  box-shadow: 0 1px 2px rgba(18, 23, 40, 0.04);
}
.pill .g {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f0982a;
  box-shadow: 0 0 8px #f0982a;
}
h1 {
  font-weight: 900;
  font-size: 66px;
  line-height: 1.12;
  letter-spacing: -0.02em;
}
h1 .grad {
  background: linear-gradient(100deg, #f0982a, #fb6f84);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}
.sub {
  color: #5a6472;
  font-size: 18.5px;
  line-height: 1.75;
  max-width: 520px;
  margin: 24px auto 38px;
  font-weight: 500;
}
.btns {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}
.primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #f8a93c, #fb6f84);
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow:
    0 12px 32px -8px rgba(251, 111, 132, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 0.2s ease;
}
.ghost {
  font-weight: 600;
  font-size: 16px;
  color: #14171f;
  text-decoration: none;
  border: 1px solid rgba(18, 23, 40, 0.09);
  background: #fff;
  padding: 15px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(18, 23, 40, 0.04);
  transition: transform 0.2s ease;
}
.trust {
  margin-top: 20px;
  font-size: 13px;
  color: #8b93a1;
  letter-spacing: 0.03em;
}

.show {
  position: relative;
  margin: 30px auto 0;
  max-width: 920px;
  scroll-margin-top: 24px;
}
.halo {
  position: absolute;
  left: 50%;
  top: 18%;
  transform: translateX(-50%);
  width: 780px;
  max-width: 120%;
  height: 300px;
  background: radial-gradient(
    50% 60% at 50% 50%,
    rgba(248, 169, 60, 0.28),
    rgba(251, 111, 132, 0.16) 55%,
    transparent 75%
  );
  filter: blur(30px);
  z-index: 0;
}
.browser {
  position: relative;
  z-index: 1;
  background: #fff;
  border: 1px solid rgba(18, 23, 40, 0.09);
  border-radius: 16px;
  box-shadow:
    0 40px 90px -30px rgba(34, 30, 60, 0.3),
    0 8px 24px -12px rgba(34, 30, 60, 0.18);
  overflow: hidden;
}
.bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 13px 16px;
  border-bottom: 1px solid rgba(18, 23, 40, 0.09);
  background: #fcfcfe;
}
.bar i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #e2e5ec;
}
.bar .url {
  margin-left: 14px;
  font-size: 12px;
  color: #5a6472;
  background: #f2f3f7;
  padding: 4px 14px;
  border-radius: 7px;
}
.browser img {
  display: block;
  width: 100%;
  height: auto;
}

.phone {
  display: none;
}

.feats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 84px 0 90px;
}
.card {
  position: relative;
  background: #fff;
  border: 1px solid rgba(18, 23, 40, 0.09);
  border-radius: 16px;
  padding: 26px 24px;
  box-shadow:
    0 2px 4px rgba(18, 23, 40, 0.03),
    0 14px 30px -18px rgba(18, 23, 40, 0.12);
}
.card::before {
  content: '';
  position: absolute;
  left: 24px;
  right: 24px;
  top: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(248, 169, 60, 0.7),
    rgba(251, 111, 132, 0.5),
    transparent
  );
}
.card .ic {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(248, 169, 60, 0.16), rgba(251, 111, 132, 0.12));
  border: 1px solid rgba(18, 23, 40, 0.09);
  color: #d97a1e;
  margin-bottom: 16px;
}
.card .ic svg {
  width: 20px;
  height: 20px;
}
.card h2 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 7px;
}
.card p {
  font-size: 14px;
  color: #5a6472;
  line-height: 1.7;
}

@media (hover: hover) {
  .primary:hover,
  .ghost:hover {
    transform: translateY(-2px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .primary,
  .ghost {
    transition: none;
  }
}

@media (max-width: 640px) {
  .wrap {
    padding: 0 20px;
  }
  .nav {
    padding: 18px 0;
  }
  .hero {
    padding: 44px 0 36px;
  }
  .pill {
    font-size: 11.5px;
    padding: 6px 12px;
    margin-bottom: 22px;
  }
  h1 {
    font-size: 40px;
    line-height: 1.16;
  }
  .sub {
    font-size: 16px;
    margin: 18px auto 28px;
  }
  .sub br {
    display: none;
  }
  .btns {
    flex-direction: column;
    align-items: stretch;
    gap: 11px;
  }
  .primary,
  .ghost {
    justify-content: center;
    width: 100%;
  }
  .browser {
    display: none;
  }
  .show {
    margin-top: 24px;
  }
  .halo {
    top: 6%;
    width: 120%;
    height: 60%;
  }
  .phone {
    display: block;
    position: relative;
    z-index: 1;
    width: 236px;
    margin: 0 auto;
    background: #fff;
    padding: 7px;
    border: 1px solid rgba(18, 23, 40, 0.09);
    border-radius: 30px;
    box-shadow: 0 30px 70px -24px rgba(34, 30, 60, 0.32);
  }
  .phone img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 24px;
  }
  .feats {
    grid-template-columns: 1fr;
    gap: 13px;
    padding: 60px 0 68px;
  }
}
</style>
