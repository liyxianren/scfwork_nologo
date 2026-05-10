(function () {
  const form = document.getElementById("advisorForm");
  const resultsEl = document.getElementById("advisorResults");

  if (!form || !resultsEl) return;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formPayload() {
    const data = new FormData(form);
    return {
      grade: String(data.get("grade") || "").trim(),
      interests: String(data.get("interests") || "").trim(),
      foundation: String(data.get("foundation") || "").trim(),
      goal: String(data.get("goal") || "").trim(),
      time: String(data.get("time") || "").trim()
    };
  }

  function tokenize(value) {
    return String(value || "")
      .toLowerCase()
      .split(/[\s,，、。；;：:\/|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function fallbackRecommendations(payload) {
    const projects = window.SUMMER_PROJECTS || [];
    const tokens = tokenize(
      [
        payload.grade,
        payload.interests,
        payload.foundation,
        payload.goal,
        payload.time
      ].join(" ")
    );

    const ranked = projects
      .map((project) => {
        const haystack = [
          project.name,
          project.type,
          project.category,
          project.grade,
          project.direction,
          project.requirement,
          project.summary,
          project.intro,
          (project.subjects || []).join(" "),
          (project.focus || []).join(" "),
          (project.outcomes || []).join(" ")
        ]
          .join(" ")
          .toLowerCase();
        const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
        return { project, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.project.name.localeCompare(b.project.name, "zh-CN");
      })
      .slice(0, 3);

    return {
      mode: "fallback",
      summary: "已基于当前项目库生成初步推荐。",
      recommendations: ranked.map(({ project, score }) => ({
        title: project.name,
        match_score: score > 0 ? "较高" : "参考",
        reason: project.summary || project.intro || "该项目与当前填写的信息有一定相关性。",
        learning_outcomes: (project.outcomes || project.focus || []).slice(0, 3),
        next_step: "建议进入详情页查看项目安排、适合年级和计划书。",
        detail_url: `projects/${project.slug}.html`
      })),
      questions_to_follow_up: [
        "学生当前是否已有相关编程或工程基础？",
        "更希望偏软件、硬件，还是综合实践？"
      ],
      disclaimer: "推荐结果基于页面内项目库自动匹配，仅供初步筛选。"
    };
  }

  function setLoading() {
    resultsEl.className = "advisor-results advisor-results--loading";
    resultsEl.innerHTML = "<p>正在基于项目库生成推荐，请稍候...</p>";
  }

  function renderError(message) {
    resultsEl.className = "advisor-results advisor-results--error";
    resultsEl.innerHTML = `<p>${escapeHtml(message || "暂时无法生成推荐，请稍后重试。")}</p>`;
  }

  function renderRecommendations(data) {
    const recommendations = data.recommendations || [];
    if (!recommendations.length) {
      renderError("当前信息下没有找到合适项目，可以放宽兴趣方向或补充更多背景。");
      return;
    }

    const cards = recommendations
      .map((item) => {
        const outcomes = (item.learning_outcomes || [])
          .map((outcome) => `<span>${escapeHtml(outcome)}</span>`)
          .join("");
        const score = item.match_score ? `<span class="advisor-card__score">匹配度 ${escapeHtml(item.match_score)}</span>` : "";
        return `
          <article class="advisor-card">
            <div class="advisor-card__head">
              <h3>${escapeHtml(item.title)}</h3>
              ${score}
            </div>
            <p>${escapeHtml(item.reason)}</p>
            ${outcomes ? `<div class="advisor-card__outcomes">${outcomes}</div>` : ""}
            <div class="advisor-card__next">${escapeHtml(item.next_step || "建议预约老师进一步确认。")}</div>
            <a class="btn btn-outline" href="${escapeHtml(item.detail_url || "#projects")}" target="_top">查看项目详情</a>
          </article>
        `;
      })
      .join("");

    const questions = (data.questions_to_follow_up || [])
      .map((question) => `<li>${escapeHtml(question)}</li>`)
      .join("");

    resultsEl.className = "advisor-results advisor-results--ready";
    resultsEl.innerHTML = `
      <div class="advisor-summary">
        <strong>${escapeHtml(data.summary || "已生成初步推荐。")}</strong>
        <span>${data.mode === "fallback" ? "已基于当前项目库生成推荐" : "由 AI 基于项目库生成"}</span>
      </div>
      <div class="advisor-card-grid">${cards}</div>
      ${questions ? `<div class="advisor-followup"><strong>建议继续确认</strong><ul>${questions}</ul></div>` : ""}
      <p class="advisor-disclaimer">${escapeHtml(data.disclaimer || "推荐结果仅供初步参考。")}</p>
    `;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    setLoading();
    const payload = formPayload();
    const apiEndpoint = window.SUMMER_PROJECT_RECOMMENDATION_API || "";

    if (!apiEndpoint) {
      renderRecommendations(fallbackRecommendations(payload));
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "暂时无法生成推荐，请稍后重试。");
      }
      renderRecommendations(data);
    } catch (error) {
      renderRecommendations(fallbackRecommendations(payload));
    }
  });
})();
