/* Publication detail — dark design (ported from Claude Design PublicationDetail.dc.html).
   Each page sets window.PUB_ID; this renders #app with that paper. */
(function(){
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function emph(str){
  const tokens=["Mingyu Luo","Luo, Mingyu","Luo M","Luo"]; const parts=[]; let i=0;
  while(i<str.length){ let hit=null,at=-1;
    for(const tk of tokens){ const idx=str.indexOf(tk,i); if(idx!==-1&&(at===-1||idx<at)){at=idx;hit=tk;} }
    if(at===-1){ parts.push({text:str.slice(i),isMe:false}); break; }
    if(at>i) parts.push({text:str.slice(i,at),isMe:false});
    parts.push({text:hit,isMe:true}); i=at+hit.length; }
  return parts;
}
function rich(str){
  const out=[]; const re=/(\*\*([^*]+)\*\*|`([^`]+)`)/g; let m,last=0;
  while((m=re.exec(str))){
    if(m.index>last) out.push({text:str.slice(last,m.index),t:'p'});
    if(m[2]!=null) out.push({text:m[2],t:'b'}); else out.push({text:m[3],t:'c'});
    last=re.lastIndex;
  }
  if(last<str.length) out.push({text:str.slice(last),t:'p'});
  return out;
}
function richHTML(parts){
  return parts.map(s=> s.t==='b' ? `<strong style="color:var(--t1);font-weight:600;">${esc(s.text)}</strong>`
    : s.t==='c' ? `<code style="font-family:'JetBrains Mono',monospace;font-size:.86em;background:rgba(255,255,255,.06);border:1px solid var(--line);border-radius:4px;padding:1px 5px;color:var(--accent);">${esc(s.text)}</code>`
    : `<span>${esc(s.text)}</span>`).join('');
}
function vals(lang){
  const zh = lang==='zh';
  const t = zh ? {
    statusA:'在读', statusB:'寻求合作', name:'骆明宇', nameAlt:'MINGYU LUO',
    role1:'复旦大学 · 博士生', role2:'香港科技大学 · 访问学生', location:'中国 · 上海', org:'复旦大学',
    email:'电子邮件', cv:'下载简历', updated:'最近更新', navHome:'主页', navPubs:'论文',
    back:'返回论文列表', secResources:'资源链接', secCitation:'推荐引用',
  } : {
    statusA:'AVAILABLE', statusB:'OPEN TO COLLAB', name:'骆明宇', nameAlt:'MINGYU LUO',
    role1:'Ph.D. Student · Fudan University', role2:'Visiting Student · HKUST', location:'Shanghai, China', org:'Fudan University',
    email:'Email', cv:'Download CV', updated:'LAST UPDATED', navHome:'Home', navPubs:'Publications',
    back:'Back to Publications', secResources:'Resources', secCitation:'Recommended Citation',
  };
  const SECT = { abstract: zh?'摘要':'Abstract', motivation: zh?'研究动机':'Motivation', methodology: zh?'方法':'Methodology', results: zh?'主要结果':'Key Results' };
  const DB = {
    tipexploit: { venue:'Preprint', accept:false, date: zh?'2025 年 9 月':'September 2025',
      title:'Red-Teaming Coding Agents from a Tool-Invocation Perspective: An Empirical Security Assessment',
      authors:'Yuchong Xie, Mingyu Luo, Zesen Liu, et al.',
      venueFull:'arXiv preprint arXiv:2509.05755, 2025.',
      citation:'Xie Y, Luo M, Liu Z, et al. On the Security of Tool-Invocation Prompts for LLM-Based Agentic Systems: An Empirical Risk Assessment. arXiv preprint arXiv:2509.05755, 2025.',
      links:[ {label:'arXiv', href:'https://arxiv.org/abs/2509.05755'}, {label:'PDF', href:'https://arxiv.org/pdf/2509.05755'}, {label:'Artifact', href:'https://anonymous.4open.science/r/oakland_2026-C1E0'} ],
      bibtex:'@article{xie2025toolinvocation,\n  title   = {On the Security of Tool-Invocation Prompts for LLM-Based\n             Agentic Systems: An Empirical Risk Assessment},\n  author  = {Xie, Yuchong and Luo, Mingyu and Liu, Zesen and others},\n  journal = {arXiv preprint arXiv:2509.05755},\n  year    = {2025}\n}',
      body:[
        { hk:'abstract', p:'Coding agents powered by large language models are becoming central modules of modern IDEs, helping users perform complex tasks by invoking tools — but this tool-invocation operation opens a substantial attack surface. This paper conducts the first systematic, in-depth red-teaming from a tool-invocation perspective on six popular real-world coding agents: **Cursor, Claude Code, Copilot, Windsurf, Cline, and Trae**. It proceeds in two phases: (1) reconnaissance via a new vulnerability called **ToolLeak**, which exfiltrates system prompts through benign argument retrieval; and (2) exploitation via a novel **two-channel prompt injection** that hijacks tool-invocation to achieve Remote Code Execution (RCE).' },
        { hk:'motivation', ul:[
          '**Growing attack surface:** coding agents like Cursor and Copilot ship high-privilege built-in tools (terminal access, file manipulation).',
          '**No systematic assessment:** prior work targets general LLM agents, not the specific risks of *tool-invocation* in coding agents.',
          '**Fragile tool mechanisms:** manipulating tool descriptions and returns can trick the model into revealing internal instructions or executing malicious commands.',
        ]},
        { hk:'methodology', ul:[
          '**Phase 1 — Prompt exfiltration (ToolLeak):** register a malicious tool that requests sensitive internal context (e.g. the system prompt) as a *required* argument, inducing the model to spill internal instructions into the argument field during a benign invocation — bypassing standard refusal guardrails.',
          '**Phase 2 — Tool-invocation hijacking (two-channel injection):** the *tool-description channel* lures the agent into selecting the malicious tool, then the *tool-return channel* delivers high-salience procedural instructions the agent executes, reaching RCE through its built-in terminal (e.g. `curl | bash`).',
        ]},
        { fig:{ src:'https://my.drluo.cn/images/pub/tip/fig1.png', caption:'Figure 1 — Traditional prompt exfiltration (left) vs. the proposed ToolLeak attack (right).' } },
        { fig:{ src:'https://my.drluo.cn/images/pub/tip/fig2.png', caption:'Figure 2 — Tool-invocation hijacking via two-channel prompt injection.' } },
        { hk:'results', ul:[
          '**Widespread prompt leakage:** ToolLeak fully exfiltrated system prompts in **19 of 25** agent–LLM pairs, bypassing models such as Claude-Sonnet-4/4.5 and Grok-4.',
          '**Universal RCE:** two-channel hijacking achieved Remote Code Execution on **all six** evaluated agents, outperforming baseline indirect prompt injection.',
          '**Incomplete-display flaw:** in Cursor and Windsurf, tagged malicious text is hidden from the user yet processed by the model, enabling stealthy attacks.',
          '**Case studies:** detailed exploits on Cursor (GPT-5) and Claude Code (Claude-Sonnet-4.5) show even strongly-aligned or guard-modeled agents can be compromised.',
        ]},
      ],
    },
    revprag: { venue:'EMNLP 2025', accept:true, date: zh?'2025 年 10 月':'October 2025',
      title:'RevPRAG: Revealing Poisoning Attacks in Retrieval-Augmented Generation through LLM Activation Analysis',
      authors:'Xue Tan, Hao Luan, Mingyu Luo, Xiaoyan Sun, Ping Chen, Jun Dai',
      venueFull:'Findings of the Association for Computational Linguistics: EMNLP 2025, pages 12999–13011, Suzhou, China.',
      citation:'Xue Tan, Hao Luan, Mingyu Luo, Xiaoyan Sun, Ping Chen, and Jun Dai. 2025. RevPRAG: Revealing Poisoning Attacks in Retrieval-Augmented Generation through LLM Activation Analysis. In Findings of the Association for Computational Linguistics: EMNLP 2025, pages 12999–13011, Suzhou, China.',
      links:[ {label:'PDF', href:'https://aclanthology.org/2025.findings-emnlp.698.pdf'}, {label:'ACL Anthology', href:'https://aclanthology.org/2025.findings-emnlp.698/'}, {label:'arXiv (v1)', href:'https://arxiv.org/abs/2411.18948'} ],
      bibtex:'@inproceedings{tan2025revprag,\n  title     = {RevPRAG: Revealing Poisoning Attacks in Retrieval-Augmented\n               Generation through LLM Activation Analysis},\n  author    = {Tan, Xue and Luan, Hao and Luo, Mingyu and Sun, Xiaoyan\n               and Chen, Ping and Dai, Jun},\n  booktitle = {Findings of the Association for Computational Linguistics: EMNLP 2025},\n  pages     = {12999--13011},\n  address   = {Suzhou, China},\n  year      = {2025}\n}',
      body:[
        { hk:'abstract', p:'Retrieval-Augmented Generation (RAG) enhances LLMs with external knowledge, but this openness introduces a new attack surface: knowledge-database poisoning. We propose **RevPRAG**, a flexible, automated pipeline that detects RAG poisoning by leveraging the intrinsic activation patterns of LLMs. Across various architectures and datasets it achieves a **98% True Positive Rate** while keeping the **False Positive Rate near 1%**, significantly outperforming existing baselines in both accuracy and efficiency.' },
        { hk:'motivation', ul:[
          '**RAG is exploitable:** retrieved content can be *poisoned* to hijack outputs (e.g. forcing “Fuji” for “the highest mountain?”).',
          '**Costly defenses:** methods like RobustRAG and InstructRAG need extra large models for voting / denoising — high overhead and latency.',
          '**Key insight:** LLMs show distinct internal activation patterns for poisoned vs. correct responses, so internal states can flag manipulation without changing the RAG workflow.',
        ]},
        { fig:{ src:'https://my.drluo.cn/images/pub/revprag/fig2.png', caption:'Figure 1 — t-SNE of activations: correct vs. poisoned responses form distinct clusters.' } },
        { hk:'methodology', ul:[
          '**Poisoning data collection:** simulate state-of-the-art attacks (PoisonedRAG, GARAG) to build paired poisoned / clean generation scenarios.',
          '**Activation collection:** extract last-token activations across all layers, then normalize them as a summary of the model’s decision process.',
          '**Detection model:** a lightweight ResNet-18 CNN probe trained with a triplet-network objective separates poisoned from clean responses, robust even with limited data.',
        ]},
        { fig:{ src:'https://my.drluo.cn/images/pub/revprag/fig3.png', caption:'Figure 2 — The RevPRAG detection pipeline.' } },
        { hk:'results', ul:[
          '**>98% TPR** across Natural Questions, HotpotQA and MS-MARCO on Llama2, Mistral and GPT2-XL.',
          '**~1% FPR** — correct responses are rarely mis-flagged.',
          '**Robust** to retrievers (Contriever, DPR, ANCE) and to natural noise such as typos and grammatical errors.',
          '**Efficient:** far lower training / inference cost than baselines like LLM Factoscope, suitable for real-time use.',
        ]},
      ],
    },
    queryipi: { venue:'Preprint', accept:false, date: zh?'2025 年 10 月':'October 2025',
      title:'QueryIPI: Query-agnostic Indirect Prompt Injection on Coding Agents',
      authors:'Yuchong Xie, Zesen Liu, Mingyu Luo, Zhixiang Zhang, Kaikai Zhang, Zongjie Li, Ping Chen, Shuai Wang, Dongdong She',
      venueFull:'arXiv preprint arXiv:2510.23675, 2025.',
      citation:'Yuchong Xie, Zesen Liu, Mingyu Luo, Zhixiang Zhang, Kaikai Zhang, Zongjie Li, Ping Chen, Shuai Wang, Dongdong She. (2025). "QueryIPI: Query-agnostic Indirect Prompt Injection on Coding Agents." arXiv preprint arXiv:2510.23675.',
      links:[ {label:'arXiv', href:'https://arxiv.org/abs/2510.23675'}, {label:'PDF', href:'https://arxiv.org/pdf/2510.23675'} ],
      bibtex:'@article{xie2025queryipi,\n  title   = {QueryIPI: Query-agnostic Indirect Prompt Injection on Coding Agents},\n  author  = {Xie, Yuchong and Liu, Zesen and Luo, Mingyu and Zhang, Zhixiang\n             and Zhang, Kaikai and Li, Zongjie and Chen, Ping and Wang, Shuai\n             and She, Dongdong},\n  journal = {arXiv preprint arXiv:2510.23675},\n  year    = {2025}\n}',
      body:[
        { hk:'abstract', p:'Coding agents in modern IDEs orchestrate powerful tools and system-level actions, creating a high-stakes attack surface. Prior Indirect Prompt Injection (IPI) work is mainly *query-specific*, making attacks unstable and dependent on user input. **QueryIPI** is the first query-agnostic IPI method for realistic coding agents: it leverages the agent’s internal prompt to turn the attack into a constrained white-box optimization problem, refining malicious tool descriptions to reliably trigger regardless of user queries. It reaches an average success rate of up to **87%** and transfers to real-world agents.' },
        { hk:'motivation', ul:[
          '**Unstable existing attacks:** current IPI is largely *query-specific* — it only fires if the user’s query happens to trigger the malicious content.',
          '**The query-agnostic threat:** an attack that triggers regardless of the request is far more dangerous, but the payload must out-compete the real query and system prompt for attention.',
          '**Leverage internal prompts:** access to the agent’s leaked internal prompt turns a black-box guessing game into a white-box optimization task.',
        ]},
        { fig:{ src:'https://my.drluo.cn/images/pub/queryipi/fig1.png', caption:'Figure 1 — Query-specific (left) vs. query-agnostic (right) indirect prompt injection; QueryIPI triggers deterministically regardless of user input.' } },
        { hk:'methodology', ul:[
          '**Internal-prompt-aware optimization:** a leaked internal prompt seeds a tool description that mimics the agent’s native toolset; a Mutation LLM reflects on failures to learn which guardrails fired and how to bypass them.',
          '**Iterative search:** a genetic-style loop mutates and evaluates tool-description variants against diverse queries, scored 0–100 by a calibrated Judge LLM to guide optimization.',
        ]},
        { hk:'results', ul:[
          '**87% average ASR** across five simulated agents (Cursor, Windsurf, Cline, Copilot, Trae) with just 8 samples — vs. 50% baseline.',
          '**Real-world transfer:** 50% ASR on real agents vs. 2% for the baseline.',
          '**Robust to partial knowledge:** 71% ASR using only publicly available partial prompts.',
          '**Stealthy:** generated descriptions evade perplexity-based filters, scoring like benign tools.',
        ]},
      ],
    },
    mscdn: { venue:'Int. J. Intelligent Networks', accept:true, date: zh?'2023 年 12 月':'December 2023',
      title:'Multi-sensor based strategy learning with deep reinforcement learning for unmanned ground vehicle',
      authors:'Mingyu Luo',
      venueFull:'International Journal of Intelligent Networks 4 (2023): 325-336.',
      citation:'Luo, Mingyu. "Multi-sensor based strategy learning with deep reinforcement learning for unmanned ground vehicle." International Journal of Intelligent Networks 4 (2023): 325-336.',
      links:[ {label:'ScienceDirect', href:'https://www.sciencedirect.com/science/article/pii/S2666603023000313'} ],
      bibtex:'@article{luo2023multisensor,\n  title   = {Multi-sensor based strategy learning with deep reinforcement\n             learning for unmanned ground vehicle},\n  author  = {Luo, Mingyu},\n  journal = {International Journal of Intelligent Networks},\n  volume  = {4},\n  pages   = {325--336},\n  year    = {2023}\n}',
      body:[],
    },
  };
  return { t, SECT, DB };
}
function blocksHTML(body, SECT){
  return body.map(seg=>{
    let h='';
    if(seg.hk) h+=`<div style="display:flex;align-items:center;gap:16px;margin:30px 0 16px;"><h3 style="margin:0;font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);">${esc(SECT[seg.hk])}</h3><div style="flex:1;height:1px;background:var(--line);"></div></div>`;
    if(seg.p) h+=`<p style="margin:0 0 14px;font-size:15.5px;line-height:1.78;color:var(--t1);">${richHTML(rich(seg.p))}</p>`;
    if(seg.ul) h+=`<div style="display:flex;flex-direction:column;gap:12px;margin:2px 0 18px;">`+
      seg.ul.map(s=>`<div style="display:grid;grid-template-columns:18px 1fr;gap:11px;font-size:14.5px;line-height:1.68;color:var(--t2);"><span style="color:var(--accent);padding-top:2px;font-family:'JetBrains Mono',monospace;font-size:12px;">▹</span><div>${richHTML(rich(s))}</div></div>`).join('')+`</div>`;
    if(seg.fig) h+=`<figure style="margin:10px 0 22px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#0B0C0E;"><img src="${seg.fig.src}" alt="${esc(seg.fig.caption)}" loading="lazy" style="display:block;width:100%;height:auto;"/><figcaption style="padding:11px 16px;font-size:12.5px;color:var(--t3);border-top:1px solid var(--line);line-height:1.5;font-style:italic;">${esc(seg.fig.caption)}</figcaption></figure>`;
    return h;
  }).join('');
}
function sidebar(t){
  return `<aside id="pg-aside" style="position:fixed;top:0;left:0;width:300px;height:100vh;z-index:3;border-right:1px solid var(--line);background:rgba(8,9,10,.72);backdrop-filter:blur(8px);padding:30px 28px;display:flex;flex-direction:column;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) both;overflow-y:auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;"><span style="width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent);"></span><span style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.22em;color:var(--t2);text-transform:uppercase;line-height:1.55;">${esc(t.statusA)}<br/>${esc(t.statusB)}</span></div>
    <div style="position:relative;width:84px;height:84px;margin-bottom:16px;"><div style="position:absolute;inset:-1px;border-radius:15px;background:linear-gradient(150deg,var(--accent),transparent 55%);opacity:.5;"></div><img src="https://my.drluo.cn/images/profile.jpeg" alt="Mingyu LUO" style="position:relative;width:84px;height:84px;border-radius:14px;object-fit:cover;border:1px solid var(--line);filter:grayscale(.15) contrast(1.02);"/></div>
    <h1 style="margin:0;font-size:27px;font-weight:600;letter-spacing:.02em;line-height:1.1;">${esc(t.name)}</h1>
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent);margin-top:5px;letter-spacing:.14em;">${esc(t.nameAlt)}</div>
    <div style="margin:13px 0 0;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--t1);"><span style="width:14px;height:1px;background:var(--accent);flex:none;"></span>${esc(t.role1)}</div>
      <div style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--t2);"><span style="width:14px;height:1px;background:var(--t3);flex:none;"></span>${esc(t.role2)}</div>
    </div>
    <div style="height:1px;background:var(--line);margin:18px 0 16px;"></div>
    <div style="display:flex;flex-direction:column;gap:11px;font-size:13px;">
      <div style="display:flex;align-items:center;gap:12px;color:var(--t2);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--t3);flex:none;"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><span>${esc(t.location)}</span></div>
      <div style="display:flex;align-items:center;gap:12px;color:var(--t2);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--t3);flex:none;"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></svg><span>${esc(t.org)}</span></div>
      <a class="lnk" href="mailto:fudan@drluo.cn" style="display:flex;align-items:center;gap:12px;color:var(--t2);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--t3);flex:none;"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span>${esc(t.email)}</span></a>
      <a class="lnk" href="https://scholar.google.com/citations?user=KU8R00YAAAAJ" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;color:var(--t2);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--t3);flex:none;"><path d="M12 3 2 8.5 12 14l10-5.5L12 3z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg><span>Google Scholar</span></a>
      <a class="lnk" href="https://github.com/kuangren777" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;color:var(--t2);"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="color:var(--t3);flex:none;"><path d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6 0-.6 0-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.6-1.4-2.3-.3-4.7-1.1-4.7-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5z"/></svg><span>GitHub @kuangren777</span></a>
    </div>
    <div class="pg-spacer" style="flex:1;min-height:24px;"></div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--t3);letter-spacing:.05em;line-height:1.7;margin-top:18px;">© 2026 MINGYU&nbsp;LUO<br/>${esc(t.updated)} · 2026-06-28</div>
  </aside>`;
}
let lang = (navigator.language||'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
let copied = false;
function currentId(V){
  let id = window.PUB_ID || (location.hash||'').replace('#','');
  return (id && V.DB[id]) ? id : 'tipexploit';
}
function render(){
  const V = vals(lang), t = V.t, zh = lang==='zh', on='#08090A';
  const raw = V.DB[currentId(V)];
  const pub = { venue:raw.venue, accent:raw.accept, date:raw.date, title:raw.title, venueFull:raw.venueFull,
    citation:raw.citation, bibtex:raw.bibtex, links:raw.links, authors:emph(raw.authors) };
  const enBg=zh?'transparent':'var(--accent)',enColor=zh?'var(--t2)':on,zhBg=zh?'var(--accent)':'transparent',zhColor=zh?on:'var(--t2)';
  const venueTag = pub.accent
    ? `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.05em;color:var(--accent);background:var(--soft);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);padding:4px 11px;border-radius:6px;">${esc(pub.venue)}</span>`
    : `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.05em;color:var(--t2);border:1px solid var(--line);padding:4px 11px;border-radius:6px;">${esc(pub.venue)}</span>`;
  const authors = pub.authors.map(a=> a.isMe?`<strong style="color:var(--t1);font-weight:600;">${esc(a.text)}</strong>`:`<span>${esc(a.text)}</span>`).join('');
  const body = blocksHTML(raw.body, V.SECT);
  const resources = pub.links.map(ln=>`<a class="reslink" href="${ln.href}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:9px;padding:11px 18px;border:1px solid var(--line);border-radius:10px;color:var(--t1);font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.05em;background:rgba(255,255,255,.015);">${esc(ln.label)}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`).join('');
  const copyLabel = copied ? (zh?'已复制':'Copied') : (zh?'复制':'Copy');
  const copyColor = copied ? 'var(--accent)' : 'var(--t2)';
  const copyBorder = copied ? 'var(--accent)' : 'var(--line)';

  return `
<div style="position:relative;min-height:100vh;background:var(--bg);overflow-x:hidden;">
  <div style="position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(900px 520px at 22% -8%, color-mix(in srgb,var(--accent) 9%,transparent), transparent 70%);"></div>
  <div style="position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5;background-image:linear-gradient(var(--line2) 1px,transparent 1px),linear-gradient(90deg,var(--line2) 1px,transparent 1px);background-size:64px 64px;-webkit-mask-image:radial-gradient(circle at 30% 0%, #000, transparent 75%);"></div>
  ${sidebar(t)}
  <main id="pg-main" style="position:relative;z-index:2;margin-left:300px;min-height:100vh;">
    <div id="pg-topbar" style="position:sticky;top:0;z-index:4;padding:13px 0;border-bottom:1px solid var(--line);background:rgba(8,9,10,.7);backdrop-filter:blur(10px);">
      <div style="max-width:800px;margin:0 auto;padding:0 44px;display:flex;align-items:center;justify-content:space-between;">
        <nav style="display:flex;align-items:center;gap:28px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.06em;">
          <a class="navlnk" href="/" style="color:var(--t2);">${esc(t.navHome)}</a>
          <a href="/publications/" style="color:var(--accent);display:flex;align-items:center;gap:7px;"><span style="width:5px;height:5px;background:var(--accent);border-radius:50%;"></span>${esc(t.navPubs)}</a>
        </nav>
        <div style="display:flex;align-items:center;gap:13px;">
          <a class="cvbtn" href="https://my.drluo.cn/files/lmy_cv.pdf" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:7px;padding:7px 13px;border:1px solid var(--accent);border-radius:8px;color:var(--accent);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>${esc(t.cv)}</a>
          <button id="langToggle" style="display:flex;align-items:center;border:1px solid var(--line);border-radius:9px;overflow:hidden;background:transparent;cursor:pointer;padding:0;font-family:'JetBrains Mono',monospace;"><span style="padding:7px 12px;font-size:11px;letter-spacing:.1em;background:${enBg};color:${enColor};">EN</span><span style="padding:7px 12px;font-size:11px;letter-spacing:.05em;background:${zhBg};color:${zhColor};font-family:'Noto Sans SC',sans-serif;">中</span></button>
        </div>
      </div>
    </div>

    <div id="pg-content" style="padding:0 44px 80px;max-width:800px;margin:0 auto;">
      <section id="pg-hero" style="padding:40px 0 0;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) .05s both;">
        <a class="backlnk" href="/publications/" style="display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.08em;color:var(--t2);text-transform:uppercase;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>${esc(t.back)}</a>
        <div style="display:flex;align-items:center;gap:10px;margin:26px 0 18px;flex-wrap:wrap;">${venueTag}<span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3);letter-spacing:.04em;">${esc(pub.date)}</span></div>
        <h1 style="margin:0;font-size:33px;line-height:1.2;font-weight:600;letter-spacing:-.02em;color:var(--t1);">${esc(pub.title)}</h1>
        <div style="font-size:15px;color:var(--t2);margin-top:18px;line-height:1.6;">${authors}</div>
        <div style="font-size:13.5px;color:var(--t3);margin-top:10px;line-height:1.5;font-style:italic;">${esc(pub.venueFull)}</div>
      </section>
      <section style="padding:14px 0 0;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) .1s both;">${body}</section>
      <section style="padding:30px 0 0;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) .14s both;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;"><h3 style="margin:0;font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--t2);">${esc(t.secResources)}</h3><div style="flex:1;height:1px;background:var(--line);"></div></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">${resources}</div>
      </section>
      <section style="padding:30px 0 0;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) .18s both;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;"><h3 style="margin:0;font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--t2);">${esc(t.secCitation)}</h3><div style="flex:1;height:1px;background:var(--line);"></div></div>
        <div style="border:1px solid var(--line);border-left:2px solid var(--accent);border-radius:10px;padding:20px 22px;background:rgba(255,255,255,.015);font-size:14.5px;line-height:1.7;color:var(--t1);">${esc(pub.citation)}</div>
      </section>
      <section style="padding:30px 0 0;animation:fadeUp .7s cubic-bezier(.2,.7,.2,1) .22s both;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;"><h3 style="margin:0;font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--t2);">BibTeX</h3><div style="flex:1;height:1px;background:var(--line);"></div><button id="copyBtn" class="copybtn" style="display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border:1px solid ${copyBorder};border-radius:8px;background:transparent;cursor:pointer;color:${copyColor};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>${copyLabel}</button></div>
        <pre style="margin:0;border:1px solid var(--line);border-radius:10px;padding:20px 22px;background:#0B0C0E;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.7;color:var(--t2);white-space:pre;">${esc(pub.bibtex)}</pre>
      </section>
    </div>
  </main>
</div>`;
}
function mount(){
  const V = vals(lang); const raw = V.DB[currentId(V)];
  document.title = raw.title + ' · Mingyu LUO';
  document.getElementById('app').innerHTML = render();
  document.getElementById('langToggle').onclick = ()=>{ lang = lang==='zh'?'en':'zh'; copied=false; mount(); };
  const cb = document.getElementById('copyBtn');
  if(cb) cb.onclick = ()=>{ try{ navigator.clipboard.writeText(raw.bibtex); }catch(e){} copied=true; mount(); setTimeout(()=>{copied=false;mount();},1600); };
}
mount();
})();
