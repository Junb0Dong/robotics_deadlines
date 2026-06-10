const state = {
  conferences: [],
  area: "All",
  ccf: "all",
  query: "",
  timezone: "local",
};

const areaLabels = {
  All: "全部",
  Robotics: "机器人",
  AI: "人工智能",
  ML: "机器学习",
  Vision: "计算机视觉",
};

const elements = {
  list: document.querySelector("#conference-list"),
  template: document.querySelector("#conference-card-template"),
  empty: document.querySelector("#empty-state"),
  search: document.querySelector("#search"),
  ccfFilter: document.querySelector("#ccf-filter"),
  areaFilters: document.querySelector("#area-filters"),
  timezoneToggle: document.querySelector("#timezone-toggle"),
  upcomingCount: document.querySelector("#upcoming-count"),
  tbaCount: document.querySelector("#tba-count"),
  conferenceCount: document.querySelector("#conference-count"),
  lastUpdated: document.querySelector("#last-updated"),
};

function deadlineDate(conference) {
  return conference.deadline ? new Date(conference.deadline) : null;
}

function formatDeadline(conference) {
  const date = deadlineDate(conference);
  if (!date) {
    return conference.expectedWindow
      ? `TBA · 预计 ${conference.expectedWindow}`
      : "TBA · 等待官方公布";
  }

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: state.timezone === "beijing" ? "Asia/Shanghai" : undefined,
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("zh-CN", options).format(date);
}

function formatDateColumn(conference, element) {
  const date = deadlineDate(conference);
  const month = element.querySelector(".date-month");
  const day = element.querySelector(".date-day");
  const year = element.querySelector(".date-year");

  if (!date) {
    element.classList.add("is-tba");
    month.textContent = conference.expectedWindow || "DATE";
    day.textContent = "TBA";
    year.textContent = conference.edition;
    return;
  }

  const timeZone = state.timezone === "beijing" ? "Asia/Shanghai" : undefined;
  month.textContent = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone,
  }).format(date);
  day.textContent = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone,
  }).format(date);
  year.textContent = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone,
  }).format(date);
}

function countdownText(conference) {
  const date = deadlineDate(conference);
  if (!date) {
    return "待官方公布";
  }

  const distance = date.getTime() - Date.now();
  if (distance <= 0) {
    return "截稿已结束";
  }

  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  if (days > 0) {
    return `还剩 ${days} 天 ${hours} 小时`;
  }

  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  return `还剩 ${hours} 小时 ${minutes} 分钟`;
}

function cardFor(conference) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".conference-card");
  const dateColumn = fragment.querySelector(".date-column");
  const badges = fragment.querySelector(".badges");
  const countdown = fragment.querySelector(".countdown");
  const source = fragment.querySelector(".source-link");

  formatDateColumn(conference, dateColumn);
  fragment.querySelector(".conference-meta").textContent =
    `${conference.area} · ${conference.edition}`;
  fragment.querySelector(".conference-title").textContent =
    `${conference.acronym} ${conference.edition}`;
  fragment.querySelector(".conference-description").textContent = conference.name;
  fragment.querySelector(".deadline-label").textContent = `${conference.deadlineType}：`;
  fragment.querySelector(".deadline-value").textContent = formatDeadline(conference);

  const areaBadge = document.createElement("span");
  areaBadge.className = "badge";
  areaBadge.textContent = areaLabels[conference.area] || conference.area;
  badges.append(areaBadge);

  if (conference.ccf) {
    const ccfBadge = document.createElement("span");
    ccfBadge.className = `badge ccf-${conference.ccf.toLowerCase()}`;
    ccfBadge.textContent = `CCF ${conference.ccf}`;
    badges.append(ccfBadge);
  }

  countdown.textContent = countdownText(conference);
  if (!conference.deadline) {
    countdown.classList.add("is-tba");
  } else if (deadlineDate(conference) <= new Date()) {
    countdown.classList.add("is-past");
    card.dataset.past = "true";
  }

  source.href = conference.source;
  source.setAttribute("aria-label", `查看 ${conference.acronym} 官方来源`);
  return fragment;
}

function filteredConferences() {
  const normalizedQuery = state.query.trim().toLowerCase();
  return state.conferences
    .filter((conference) => state.area === "All" || conference.area === state.area)
    .filter((conference) => {
      if (state.ccf === "all") return true;
      if (state.ccf === "none") return !conference.ccf;
      return conference.ccf === state.ccf;
    })
    .filter((conference) => {
      if (!normalizedQuery) return true;
      return [
        conference.acronym,
        conference.name,
        conference.area,
        conference.edition,
      ].some((value) => String(value).toLowerCase().includes(normalizedQuery));
    })
    .sort((a, b) => {
      if (a.deadline && b.deadline) return deadlineDate(a) - deadlineDate(b);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return a.sortDate.localeCompare(b.sortDate);
    });
}

function render() {
  const conferences = filteredConferences();
  elements.list.replaceChildren(...conferences.map(cardFor));
  elements.empty.hidden = conferences.length !== 0;
  elements.list.hidden = conferences.length === 0;
}

function renderAreaFilters() {
  Object.entries(areaLabels).forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${value === state.area ? " active" : ""}`;
    button.textContent = label;
    button.dataset.area = value;
    button.addEventListener("click", () => {
      state.area = value;
      elements.areaFilters
        .querySelectorAll(".filter-button")
        .forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
    elements.areaFilters.append(button);
  });
}

function updateSummary() {
  const now = new Date();
  elements.upcomingCount.textContent = state.conferences.filter(
    (conference) => conference.deadline && deadlineDate(conference) > now,
  ).length;
  elements.tbaCount.textContent = state.conferences.filter(
    (conference) => !conference.deadline,
  ).length;
  elements.conferenceCount.textContent = state.conferences.length;
}

async function loadConferences() {
  try {
    const response = await fetch("./data/conferences.json?v=20260610-2", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    state.conferences = payload.conferences;
    elements.lastUpdated.textContent = `数据更新时间：${payload.lastUpdated}`;
    updateSummary();
    render();
  } catch (error) {
    console.error(error);
    elements.list.innerHTML =
      '<div class="loading-state">数据加载失败，请稍后刷新页面。</div>';
  }
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.ccfFilter.addEventListener("change", (event) => {
  state.ccf = event.target.value;
  render();
});

elements.timezoneToggle.addEventListener("click", () => {
  state.timezone = state.timezone === "local" ? "beijing" : "local";
  elements.timezoneToggle.textContent =
    state.timezone === "local" ? "显示北京时间" : "显示本地时间";
  render();
});

renderAreaFilters();
loadConferences();
setInterval(render, 60_000);
