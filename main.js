/*
  main.js, yuliatsernant.com

  What this file does:
    1. Opens and closes the mobile menu
    2. Expands work rows to show their details
    3. Rotates the word after "Ищу гармонию в"
    4. Builds the animations grid from a single list, with "show more"
    5. Highlights the nav link for the section on screen
    6. Copies the email address to the clipboard
    7. Keeps the footer year current

  No libraries, no build step. Loaded with "defer", so it runs after
  the page is parsed. The page still works without it.
*/

"use strict";

// Respect the "reduce motion" setting from the operating system
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = () => reducedMotionQuery.matches;

// Creates an element, sets its properties and appends children (elements or text).
// Uses properties instead of innerHTML, so nothing is ever parsed as markup.
function createElement(tag, props = {}, ...children) {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
}


/* ---------------------------------------------------------
   1. Mobile menu
   --------------------------------------------------------- */
function setUpMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!menuButton || !nav) return;

  const menuLabel = menuButton.querySelector(".menu-toggle__label");
  const navLinks = [...nav.querySelectorAll("a")];

  // Must match the breakpoint in style.css where the menu becomes a row (56.25em = 900px)
  const desktopQuery = window.matchMedia("(min-width: 56.25em)");

  const isMenuOpen = () => menuButton.getAttribute("aria-expanded") === "true";

  function setMenuOpen(isOpen, { moveFocus = true } = {}) {
    // Turn on the open/close animation only now (see .is-animated in style.css)
    nav.classList.add("is-animated");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuLabel.textContent = isOpen ? "Закрыть" : "Меню";
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);

    if (!moveFocus) return;

    if (isOpen) {
      // Put focus on the first link so keyboard and screen reader users land
      // in the menu. Wait a frame so the panel is visible before it gets focus.
      requestAnimationFrame(() => navLinks[0]?.focus());
    } else {
      menuButton.focus();
    }
  }

  menuButton.addEventListener("click", () => setMenuOpen(!isMenuOpen()));

  // Tapping a link closes the menu, then the browser scrolls to the section
  for (const link of navLinks) {
    link.addEventListener("click", () => {
      if (isMenuOpen()) setMenuOpen(false, { moveFocus: false });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!isMenuOpen()) return;

    if (event.key === "Escape") {
      setMenuOpen(false);
      return;
    }

    // Keep Tab inside the open menu (the menu button counts as part of it)
    if (event.key === "Tab") {
      const first = menuButton;
      const last = navLinks.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // If the window grows past the breakpoint while the menu is open, reset it
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && isMenuOpen()) setMenuOpen(false, { moveFocus: false });
  });
}


/* ---------------------------------------------------------
   2. Work rows expand to show details
   --------------------------------------------------------- */
function setUpWorkToggles() {
  for (const button of document.querySelectorAll(".work-item__toggle")) {
    const row = button.closest(".work-item");
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!row || !panel) continue;

    // "inert" hides a collapsed panel from screen readers and the Tab key.
    // Without JS the CSS never collapses it, so it stays readable.
    panel.inert = true;

    button.addEventListener("click", () => {
      const isOpen = row.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      panel.inert = !isOpen;
    });
  }
}


/* ---------------------------------------------------------
   3. Rotating role in the hero
   --------------------------------------------------------- */
