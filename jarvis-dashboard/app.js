(function () {
  "use strict";

  const ALL_TRACKS = TOP_TRACKS.concat(DISCOVERY_TRACKS);

  function artistNames(t) {
    return t.artists.join(", ");
  }

  function trackTitle(t) {
    return t.version ? `${t.title} (${t.version})` : t.title;
  }

  // ---------------------------------------------------------------
  // Tabs
  // ---------------------------------------------------------------
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.id === `tab-${target}`));

      // Pause any audio playing outside the tab being left.
      if (target !== "dj") djPause();
      if (target !== "fm") fmPause();
      previewAudio.pause();
    });
  });

  // ---------------------------------------------------------------
  // Shared single-shot preview player (used by Summary/Explore quick play)
  // ---------------------------------------------------------------
  const previewAudio = new Audio();
  previewAudio.volume = 0.9;

  function playOneShot(track) {
    previewAudio.pause();
    previewAudio.src = track.preview;
    previewAudio.currentTime = 0;
    previewAudio.play().catch(() => {});
  }

  // ---------------------------------------------------------------
  // Summary tab
  // ---------------------------------------------------------------
  function computeGenreCounts() {
    const counts = {};
    TOP_TRACKS.forEach((t) => t.genres.forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    TOP_ARTISTS.forEach((a) => a.genres.forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    return counts;
  }

  function renderSummary() {
    const counts = computeGenreCounts();
    const sortedGenres = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const totalMentions = sortedGenres.reduce((s, [, c]) => s + c, 0);
    const topGenre = sortedGenres[0] ? sortedGenres[0][0] : "—";

    document.getElementById("footer-date").textContent = SNAPSHOT_PULLED_AT;

    const statRow = document.getElementById("stat-row");
    statRow.innerHTML = "";
    const stats = [
      { label: "Top Genre", value: topGenre, sub: `${sortedGenres.length} genres in rotation` },
      { label: "Top Artist", value: TOP_ARTISTS[0].name, sub: TOP_ARTISTS[0].genres.join(" · ") },
      { label: "Top Track", value: trackTitle(TOP_TRACKS[0]), sub: artistNames(TOP_TRACKS[0]) },
      { label: "Saved in Library", value: `${TOP_TRACKS.filter((t) => t.saved).length}/${TOP_TRACKS.length}`, sub: "of your top tracks" },
    ];
    stats.forEach((s) => {
      const el = document.createElement("div");
      el.className = "stat-card";
      el.innerHTML = `<div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub">${s.sub}</div>`;
      statRow.appendChild(el);
    });

    const list = document.getElementById("top-tracks-list");
    list.innerHTML = "";
    TOP_TRACKS.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "track-row";
      li.innerHTML = `
        <span class="track-rank">${i + 1}</span>
        <img src="${t.cover}" alt="" />
        <div class="track-info">
          <div class="track-title">${trackTitle(t)}</div>
          <div class="track-sub">${artistNames(t)}</div>
        </div>
        ${t.saved ? '<span class="saved-pill">Saved</span>' : ""}
      `;
      li.addEventListener("click", () => playOneShot(t));
      li.style.cursor = "pointer";
      list.appendChild(li);
    });

    const artistGrid = document.getElementById("top-artists-grid");
    artistGrid.innerHTML = "";
    TOP_ARTISTS.forEach((a) => {
      const el = document.createElement("a");
      el.className = "artist-card";
      el.href = a.url;
      el.target = "_blank";
      el.rel = "noopener";
      el.innerHTML = `
        <img src="${a.image}" alt="" />
        <div class="artist-name">${a.name}</div>
        <div class="artist-genre">${a.genres[0]}</div>
      `;
      artistGrid.appendChild(el);
    });

    const cloud = document.getElementById("genre-cloud");
    cloud.innerHTML = "";
    sortedGenres.forEach(([g, c]) => {
      const pct = Math.round((c / totalMentions) * 100);
      const chip = document.createElement("span");
      chip.className = "genre-chip";
      chip.style.fontSize = `${0.85 + (c / sortedGenres[0][1]) * 0.35}rem`;
      chip.innerHTML = `${g}<span class="pct">${pct}%</span>`;
      cloud.appendChild(chip);
    });
  }

  // ---------------------------------------------------------------
  // Explore tab
  // ---------------------------------------------------------------
  let exploreOrder = shuffle(DISCOVERY_TRACKS.slice());
  let exploreIndex = 0;
  const LIKED_KEY = "jarvis_explore_likes";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getLiked() {
    try {
      return JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function setLiked(list) {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function currentExploreTrack() {
    return exploreOrder[exploreIndex % exploreOrder.length];
  }

  function renderExploreCard() {
    const t = currentExploreTrack();
    const deck = document.getElementById("explore-deck");
    deck.innerHTML = `
      <div class="explore-card">
        <img src="${t.cover}" alt="" />
        <div class="ec-body">
          <div class="ec-because">${t.because}</div>
          <h3>${trackTitle(t)}</h3>
          <div class="ec-artist">${artistNames(t)}</div>
          <div class="genre-chips">${t.genres.map((g) => `<span>${g}</span>`).join("")}</div>
        </div>
      </div>
    `;
    document.getElementById("explore-progress").textContent =
      `Card ${(exploreIndex % exploreOrder.length) + 1} of ${exploreOrder.length} · open ${t.url.replace("https://open.spotify.com/track/", "")} on Spotify to save for real`;
  }

  function renderLikedList() {
    const liked = getLiked();
    document.getElementById("liked-count").textContent = String(liked.length);
    const ul = document.getElementById("liked-list");
    ul.innerHTML = "";
    liked.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<img src="${t.cover}" alt="" /><span>${trackTitle(t)} — ${artistNames(t)}</span>`;
      ul.appendChild(li);
    });
  }

  function advanceExplore() {
    exploreIndex++;
    if (exploreIndex % exploreOrder.length === 0) exploreOrder = shuffle(DISCOVERY_TRACKS.slice());
    renderExploreCard();
  }

  document.getElementById("explore-skip").addEventListener("click", advanceExplore);
  document.getElementById("explore-preview").addEventListener("click", () => playOneShot(currentExploreTrack()));
  document.getElementById("explore-like").addEventListener("click", () => {
    const t = currentExploreTrack();
    const liked = getLiked();
    if (!liked.find((x) => x.id === t.id)) {
      liked.push(t);
      setLiked(liked);
      renderLikedList();
    }
    advanceExplore();
  });
  document.getElementById("clear-liked").addEventListener("click", () => {
    setLiked([]);
    renderLikedList();
  });

  document.getElementById("blend-btn").addEventListener("click", () => {
    const genrePool = Array.from(new Set(TOP_TRACKS.flatMap((t) => t.genres)));
    const gA = genrePool[Math.floor(Math.random() * genrePool.length)];
    let gB = genrePool[Math.floor(Math.random() * genrePool.length)];
    if (genrePool.length > 1) while (gB === gA) gB = genrePool[Math.floor(Math.random() * genrePool.length)];

    const matches = ALL_TRACKS.filter((t) => t.genres.includes(gA) || t.genres.includes(gB));
    const picks = shuffle(matches).slice(0, 3);

    const box = document.getElementById("blend-result");
    box.innerHTML = `<div><span class="blend-pill">${gA}</span> + <span class="blend-pill">${gB}</span></div>`;
    const ul = document.createElement("ul");
    ul.className = "mini-list";
    picks.forEach((t) => {
      const li = document.createElement("li");
      li.style.cursor = "pointer";
      li.innerHTML = `<img src="${t.cover}" alt="" /><span>${trackTitle(t)} — ${artistNames(t)}</span>`;
      li.addEventListener("click", () => playOneShot(t));
      ul.appendChild(li);
    });
    box.appendChild(ul);
  });

  // ---------------------------------------------------------------
  // DJ tab — auto-mixed, crossfaded session
  // ---------------------------------------------------------------
  const djAudioA = new Audio();
  const djAudioB = new Audio();
  let djActive = djAudioA;
  let djInactive = djAudioB;
  let djQueue = shuffle(ALL_TRACKS.slice());
  let djPos = 0;
  let djPlaying = false;
  let djFading = false;
  const DJ_CROSSFADE_SEC = 2.5;

  function djCurrentTrack() {
    return djQueue[djPos % djQueue.length];
  }

  function djRenderNow() {
    const t = djCurrentTrack();
    document.getElementById("dj-cover").src = t.cover;
    document.getElementById("dj-title").textContent = trackTitle(t);
    document.getElementById("dj-artist").textContent = artistNames(t);
    document.getElementById("dj-source-tag").textContent = TOP_TRACKS.includes(t) ? "FROM YOUR TOP TRACKS" : "FRESH PICK";
    document.getElementById("dj-genres").innerHTML = t.genres.map((g) => `<span>${g}</span>`).join("");
    djRenderQueue();
  }

  function djRenderQueue() {
    const ol = document.getElementById("dj-queue-list");
    ol.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
      const t = djQueue[(djPos + i) % djQueue.length];
      const li = document.createElement("li");
      li.innerHTML = `<img src="${t.cover}" alt="" /><span>${trackTitle(t)} — ${artistNames(t)}</span>`;
      ol.appendChild(li);
    }
  }

  function djLoad(audioEl, track, startVolume) {
    audioEl.src = track.preview;
    audioEl.currentTime = 0;
    audioEl.volume = startVolume;
  }

  function djPlay() {
    djPlaying = true;
    document.getElementById("dj-playpause").textContent = "⏸ Pause";
    document.getElementById("dj-visualizer").classList.add("is-playing");
    if (!djActive.src) {
      djLoad(djActive, djCurrentTrack(), Number(document.getElementById("dj-volume").value));
    }
    djActive.play().catch(() => {});
    djRenderNow();
  }

  function djPause() {
    djPlaying = false;
    djAudioA.pause();
    djAudioB.pause();
    document.getElementById("dj-playpause").textContent = "▶ Play";
    document.getElementById("dj-visualizer").classList.remove("is-playing");
  }

  function djAdvance() {
    if (djFading) return;
    djFading = true;
    djPos++;
    const nextTrack = djCurrentTrack();
    const targetVolume = Number(document.getElementById("dj-volume").value);

    djLoad(djInactive, nextTrack, 0);
    djInactive.play().catch(() => {});
    djRenderNow();

    const steps = 25;
    let i = 0;
    const outgoing = djActive;
    const incoming = djInactive;
    const timer = setInterval(() => {
      i++;
      const p = i / steps;
      outgoing.volume = Math.max(0, targetVolume * (1 - p));
      incoming.volume = Math.min(targetVolume, targetVolume * p);
      if (i >= steps) {
        clearInterval(timer);
        outgoing.pause();
        outgoing.currentTime = 0;
        const tmp = djActive;
        djActive = djInactive;
        djInactive = tmp;
        djFading = false;
      }
    }, (DJ_CROSSFADE_SEC * 1000) / steps);
  }

  djActive.addEventListener("timeupdate", () => {
    if (djActive.duration && djPlaying) {
      document.getElementById("dj-progress").style.width = `${(djActive.currentTime / djActive.duration) * 100}%`;
      if (djActive.duration - djActive.currentTime < DJ_CROSSFADE_SEC + 0.3 && !djFading) {
        djAdvance();
      }
    }
  });
  djAudioB.addEventListener("timeupdate", () => {
    if (djActive === djAudioB && djActive.duration && djPlaying) {
      document.getElementById("dj-progress").style.width = `${(djActive.currentTime / djActive.duration) * 100}%`;
      if (djActive.duration - djActive.currentTime < DJ_CROSSFADE_SEC + 0.3 && !djFading) {
        djAdvance();
      }
    }
  });

  document.getElementById("dj-playpause").addEventListener("click", () => {
    if (djPlaying) djPause();
    else djPlay();
  });
  document.getElementById("dj-next").addEventListener("click", () => {
    if (!djPlaying) djPlay();
    djAdvance();
  });
  document.getElementById("dj-shuffle").addEventListener("click", () => {
    djQueue = shuffle(ALL_TRACKS.slice());
    djPos = 0;
    djRenderQueue();
    if (djPlaying) {
      djPause();
      djAudioA.src = "";
      djAudioB.src = "";
      djPlay();
    } else {
      djRenderNow();
    }
  });
  document.getElementById("dj-volume").addEventListener("input", (e) => {
    const v = Number(e.target.value);
    if (!djFading) djActive.volume = v;
  });

  // ---------------------------------------------------------------
  // FM tab — genre radio stations, loops continuously
  // ---------------------------------------------------------------
  const fmAudio = new Audio();
  let fmStationName = null;
  let fmTracks = [];
  let fmPos = 0;
  let fmPlaying = false;

  function stationTracksFor(name) {
    if (name === "Discovery") return DISCOVERY_TRACKS.slice();
    return ALL_TRACKS.filter((t) => t.genres.includes(name));
  }

  function buildStations() {
    const names = Object.keys(STATION_PLAYLISTS);
    return names
      .map((name) => ({ name, tracks: stationTracksFor(name) }))
      .filter((s) => s.tracks.length > 0);
  }

  function renderStationList() {
    const stations = buildStations();
    const box = document.getElementById("station-list");
    box.innerHTML = "";
    stations.forEach((s) => {
      const el = document.createElement("div");
      el.className = "station-card" + (s.name === fmStationName ? " is-tuned" : "");
      const trackWord = s.tracks.length === 1 ? "track" : "tracks";
      el.innerHTML = `<div class="st-name">${s.name} Radio</div><div class="st-sub">${s.tracks.length} ${trackWord} in rotation</div>`;
      el.addEventListener("click", () => tuneIn(s.name));
      box.appendChild(el);
    });
  }

  function tuneIn(name) {
    fmStationName = name;
    fmTracks = shuffle(stationTracksFor(name));
    fmPos = 0;
    document.getElementById("fm-playpause").disabled = false;
    document.getElementById("fm-scan").disabled = false;
    document.getElementById("fm-open-spotify").href = STATION_PLAYLISTS[name] || "#";
    document.getElementById("fm-station-name").textContent = `${name} Radio`;
    renderStationList();
    fmPlay();
  }

  function fmRenderNow() {
    const t = fmTracks[fmPos % fmTracks.length];
    document.getElementById("fm-cover").src = t.cover;
    document.getElementById("fm-title").textContent = trackTitle(t);
    document.getElementById("fm-artist").textContent = artistNames(t);
  }

  function fmPlay() {
    if (!fmStationName) return;
    fmPlaying = true;
    document.getElementById("fm-playpause").textContent = "⏸ Pause";
    document.getElementById("fm-live-badge").textContent = "◉ ON AIR";
    document.getElementById("fm-live-badge").classList.add("is-live");
    fmAudio.src = fmTracks[fmPos % fmTracks.length].preview;
    fmAudio.currentTime = 0;
    fmAudio.play().catch(() => {});
    fmRenderNow();
  }

  function fmPause() {
    fmPlaying = false;
    fmAudio.pause();
    document.getElementById("fm-playpause").textContent = "▶ Play";
    document.getElementById("fm-live-badge").textContent = fmStationName ? "◉ PAUSED" : "◉ NOT TUNED IN";
    document.getElementById("fm-live-badge").classList.remove("is-live");
  }

  function fmScan() {
    fmPos++;
    fmAudio.src = fmTracks[fmPos % fmTracks.length].preview;
    fmAudio.currentTime = 0;
    if (fmPlaying) fmAudio.play().catch(() => {});
    fmRenderNow();
  }

  fmAudio.addEventListener("timeupdate", () => {
    if (fmAudio.duration) {
      document.getElementById("fm-progress").style.width = `${(fmAudio.currentTime / fmAudio.duration) * 100}%`;
    }
  });
  fmAudio.addEventListener("ended", () => {
    if (fmPlaying) fmScan();
  });

  document.getElementById("fm-playpause").addEventListener("click", () => {
    if (fmPlaying) fmPause();
    else fmPlay();
  });
  document.getElementById("fm-scan").addEventListener("click", fmScan);

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  renderSummary();
  renderExploreCard();
  renderLikedList();
  djRenderNow();
  renderStationList();
})();
