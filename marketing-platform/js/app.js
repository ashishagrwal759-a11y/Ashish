/**
 * AdPulse 360 - Master Application Controller
 * Handles routing, sidebar navigation, top bar controls, KPI updates, and global UI state
 */

const App = {
  activeTab: "overview",

  init() {
    this.bindNavigation();
    this.updateOverviewMetrics();
    this.bindGlobalEvents();

    // Initialize sub-modules
    AnalyticsEngine.init();
    CampaignManager.init();
    KeywordManager.init();
    AdBuilder.init();
    GoogleAdsApiConnector.init();
    ReportEngine.init();

    // Subscribe to storage changes
    StorageManager.subscribe(() => {
      this.updateOverviewMetrics();
    });
  },

  bindNavigation() {
    const navItems = document.querySelectorAll(".nav-item[data-tab]");
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = item.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById("mobile-sidebar-toggle");
    const sidebar = document.getElementById("app-sidebar");
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });

      // Close when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    }
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav links
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-tab") === tabId) {
        item.classList.add("active");
      }
    });

    // Update view panels
    document.querySelectorAll(".view-pane").forEach(pane => {
      pane.classList.remove("active");
    });

    const activePane = document.getElementById(`view-${tabId}`);
    if (activePane) {
      activePane.classList.add("active");
    }

    // Update Breadcrumb
    const breadcrumbEl = document.getElementById("topbar-breadcrumb");
    if (breadcrumbEl) {
      const titles = {
        overview: "Executive Overview & ROI Dashboard",
        campaigns: "Google Ads Campaigns Management",
        keywords: "Keywords, Match Types & Quality Scores",
        ads: "Responsive Search Ads & Google SERP Preview",
        audiences: "Audience Segments & Demographic Targeting",
        "google-api": "Google Ads API v16 Integration & Settings",
        reports: "Performance Reports & AI Recommendations"
      };
      breadcrumbEl.textContent = titles[tabId] || "Dashboard";
    }

    // Refresh charts if entering overview
    if (tabId === "overview") {
      setTimeout(() => AnalyticsEngine.renderAllCharts(), 50);
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) sidebar.classList.remove("open");
  },

  updateOverviewMetrics() {
    const data = StorageManager.getData();
    const kpis = data.overviewKPIs;

    this.setText("kpi-total-spend", `$${kpis.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setText("kpi-impressions", kpis.impressions.toLocaleString());
    this.setText("kpi-clicks", kpis.clicks.toLocaleString());
    this.setText("kpi-ctr", `${kpis.ctr}%`);
    this.setText("kpi-cpc", `$${kpis.avgCpc.toFixed(2)}`);
    this.setText("kpi-conversions", kpis.conversions.toLocaleString());
    this.setText("kpi-cvr", `${kpis.conversionRate}%`);
    this.setText("kpi-cost-per-conv", `$${kpis.costPerConv.toFixed(2)}`);
    this.setText("kpi-conv-value", `$${kpis.convValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setText("kpi-roas", `${kpis.roas}%`);

    // Top Header Badge
    this.setText("header-total-spend", `$${kpis.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);
  },

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  bindGlobalEvents() {
    // Date Range Filter Simulator
    const dateSelect = document.getElementById("global-date-range");
    if (dateSelect) {
      dateSelect.addEventListener("change", (e) => {
        this.showToast(`Updated performance view to: ${e.target.value}`);
        AnalyticsEngine.renderAllCharts();
      });
    }

    // Reset Demo Data button
    const resetBtn = document.getElementById("btn-reset-demo-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all Google Ads campaigns, keywords, and metrics back to initial factory demo data?")) {
          StorageManager.resetToDefault();
          CampaignManager.renderCampaignsTable();
          KeywordManager.renderKeywordsTable();
          AdBuilder.renderAdsList();
          AnalyticsEngine.renderAllCharts();
          this.updateOverviewMetrics();
          this.showToast("All data successfully restored to default seed state.");
        }
      });
    }
  },

  showToast(message) {
    const container = document.getElementById("app-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #00d2ff;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("visible"), 20);
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