function setUpRoleRotation() {
  const roleElement = document.querySelector(".hero__role");
  if (!roleElement) return;

  const roles = roleElement.dataset.roles.split(",").map((role) => role.trim());
  if (roles.length < 2) return;

  const msPerRole = 2400;
  const fadeOutMs = 350; // same as --duration-medium in style.css
  let currentIndex = 0;
  let timerId = null;

  function showNextRole() {
    currentIndex = (currentIndex + 1) % roles.length;

    // Slide the old word up and out...
    roleElement.classList.add("is-leaving");

    setTimeout(() => {
      // ...swap the text and jump the new word just below its spot...
      roleElement.textContent = roles[currentIndex];
      roleElement.classList.replace("is-leaving", "is-entering");

      // ...make the browser apply that position, then let it slide in
      void roleElement.offsetWidth;
      roleElement.classList.remove("is-entering");
    }, fadeOutMs);
  }

  // Only animate while the tab is visible and reduced motion is off.
  // Re-checked whenever either of those changes.
  function startOrStop() {
    const shouldRun = !document.hidden && !prefersReducedMotion();

    if (shouldRun && !timerId) {
      timerId = setInterval(showNextRole, msPerRole);
    } else if (!shouldRun) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  document.addEventListener("visibilitychange", startOrStop);
  reducedMotionQuery.addEventListener("change", startOrStop);
  startOrStop();
}


/* ---------------------------------------------------------
   4. Animations grid
   To add a new piece, add a line here and drop the GIF into
   media/gifs/. The order here is the order on the page.
   --------------------------------------------------------- */
const animations = [
  { title: "Christmas", gif: "christmas.gif", pen: "LENJaPB" },
  { title: "Winter", gif: "winter.gif", pen: "RwJrzBg" },
  { title: "Fire", gif: "fire.gif", pen: "KKvMyLp" },
  { title: "Snitch", gif: "snitch.gif", pen: "gOMroJK" },
  { title: "Night Forest", gif: "night-forest.gif", pen: "qBrGPMP" },
  { title: "Landscape", gif: "landscape.gif", pen: "zYBqpMr" },
  { title: "Bean", gif: "bean.gif", pen: "gOMrode" },
  { title: "Boo", gif: "boo.gif", pen: "gOxaogw" },
  { title: "Tickets", gif: "tickets.gif", pen: "VwbgXRd" },
  { title: "Butterfly", gif: "butterfly.gif", pen: "XWMwevR" },
  { title: "Morph", gif: "morph.gif", pen: "LYWqevQ" },
  { title: "Vegvisir", gif: "vegvisir.gif", pen: "abZZoLw" }
];

const codepenProfile = "https://codepen.io/LiaTsernant/pen/";
const gifFolder = "media/gifs/";
const cardsShownAtFirst = 6;

// Builds one <li> card. Cards past the first few start hidden,
// and hidden cards don't load their lazy GIFs until they're shown.
function createAnimationCard({ title, gif, pen }, index) {
  const image = createElement("img", {
    src: gifFolder + gif,
    alt: "", // the title below already says what it is
    width: 400,
    height: 400,
    loading: "lazy",
    decoding: "async"
  });

  // If a GIF is missing, hide the broken-image icon and keep the grey tile
  image.addEventListener("error", () => {
    image.style.visibility = "hidden";
  });

  const link = createElement(
    "a",
    { className: "animation-card", href: codepenProfile + pen, target: "_blank", rel: "noopener noreferrer" },
    createElement("span", { className: "animation-card__frame" }, image),
    createElement(
      "span",
      { className: "animation-card__title" },
      createElement("span", { className: "animation-card__number" }, `№ ${index + 1}`),
      createElement("span", {}, title),
      createElement("span", { className: "visually-hidden" }, ", анимация на CodePen (откроется в новой вкладке)")
    )
  );

  return createElement("li", { hidden: index >= cardsShownAtFirst }, link);
}

function renderAnimationGrid() {
  const grid = document.getElementById("animation-grid");
  if (!grid) return;

  // Replace the "see all on CodePen" fallback with the real cards
  grid.replaceChildren(...animations.map(createAnimationCard));

  // GIFs keep playing even with reduced motion turned on, so for
  // those visitors we freeze each one on its first frame instead
  if (prefersReducedMotion()) {
    grid.querySelectorAll("img").forEach(freezeGif);
  }

  addShowMoreButton(grid);
}

// One button under the grid that shows the rest of the cards and hides them again
function addShowMoreButton(grid) {
  const extraCards = [...grid.querySelectorAll("li[hidden]")];
  if (!extraCards.length) return;

  const count = extraCards.length;
  const showLabel = `Показать ещё ${count} ${pluralRu(count, "работу", "работы", "работ")}`;
  const hideLabel = "Свернуть";

  const button = createElement(
    "button",
    { type: "button", className: "button button--outline animation-gallery__more" },
    showLabel
  );
  button.setAttribute("aria-controls", grid.id);
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") !== "true";

    for (const card of extraCards) card.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? hideLabel : showLabel;

    if (isOpen) {
      // Take keyboard and screen reader users straight to the first new card
      extraCards[0].querySelector("a").focus();
    } else {
      // The grid just got shorter, so keep the button on screen
      button.scrollIntoView({ block: "nearest" });
    }
  });

  grid.after(button);
}

