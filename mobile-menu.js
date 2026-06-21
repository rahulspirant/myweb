/* ===================================================================
   DEEP MIND IT SOLUTIONS — PREMIUM MOBILE-MENU.JS v2.0
   Mobile navigation with smooth animations and accessibility
   =================================================================== */
(function() {
  "use strict";

  var hamburger = document.querySelector(".hamburger");
  var panel = document.querySelector(".mobile-panel");
  var scrim = document.querySelector(".mobile-scrim");
  if (!hamburger || !panel) return;

  var isOpen = false;
  var lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    hamburger.classList.add("active");
    panel.classList.add("open");
    if (scrim) scrim.classList.add("open");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
    isOpen = true;
    
    // Focus first link in panel
    setTimeout(function() {
      var firstLink = panel.querySelector(".m-link");
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    panel.classList.remove("open");
    if (scrim) scrim.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
    isOpen = false;
    
    // Return focus to hamburger
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener("click", toggleMenu);
  
  if (scrim) {
    scrim.addEventListener("click", closeMenu);
  }

  // Trap focus within mobile panel when open
  panel.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    
    if (e.key === "Tab") {
      var focusableElements = panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      );
      var firstFocusable = focusableElements[0];
      var lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // accordion groups inside mobile panel (e.g. Services submenu)
  panel.querySelectorAll(".m-group > .m-link").forEach(function(trigger) {
    trigger.addEventListener("click", function(e) {
      var group = trigger.parentElement;
      if (group.querySelector(".m-sub")) {
        e.preventDefault();
        group.classList.toggle("open");
        
        // Animate submenu
        var submenu = group.querySelector(".m-sub");
        if (submenu) {
          if (group.classList.contains("open")) {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
            submenu.style.opacity = "1";
          } else {
            submenu.style.maxHeight = "0";
            submenu.style.opacity = "0";
          }
        }
      }
    });
  });

  // close on plain link click
  panel.querySelectorAll("a.m-link:not(.m-group > .m-link)").forEach(function(link) {
    link.addEventListener("click", function() {
      closeMenu();
    });
  });
  
  panel.querySelectorAll(".m-sub a").forEach(function(link) {
    link.addEventListener("click", function() {
      closeMenu();
    });
  });
  
  panel.querySelectorAll(".nav-cta a").forEach(function(link) {
    link.addEventListener("click", function() {
      closeMenu();
    });
  });

  // Prevent body scroll when panel is open
  document.addEventListener("touchmove", function(e) {
    if (isOpen && !panel.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Handle resize - close panel on desktop
  window.addEventListener("resize", function() {
    if (window.innerWidth > 1024 && isOpen) {
      closeMenu();
    }
  });

})();