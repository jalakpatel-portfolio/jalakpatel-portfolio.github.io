(function(){
  var timeline = document.querySelector('.career-timeline');
  if (!timeline) return;
  if (!('IntersectionObserver' in window)) {
    timeline.classList.add('is-visible');
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        timeline.classList.add('is-visible');
        observer.disconnect();
      }
    });
  }, { threshold: 0.18 });
  observer.observe(timeline);
})();
