/* global NexT: true */

$(document).ready(function () {

  initScrollSpy();
  // Handle the clicking of TOC links

  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetId = decodeURIComponent($(this).attr('href'));
    var target = $(targetId);

    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 500);
    }
  });


  function initScrollSpy() {
    var tocSelector = '.post-toc';
    var $tocElement = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');

        // Scrolling to center active TOC element if TOC content is taller then viewport.
        $tocElement.scrollTop($currentActiveElement.offset().top - $tocElement.offset().top + $tocElement.scrollTop() - ($tocElement.height() / 2));
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    $('body').scrollspy({target: tocSelector});

    function removeCurrentActiveClass() {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }
  }

});

$(document).ready(function () {
  var html = $('html');
  var TAB_ANIMATE_DURATION = 200;
  var hasVelocity = $.isFunction(html.velocity);

  $('.sidebar-nav li').on('click', function () {
    var item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';
    if (item.hasClass(activeTabClassName)) {
      return;
    }

    var currentTarget = $('.' + activePanelClassName);
    var target = $('.' + item.data('target'));

    hasVelocity ?
      currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
        target
          .velocity('stop')
          .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
          .addClass(activePanelClassName);
      }) :
      currentTarget.animate({opacity: 0}, TAB_ANIMATE_DURATION, function () {
        currentTarget.hide();
        target
          .stop()
          .css({'opacity': 0, 'display': 'block'})
          .animate({opacity: 1}, TAB_ANIMATE_DURATION, function () {
            currentTarget.removeClass(activePanelClassName);
            target.addClass(activePanelClassName);
          });
      });

    item.siblings().removeClass(activeTabClassName);
    item.addClass(activeTabClassName);
  });

  // TOC item animation navigate & prevent #item selector in adress bar.
  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetSelector = NexT.utils.escapeSelector(this.getAttribute('href'));
    var offset = $(targetSelector).offset().top;

    hasVelocity ?
      html.velocity('stop').velocity('scroll', {
        offset: offset + 'px',
        mobileHA: false
      }) :
      $('html, body').stop().animate({
        scrollTop: offset
      }, 500);
  });

  // Expand sidebar on post detail page by default, when post has a toc.
  var $tocContent = $('.post-toc-content');
  var isSidebarCouldDisplay = CONFIG.sidebar.display === 'post' ||
    CONFIG.sidebar.display === 'always';
  var hasTOC = $tocContent.length > 0 && $tocContent.html().trim().length > 0;
  if (isSidebarCouldDisplay && hasTOC) {
    CONFIG.motion.enable ?
      (NexT.motion.middleWares.sidebar = function () {
        NexT.utils.displaySidebar();
      }) : NexT.utils.displaySidebar();
  }
});

$(document).ready(function () {
  // 处理目录点击展开/折叠
  $('.post-toc .nav-item').on('click', function (e) {
    e.stopPropagation(); // 阻止事件冒泡

    var $this = $(this);
    var $subNav = $this.children('.nav-child');

    // 如果有子目录
    if ($subNav.length > 0) {
      e.preventDefault(); // 阻止默认跳转
      $subNav.slideToggle(200);
      $this.toggleClass('expanded');
    }
  });

  // 初始展开当前活动的目录项
  function expandActiveNav() {
    var $activeItem = $('.post-toc .active-current').parent();
    $activeItem.parents('.nav-child').show();
    $activeItem.parents('.nav-item').addClass('expanded');
  }

  // 首次加载时展开
  expandActiveNav();

  // 滚动时保持展开状态
  $(window).on('activate.bs.scrollspy', function () {
    expandActiveNav();
  });
});
