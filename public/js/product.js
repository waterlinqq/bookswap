$("document").ready(() => {
  $(".carousel-item").eq(0).addClass("active");
  $("[data-slide-to]").eq(0).addClass("active");
  $(".carousel").carousel();
});
