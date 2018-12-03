/* global NexT: true */

$(document).ready(function () {
  /*显示github的小猫，只在电脑端显示*/
  /*NexT.utils.isDesktop() && $(document.body).append('<a href="https://github.com/KnivesZee" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style></a>');
  */

  NexT.motion = {};

  var sidebarToggleLines = {
    lines: [],
    push: function (line) {
      this.lines.push(line);
    },
    init: function () {
      this.lines.forEach(function (line) {
        line.init();
      });
    },
    arrow: function () {
      this.lines.forEach(function (line) {
        line.arrow();
      });
    },
    close: function () {
      this.lines.forEach(function (line) {
        line.close();
      });
    }
  };

  function SidebarToggleLine(settings) {
    this.el = $(settings.el);
    this.status = $.extend({}, {
      init: {
        width: '100%',
        opacity: 1,
        left: 0,
        rotateZ: 0,
        top: 0
      }
    }, settings.status);
  }

  SidebarToggleLine.prototype.init = function () {
    this.transform('init');
  };
  SidebarToggleLine.prototype.arrow = function () {
    this.transform('arrow');
  };
  SidebarToggleLine.prototype.close = function () {
    this.transform('close');
  };
  SidebarToggleLine.prototype.transform = function (status) {
    this.el.velocity('stop').velocity(this.status[status]);
  };

  var sidebarToggleLine1st = new SidebarToggleLine({
    el: '.sidebar-toggle-line-first',
    status: {
      arrow: {width: '50%', rotateZ: '-45deg', top: '2px'},
      close: {width: '100%', rotateZ: '-45deg', top: '5px'}
    }
  });
  var sidebarToggleLine2nd = new SidebarToggleLine({
    el: '.sidebar-toggle-line-middle',
    status: {
      arrow: {width: '90%'},
      close: {opacity: 0}
    }
  });
  var sidebarToggleLine3rd = new SidebarToggleLine({
    el: '.sidebar-toggle-line-last',
    status: {
      arrow: {width: '50%', rotateZ: '45deg', top: '-2px'},
      close: {width: '100%', rotateZ: '45deg', top: '-5px'}
    }
  });

  sidebarToggleLines.push(sidebarToggleLine1st);
  sidebarToggleLines.push(sidebarToggleLine2nd);
  sidebarToggleLines.push(sidebarToggleLine3rd);

  var SIDEBAR_WIDTH = '320px';
  var SIDEBAR_DISPLAY_DURATION = 200;
  var xPos, yPos;

  var sidebarToggleMotion = {
    toggleEl: $('.sidebar-toggle'),
    dimmerEl: $('#sidebar-dimmer'),
    sidebarEl: $('.sidebar'),
    isSidebarVisible: false,
    init: function () {
      this.toggleEl.on('click', this.clickHandler.bind(this));
      this.dimmerEl.on('click', this.clickHandler.bind(this));
      this.toggleEl.on('mouseenter', this.mouseEnterHandler.bind(this));
      this.toggleEl.on('mouseleave', this.mouseLeaveHandler.bind(this));
      this.sidebarEl.on('touchstart', this.touchstartHandler.bind(this));
      this.sidebarEl.on('touchend', this.touchendHandler.bind(this));
      this.sidebarEl.on('touchmove', function(e){e.preventDefault();});

      $(document)
        .on('sidebar.isShowing', function () {
          NexT.utils.isDesktop() && $('body').velocity('stop').velocity(
            {paddingRight: SIDEBAR_WIDTH},
            SIDEBAR_DISPLAY_DURATION
          );
        })
        .on('sidebar.isHiding', function () {
        });
    },
    clickHandler: function () {
      this.isSidebarVisible ? this.hideSidebar() : this.showSidebar();
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    mouseEnterHandler: function () {
      if (this.isSidebarVisible) {
        return;
      }
      sidebarToggleLines.arrow();
    },
    mouseLeaveHandler: function () {
      if (this.isSidebarVisible) {
        return;
      }
      sidebarToggleLines.init();
    },
    touchstartHandler: function(e) {
      xPos = e.originalEvent.touches[0].clientX;
      yPos = e.originalEvent.touches[0].clientY;
    },
    touchendHandler: function(e) {
      var _xPos = e.originalEvent.changedTouches[0].clientX;
      var _yPos = e.originalEvent.changedTouches[0].clientY;
      if (_xPos-xPos > 30 && Math.abs(_yPos-yPos) < 20) {
          this.clickHandler();
      }
    },
    showSidebar: function () {
      var self = this;

      sidebarToggleLines.close();

      this.sidebarEl.velocity('stop').velocity({
          width: SIDEBAR_WIDTH
        }, {
          display: 'block',
          duration: SIDEBAR_DISPLAY_DURATION,
          begin: function () {
            $('.sidebar .motion-element').velocity(
              'transition.slideRightIn',
              {
                stagger: 50,
                drag: true,
                complete: function () {
                  self.sidebarEl.trigger('sidebar.motion.complete');
                }
              }
            );
          },
          complete: function () {
            self.sidebarEl.addClass('sidebar-active');
            self.sidebarEl.trigger('sidebar.didShow');
          }
        }
      );

      this.sidebarEl.trigger('sidebar.isShowing');
    },
    hideSidebar: function () {
      NexT.utils.isDesktop() && $('body').velocity('stop').velocity({paddingRight: 0});
      this.sidebarEl.find('.motion-element').velocity('stop').css('display', 'none');
      this.sidebarEl.velocity('stop').velocity({width: 0}, {display: 'none'});

      sidebarToggleLines.init();

      this.sidebarEl.removeClass('sidebar-active');
      this.sidebarEl.trigger('sidebar.isHiding');

      // Prevent adding TOC to Overview if Overview was selected when close & open sidebar.
      if (!!$('.post-toc-wrap')) {
        if ($('.site-overview-wrap').css('display') === 'block') {
          $('.post-toc-wrap').removeClass('motion-element');
        } else {
          $('.post-toc-wrap').addClass('motion-element');
        }
      }
    }
  };
  sidebarToggleMotion.init();

  NexT.motion.integrator = {
    queue: [],
    cursor: -1,
    add: function (fn) {
      this.queue.push(fn);
      return this;
    },
    next: function () {
      this.cursor++;
      var fn = this.queue[this.cursor];
      $.isFunction(fn) && fn(NexT.motion.integrator);
    },
    bootstrap: function () {
      this.next();
    }
  };

  NexT.motion.middleWares =  {
    logo: function (integrator) {
      var sequence = [];
      var $brand = $('.brand');
      var $title = $('.site-title');
      var $subtitle = $('.site-subtitle');
      var $logoLineTop = $('.logo-line-before i');
      var $logoLineBottom = $('.logo-line-after i');

      $brand.size() > 0 && sequence.push({
        e: $brand,
        p: {opacity: 1},
        o: {duration: 200}
      });

      NexT.utils.isMist() && hasElement([$logoLineTop, $logoLineBottom]) &&
      sequence.push(
        getMistLineSettings($logoLineTop, '100%'),
        getMistLineSettings($logoLineBottom, '-100%')
      );

      hasElement($title) && sequence.push({
        e: $title,
        p: {opacity: 1, top: 0},
        o: { duration: 200 }
      });

      hasElement($subtitle) && sequence.push({
        e: $subtitle,
        p: {opacity: 1, top: 0},
        o: {duration: 200}
      });

      if (CONFIG.motion.async) {
        integrator.next();
      }

      if (sequence.length > 0) {
        sequence[sequence.length - 1].o.complete = function () {
          integrator.next();
        };
        $.Velocity.RunSequence(sequence);
      } else {
        integrator.next();
      }


      function getMistLineSettings (element, translateX) {
        return {
          e: $(element),
          p: {translateX: translateX},
          o: {
            duration: 500,
            sequenceQueue: false
          }
        };
      }

      /**
       * Check if $elements exist.
       * @param {jQuery|Array} $elements
       * @returns {boolean}
       */
      function hasElement ($elements) {
        $elements = Array.isArray($elements) ? $elements : [$elements];
        return $elements.every(function ($element) {
          return $.isFunction($element.size) && $element.size() > 0;
        });
      }
    },

    menu: function (integrator) {

      if (CONFIG.motion.async) {
        integrator.next();
      }

      $('.menu-item').velocity('transition.slideDownIn', {
        display: null,
        duration: 200,
        complete: function () {
          integrator.next();
        }
      });
    },

    postList: function (integrator) {
      //var $post = $('.post');
      var $postBlock = $('.post-block, .pagination, .comments');
      var $postBlockTransition = CONFIG.motion.transition.post_block;
      var $postHeader = $('.post-header');
      var $postHeaderTransition = CONFIG.motion.transition.post_header;
      var $postBody = $('.post-body');
      var $postBodyTransition = CONFIG.motion.transition.post_body;
      var $collHeader = $('.collection-title, .archive-year');
      var $collHeaderTransition = CONFIG.motion.transition.coll_header;
      var $sidebarAffix = $('.sidebar-inner');
      var $sidebarAffixTransition = CONFIG.motion.transition.sidebar;
      var hasPost = $postBlock.size() > 0;

      hasPost ? postMotion() : integrator.next();

      if (CONFIG.motion.async) {
        integrator.next();
      }

      function postMotion () {
        var postMotionOptions = window.postMotionOptions || {
            stagger: 100,
            drag: true
          };
        postMotionOptions.complete = function () {
          // After motion complete need to remove transform from sidebar to let affix work on Pisces | Gemini.
          if (CONFIG.motion.transition.sidebar && (NexT.utils.isPisces() || NexT.utils.isGemini())) {
            $sidebarAffix.css({ 'transform': 'initial' });
          }
          integrator.next();
        };

        //$post.velocity('transition.slideDownIn', postMotionOptions);
        if (CONFIG.motion.transition.post_block) {
          $postBlock.velocity('transition.' + $postBlockTransition, postMotionOptions);
        }
        if (CONFIG.motion.transition.post_header) {
          $postHeader.velocity('transition.' + $postHeaderTransition, postMotionOptions);
        }
        if (CONFIG.motion.transition.post_body) {
          $postBody.velocity('transition.' + $postBodyTransition, postMotionOptions);
        }
        if (CONFIG.motion.transition.coll_header) {
          $collHeader.velocity('transition.' + $collHeaderTransition, postMotionOptions);
        }
        // Only for Pisces | Gemini.
        if (CONFIG.motion.transition.sidebar && (NexT.utils.isPisces() || NexT.utils.isGemini())) {
          $sidebarAffix.velocity('transition.' + $sidebarAffixTransition, postMotionOptions);
        }
      }
    },

    sidebar: function (integrator) {
      if (CONFIG.sidebar.display === 'always') {
        NexT.utils.displaySidebar();
      }
      integrator.next();
    }
  };

});
