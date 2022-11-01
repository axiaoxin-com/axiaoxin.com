(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-three-dots");
          navbarToggle.classList.toggle("bi-x-square");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      mirror: false,
      once: true,
    });
  });

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-three-dots");
    this.classList.toggle("bi-x-square");
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Initiate Pure Counter
   */
  let nowTime = new Date().getTime();
  let ageCount = select("#age-count");
  let workCount = select("#work-count");
  let domainCount = select("#domain-count");

  let birthdayTime = new Date("1990-10").getTime();
  let ageVal = Math.floor((nowTime - birthdayTime) / 31536000000);
  ageCount.setAttribute("data-purecounter-end", ageVal);

  let workTime = new Date("2014-07").getTime();
  let workVal = Math.ceil((nowTime - workTime) / 31536000000);
  workCount.setAttribute("data-purecounter-end", workVal);
  let workYears = select("#resume-work-years");
  workYears.innerHTML = workVal;

  let domainTime = new Date("2014-08-31").getTime();
  let domainVal = Math.ceil((nowTime - domainTime) / 86400000);
  domainCount.setAttribute("data-purecounter-end", domainVal);

  new PureCounter();

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * picture isotope and filter
   */
  window.addEventListener("load", () => {
    let pictureContainer = select(".picture-container");
    if (pictureContainer) {
      let pictureIsotope = new Isotope(pictureContainer, {
        itemSelector: ".picture-item",
      });

      let pictureFilters = select("#picture-filters li", true);

      on(
        "click",
        "#picture-filters li",
        function (e) {
          e.preventDefault();
          pictureFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          pictureIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          pictureIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate picture lightbox
   */
  const pictureLightbox = GLightbox({
    selector: ".picture-lightbox",
  });

  /**
   * Initiate picture lazy load
   */
  const observer = lozad(".lozad", {
    loaded: function (el) {
      if (!el.classList.contains("picture-cover")) {
        return;
      }
      let activeFilter = select(".filter-active");
      activeFilter.click();
    },
  });
  observer.observe();
})();