// Picks the Russian word form for a number: 1 работу, 2 работы, 5 работ
function pluralRu(n, one, few, many) {
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

// Draws the first frame of a GIF onto a canvas and uses that as the image
function freezeGif(image) {
  function drawStill() {
    try {
      const canvas = createElement("canvas", { width: image.naturalWidth, height: image.naturalHeight });
      canvas.getContext("2d").drawImage(image, 0, 0);
      image.src = canvas.toDataURL("image/png");
    } catch {
      // If the image came from another domain the browser won't let
      // us read it. Leaving it animated is better than breaking it.
    }
  }

  if (image.complete && image.naturalWidth) {
    drawStill();
  } else {
    image.addEventListener("load", drawStill, { once: true });
  }
}


/* ---------------------------------------------------------
   5. Current section in the nav
   --------------------------------------------------------- */
function setUpCurrentSectionHighlight() {
  const navLinks = [...document.querySelectorAll(".site-nav__link")];
  const linksBySectionId = new Map(
    navLinks.map((link) => [link.hash.slice(1), link])
  );
  const lastSectionId = [...linksBySectionId.keys()].at(-1);

  let sectionOnLine = null; // the section last seen crossing the line
  let currentId = null; // the section currently highlighted

  function markCurrent(sectionId) {
    if (sectionId === currentId) return;
    currentId = sectionId;

    // The hero ("top") has no link, so scrolling back up clears every link
    const currentLink = linksBySectionId.get(sectionId);

    for (const link of navLinks) {
      const isCurrent = link === currentLink;
      link.classList.toggle("is-current", isCurrent);

      // aria-current needs a value: an empty one counts as "false"
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }

  // The footer is too short to ever reach the line on tall screens,
  // so at the very bottom of the page the last link wins
  function update() {
    const { scrollY, innerHeight } = window;
    const isAtBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    markCurrent(isAtBottom ? lastSectionId : sectionOnLine);
  }

  // A section counts as "current" when it crosses a line
  // about 40% of the way down the screen
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) sectionOnLine = entry.target.id;
    }
    update();
  }, { rootMargin: "-40% 0px -55% 0px" });

  for (const sectionId of ["top", ...linksBySectionId.keys()]) {
    const section = document.getElementById(sectionId);
    if (section) observer.observe(section);
  }

  window.addEventListener("scroll", update, { passive: true });
}


/* ---------------------------------------------------------
   6. Copy email button
   --------------------------------------------------------- */
function setUpCopyButton() {
  const copyButton = document.querySelector(".copy-button");
  if (!copyButton) return;

  const statusMessage = document.getElementById("copy-status");
  const tooltip = copyButton.querySelector(".copy-button__tooltip");
  const originalLabel = tooltip.textContent;
  const emailAddress = copyButton.dataset.copy;
  let resetTimer = null;

  // The tooltip opens to the right of the button. When the button sits
  // near the right edge, open it to the left instead, so it never pokes
  // out of the page (even hidden, it would make the page scroll sideways)
  function keepTooltipOnScreen() {
    copyButton.classList.remove("is-tooltip-end");
    const roomOnRight = document.documentElement.clientWidth - copyButton.getBoundingClientRect().left;
    copyButton.classList.toggle("is-tooltip-end", tooltip.offsetWidth > roomOnRight - 8);
  }

  // Shows the message in the tooltip (and to screen readers), then resets after 2s
  function showResult(message, didCopy) {
    tooltip.textContent = message;
    if (statusMessage) statusMessage.textContent = message;
    keepTooltipOnScreen();
    copyButton.classList.remove("is-tooltip-dismissed");
    copyButton.classList.add("is-showing-result");
    copyButton.classList.toggle("is-copied", didCopy);

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      tooltip.textContent = originalLabel;
      if (statusMessage) statusMessage.textContent = "";
      keepTooltipOnScreen();
      copyButton.classList.remove("is-showing-result", "is-copied");
    }, 2000);
  }

  // Measure again once the web fonts load, since they make the tooltip wider
  keepTooltipOnScreen();
  document.fonts.ready.then(keepTooltipOnScreen);
  window.addEventListener("resize", keepTooltipOnScreen);

  // Escape hides the tooltip without moving focus (WCAG 1.4.13),
  // until the pointer or focus leaves the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") copyButton.classList.add("is-tooltip-dismissed");
  });

  const clearDismissed = () => copyButton.classList.remove("is-tooltip-dismissed");
  copyButton.addEventListener("mouseleave", clearDismissed);
  copyButton.addEventListener("blur", clearDismissed);

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      showResult("Скопировано", true);
    } catch {
      // No clipboard access: plain http, permission denied or an old browser
      showResult("Не удалось скопировать", false);
    }
  });
}


/* ---------------------------------------------------------
   7. Footer year
   --------------------------------------------------------- */
function updateFooterYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------
   Start everything. "defer" means the page is already parsed,
   so there's no need to wait for DOMContentLoaded.
   --------------------------------------------------------- */
setUpMobileMenu();
setUpWorkToggles();
setUpRoleRotation();
renderAnimationGrid();
setUpCurrentSectionHighlight();
setUpCopyButton();
updateFooterYear();
