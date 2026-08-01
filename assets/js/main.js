/**
 * Science Universe — entry point.
 *
 * Two behaviours: the full screen overlay menu, and honouring the visitor's
 * reduced motion setting for the looping background footage.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Overlay menu
     ------------------------------------------------------------------------ */

  function initMenu() {
    const menu = document.getElementById("menu");
    const openButton = document.getElementById("menu-open");
    const closeButton = document.getElementById("menu-close");
    const shell = document.getElementById("shell");
    const backdrop = document.getElementById("backdrop");

    if (!menu || !openButton || !closeButton) {
      return;
    }

    const video = menu.querySelector("video");
    let isOpen = false;

    function setBackgroundInert(inert) {
      [shell, backdrop].forEach(function (element) {
        if (element) {
          element.inert = inert;
        }
      });
    }

    function open() {
      if (isOpen) {
        return;
      }
      isOpen = true;
      menu.inert = false;
      menu.classList.add("is-open");
      openButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-menu-open");
      setBackgroundInert(true);
      closeButton.focus();

      if (video) {
        const played = video.play();
        if (played && typeof played.catch === "function") {
          played.catch(function () {
            /* Autoplay refused: the poster frame stands in. */
          });
        }
      }
    }

    function close(returnFocus) {
      if (!isOpen) {
        return;
      }
      isOpen = false;
      menu.classList.remove("is-open");
      menu.inert = true;
      openButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-menu-open");
      setBackgroundInert(false);

      if (video) {
        video.pause();
      }
      if (returnFocus) {
        openButton.focus();
      }
    }

    openButton.addEventListener("click", open);
    closeButton.addEventListener("click", function () {
      close(true);
    });

    /* Delegated: any link inside the panel dismisses the menu, so in-page
       anchors land on content that is actually visible. */
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        close(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        close(true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Reduced motion
     ------------------------------------------------------------------------ */

  function initMotionPreference() {
    if (!window.matchMedia) {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function apply() {
      document.querySelectorAll("video").forEach(function (video) {
        if (query.matches) {
          video.pause();
          video.removeAttribute("autoplay");
        }
      });
    }

    apply();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", apply);
    }
  }

  initMenu();
  initMotionPreference();
})();
