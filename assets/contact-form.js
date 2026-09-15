/* GreenEdge modals — replaces old Cognito lightbox popups
 * Two modals:
 *   - Discovery Call (Get Started / Request Discovery Call / Learn More etc.)
 *   - Contact Us (only for buttons whose label is "Contact Us")
 * Set your access key in ACCESS_KEY. Web3Forms handles submission + file upload.
 */
(function () {
  var ACCESS_KEY = "ea1d39c2-f8c8-4bf6-b276-0ab0c3f0cb6e";
  var FALLBACK_PHONE = "";
  var FALLBACK_EMAIL = "info@greenedgesystems.com.au";
  var DISCOVERY_ID = "ge-discovery-modal";
  var CONTACT_ID = "ge-contact-modal";

  var CSS = [
    ".ge-modal{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;background:rgba(10,36,24,.65);padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#143f2b}",
    ".ge-modal.open{display:flex}",
    ".ge-modal .ge-card{background:#fff;border-radius:18px;max-width:640px;width:100%;padding:34px 30px 30px;box-shadow:0 25px 80px rgba(0,0,0,.35);max-height:92vh;overflow-y:auto;position:relative}",
    ".ge-modal .ge-close{position:absolute;top:12px;right:14px;background:transparent;border:0;font-size:26px;line-height:1;cursor:pointer;color:#666;padding:6px 10px;border-radius:8px}",
    ".ge-modal .ge-close:hover{background:#f3efe8;color:#143f2b}",
    ".ge-modal h2{margin:0 0 22px 0;font-size:26px;font-weight:700;color:#143f2b;letter-spacing:-.01em;text-align:center}",
    ".ge-modal .ge-sub{margin:-16px 0 22px 0;color:#6b5e47;font-size:14px;line-height:1.5;text-align:center}",
    ".ge-modal label{display:block;font-size:13px;font-weight:700;color:#143f2b;margin-bottom:6px}",
    ".ge-modal label .req{color:#dc2626;margin-left:3px}",
    ".ge-modal .ge-row{margin-bottom:16px}",
    ".ge-modal .ge-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}",
    "@media (max-width:520px){.ge-modal .ge-grid{grid-template-columns:1fr}}",
    ".ge-modal input[type=text],.ge-modal input[type=email],.ge-modal input[type=tel],.ge-modal select,.ge-modal textarea{width:100%;box-sizing:border-box;padding:11px 13px;border:1.5px solid #d5cfc2;border-radius:6px;font-size:14px;font-family:inherit;color:#143f2b;background:#fff;transition:border-color .15s ease, box-shadow .15s ease}",
    ".ge-modal input:focus,.ge-modal select:focus,.ge-modal textarea:focus{outline:none;border-color:#1f7a4c;box-shadow:0 0 0 3px rgba(31,122,76,.12)}",
    ".ge-modal textarea{resize:vertical;min-height:90px}",
    ".ge-modal .ge-checks{display:flex;flex-wrap:wrap;gap:12px 22px;margin-top:6px}",
    ".ge-modal .ge-check{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#333;cursor:pointer;line-height:1.3}",
    ".ge-modal .ge-check input{width:16px;height:16px;accent-color:#1f7a4c;cursor:pointer;margin:0}",
    ".ge-modal .ge-other-input{flex:1;min-width:180px;padding:6px 10px;border:1.5px solid #d5cfc2;border-radius:6px;font-size:14px}",
    ".ge-modal .ge-upload{background:#f5f1e8;border:1.5px dashed #cfc7b5;border-radius:6px;padding:14px 16px;display:flex;align-items:center;gap:14px;transition:background .15s ease, border-color .15s ease}",
    ".ge-modal .ge-upload.drag-over{background:#dcf3e6;border-color:#1f7a4c;border-style:solid}",
    ".ge-modal .ge-upload-btn{background:#fff;border:1.5px solid #1f7a4c;color:#1f7a4c;padding:6px 16px;border-radius:5px;font-weight:600;font-size:13px;cursor:pointer;flex-shrink:0}",
    ".ge-modal .ge-upload-btn:hover{background:#f0faf5}",
    ".ge-modal .ge-upload input[type=file]{display:none}",
    ".ge-modal .ge-upload-hint{color:#666;font-size:13px;flex:1}",
    ".ge-modal .ge-file-list{display:flex;flex-direction:column;gap:6px}",
    ".ge-modal .ge-file-item{display:flex;align-items:center;gap:8px;background:#f0faf5;border:1px solid #dcf3e6;border-radius:5px;padding:6px 10px;font-size:13px;color:#143f2b}",
    ".ge-modal .ge-file-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".ge-modal .ge-file-size{color:#8c7e63;font-size:11px;flex-shrink:0}",
    ".ge-modal .ge-file-remove{background:transparent;border:0;cursor:pointer;color:#8c7e63;font-size:16px;padding:0 4px;line-height:1;flex-shrink:0}",
    ".ge-modal .ge-file-remove:hover{color:#dc2626}",
    ".ge-modal .ge-file-err{color:#dc2626;font-size:12px;margin-top:4px}",
    ".ge-modal .ge-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}",
    ".ge-modal .ge-submit{width:100%;background:#1f7a4c;color:#fff;font-weight:600;font-size:15px;padding:13px;border:0;border-radius:8px;cursor:pointer;margin-top:8px;letter-spacing:.01em;transition:background .15s ease}",
    ".ge-modal .ge-submit:hover{background:#174d33}",
    ".ge-modal .ge-submit:disabled{opacity:.5;cursor:not-allowed}",
    ".ge-modal .ge-err{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:12px}",
    ".ge-modal .ge-ok{text-align:center;padding:24px 8px}",
    ".ge-modal .ge-ok-badge{width:64px;height:64px;border-radius:50%;background:#dcf3e6;color:#1f7a4c;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:32px}",
    ".ge-modal .ge-foot{text-align:center;color:#8c7e63;font-size:12px;margin-top:14px}",
  ].join("");

  var DISCOVERY_HTML =
    '<div class="ge-card" role="dialog" aria-modal="true" aria-labelledby="ge-discovery-title">' +
      '<button type="button" class="ge-close" aria-label="Close">&times;</button>' +
      '<div class="ge-body">' +
        '<h2 id="ge-discovery-title">15 Minute Discovery Call</h2>' +
        '<form id="ge-discovery-form" novalidate>' +
          '<input class="ge-hp" type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true"/>' +
          '<div class="ge-err" style="display:none"></div>' +
          '<div class="ge-row"><label>Name<span class="req">*</span></label>' +
            '<div class="ge-grid" style="margin-bottom:0">' +
              '<input required name="first_name" type="text" placeholder="First"/>' +
              '<input required name="last_name" type="text" placeholder="Last"/>' +
            '</div></div>' +
          '<div class="ge-grid">' +
            '<div><label>Email<span class="req">*</span></label><input required name="email" type="email"/></div>' +
            '<div><label>Phone<span class="req">*</span></label><input required name="phone" type="tel"/></div>' +
          '</div>' +
          '<div class="ge-row"><label>Best time to call</label>' +
            '<div class="ge-checks">' +
              '<label class="ge-check"><input type="checkbox" name="best_time" value="Morning 8:30am - 12:00pm"/>Morning 8:30am - 12:00pm</label>' +
              '<label class="ge-check"><input type="checkbox" name="best_time" value="Lunch 12:00pm - 1:00pm"/>Lunch 12:00pm - 1:00pm</label>' +
              '<label class="ge-check"><input type="checkbox" name="best_time" value="Afternoon 1:00pm - 6:00pm"/>Afternoon 1:00pm - 6:00pm</label>' +
              '<label class="ge-check" style="flex:1;min-width:220px"><input type="checkbox" id="ge-other-time-cb"/><input type="text" class="ge-other-input" name="best_time_other" placeholder="Other"/></label>' +
            '</div></div>' +
          '<div class="ge-row"><label>Project Type</label>' +
            '<div class="ge-checks">' +
              '<label class="ge-check"><input type="checkbox" name="project_type" value="Hydronic Heating"/>Hydronic Heating</label>' +
              '<label class="ge-check"><input type="checkbox" name="project_type" value="Solar Power"/>Solar Power</label>' +
              '<label class="ge-check"><input type="checkbox" name="project_type" value="Swimming Pool"/>Swimming Pool</label>' +
              '<label class="ge-check"><input type="checkbox" name="project_type" value="Wood Fired Heating"/>Wood Fired Heating</label>' +
              '<label class="ge-check"><input type="checkbox" name="project_type" value="Domestic Hot Water"/>Domestic Hot Water</label>' +
            '</div></div>' +
          '<div class="ge-row"><label>Upload Plans</label>' +
            '<div class="ge-upload" id="ge-drop-zone">' +
              '<label class="ge-upload-btn" for="ge-file-input">Upload</label>' +
              '<input id="ge-file-input" type="file" name="attachment" multiple accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"/>' +
              '<span class="ge-upload-hint">or drag files here.</span>' +
            '</div>' +
            '<div class="ge-file-list" style="margin-top:8px;display:none"></div></div>' +
          '<div class="ge-row"><label>Additional Information</label>' +
            '<textarea name="additional_info" rows="4" placeholder="Tell us anything else about your project..."></textarea></div>' +
          '<button type="submit" class="ge-submit">Book My Discovery Call</button>' +
        '</form>' +
        '<div class="ge-foot">Free 15-minute call &middot; No obligation</div>' +
      '</div>' +
      '<div class="ge-ok" style="display:none">' +
        '<div class="ge-ok-badge">&#10003;</div>' +
        '<h2 style="margin-bottom:8px">Discovery call requested!</h2>' +
        '<p class="ge-sub" style="margin-top:0">Thanks — Gary will come back to you within 24 hours to schedule your free 15-minute call.</p>' +
      '</div>' +
    '</div>';

  var CONTACT_HTML =
    '<div class="ge-card" role="dialog" aria-modal="true" aria-labelledby="ge-contact-title">' +
      '<button type="button" class="ge-close" aria-label="Close">&times;</button>' +
      '<div class="ge-body">' +
        '<h2 id="ge-contact-title">Contact GreenEdge</h2>' +
        '<p class="ge-sub">Send us a message and we\'ll come straight back to you.</p>' +
        '<form id="ge-contact-form" novalidate>' +
          '<input class="ge-hp" type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true"/>' +
          '<div class="ge-err" style="display:none"></div>' +
          '<div class="ge-grid">' +
            '<div><label>Name<span class="req">*</span></label><input required name="name" type="text"/></div>' +
            '<div><label>Phone<span class="req">*</span></label><input required name="phone" type="tel"/></div>' +
          '</div>' +
          '<div class="ge-row"><label>Email<span class="req">*</span></label><input required name="email" type="email"/></div>' +
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
        '<h2 style="margin-bottom:8px">Message sent!</h2>' +
        '<p class="ge-sub" style="margin-top:0">Thanks — we\'ll come back to you within 24 hours.</p>' +
      '</div>' +
    '</div>';

  function injectStyle() {
    if (document.getElementById("ge-modal-style")) return;
    var s = document.createElement("style");
    s.id = "ge-modal-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var MAX_FILE_MB = 20;

  function buildModal(id, html, kind) {
    injectStyle();
    if (document.getElementById(id)) return document.getElementById(id);
    var m = document.createElement("div");
    m.id = id;
    m.className = "ge-modal";
    m.innerHTML = html;
    document.body.appendChild(m);
    m.querySelector(".ge-close").addEventListener("click", function () { closeModal(m); });
    m.addEventListener("click", function (e) { if (e.target === m) closeModal(m); });
    var form = m.querySelector("form");
    form.addEventListener("submit", function (e) { onSubmit(e, m, kind); });

    // Multi-file upload w/ drag+drop
    var fileInput = m.querySelector('input[type=file]');
    if (fileInput) {
      m._files = []; // authoritative list
      var dropZone = m.querySelector("#ge-drop-zone") || fileInput.parentNode;
      fileInput.addEventListener("change", function () {
        addFiles(m, fileInput.files);
        fileInput.value = ""; // reset so same file can be re-added
      });

      ["dragenter", "dragover"].forEach(function (ev) {
        dropZone.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          dropZone.classList.add("drag-over");
        });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        dropZone.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          dropZone.classList.remove("drag-over");
        });
      });
      dropZone.addEventListener("drop", function (e) {
        if (e.dataTransfer && e.dataTransfer.files) {
          addFiles(m, e.dataTransfer.files);
        }
      });
    }
    return m;
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }

  function addFiles(m, fileList) {
    var listBox = m.querySelector(".ge-file-list");
    var hint = m.querySelector(".ge-upload-hint");
    var maxBytes = MAX_FILE_MB * 1024 * 1024;
    var rejected = [];
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      if (f.size > maxBytes) {
        rejected.push(f.name + " (" + fmtSize(f.size) + ")");
        continue;
      }
      m._files.push(f);
    }
    renderFiles(m);
    if (rejected.length) {
      var msg = "Too large (max " + MAX_FILE_MB + "MB): " + rejected.join(", ");
      showFileError(m, msg);
    } else {
      showFileError(m, "");
    }
  }

  function showFileError(m, msg) {
    var listBox = m.querySelector(".ge-file-list");
    var err = listBox.querySelector(".ge-file-err");
    if (msg) {
      if (!err) {
        err = document.createElement("div");
        err.className = "ge-file-err";
        listBox.appendChild(err);
      }
      err.textContent = msg;
      listBox.style.display = "flex";
    } else if (err) {
      err.remove();
    }
  }

  function renderFiles(m) {
    var listBox = m.querySelector(".ge-file-list");
    var hint = m.querySelector(".ge-upload-hint");
    // Clear existing items but keep error line
    var err = listBox.querySelector(".ge-file-err");
    listBox.innerHTML = "";
    if (m._files.length === 0) {
      listBox.style.display = "none";
      hint.textContent = "or drag files here.";
      hint.style.color = "";
      if (err) listBox.appendChild(err);
      return;
    }
    listBox.style.display = "flex";
    hint.textContent = m._files.length + " file" + (m._files.length === 1 ? "" : "s") + " attached";
    hint.style.color = "#1f7a4c";
    m._files.forEach(function (f, idx) {
      var row = document.createElement("div");
      row.className = "ge-file-item";
      row.innerHTML =
        '<span class="ge-file-name"></span>' +
        '<span class="ge-file-size"></span>' +
        '<button type="button" class="ge-file-remove" aria-label="Remove">&times;</button>';
      row.querySelector(".ge-file-name").textContent = f.name;
      row.querySelector(".ge-file-size").textContent = fmtSize(f.size);
      row.querySelector(".ge-file-remove").addEventListener("click", function () {
        m._files.splice(idx, 1);
        renderFiles(m);
      });
      listBox.appendChild(row);
    });
    if (err) listBox.appendChild(err);
  }

  function openModal(m) {
    var body = m.querySelector(".ge-body");
    var ok = m.querySelector(".ge-ok");
    body.style.display = "";
    ok.style.display = "none";
    m.querySelector(".ge-err").style.display = "none";
    m.classList.add("open");
    setTimeout(function () {
      var first = m.querySelector('input[name="first_name"], input[name="name"]');
      if (first) first.focus();
    }, 40);
  }

  function closeModal(m) { m.classList.remove("open"); }

  function openDiscovery() { openModal(buildModal(DISCOVERY_ID, DISCOVERY_HTML, "discovery")); }
  function openContact() { openModal(buildModal(CONTACT_ID, CONTACT_HTML, "contact")); }

  function fallbackMsg() {
    var bits = [];
    if (FALLBACK_PHONE) bits.push("call " + FALLBACK_PHONE);
    if (FALLBACK_EMAIL) bits.push("email " + FALLBACK_EMAIL);
    return "Sorry — that didn't send. Please " + bits.join(" or ") + ".";
  }

  function collectData(form) {
    var out = {};
    var fd = new FormData(form);
    // Collect multi-value checkboxes into arrays
    fd.forEach(function (v, k) {
      if (k === "attachment") return; // handled separately
      if (out[k] === undefined) out[k] = v;
      else if (Array.isArray(out[k])) out[k].push(v);
      else out[k] = [out[k], v];
    });
    // Join arrays for readable email
    Object.keys(out).forEach(function (k) {
      if (Array.isArray(out[k])) out[k] = out[k].join(", ");
    });
    return out;
  }

  function onSubmit(e, modal, kind) {
    e.preventDefault();
    var form = modal.querySelector("form");
    var errBox = modal.querySelector(".ge-err");
    var submitBtn = modal.querySelector(".ge-submit");
    if (form.querySelector('input[name="botcheck"]').value) return;
    errBox.style.display = "none";

    var data = collectData(form);
    var files = modal._files || [];

    if (!ACCESS_KEY) {
      errBox.textContent = "This form isn't connected yet — please email " + FALLBACK_EMAIL + ".";
      errBox.style.display = "block";
      return;
    }

    submitBtn.disabled = true;
    var origLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    var payload;
    var headers;
    if (files.length > 0) {
      // multipart with one or more files
      var fd = new FormData();
      fd.append("access_key", ACCESS_KEY);
      fd.append("from_name", "greenedgesystems.com.au");
      fd.append("subject", subjectFor(kind, data));
      Object.keys(data).forEach(function (k) { fd.append(k, data[k] || ""); });
      files.forEach(function (f, i) {
        // Send as attachment, attachment_2, attachment_3... (Web3Forms accepts multiple keys)
        fd.append(i === 0 ? "attachment" : "attachment_" + (i + 1), f, f.name);
      });
      fd.append("attachment_count", String(files.length));
      fd.append("source_page", window.location.href);
      payload = fd;
      headers = { Accept: "application/json" };
    } else {
      payload = JSON.stringify(Object.assign({
        access_key: ACCESS_KEY,
        from_name: "greenedgesystems.com.au",
        subject: subjectFor(kind, data),
        source_page: window.location.href,
      }, data));
      headers = { "Content-Type": "application/json", Accept: "application/json" };
    }

    fetch("https://api.web3forms.com/submit", { method: "POST", headers: headers, body: payload })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.j || !res.j.success) throw new Error("failed");
        modal.querySelector(".ge-body").style.display = "none";
        modal.querySelector(".ge-ok").style.display = "block";
        form.reset();
        modal._files = [];
        var listBox = modal.querySelector(".ge-file-list");
        if (listBox) { listBox.innerHTML = ""; listBox.style.display = "none"; }
        var hint = modal.querySelector(".ge-upload-hint");
        if (hint) { hint.textContent = "or drag files here."; hint.style.color = ""; }
      })
      .catch(function () {
        errBox.textContent = fallbackMsg();
        errBox.style.display = "block";
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = origLabel;
      });
  }

  function subjectFor(kind, d) {
    var name = (d.first_name || d.name || "") + (d.last_name ? " " + d.last_name : "");
    if (kind === "discovery") {
      return "Discovery call request — " + name.trim() + (d.project_type ? " (" + d.project_type + ")" : "");
    }
    return "Contact form — " + (d.topic || "General enquiry") + " — " + name.trim();
  }

  function labelOf(a) {
    return (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function routeClick(a) {
    var label = labelOf(a);
    if (label.indexOf("contact") === 0 || label === "contact us") {
      openContact();
    } else {
      // Get Started, Learn More, Request Discovery Call, etc.
      openDiscovery();
    }
  }

  // Prime already-parked links so href="mailto:" doesn't flash a chooser
  function wireLinks() {
    var all = document.querySelectorAll('a.n2-lightbox-trigger[href^="mailto:info@greenedgesystems"]');
    for (var i = 0; i < all.length; i++) {
      var a = all[i];
      if (a.dataset.geWired === "1") continue;
      a.dataset.geWired = "1";
      a.setAttribute("href", "javascript:void(0)");
      a.setAttribute("role", "button");
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target;
    while (a && a !== document && a.tagName !== "A") a = a.parentNode;
    if (!a || a === document) return;
    if (!a.classList || !a.classList.contains("n2-lightbox-trigger")) return;
    var href = a.getAttribute("href") || "";
    if (
      href.indexOf("mailto:info@greenedgesystems") === 0 ||
      href === "javascript:void(0)" ||
      href === "#" ||
      href === ""
    ) {
      e.preventDefault();
      e.stopPropagation();
      routeClick(a);
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireLinks);
  } else {
    wireLinks();
  }

  window.openGeContactForm = openContact;
  window.openGeDiscoveryForm = openDiscovery;
})();
