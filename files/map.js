/* Research map: data and three views (flow, regions, trajectory). Plain D3; no build step. */
(function () {
  var TOPICS = [
    { id: 'ai',   name: 'AI adoption and use',            c: '#2a78d6', from: 2021, to: null },
    { id: 'auto', name: 'Automation and training',        c: '#eb6834', from: 2018, to: 2024 },
    { id: 'skl',  name: 'Skills demand and wages',        c: '#1baf7a', from: 2021, to: null },
    { id: 'gd',   name: 'Green and digital transition',   c: '#eda100', from: 2023, to: null },
    { id: 'reg',  name: 'Regional productivity and jobs', c: '#e87ba4', from: 2023, to: null },
    { id: 'llm',  name: 'LLMs as research instruments',   c: '#4a3aa7', from: 2023, to: null }
  ];
  var METHODS = [
    { id: 'cls', name: 'LLM classification' },
    { id: 'emb', name: 'Embeddings and classifiers' },
    { id: 'net', name: 'Network analysis' },
    { id: 'fe',  name: 'Fixed effects, long differences' },
    { id: 'ev',  name: 'Event studies' },
    { id: 'ss',  name: 'Shift-share and IV' },
    { id: 'ml',  name: 'Multilevel models' },
    { id: 'agt', name: 'LLM survey agents' }
  ];
  var DATA = [
    { id: 'ads',   name: 'Online job advertisements' },
    { id: 'pat',   name: 'Patents' },
    { id: 'wiki',  name: 'Wikipedia pages' },
    { id: 'piaac', name: 'PIAAC adult skills survey' },
    { id: 'btos',  name: 'Census BTOS firm survey' },
    { id: 'aei',   name: 'Anthropic Economic Index' },
    { id: 'lfs',   name: 'LFS and ARDECO' },
    { id: 'exp',   name: 'Expert surveys' },
    { id: 'sci',   name: 'Scientific abstracts' }
  ];
  var REGIONS = [
    { id: 'uk',   name: 'United Kingdom', cover: '110M+ Adzuna job ads; UK Lightcast; TTWA and ITL regions' },
    { id: 'eu',   name: 'European Union', cover: '200M+ job ads from Cedefop and Lightcast; 10 to 27 countries; NUTS-2 and NUTS-3 regions' },
    { id: 'us',   name: 'United States',  cover: '50 states and large metros; BTOS; 433M postings; Anthropic data' },
    { id: 'oecd', name: 'OECD countries', cover: '22 countries in PIAAC' },
    { id: 'glob', name: 'Methods', cover: 'Methods papers and expert panels' }
  ];
  // One row per paper. topics: first entry gives the paper's colour. year = current version; start = when the work began.
  var PAPERS = [
    { t: 'LLM Meets Job Advertisements: Unmasking Skill Premia in the UK', s: 'Job market paper, forthcoming RLE', year: 2026, start: 2021, topics: ['skl','ai'], m: ['cls','emb','fe'], d: ['ads'], r: ['uk'] },
    { t: 'How Regions Use Large Language Models', s: 'with A. Badort; JoEG special issue', year: 2026, start: 2025, topics: ['ai','reg'], m: ['fe','net'], d: ['aei','ads'], r: ['us'] },
    { t: 'Green and Digital Technology: Exposure, Substitution and Complementarity', s: 'with T. Ciarli and Ö. Nomaler', year: 2026, start: 2025, topics: ['gd','auto'], m: ['net','emb','agt'], d: ['pat','wiki','lfs'], r: ['eu'] },
    { t: 'Silicon Survey Agents', s: 'with T. Ciarli and Ö. Nomaler', year: 2025, start: 2023, ongoing: true, topics: ['llm','gd'], m: ['agt'], d: ['exp'], r: ['glob'] },
    { t: 'Standard Occupation Classifier', s: 'with J. Patman; arXiv', year: 2025, start: 2021, topics: ['skl'], m: ['emb'], d: ['ads'], r: ['uk','us'] },
    { t: 'Automation and Human Capital Investment', s: 'SSRN; PhD chapter 1', year: 2024, start: 2019, topics: ['auto'], m: ['ml'], d: ['piaac'], r: ['oecd'] },
    { t: 'Skill Relatedness and the Absorption of AI Across US Labor Markets', s: 'with A. Badort; in progress', year: 2026, ongoing: true, start: 2025, topics: ['ai','reg'], m: ['ev','net','fe'], d: ['btos','ads'], r: ['us'] },
    { t: 'The Twin Transition in Labour Demand', s: 'with Ciarli, Marzucchi, Rizzo, Vanegas; in progress', year: 2026, ongoing: true, start: 2025, topics: ['gd','skl'], m: ['net','fe'], d: ['ads','pat','wiki'], r: ['eu'] },
    { t: 'Recombining Capabilities: Skill Demand Portfolios and Regional Productivity', s: 'with Badort, Caldarola, Ciarli; in progress', year: 2026, ongoing: true, start: 2024, topics: ['reg','skl'], m: ['net','fe'], d: ['ads','lfs'], r: ['uk','eu'] },
    { t: 'Twin Transition Skill Demand and Regional Productivity', s: 'with Badort, Caldarola, Ciarli; in progress', year: 2026, ongoing: true, start: 2024, topics: ['gd','reg'], m: ['fe','ss'], d: ['ads','lfs'], r: ['eu'] },
    { t: 'Matching Lightcast Skills to the ESCO Framework', s: 'with Badort, Caldarola, Ciarli; in progress', year: 2026, ongoing: true, start: 2024, topics: ['skl'], m: ['emb'], d: ['ads'], r: ['uk','eu'] },
    { t: 'Green and Digital Technology: Occupational Exposure and Labour Market Effects', s: 'with T. Ciarli and Ö. Nomaler; in progress', year: 2026, ongoing: true, start: 2025, topics: ['gd','reg'], m: ['ss','net'], d: ['pat','wiki','lfs'], r: ['eu'] },
    { t: 'Using Topic Modelling to Discover New Trends in the Scientific Literature', s: 'Alan Turing Institute report', year: 2023, start: 2023, topics: ['llm'], m: ['emb','net'], d: ['sci'], r: ['glob'] }
  ];
  var tcol = {}; TOPICS.forEach(function (t) { tcol[t.id] = t.c; });
  var tip = document.getElementById('tip');
  function placeTip(ev) {
    var w = tip.offsetWidth || 300, h = tip.offsetHeight || 60;
    var x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 14;
    if (y + h > innerHeight - 8) y = ev.clientY - h - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function showTip(html, ev) { tip.innerHTML = html; tip.hidden = false; placeTip(ev); }
  function hideTip() { tip.hidden = true; }
  function paperTip(p) { return '<b>' + p.t + '</b><span>' + p.s + '</span>'; }

  // ---- strip: icon arrays
  document.querySelectorAll('.arr').forEach(function (a) {
    var n = +a.dataset.n, c = a.dataset.c, h = '';
    for (var i = 0; i < n; i++) h += '<i style="background:' + c + '"></i>';
    a.innerHTML = h;
  });

  // ---- legend and paper list
  document.getElementById('legend').innerHTML = TOPICS.map(function (t) { return '<span><i style="background:' + t.c + '"></i>' + t.name + '</span>'; }).join('');
  var list = document.getElementById('papers');
  list.innerHTML = PAPERS.map(function (p, i) {
    return '<div data-i="' + i + '"><i style="background:' + tcol[p.topics[0]] + '"></i><span>' + p.t + '</span></div>';
  }).join('');

  // ---- sankey
  var svg = d3.select('#sankey');
  function key(k, id) { return k + ':' + id; }
  var nodes = [].concat(
    TOPICS.map(function (t) { return { id: key('t', t.id), name: t.name, kind: 't', c: t.c }; }),
    METHODS.map(function (m) { return { id: key('m', m.id), name: m.name, kind: 'm' }; }),
    DATA.map(function (d) { return { id: key('d', d.id), name: d.name, kind: 'd' }; })
  );
  var links = [];
  PAPERS.forEach(function (p, i) {
    var c = tcol[p.topics[0]];
    p.topics.forEach(function (t) { p.m.forEach(function (m) { links.push({ source: key('t', t), target: key('m', m), value: 1 / p.topics.length, paper: i, c: tcol[t] }); }); });
    p.m.forEach(function (m) { p.d.forEach(function (d) { links.push({ source: key('m', m), target: key('d', d), value: 1 / p.d.length, paper: i, c: c }); }); });
  });
  function drawSankey() {
    svg.selectAll('*').remove();
    var W = svg.node().clientWidth, H = svg.node().clientHeight;
    var sk = d3.sankey().nodeId(function (d) { return d.id; }).nodeWidth(14).nodePadding(12).nodeSort(null)
      .extent([[170, 22], [W - 180, H - 6]]);
    var g = sk({ nodes: nodes.map(function (d) { return Object.assign({}, d); }), links: links.map(function (d) { return Object.assign({}, d); }) });
    var caps = [['Topics', 4, 'start'], ['Methods', W / 2, 'middle'], ['Data', W - 4, 'end']];
    svg.selectAll('.col').data(caps).enter().append('text').attr('class', 'col').attr('x', function (d) { return d[1]; }).attr('y', 12).attr('text-anchor', function (d) { return d[2]; }).text(function (d) { return d[0]; });
    var link = svg.append('g').selectAll('path').data(g.links).enter().append('path')
      .attr('class', 'link').attr('d', d3.sankeyLinkHorizontal()).attr('stroke', function (d) { return d.c; }).attr('stroke-width', function (d) { return Math.max(1.5, d.width); });
    var node = svg.append('g').selectAll('g').data(g.nodes).enter().append('g').attr('class', 'node');
    node.append('rect').attr('x', function (d) { return d.x0; }).attr('y', function (d) { return d.y0; }).attr('height', function (d) { return Math.max(2, d.y1 - d.y0); }).attr('width', function (d) { return d.x1 - d.x0; })
      .attr('rx', 2).attr('fill', function (d) { return d.c || '#8f8a83'; });
    node.append('text').attr('x', function (d) { return d.kind === 't' ? d.x0 - 7 : d.x1 + 7; }).attr('y', function (d) { return (d.y0 + d.y1) / 2; }).attr('dy', '0.35em')
      .attr('text-anchor', function (d) { return d.kind === 't' ? 'end' : 'start'; }).text(function (d) { return d.name; });
    function focus(set) {
      svg.classed('dim', true);
      link.classed('on', function (d) { return set.has(d.paper); });
      var on = new Set(); g.links.forEach(function (l) { if (set.has(l.paper)) { on.add(l.source.id); on.add(l.target.id); } });
      node.classed('on', function (d) { return on.has(d.id); });
      list.querySelectorAll('div[data-i]').forEach(function (el) { el.classList.toggle('on', set.has(+el.dataset.i)); });
    }
    function clear() { svg.classed('dim', false); link.classed('on', false); node.classed('on', false); list.querySelectorAll('div[data-i]').forEach(function (el) { el.classList.remove('on'); }); hideTip(); }
    node.on('mouseenter', function (ev, d) {
      var set = new Set(); g.links.forEach(function (l) { if (l.source.id === d.id || l.target.id === d.id) set.add(l.paper); });
      focus(set); showTip('<b>' + d.name + '</b><span>' + set.size + (set.size === 1 ? ' paper' : ' papers') + '</span>', ev);
    }).on('mousemove', placeTip).on('mouseleave', clear);
    link.on('mouseenter', function (ev, d) { focus(new Set([d.paper])); showTip(paperTip(PAPERS[d.paper]), ev); }).on('mousemove', placeTip).on('mouseleave', clear);
    list.querySelectorAll('div[data-i]').forEach(function (el) {
      el.onmouseenter = function (ev) { var i = +el.dataset.i; focus(new Set([i])); showTip(paperTip(PAPERS[i]), ev); };
      el.onmousemove = placeTip; el.onmouseleave = clear;
    });
  }
  drawSankey();

  // ---- regions
  var rg = document.getElementById('regions');
  rg.innerHTML = REGIONS.map(function (r) {
    var ps = PAPERS.filter(function (p) { return p.r.indexOf(r.id) >= 0; });
    return '<div class="region" data-r="' + r.id + '"><div class="name">' + r.name + '</div><div class="cover">' + r.cover + '</div><div class="dots">' +
      ps.map(function (p) { return '<i style="background:' + tcol[p.topics[0]] + '"></i>'; }).join('') +
      '</div><div class="cnt">' + ps.length + (ps.length === 1 ? ' paper' : ' papers') + '</div></div>';
  }).join('');
  rg.querySelectorAll('.region').forEach(function (el) {
    el.addEventListener('mouseenter', function (ev) {
      var ps = PAPERS.filter(function (p) { return p.r.indexOf(el.dataset.r) >= 0; });
      showTip('<b>' + el.querySelector('.name').textContent + '</b>' + ps.map(function (p) { return '<span>' + p.t + '</span><br>'; }).join(''), ev);
    });
    el.addEventListener('mousemove', placeTip); el.addEventListener('mouseleave', hideTip);
  });

  // ---- trajectory: one bar per topic from the year the work started; a dot marks the start, bars without an end year run to now
  function drawTraj() {
    var s = d3.select('#traj'); s.selectAll('*').remove();
    var W = s.node().clientWidth, H = s.node().clientHeight, m = { l: 16, r: 16, t: 14, b: 26 };
    var NOW = 2026.75;
    var x = d3.scaleLinear().domain([2017.6, NOW]).range([m.l, W - m.r]);
    var y = d3.scalePoint().domain(TOPICS.map(function (t) { return t.id; })).range([m.t + 12, H - m.b - 12]);
    s.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + (H - m.b) + ')')
      .call(d3.axisBottom(x).tickValues(d3.range(2018, 2027)).tickFormat(d3.format('d')).tickSize(-(H - m.b - m.t)));
    s.selectAll('.lane').data(TOPICS).enter().append('text').attr('class', 'lbl').attr('x', m.l).attr('y', function (t) { return y(t.id) - 11; }).attr('fill', '#5b5752').text(function (t) { return t.name; });
    var g = s.append('g');
    TOPICS.forEach(function (t) {
      var yy = y(t.id), x0 = x(t.from), x1 = x(t.to || NOW);
      var ps = PAPERS.filter(function (p) { return p.topics.indexOf(t.id) >= 0; });
      var html = '<b>' + t.name + '</b><span>' + t.from + (t.to ? ' to ' + t.to : ', continuing') + '</span>' + ps.map(function (p) { return '<span>' + p.t + '</span><br>'; }).join('');
      var bar = g.append('g');
      bar.append('line').attr('x1', x0).attr('x2', x1).attr('y1', yy).attr('y2', yy).attr('stroke', t.c).attr('stroke-width', 6).attr('stroke-opacity', .55).attr('stroke-linecap', 'round');
      bar.append('circle').attr('cx', x0).attr('cy', yy).attr('r', 6).attr('fill', t.c);
      bar.on('mouseenter', function (ev) { showTip(html, ev); }).on('mousemove', placeTip).on('mouseleave', hideTip);
    });
  }
  drawTraj();
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { drawSankey(); drawTraj(); }, 150); });
})();
