const PLACEHOLDER_POSTER = "assets/project-media/shared/project-placeholder.svg";
(function () {
  window.PROJECT_DETAIL_CONTENT = window.PROJECT_DETAIL_CONTENT || {};
  const projects = window.SUMMER_PROJECTS || [];

  function getDetailPage(slug) {
    if (window.getProjectBySlug) {
      const project = window.getProjectBySlug(slug);
      if (project && project.detailPage) return project.detailPage;
    }
    const supplemental = window.PROJECT_DETAIL_CONTENT[slug];
    if (supplemental && supplemental.detailPage) return supplemental.detailPage;
    return null;
  }

  function applyPosterHero(slug, name) {
    const detailPage = getDetailPage(slug);
    if (!detailPage) return;
    const posterSrc = `assets/project-media/${slug}/poster.jpg`;

    detailPage.heroMode = "poster";
    detailPage.heroImage = posterSrc;
    detailPage.heroAlt = `${name} 项目海报`;
    detailPage.heroCaption = `${name} 项目海报`;

    detailPage.gallery = detailPage.gallery || [];
    if (!detailPage.gallery.some((item) => item.src === posterSrc)) {
      detailPage.gallery.unshift({
        src: posterSrc,
        alt: `${name} 项目海报`,
        caption: `${name} 项目海报`
      });
    }
  }

  function setVisualFrames(slug, frames) {
    const detailPage = getDetailPage(slug);
    if (!detailPage) return;
    const posterSrc = `assets/project-media/${slug}/poster.jpg`;
    const normalized = (frames || []).map((frame, index) =>
      index === 0 ? { ...frame, src: posterSrc } : frame
    );
    detailPage.visualFrames = normalized;
  }

  window.PROJECT_DETAIL_CONTENT["customer-churn-guardian"] = {
    detailPage: {
      kicker: "Project Detail",
      heroMode: "poster",
      heroImage: "assets/project-media/customer-churn-guardian/poster.jpg",
      heroAlt: "客脉守望者 项目海报",
      heroCaption: "客脉守望者 项目海报",
      quickView: [
        {
          label: "这 30 小时会做什么",
          value: "从真实商业问题拆解、客户数据清洗、RFM 与多因子特征工程，到随机森林建模、Flask 后台和 ECharts 看板展示，完整做出一套客户流失预警系统。"
        },
        {
          label: "课程结束能看到什么",
          value: "可运行的客户流失预警系统、高风险客户清单、模型评估结果和项目说明文档。"
        },
        {
          label: "更适合哪类学生",
          value: "对数据科学、机器学习、商业分析和 Python 全栈表达感兴趣，希望把 AI 真正落进一个真实业务问题的学生。"
        },
        {
          label: "为什么值得学",
          value: "它不是做一个脱离场景的算法练习，而是把“客户为什么会流失、商家能怎么提前行动”做成一个能解释、能展示、也能继续迭代的系统。"
        }
      ],
      sections: [
        {
          type: "insight",
          title: "为什么客户流失预警是一个真实的 AI 商业问题",
          paragraphs: [
            "很多小型业态并不是不知道“老客户很重要”，而是不知道应该在什么时候、根据什么信号去判断一个客户正在慢慢流失。对咖啡馆这类复购驱动型生意来说，等客户真的不来了再去补救，通常已经太晚了。",
            "这个项目的价值，就在于把原本依赖经验的判断过程变成一套可计算、可解释的系统。学生不会只停留在“训练一个模型”，而是要先理解客户行为、消费节奏、互动活跃度和价值贡献之间到底是什么关系，再决定怎样把这些因素组织成真正有判断力的特征。"
          ],
          bullets: [
            "不是只看 RFM 三个基础指标，而是继续补上消费间隔、活动参与度、登录活跃度、偏好稳定性等行为维度。",
            "不是只给出一个“会不会流失”的结果，而是要求模型能说明哪些信号最值得关注。",
            "不是把机器学习停留在 notebook 里，而是把结果接进可供非技术用户使用的 Flask 可视化后台。"
          ],
          compare: {
            headers: ["对比维度", "经验式经营", "客脉守望者"],
            rows: [
              ["判断客户风险", "主要靠店主感觉和零散观察", "结合消费、互动和价值贡献等多因子做系统判断"],
              ["运营动作时机", "客户明显流失后才补救", "在流失风险上升前先识别并提前干预"],
              ["输出结果", "只有模糊印象，很难复盘", "高风险客户名单 + 特征解释 + 运营建议"]
            ]
          }
        },
        {
          type: "schedule",
          title: "5 天项目怎么推进",
          intro: "这门课不会把机器学习拆成零散知识点去讲，而是围绕同一个商业问题连续推进。学生每天都要同时回答两个问题：模型有没有更准，系统有没有更能用。",
          days: [
            {
              day: "Day 1",
              title: "商业问题拆解与数据基线整理",
              detail: "先看懂精品咖啡馆等小型业态为什么会有客户流失问题，再整理客户数据来源，完成缺失值、异常值和格式统一等清洗工作。",
              output: "明确建模目标 + 干净的基础数据集"
            },
            {
              day: "Day 2",
              title: "RFM 与多因子特征工程",
              detail: "在基础消费指标之外继续补充行为活跃度、消费偏好和互动维度，把“客户像不像要流失”做成一组真正可用的核心特征。",
              output: "完成核心特征集与相关性分析"
            },
            {
              day: "Day 3",
              title: "随机森林建模与基线评估",
              detail: "训练随机森林模型，使用准确率、召回率、F1 和 AUC 等指标评估表现，并重点看模型对高风险客户的识别能力。",
              output: "得到第一版模型与评估结果"
            },
            {
              day: "Day 4",
              title: "模型调优、解释与预测接口",
              detail: "通过参数调优和交叉验证控制过拟合，结合特征重要性解释模型为什么会这样判断，并把预测能力整理成可复用接口。",
              output: "最优模型 + 流失风险评分接口"
            },
            {
              day: "Day 5",
              title: "Flask 可视化系统与最终展示",
              detail: "把模型接入 Flask 后台和 ECharts 风险看板，完成客户风险分布、重点名单和运营建议展示，并整理项目说明文档。",
              output: "客户流失预警系统 + 项目说明文档"
            }
          ]
        },
        {
          type: "cards",
          title: "这个项目真正搭起来的，不只是一个算法",
          intro: "从项目结构上看，客脉守望者是一条从业务问题到产品交付的完整链路，而不是只停留在模型分数上。",
          cards: [
            {
              title: "商业问题定义",
              text: "先把“客户流失”变成一个清楚的业务判断问题，理解商家为什么需要在客户真正离开前做识别。"
            },
            {
              title: "特征工程",
              text: "把客户行为拆成一组真正有判别力的指标，而不是只把原始数据直接扔进模型。"
            },
            {
              title: "机器学习建模",
              text: "用随机森林完成分类预测，并结合特征重要性解释“模型为什么这样判断”。"
            },
            {
              title: "系统化展示",
              text: "把预测结果放进 Flask + ECharts 后台，让非技术用户也能直接看到风险分布、重点客户和对应建议。"
            }
          ]
        },
        {
          type: "results",
          title: "课程结束后，家长能直接看到什么",
          cards: [
            {
              title: "可运行的 Web 系统",
              text: "不是只交一份代码，而是一个能上传数据、触发预测、查看结果的客户流失预警后台。"
            },
            {
              title: "模型评估与解释结果",
              text: "家长能看到模型准确率、AUC、特征重要性等关键结果，知道这个系统不是“随便猜”的。"
            },
            {
              title: "高风险客户清单与建议",
              text: "系统能输出高风险客户名单，并配合关键特征分析，帮助理解后续运营动作为什么这样设计。"
            }
          ]
        },
        {
          type: "fit",
          title: "什么样的学生更适合这个项目",
          goodFit: [
            "对数据科学、商业分析、机器学习和 Python 项目开发都感兴趣，希望做出一个既有算法又有产品形态的学生。",
            "不满足于只做模型分数，希望同时理解“业务问题怎么定义、系统怎么落地、结果怎么展示”的学生。",
            "愿意处理表格数据、做特征选择、看评估指标，也愿意把最后成果讲清楚的学生。"
          ],
          notFit: [
            "只想做纯前端页面，不想碰数据清洗、模型训练和指标评估的学生。",
            "对商业问题没有兴趣，只想把机器学习当成一组现成公式套用的学生。",
            "不愿意同时处理“算法 + 系统展示 + 业务表达”这三层内容的学生。"
          ]
        },
        {
          type: "faq",
          title: "家长常见问题",
          items: [
            {
              q: "这个项目更偏写代码，还是更偏做数学？",
              a: "它本质上是一个数据科学项目，但不会把重点放在抽象公式推导上。学生既要理解模型逻辑，也要真的把数据处理、模型训练和 Web 展示系统做出来。"
            },
            {
              q: "为什么这里选随机森林，而不是更复杂的深度学习模型？",
              a: "因为这个项目的核心不只是“预测对不对”，还包括“能不能解释给商家听”。随机森林在这类中小规模结构化数据问题里通常足够强，同时也更容易做特征重要性分析和业务解读。"
            },
            {
              q: "最后会不会只做出一份分析报告，没有真正的系统？",
              a: "不会。项目明确包含 Flask 后台、数据上传、模型调用和 ECharts 看板，所以最终交付会是一个能演示的系统，而不是只有静态报告。"
            }
          ]
        }
      ],
      gallery: [
        {
          src: "assets/project-media/customer-churn-guardian/scene-reference.jpg",
          alt: "咖啡馆经营场景参考",
          caption: "咖啡馆经营场景参考"
        },
        {
          src: "assets/project-media/customer-churn-guardian/outcome-reference.jpg",
          alt: "客户流失预警分析界面参考",
          caption: "客户流失预警分析界面参考"
        }
      ]
    }
  };

  projects.forEach((project) => {
    applyPosterHero(project.slug, project.name);
  });
})();
