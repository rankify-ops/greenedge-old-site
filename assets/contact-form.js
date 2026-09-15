/* GreenEdge contact modal — replaces old Cognito lightbox popups
 * Intercepts every .n2-lightbox-trigger (Get Started / Contact Us / etc.)
 * whose href points to mailto:info@greenedgesystems.com.au and opens
 * a proper form modal that submits to Web3Forms.
 * Set your access key in the ACCESS_KEY constant below.
 */
(function () {
  var ACCESS_KEY = ""; // <-- paste your Web3Forms access key here
  var FALLBACK_PHONE = "";
  var FALLBACK_EMAIL = "info@greenedgesystems.com.au";
  var MODAL_ID = "ge-contact-modal";

  var CSS = [
    "#" + MODAL_ID + "{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;background:rgba(10,36,24,.65);padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#143f2b}",
    "#" + MODAL_ID + ".open{display:flex}",
    "#" + MODAL_ID + " .ge-card{background:#fff;border-radius:18px;max-width:560px;width:100%;padding:32px 28px;box-shadow:0 25px 80px rgba(0,0,0,.35);max-height:92vh;overflow-y:auto;position:relative}",
    "#" + MODAL_ID + " .ge-close{position:absolute;top:12px;right:14px;background:transparent;border:0;font-size:26px;line-height:1;cursor:pointer;color:#666;padding:6px 10px;border-radius:8px}",
    "#" + MODAL_ID + " .ge-close:hover{background:#f3efe8;color:#143f2b}",
    "#" + MODAL_ID + " h2{margin:0 0 6px 0;font-size:24px;font-weight:700;color:#143f2b;letter-spacing:-.01em}",
    "#" + MODAL_ID + " .ge-sub{margin:0 0 22px 0;color:#6b5e47;font-size:14px;line-height:1.5}",
    "#" + MODAL_ID + " label{display:block;font-size:11px;font-weight:600;color:#524835;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}",
    "#" + MODAL_ID + " .ge-row{margin-bottom:14px}",
    "#" + MODAL_ID + " .ge-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}",
    "@media (max-width:520px){#" + MODAL_ID + " .ge-grid{grid-template-columns:1fr}}",
    "#" + MODAL_ID + " input,#" + MODAL_ID + " select,#" + MODAL_ID + " textarea{width:100%;box-sizing:border-box;padding:11px 13px;border:1.5px solid #e7dfd2;border-radius:10px;font-size:14px;font-family:inherit;color:#143f2b;background:#fff;transition:border-color .15s ease, box-shadow .15s ease}",
    "#" + MODAL_ID + " input:focus,#" + MODAL_ID + " select:focus,#" + MODAL_ID + " textarea:focus{outline:none;border-color:#1f7a4c;box-shadow:0 0 0 3px rgba(31,122,76,.12)}",
    "#" + MODAL_ID + " textarea{resize:vertical;min-height:96px}",
    "#" + MODAL_ID + " .ge-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}",
    "#" + MODAL_ID + " .ge-submit{width:100%;background:#1f7a4c;color:#fff;font-weight:600;font-size:15px;padding:13px;border:0;border-radius:10px;cursor:pointer;margin-top:6px;letter-spacing:.01em;transition:background .15s ease}",
    "#" + MODAL_ID + " .ge-submit:hover{background:#174d33}",
    "#" + MODAL_ID + " .ge-submit:disabled{opacity:.5;cursor:not-allowed}",
    "#" + MODAL_ID + " .ge-err{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:12px}",
    "#" + MODAL_ID + " .ge-ok{text-align:center;padding:24px 8px}",
    "#" + MODAL_ID + " .ge-ok-badge{width:64px;height:64px;border-radius:50%;background:#dcf3e6;color:#1f7a4c;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:32px}",
    "#" + MODAL_ID + " .ge-foot{text-align:center;color:#8c7e63;font-size:12px;margin-top:14px}",
  ].join("");

  var FORM_HTML =
    '<div class="ge-card" role="dialog" aria-modal="true" aria-labelledby="ge-title">' +
      '<button type="button" class="ge-close" aria-label="Close">&times;</button>' +
      '<div class="ge-body">' +
        '<h2 id="ge-title">Contact GreenEdge</h2>' +
        '<p class="ge-sub">Send us a message and we\'ll come straight back to you.</p>' +
        '<form id="ge-form" novalidate>' +
          '<input class="ge-hp" type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true"/>' +
          '<div class="ge-err" style="display:none"></div>' +
          '<div class="ge-grid">' +
            '<div><label>Name *</label><input required name="name" type="text" placeholder="Your full name"/></div>' +
            '<div><label>Phone *</label><input required name="phone" type="tel" placeholder="04XX XXX XXX"/></div>' +
          '</div>' +
          '<div class="ge-row"><label>Email *</label><input required name="email" type="email" placeholder="you@example.com"/></div>' +
          '<div class="ge-row"><label>What can we help with?</label>' +
            '<select name="topic">' +
              '<option value="">Select a topic (optional)</option>' +
              '<option>Hydronic Heating</option>' +
              '<option>Hot Water Systems</option>' +
              '<option>Solar Power</option>' +
              '<option>Wood Fired Heating</option>' +
              '<option>Heat Pumps</option>' +
              '<option>Commercial</option>' +
              '<option>Design My System</option>' +
              '<option>Other</option>' +
            '</select></div>' +
          '<div class="ge-row"><label>Message</label><textarea name="message" rows="4" placeholder="Tell us about your project..."></textarea></div>' +
          '<button type="submit" class="ge-submit">Send Message</button>' +
        '</form>' +
        '<div class="ge-foot">We reply within 24 hours &middot; No spam ever</div>' +
      '</div>' +
      '<div class="ge-ok" style="display:none">' +
        '<div class="ge-ok-badge">&#10003;</div>' +
        '<h2>Message sent!</h2>' +
        '<p class="ge-sub" style="margin-top:8px">Thanks — we\'ll come back to you within 24 hours.</p>' +
      '</div>' +
    '</div>';

  var modal, form, errBox, okBox, bodyBox, submitBtn;

  function injectStyle() {
    if (document.getElementById("ge-contact-style")) return;
    var s = document.createElement("style");
    s.id = "ge-contact-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function build() {
    injectStyle();
    modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.innerHTML = FORM_HTML;
    document.body.appendChild(modal);
    form = modal.querySelector("#ge-form");
    errBox = modal.querySelector(".ge-err");
    okBox = modal.querySelector(".ge-ok");
    bodyBox = modal.querySelector(".ge-body");
    submitBtn = modal.querySelector(".ge-submit");

    modal.querySelector(".ge-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    form.addEventListener("submit", onSubmit);
  }

  function open() {
    if (!modal) build();
    // reset for repeat opens
    bodyBox.style.display = "";
    okBox.style.display = "none";
    errBox.style.display = "none";
    modal.classList.add("open");
    setTimeout(function(){ var n = form.querySelector('input[name="name"]'); if (n) n.focus(); }, 30);
  }

  function close() { if (modal) modal.classList.remove("open"); }

  function showError(msg) {
    errBox.textContent = msg;
    errBox.style.display = "block";
  }

  function fallbackMsg() {
    var bits = [];
    if (FALLBACK_PHONE) bits.push("call " + FALLBACK_PHONE);
    if (FALLBACK_EMAIL) bits.push("email " + FALLBACK_EMAIL);
    return "Sorry — that didn't send. Please " + bits.join(" or ") + ".";
  }

  function onSubmit(e) {
    e.preventDefault();
    if (form.querySelector('input[name="botcheck"]').value) return;
    errBox.style.display = "none";

    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v; });

    if (!ACCESS_KEY) {
      showError("This form isn't connected yet — please email " + FALLBACK_EMAIL + ".");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    var payload = {
      access_key: ACCESS_KEY,
      subject: "GreenEdge contact form: " + (data.topic || "General enquiry") + " — " + (data.name || ""),
      from_name: "greenedgesystems.com.au",
      name: data.name,
      email: data.email,
      phone: data.phone,
      topic: data.topic || "Not specified",
      message: data.message || "—",
      source_page: window.location.href,
    };

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.j || !res.j.success) throw new Error("failed");
        bodyBox.style.display = "none";
        okBox.style.display = "block";
        form.reset();
      })
      .catch(function () { showError(fallbackMsg()); })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
  }

  function isContactTrigger(a) {
    if (!a || a.tagName !== "A") return false;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("mailto:info@greenedgesystems") === 0) {
      // only intercept ones that were the old Cognito popup buttons
      if (a.classList && a.classList.contains("n2-lightbox-trigger")) return true;
    }
    return false;
  }

  function wireLinks() {
    var all = document.querySelectorAll('a.n2-lightbox-trigger[href^="mailto:info@greenedgesystems"]');
    for (var i = 0; i < all.length; i++) {
      var a = all[i];
      if (a.dataset.geWired === "1") continue;
      a.dataset.geWired = "1";
      a.setAttribute("href", "#contact");
      a.setAttribute("role", "button");
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target;
    while (a && a !== document && a.tagName !== "A") a = a.parentNode;
    if (!a || a === document) return;
    if (isContactTrigger(a) || (a.getAttribute && a.getAttribute("href") === "#contact" && a.dataset && a.dataset.geWired === "1")) {
      e.preventDefault();
      open();
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireLinks);
  } else {
    wireLinks();
  }

  window.openGeContactForm = open;
})();
