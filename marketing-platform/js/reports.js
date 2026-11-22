/**
 * AdPulse 360 - Reporting, ROI Engine, CSV Exporter, and AI Recommendations
 */

const ReportEngine = {
  init() {
    this.renderRecommendations();
    this.bindEvents();
  },

  bindEvents() {
    const exportCsvBtn = document.getElementById("btn-export-campaigns-csv");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => this.exportCampaignsToCsv());
    }

    const exportKwBtn = document.getElementById("btn-export-keywords-csv");
    if (exportKwBtn) {
      exportKwBtn.addEventListener("click", () => this.exportKeywordsToCsv());
    }

    const printReportBtn = document.getElementById("btn-print-report");
    if (printReportBtn) {
      printReportBtn.addEventListener("click", () => window.print());
    }
  },

  renderRecommendations() {
    const container = document.getElementById("ai-recommendations-list");
    if (!container) return;

    const data = StorageManager.getData();
    const recs = data.recommendations || [];

    if (recs.length === 0) {
      container.innerHTML = `<div style="color: #94a3b8; padding: 2rem; text-align: center;">All optimization recommendations applied! Your account optimization score is 98.4%.</div>`;
      return;
    }

    container.innerHTML = recs.map(r => `
      <div class="recommendation-card" id="rec-card-${r.id}">
        <div class="rec-card-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="rec-category-tag">${r.category}</span>
            <span class="rec-score-boost font-mono">${r.scoreBoost} Score</span>
          </div>
          <span class="rec-impact-tag font-mono">${r.impact}</span>
        </div>
        <h4 class="rec-card-title">${r.title}</h4>
        <p class="rec-card-desc">${r.description}</p>
        <div class="rec-card-actions">
          <button class="btn btn-primary btn-sm" onclick="ReportEngine.applyRecommendation('${r.id}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> ${r.actionText}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ReportEngine.dismissRecommendation('${r.id}')">
            Dismiss
          </button>
        </div>
      </div>
    `).join("");
  },

  applyRecommendation(id) {
    const data = StorageManager.getData();
    const rec = data.recommendations.find(r => r.id === id);
    if (!rec) return;

    if (id === "rec-01") {
      // Increase budget on PMax
      const camp = data.campaigns.find(c => c.id === rec.campaignId);
      if (camp) {
        camp.dailyBudget += 50;
        StorageManager.saveData(data);
      }
    } else if (id === "rec-02") {
      // Add negative keywords
      ["-free", "-internship", "-tutorial", "-cheap", "-diy", "-cracked"].forEach(term => {
        StorageManager.addKeyword({
          text: term,
          matchType: "Negative",
          maxCpc: null,
          campaignId: rec.campaignId
        });
      });
    } else if (id === "rec-03") {
      App.switchTab("ads");
      App.showToast("Navigated to Ad Builder to refine headlines.");
      return;
    }

    // Remove recommendation
    data.recommendations = data.recommendations.filter(r => r.id !== id);
    StorageManager.saveData(data);
    this.renderRecommendations();
    CampaignManager.renderCampaignsTable();
    App.updateOverviewMetrics();
    App.showToast(`Applied recommendation: "${rec.title}"!`);
  },

  dismissRecommendation(id) {
    const card = document.getElementById(`rec-card-${id}`);
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      setTimeout(() => {
        const data = StorageManager.getData();
        data.recommendations = data.recommendations.filter(r => r.id !== id);
        StorageManager.saveData(data);
        this.renderRecommendations();
      }, 300);
    }
  },

  exportCampaignsToCsv() {
    const campaigns = StorageManager.getCampaigns();
    if (campaigns.length === 0) {
      App.showToast("No campaign data available to export.");
      return;
    }

    const headers = ["Campaign Name", "Type", "Status", "Daily Budget", "Bidding Strategy", "Impressions", "Clicks", "CTR (%)", "Avg CPC ($)", "Cost ($)", "Conversions", "Cost/Conv ($)", "Conv Value ($)", "ROAS (%)"];
    
    const rows = campaigns.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.type,
      c.status,
      c.dailyBudget,
      `"${c.biddingStrategy.replace(/"/g, '""')}"`,
      c.impressions,
      c.clicks,
      c.ctr,
      c.avgCpc,
      c.spend,
      c.conversions,
      c.costPerConv,
      c.convValue,
      c.roas
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_ads_campaigns_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("Campaign performance report downloaded as CSV.");
  },

  exportKeywordsToCsv() {
    const keywords = StorageManager.getKeywords();
    if (keywords.length === 0) {
      App.showToast("No keyword data available to export.");
      return;
    }

    const headers = ["Keyword", "Match Type", "Status", "Quality Score", "Max CPC ($)", "Impressions", "Clicks", "CTR (%)", "Avg CPC ($)", "Spend ($)", "Conversions"];
    const rows = keywords.map(k => [
      `"${k.text.replace(/"/g, '""')}"`,
      k.matchType,
      k.status,
      k.qualityScore || "—",
      k.maxCpc || 0,
      k.impressions,
      k.clicks,
      k.ctr,
      k.avgCpc,
      k.spend,
      k.conversions
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_ads_keywords_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("Keywords report downloaded as CSV.");
  }
};
