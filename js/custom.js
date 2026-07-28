/* global $ */

$(function () {
  "use strict";

  var savedTheme = localStorage.getItem("caretto_theme") || "rust";
  var savedMode = localStorage.getItem("caretto_mode") || "light";

  $("html").attr("data-theme", savedTheme);
  $("html").attr("data-mode", savedMode);

  $("#current-year").text(new Date().getFullYear());

  $(".swatch[data-theme='" + savedTheme + "']").addClass("is-active").siblings().removeClass("is-active");
  $(".mode-btn[data-mode='" + savedMode + "']").addClass("is-active").siblings().removeClass("is-active");

  $(".info-list li").click(function () {
    $(this).addClass("selected").siblings("li").removeClass("selected");
    $(".info-content div").hide();
    $("." + $(this).data("class")).fadeIn();
  });

  $("#theme-settings-btn").click(function (e) {
    e.stopPropagation();
    $(".theme-settings").toggleClass("is-open");
  });

  $("#theme-close-btn").click(function () {
    $(".theme-settings").removeClass("is-open");
  });

  $(document).click(function (e) {
    if (!$(e.target).closest(".theme-settings").length) {
      $(".theme-settings").removeClass("is-open");
    }
  });

  $(".swatch").click(function () {
    var theme = $(this).data("theme");
    $(this).addClass("is-active").siblings().removeClass("is-active");
    $("html").attr("data-theme", theme);
    localStorage.setItem("caretto_theme", theme);
  });

  $(".mode-btn").click(function () {
    var mode = $(this).data("mode");
    $(this).addClass("is-active").siblings().removeClass("is-active");
    $("html").attr("data-mode", mode);
    localStorage.setItem("caretto_mode", mode);
  });

  $("#nav-toggle-btn").click(function () {
    $(this).toggleClass("is-open");
    $(".site-nav").toggleClass("is-open");
  });

  $("a[href^='#']").click(function (e) {
    var target = $(this).attr("href");
    if (target && target !== "#" && $(target).length) {
      e.preventDefault();
      var targetPos = target === "#home" ? 0 : $(target).offset().top - 70;
      $("html, body").stop().animate({
        scrollTop: targetPos
      }, 500);
      $("#nav-toggle-btn").removeClass("is-open");
      $(".site-nav").removeClass("is-open");
    }
  });

  $(window).scroll(function () {
    var scrollPos = $(window).scrollTop();
    if (scrollPos > 40) {
      $(".site-nav").addClass("is-scrolled");
    } else {
      $(".site-nav").removeClass("is-scrolled");
    }

    var position = scrollPos + 120;
    $(".nav-links a").each(function () {
      var target = $(this).attr("href");
      if (target && target.indexOf("#") === 0 && $(target).length) {
        var refElement = $(target);
        if (
          refElement.offset().top <= position &&
          refElement.offset().top + refElement.outerHeight() > position
        ) {
          $(".nav-links a").removeClass("active");
          $(this).addClass("active");
        }
      }
    });

    checkStatsScroll();
  });

  $(".header .car").click(function () {
    $(this).addClass("selected").siblings().removeClass("selected");
    var hp = $(this).data("hp");
    var accel = $(this).data("accel");
    var speed = $(this).data("speed");

    $("#hero-hp").text(hp);
    $("#hero-accel").text(accel);
    $("#hero-speed").text(speed);
  });

  var statsAnimated = false;
  function checkStatsScroll() {
    if (statsAnimated || !$(".stats").length) return;
    var statsTop = $(".stats").offset().top - window.innerHeight + 100;
    if ($(window).scrollTop() > statsTop) {
      statsAnimated = true;
      $(".stat-num").each(function () {
        var $this = $(this);
        var countTo = parseInt($this.attr("data-count"), 10);
        $({ countNum: 0 }).animate(
          { countNum: countTo },
          {
            duration: 2000,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum).toLocaleString());
            },
            complete: function () {
              $this.text(this.countNum.toLocaleString() + "+");
            }
          }
        );
      });
    }
  }
  checkStatsScroll();

  $(".filter-btn").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    var filter = $(this).data("filter");

    if (filter === "all") {
      $(".our-works .image").fadeIn(400);
    } else {
      $(".our-works .image").each(function () {
        if ($(this).data("category") === filter) {
          $(this).fadeIn(400);
        } else {
          $(this).fadeOut(200);
        }
      });
    }
  });

  $(".our-works .image").click(function () {
    var imgSrc = $(this).find("img").attr("src");
    var title = $(this).data("title") || $(this).find(".car-name").text();
    var specs = $(this).data("specs") || "Precision Engineered Performance";
    var badge = $(this).find(".car-badge").text() || "Showcase";

    $("#modal-img").attr("src", imgSrc);
    $("#modal-title").text(title);
    $("#modal-specs").text(specs);
    $("#modal-badge").text(badge);

    $("#car-lightbox").addClass("is-active");
  });

  $("#modal-close-btn, #car-lightbox").click(function (e) {
    if (e.target === this || e.target.id === "modal-close-btn") {
      $("#car-lightbox").removeClass("is-active");
    }
  });

  $("#modal-reserve-btn, #hero-buy-btn, #nav-reserve-btn").click(function (e) {
    e.preventDefault();
    $("#car-lightbox").removeClass("is-active");
    $("#discount-modal").addClass("is-active");
  });

  $("#discount-close-btn, #discount-modal").click(function (e) {
    if (e.target === this || e.target.id === "discount-close-btn") {
      $("#discount-modal").removeClass("is-active");
    }
  });

  $("#pricing-switch").change(function () {
    var isAnnual = $(this).is(":checked");
    if (isAnnual) {
      $(".period-annual").addClass("is-active");
      $(".period-monthly").removeClass("is-active");
    } else {
      $(".period-monthly").addClass("is-active");
      $(".period-annual").removeClass("is-active");
    }

    $(".pricing-plan .pricing").each(function () {
      var val = isAnnual ? $(this).data("annual") : $(this).data("monthly");
      $(this).html("$" + val + '<span class="per">/mo</span>');
    });
  });

  $(".faq-question").click(function () {
    var parent = $(this).closest(".faq-item");
    parent.toggleClass("is-open").siblings().removeClass("is-open").find(".faq-answer").slideUp(250);
    parent.find(".faq-answer").slideToggle(250);
  });

  function showToast(message) {
    var toast = $("#toast");
    toast.text(message).addClass("is-visible");
    setTimeout(function () {
      toast.removeClass("is-visible");
    }, 3500);
  }

  $("#newsletter-form").submit(function (e) {
    e.preventDefault();
    showToast("Thank you for subscribing! Check your email for exclusive Car Show passes.");
    this.reset();
  });

  $("#reservation-form").submit(function (e) {
    e.preventDefault();
    $("#discount-modal").removeClass("is-active");
    showToast("Reservation request submitted! A Caretto specialist will contact you shortly.");
    this.reset();
  });
});
