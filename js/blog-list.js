/* ---------------------------------------------------------------
   Builds the post list on /blog/ from posts/manifest.json.
   The manifest is just a list of filenames — adding a post means
   dropping the .md file in /posts/ and adding one line there.
   Titles and dates are read from each file's frontmatter.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  var MANIFEST = '../posts/manifest.json';
  var posts = [];

  function slugOf(filename) {
    return String(filename).replace(/^.*\//, '').replace(/\.md$/i, '');
  }

  /* Accepts ["001-a.md", ...] or [{ "file": "001-a.md" }, ...] */
  function filenames(manifest) {
    var list = Array.isArray(manifest) ? manifest
      : (manifest && Array.isArray(manifest.posts) ? manifest.posts : []);
    return list.map(function (entry) {
      if (typeof entry === 'string') return entry;
      return entry && (entry.file || entry.filename || entry.slug) || '';
    }).filter(Boolean);
  }

  function load(filename) {
    var slug = window.MD.cleanSlug(slugOf(filename));
    return fetch(window.MD.postsDir + slug + '.md', { cache: 'no-cache' })
      .then(function (res) { return res.ok ? res.text() : null; })
      .then(function (raw) {
        if (raw === null) return null;
        var meta = window.MD.parseFrontmatter(raw).meta;
        return {
          slug: slug,
          title: meta.title || slug,
          date: meta.date || '',
          lang: meta.lang === 'fa' ? 'fa' : 'en'
        };
      })
      .catch(function () { return null; });
  }

  function notice(container, key) {
    container.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'notice';
    p.textContent = window.Site.t(key);
    container.appendChild(p);
  }

  function draw(container) {
    if (!posts.length) {
      notice(container, 'posts.empty');
      return;
    }

    var uiLang = window.Site.lang();
    var list = document.createElement('ul');
    list.className = 'post-list';

    posts.forEach(function (post) {
      var li = document.createElement('li');

      var link = document.createElement('a');
      link.className = 'post-title';
      link.href = 'post.html?slug=' + encodeURIComponent(post.slug);
      link.textContent = post.title;
      link.setAttribute('lang', post.lang);
      link.setAttribute('dir', post.lang === 'fa' ? 'rtl' : 'ltr');
      li.appendChild(link);

      var meta = document.createElement('span');
      meta.className = 'post-meta';

      if (post.date) {
        var time = document.createElement('time');
        time.setAttribute('datetime', post.date);
        time.setAttribute('dir', 'auto');
        time.textContent = window.Site.formatDate(post.date);
        meta.appendChild(time);
      }

      /* Only worth saying when the post isn't in the language
         the reader picked. */
      if (post.lang !== uiLang) {
        var tag = document.createElement('span');
        tag.className = 'in-lang';
        tag.textContent = window.Site.t(post.lang === 'fa' ? 'post.in.fa' : 'post.in');
        meta.appendChild(tag);
      }

      if (meta.childNodes.length) li.appendChild(meta);
      list.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(list);
  }

  function init() {
    var container = document.getElementById('post-list');
    if (!container) return;

    fetch(MANIFEST, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (manifest) {
        return Promise.all(filenames(manifest).map(load));
      })
      .then(function (loaded) {
        posts = loaded.filter(Boolean).sort(function (a, b) {
          if (a.date === b.date) return a.slug < b.slug ? 1 : -1;
          return a.date < b.date ? 1 : -1;          // newest first
        });
        draw(container);
        document.addEventListener('langchange', function () { draw(container); });
      })
      .catch(function () {
        notice(container, 'posts.error');
        document.addEventListener('langchange', function () {
          notice(container, 'posts.error');
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
