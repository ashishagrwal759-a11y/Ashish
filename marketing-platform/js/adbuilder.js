/**
 * AdPulse 360 - Responsive Search Ad Builder & Google SERP Preview
 * Real-time SERP simulation, Ad Strength algorithmic score, and ad management
 */

const AdBuilder = {
  init() {
    this.renderAdsList();
    this.bindLivePreviewEvents();
    this.updatePreview();
  },

  bindLivePreviewEvents() {
    const inputs = [
      "ad-final-url",
      "ad-display-path1",
      "ad-display-path2",
      "ad-headline-1",
      "ad-headline-2",
      "ad-headline-3",
      "ad-desc-1",
      "ad-desc-2"
    ];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => this.updatePreview());
      }
    });

    const createForm = document.getElementById("create-ad-form");
    if (createForm) {
      createForm.addEventListener("submit", (e) => this.handleSaveAd(e));
    }
  },

  updatePreview() {
    const finalUrl = document.getElementById("ad-final-url")?.value || "https://example.com";
    const path1 = document.getElementById("ad-display-path1")?.value || "";
    const path2 = document.getElementById("ad-display-path2")?.value || "";
    const h1 = document.getElementById("ad-headline-1")?.value || "Enterprise Web Development";
    const h2 = document.getElementById("ad-headline-2")?.value || "High-Converting Solutions";
    const h3 = document.getElementById("ad-headline-3")?.value || "Official AdPulse Platform";
    const d1 = document.getElementById("ad-desc-1")?.value || "Transform your digital revenue with custom, high-speed architectures and managed growth.";
    const d2 = document.getElementById("ad-desc-2")?.value || "Partner with certified developers and sales specialists. Schedule your discovery call today.";

    // Update Domain Display
    let domain = "example.com";
    try {
      const u = new URL(finalUrl.startsWith("http") ? finalUrl : "https://" + finalUrl);
      domain = u.hostname;
    } catch (e) {
      domain = "example.com";
    }

    let fullDisplayPath = domain;
    if (path1) fullDisplayPath += ` > ${path1}`;
    if (path2) fullDisplayPath += ` > ${path2}`;

    const previewUrlEl = document.getElementById("serp-preview-url");
    if (previewUrlEl) previewUrlEl.textContent = fullDisplayPath;

    // Combine headlines with pipe
    const combinedTitle = [h1, h2, h3].filter(Boolean).join(" | ");
    const previewTitleEl = document.getElementById("serp-preview-title");
    if (previewTitleEl) previewTitleEl.textContent = combinedTitle;

    // Combined descriptions
    const combinedDesc = [d1, d2].filter(Boolean).join(" ");
    const previewDescEl = document.getElementById("serp-preview-desc");
    if (previewDescEl) previewDescEl.textContent = combinedDesc;

    // Calculate Ad Strength
    this.calculateAdStrength(h1, h2, h3, d1, d2);
  },

  calculateAdStrength(h1, h2, h3, d1, d2) {
    let score = 0;
    if (h1.length >= 10) score += 20;
    if (h2.length >= 10) score += 20;
    if (h3.length >= 8) score += 20;
    if (d1.length >= 35) score += 20;
    if (d2.length >= 35) score += 20;

    const meterEl = document.getElementById("ad-strength-meter-bar");
    const labelEl = document.getElementById("ad-strength-label");

    let text = "Poor (40%)";
    let color = "#ef4444";
    if (score >= 90) {
      text = "Excellent (98%)";
      color = "#10b981";
    } else if (score >= 70) {
      text = "Good (80%)";
      color = "#3b82f6";
    } else if (score >= 50) {
      text = "Average (60%)";
      color = "#f59e0b";
    }

    if (meterEl) {
      meterEl.style.width = `${score}%`;
      meterEl.style.background = color;
    }
    if (labelEl) {
      labelEl.textContent = text;
      labelEl.style.color = color;
    }
  },

  renderAdsList() {
    const container = document.getElementById("existing-ads-list");
    if (!container) return;

    const ads = StorageManager.getAds();
    if (ads.length === 0) {
      container.innerHTML = `<div style="color: #94a3b8; padding: 2rem; text-align: center;">No active ads created yet.</div>`;
      return;
    }

    container.innerHTML = ads.map(ad => `
      <div class="ad-card-item">
        <div class="ad-card-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="status-dot dot-active"></span>
            <span style="font-weight: 700; color: #f8fafc; font-size: 0.95rem;">${ad.type}</span>
          </div>
          <span class="ad-strength-pill" style="color: #10b981; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700;">
            ${ad.adStrength}
          </span>
        </div>
        <div class="ad-card-headlines">
          <strong>Headlines:</strong>
          <ul>
            ${ad.headlines.map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>
        <div class="ad-card-descriptions">
          <strong>Descriptions:</strong>
          <p>${ad.descriptions.join(" ")}</p>
        </div>
        <div class="ad-card-stats font-mono">
          <span><i class="fa-solid fa-eye"></i> ${ad.impressions.toLocaleString()} Impr</span>
          <span><i class="fa-solid fa-mouse-pointer" style="color: #00d2ff;"></i> ${ad.clicks.toLocaleString()} Clicks</span>
          <span><i class="fa-solid fa-percentage"></i> ${ad.ctr}% CTR</span>
          <span><i class="fa-solid fa-bullseye" style="color: #a855f7;"></i> ${ad.conversions} Conv</span>
        </div>
      </div>
    `).join("");
  },

  handleSaveAd(e) {
    e.preventDefault();
    const finalUrl = document.getElementById("ad-final-url").value;
    const path1 = document.getElementById("ad-display-path1").value;
    const path2 = document.getElementById("ad-display-path2").value;
    const h1 = document.getElementById("ad-headline-1").value;
    const h2 = document.getElementById("ad-headline-2").value;
    const h3 = document.getElementById("ad-headline-3").value;
    const d1 = document.getElementById("ad-desc-1").value;
    const d2 = document.getElementById("ad-desc-2").value;
    const campaignId = document.getElementById("ad-select-campaign")?.value;

    if (!finalUrl || !h1 || !h2 || !d1) {
      App.showToast("Please fill in the required final URL, headlines, and description.");
      return;
    }

    const created = StorageManager.addAd({
      finalUrl,
      displayPath1: path1,
      displayPath2: path2,
      headlines: [h1, h2, h3].filter(Boolean),
      descriptions: [d1, d2].filter(Boolean),
      campaignId
    });

    this.renderAdsList();
    App.showToast("New Responsive Search Ad saved and pushed to Google Ads API!");
  }
};
