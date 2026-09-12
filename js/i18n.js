/* ---------------------------------------------------------------
   Bilingual text. English lives in the HTML (so the page still
   reads with JavaScript off); this file holds the Persian
   translations plus the handful of strings the blog scripts build
   at runtime. Choice is remembered in localStorage. Default: EN.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  /* Persian versions of the static page content. Keys match the
     data-i18n attributes in the HTML. Values are HTML fragments. */
  var FA = {
    'site.name': 'آرمان پاینده',
    'nav.home': 'خانه',
    'nav.blog': 'وبلاگ',

    'home.title': 'آرمان پاینده',

    'home.bio':
      '<p class="lede">دانش‌آموز دبیرستانم، در اصفهان. حدود دو سال و نیم است که کارم مهندسی بلاک‌چین بوده — سالیدیتی، امنیت قراردادهای هوشمند، Foundry — از جمله ممیزی رقابتی در Code4rena و HackenProof، و کنارش کار فریلنس توسعهٔ وب فول‌استک با Laravel و React و Node.js، که تا مدرسه‌ام تمام نشده خرج خودم را دربیاورم.</p>' +
      '<p>الان دارم تمرکز بلندمدتم را می‌برم سمت هوش مصنوعی و یادگیری ماشین. چیزی که آخرش می‌خواهم رویش کار کنم تلاقی هوش مصنوعی، سلامت و علوم اعصاب است. فعلاً پایه‌ها را می‌سازم: پایتون، ریاضی (حساب دیفرانسیل و انتگرال، جبر خطی، احتمال)، یادگیری ماشین کلاسیک و بعد یادگیری عمیق — بیشترش خودآموز.</p>' +
      '<p>همین را روی یک کار واقعی هم دارم پیاده می‌کنم: روی بخش یادگیری ماشین و بهینه‌سازی بیزی پایان‌نامهٔ دکترای داروسازی یکی از دوستانم — بهینه‌سازی فرمولاسیون.</p>' +
      '<p>چند چیز دیگر هم در این مسیر بوده: یک مقالهٔ کنفرانسی داوری‌شده دربارهٔ راهکارهای مهاجرت به رمزنگاری پس‌کوانتومی برای حساب‌های اتریوم، و جایزه در دو نمایشگاه بین‌المللی اختراع و نوآوری — نمایشگاه بین‌المللی اختراعات دوبی و مسابقهٔ «۱ ایده ۱ جهان» در ترکیه — هر دو مرتبط با سمپاد.</p>' +
      '<p>برنامه‌ام این است که مدرکم را در دانشگاه آزاد اسلامی تمام کنم، ولی بیشترِ انرژی واقعی‌ام را بگذارم روی یادگیری خودمحور، پروژه‌های متن‌باز و خروجی پژوهشی، و بعد برای کارشناسی ارشد با بورس کامل در اروپا اقدام کنم.</p>',

    'home.timeline.label': 'مسیری که آمده‌ام',

    'tl.1.when': 'اوایل',
    'tl.1.what': 'حدود کلاس هفتم برنامه‌نویسی را شروع کردم و دو سالی حوزه‌های خیلی مختلف نرم‌افزار را امتحان کردم تا یکی‌شان بگیرد.',

    'tl.2.when': 'حدود ۲٫۵ سال — بلاک‌چین',
    'tl.2.what': 'سالیدیتی، امنیت قراردادهای هوشمند، مسابقه‌های ممیزی در Code4rena و HackenProof، و چند پروژهٔ شخصی قرارداد هوشمند روی گیت‌هاب.',

    'tl.3.when': 'در جریان — وب فریلنس',
    'tl.3.what': 'کار فول‌استک برای کارفرماهای مختلف با Laravel و Livewire و React و Node.js. هنوز ادامه دارد، کنار بقیهٔ چیزها.',

    'tl.4.when': 'پژوهش',
    'tl.4.what': 'یک مقالهٔ کنفرانسی دربارهٔ مهاجرت به رمزنگاری پس‌کوانتومی برای حساب‌های EVM، به‌عنوان پژوهشگر مستقل.',

    'tl.5.when': 'الان',
    'tl.5.what': 'چرخش تمرکز به هوش مصنوعی و یادگیری ماشین — پایتون، پایه‌های ریاضی، علم داده، یادگیری عمیق — و پیاده‌کردنش روی یک پروژهٔ واقعی: یادگیری ماشین و بهینه‌سازی بیزی برای پایان‌نامهٔ دکترای داروسازی یکی از دوستانم، روی فرمولاسیون دارویی.',

    'tl.6.when': 'بعد',
    'tl.6.what': 'ساختن یک کارنامهٔ متن‌باز در هوش مصنوعی، همکاری پژوهشی، و در نهایت یک کارشناسی ارشد با بورس کامل در اروپا با تمرکز روی هوش مصنوعی در سلامت و علوم اعصاب.',

    'home.links.label': 'جاهای دیگر',

    'footer.built': 'همین چند تا فایل HTML و CSS و یک‌کم جاوااسکریپت. <a href="https://github.com/arman-g7/personal">سورسش اینجاست</a>.',

    'blog.title': 'وبلاگ — آرمان پاینده',
    'blog.heading': 'وبلاگ',
    'blog.intro': 'یادداشت‌های پراکنده. بیشتر می‌نویسم که بعداً برگردم و ببینم واقعاً چه کردم.',

    'post.title': 'آرمان پاینده',
    'post.back': '← برگشت به وبلاگ'
  };

  /* Strings the blog scripts need in both languages. */
  var UI = {
    en: {
      'posts.empty': 'No posts yet.',
      'posts.error': 'Couldn’t load the post list.',
      'post.loading': 'Loading…',
      'post.error': 'Couldn’t load this post.',
      'post.missing': 'No post was specified.',
      'post.notfound': 'That post doesn’t exist.',
      'post.in': 'in English',
      'post.in.fa': 'in Persian',
      'toggle.other': 'فارسی',
      'toggle.label': 'Switch to Persian',
      'theme.toDark': 'Dark',
      'theme.toLight': 'Light',
      'theme.toDark.label': 'Switch to the dark theme',
      'theme.toLight.label': 'Switch to the light theme'
    },
    fa: {
      'posts.empty': 'هنوز چیزی ننوشته‌ام.',
      'posts.error': 'فهرست نوشته‌ها بار نشد.',
      'post.loading': 'دارد بار می‌شود…',
      'post.error': 'این نوشته بار نشد.',
      'post.missing': 'نوشته‌ای مشخص نشده.',
      'post.notfound': 'چنین نوشته‌ای وجود ندارد.',
      'post.in': 'به انگلیسی',
      'post.in.fa': 'به فارسی',
      'toggle.other': 'English',
      'toggle.label': 'Switch to English',
      'theme.toDark': 'تیره',
      'theme.toLight': 'روشن',
      'theme.toDark.label': 'تغییر به پوستهٔ تیره',
      'theme.toLight.label': 'تغییر به پوستهٔ روشن'
    }
  };

  var current = DEFAULT_LANG;

  function stored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return (v === 'en' || v === 'fa') ? v : null;
    } catch (e) {
      return null; // private mode, blocked storage — just use the default
    }
  }

  function remember(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* not important enough to care about */ }
  }

  function t(key) {
    var table = UI[current] || UI.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : key;
  }

  /* Format an ISO date (YYYY-MM-DD) for the active language.
     Persian gets the Persian calendar via Intl, when available. */
  function formatDate(iso) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '').trim());
    if (!parts) return String(iso || '');
    var d = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    if (isNaN(d.getTime())) return String(iso);
    try {
      var locale = current === 'fa' ? 'fa-IR' : 'en-GB';
      return d.toLocaleDateString(locale, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return parts[0];
    }
  }

  function apply(lang) {
    current = (lang === 'fa') ? 'fa' : 'en';
    var root = document.documentElement;
    root.lang = current;
    root.dir = current === 'fa' ? 'rtl' : 'ltr';

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      if (el.getAttribute('data-i18n-en') === null) {
        el.setAttribute('data-i18n-en', '');       // marker only
        el._en = el.innerHTML;                      // keep the English original
      }
      var fa = Object.prototype.hasOwnProperty.call(FA, key) ? FA[key] : null;
      el.innerHTML = (current === 'fa' && fa !== null) ? fa : el._en;
    }

    // document title
    var titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) {
      if (!document.body._enTitle) document.body._enTitle = document.title;
      var faTitle = Object.prototype.hasOwnProperty.call(FA, titleKey) ? FA[titleKey] : null;
      document.title = (current === 'fa' && faTitle) ? faTitle : document.body._enTitle;
    }

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = t('toggle.other');
      btn.setAttribute('aria-label', t('toggle.label'));
      btn.setAttribute('data-shows', current === 'fa' ? 'en' : 'fa');
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  function setLang(lang) {
    remember(lang);
    apply(lang);
  }

  window.Site = {
    lang: function () { return current; },
    setLang: setLang,
    t: t,
    formatDate: formatDate
  };

  function init() {
    apply(stored() || DEFAULT_LANG);
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setLang(current === 'fa' ? 'en' : 'fa');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
