---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!-- CV PDF withdrawn 2026-10-31: [Download full CV (PDF)]({{ "/files/lmy_cv.pdf" | relative_url }}){: .btn .btn--primary} -->

<!-- <object data="{{ "/files/lmy_cv.pdf" | relative_url }}" type="application/pdf" width="100%" height="1000px">
  <p>Your browser does not support embedded PDFs. You can <a href="{{ "/files/lmy_cv.pdf" | relative_url }}">download the CV (PDF)</a>.</p>
</object> -->

Education
======
* **B.Eng. in Computer Science**, Shanghai Maritime University, 2021

Research Interests
======
* **Primary:** Knowledge Graphs, Graph Neural Networks, Graph Anomaly Detection
* **Secondary:** Large Language Models, Multi-agent Systems, Autonomous Driving

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
<!-- Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul> -->
  
<!-- Service and leadership
======
* Currently signed in to 43 different slack teams -->
