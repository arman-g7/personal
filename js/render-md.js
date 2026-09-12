/* ---------------------------------------------------------------
   Markdown plumbing shared by the blog list and the post page:
   a tiny frontmatter parser, plus (on post.html) fetching the
   file named by ?slug= and rendering it with marked.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  var POSTS_DIR = '../posts/';

  /* --- frontmatter ------------------------------------------------
     ---
     title: "Who I am"
     date: 2026-09-12
     lang: en
     ---
     Only flat key: value pairs — that is all the posts need.        */
  function parseFrontmatter(text) {
    var src = String(text).replace(/^﻿/, '');
    var meta = {};
    var match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(src);

    if (!match) return { meta: meta, body: src };

    match[1].split(/\r?\n/).forEach(function (line) {
      if (!line.trim() || line.trim().charAt(0) === '#') return;
      var sep = line.indexOf(':');
      if (sep < 1) return;
      var key = line.slice(0, sep).trim();
      var value = line.slice(sep + 1).trim();
      value = value.replace(/^"([\s\S]*)"$/, '$1').replace(/^'([\s\S]*)'$/, '$1');
      if (key) meta[key] = value;
    });

    return { meta: meta, body: src.slice(match[0].length) };
  }

  /* Slugs come from the query string, so keep them to a safe shape
     and resolve them inside the posts directory only. */
  function cleanSlug(raw) {
    return String(raw || '')
      .trim()
      .replace(/\.md$/i, '')
      .replace(/[^A-Za-z0-9._-]/g, '')
      .replace(/^\.+/, '');
  }

  function render(markdown) {
    if (typeof window.marked === 'undefined') {
      // CDN blocked or offline: show the source rather than nothing at all
      var pre = document.createElement('pre');
      pre.textContent = markdown;
      return pre.outerHTML;
    }
    return window.marked.parse(markdown);
  }

  function text(el, value) {
    el.textContent = value;
  }

  /* --- post page -------------------------------------------------- */
  function initPostPage() {
    var titleEl = document.getElementById('post-title');
    var metaEl = document.getElementById('post-date');
    var bodyEl = document.getElementById('post-body');
    if (!bodyEl) return;

    var slug = cleanSlug(new URLSearchParams(window.location.search).get('slug'));

    if (!slug) {
      text(titleEl, '');
      bodyEl.innerHTML = '<p class="notice"></p>';
      var missing = bodyEl.firstChild;
      var showMissing = function () { text(missing, window.Site.t('post.missing')); };
      showMissing();
      document.addEventListener('langchange', showMissing);
      return;
    }

    text(bodyEl, window.Site.t('post.loading'));

    fetch(POSTS_DIR + slug + '.md', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) {
          var err = new Error('HTTP ' + res.status);
          err.notFound = (res.status === 404);
          throw err;
        }
        return res.text();
      })
      .then(function (raw) {
        var post = parseFrontmatter(raw);
        var lang = (post.meta.lang === 'fa') ? 'fa' : 'en';
        var title = post.meta.title || slug;

        bodyEl.innerHTML = render(post.body);

        /* The post keeps its own language and direction regardless of
           which language the interface is set to. */
        var article = document.getElementById('post');
        if (article) {
          article.setAttribute('lang', lang);
          article.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        }

        if (titleEl) {
          text(titleEl, title);
          titleEl.setAttribute('lang', lang);
          titleEl.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        }

        var stamp = function () {
          if (!metaEl || !post.meta.date) return;
          metaEl.innerHTML = '';
          var time = document.createElement('time');
          time.setAttribute('datetime', post.meta.date);
          /* the date is written in the interface language, which may differ
             from the post's — let the browser decide its direction */
          time.setAttribute('dir', 'auto');
          time.textContent = window.Site.formatDate(post.meta.date);
          metaEl.appendChild(time);
        };
        stamp();

        var setTitle = function () {
          document.title = title + ' — ' +
            (window.Site.lang() === 'fa' ? 'آرمان پاینده' : 'Arman Payandeh');
        };
        setTitle();

        document.addEventListener('langchange', function () {
          stamp();
          setTitle();
        });
      })
      .catch(function (err) {
        var key = err && err.notFound ? 'post.notfound' : 'post.error';
        bodyEl.innerHTML = '<p class="notice"></p>';
        var node = bodyEl.firstChild;
        var show = function () { text(node, window.Site.t(key)); };
        show();
        document.addEventListener('langchange', show);
      });
  }

  window.MD = {
    parseFrontmatter: parseFrontmatter,
    cleanSlug: cleanSlug,
    render: render,
    postsDir: POSTS_DIR
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostPage);
  } else {
    initPostPage();
  }
})();
