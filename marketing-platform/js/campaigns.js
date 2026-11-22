/**
 * AdPulse 360 - Google Ads Campaign Creation & Management
 * Handles campaign tables, status toggles, inline editing, and the multi-step creation wizard
 */

const CampaignManager = {
  currentFilter: "all",
  searchQuery: "",

  init() {
    this.renderCampaignsTable();
    this.bindEvents();
  },

  bindEvents() {
    // Campaign search
    const searchInput = document.getElementById("campaign-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderCampaignsTable();
      });
    }

    // Status filter
    const statusSelect = document.getElementById("campaign-status-filter");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        this.currentFilter = e.target.value;
        this.renderCampaignsTable();
      });
    }

    // Wizard submit
    const wizardForm = document.getElementById("new-campaign-form");
    if (wizardForm) {
      wizardForm.addEventListener("submit", (e) => this.handleWizardSubmit(e));
    }
  },

  renderCampaignsTable() {
    const tbody = document.getElementById("campaigns-table-body");
    if (!tbody) return;

    let campaigns = StorageManager.getCampaigns();

    // Filter by status
    if (this.currentFilter !== "all") {
      campaigns = campaigns.filter(c => c.status.toLowerCase() === this.currentFilter.toLowerCase());
    }

    // Filter by search query
    if (this.searchQuery.trim() !== "") {
      campaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery) || 
        c.type.toLowerCase().includes(this.searchQuery)
      );
    }

    if (campaigns.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 3rem; color: #94a3b8;">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.8rem; display: block; opacity: 0.5;"></i>
            No campaigns found matching current filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = campaigns.map(c => {
      const isPaused = c.status === "Paused";
      const statusBadgeClass = isPaused ? "badge-paused" : "badge-active";
      const statusIcon = isPaused ? "fa-pause" : "fa-circle-play";
      
      return `
        <tr data-campaign-id="${c.id}">
          <td class="cell-status">
            <button class="status-toggle-btn ${statusBadgeClass}" onclick="CampaignManager.toggleStatus('${c.id}')" title="Click to Toggle Status">
              <i class="fa-solid ${statusIcon}"></i>
              <span>${c.status}</span>
            </button>
          </td>
          <td class="cell-name">
            <div class="campaign-title-wrap">
              <span class="campaign-name-text">${c.name}</span>
              <div class="campaign-meta-chips">
                <span class="type-pill type-${c.type.toLowerCase().replace(/[\s&]+/g, '-')}">${c.type}</span>
                <span class="bidding-pill"><i class="fa-solid fa-gavel"></i> ${c.biddingStrategy}</span>
              </div>
            </div>
          </td>
          <td class="cell-budget font-mono">
            <span class="budget-value">$${Number(c.dailyBudget).toFixed(2)}/day</span>
            <button class="inline-edit-btn" onclick="CampaignManager.openBudgetModal('${c.id}')" title="Edit Budget">
              <i class="fa-solid fa-pencil"></i>
            </button>
          </td>
          <td class="cell-metric font-mono">${Number(c.impressions).toLocaleString()}</td>
          <td class="cell-metric font-mono font-bold" style="color: #00d2ff;">${Number(c.clicks).toLocaleString()}</td>
          <td class="cell-metric font-mono">${c.ctr}%</td>
          <td class="cell-metric font-mono">$${Number(c.avgCpc).toFixed(2)}</td>
          <td class="cell-metric font-mono font-bold">$${Number(c.spend).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="cell-metric font-mono font-bold" style="color: #a855f7;">${Number(c.conversions).toLocaleString()}</td>
          <td class="cell-metric font-mono">$${Number(c.costPerConv).toFixed(2)}</td>
          <td class="cell-metric font-mono font-bold ${c.roas > 450 ? 'text-emerald' : ''}">${c.roas}%</td>
          <td class="cell-actions">
            <div class="action-btn-group">
              <button class="btn-icon" onclick="CampaignManager.openEditModal('${c.id}')" title="Campaign Settings">
                <i class="fa-solid fa-sliders"></i>
              </button>
              <button class="btn-icon btn-delete" onclick="CampaignManager.deleteCampaign('${c.id}')" title="Delete Campaign">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  toggleStatus(id) {
    const newStatus = StorageManager.toggleCampaignStatus(id);
    if (newStatus) {
      this.renderCampaignsTable();
      App.updateOverviewMetrics();
      AnalyticsEngine.renderAllCharts();
      App.showToast(`Campaign status updated to ${newStatus}`);
    }
  },

  deleteCampaign(id) {
    const c = StorageManager.getCampaignById(id);
    if (!c) return;
    if (confirm(`Are you sure you want to delete campaign "${c.name}"? This will remove its ad groups and keywords.`)) {
      StorageManager.deleteCampaign(id);
      this.renderCampaignsTable();
      App.updateOverviewMetrics();
      AnalyticsEngine.renderAllCharts();
      App.showToast(`Campaign "${c.name}" was deleted.`);
    }
  },

  openBudgetModal(id) {
    const c = StorageManager.getCampaignById(id);
    if (!c) return;
    const newBudgetStr = prompt(`Enter new daily budget for "${c.name}":`, c.dailyBudget);
    if (newBudgetStr !== null) {
      const newBudget = parseFloat(newBudgetStr);
      if (!isNaN(newBudget) && newBudget > 0) {
        StorageManager.updateCampaign(id, { dailyBudget: newBudget });
        this.renderCampaignsTable();
        App.showToast(`Daily budget updated to $${newBudget.toFixed(2)}/day`);
      } else {
        App.showToast("Invalid budget amount. Please enter a positive number.");
      }
    }
  },

  openEditModal(id) {
    const c = StorageManager.getCampaignById(id);
    if (!c) return;
    
    const newName = prompt("Edit Campaign Name:", c.name);
    if (newName && newName.trim() !== "") {
      StorageManager.updateCampaign(id, { name: newName.trim() });
      this.renderCampaignsTable();
      App.showToast("Campaign name updated successfully.");
    }
  },

  // Open Campaign Creation Wizard Modal
  openWizard() {
    const modal = document.getElementById("campaign-wizard-modal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeWizard() {
    const modal = document.getElementById("campaign-wizard-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  handleWizardSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("wiz-camp-name").value.trim();
    const type = document.getElementById("wiz-camp-type").value;
    const objective = document.getElementById("wiz-camp-objective").value;
    const dailyBudget = parseFloat(document.getElementById("wiz-camp-budget").value);
    const biddingStrategy = document.getElementById("wiz-camp-bidding").value;
    const targetCpa = document.getElementById("wiz-camp-target-cpa").value;
    const locationsInput = document.getElementById("wiz-camp-locations").value;
    const locations = locationsInput.split(",").map(s => s.trim()).filter(Boolean);

    if (!name) {
      App.showToast("Please provide a campaign name.");
      return;
    }
    if (isNaN(dailyBudget) || dailyBudget <= 0) {
      App.showToast("Please provide a valid daily budget.");
      return;
    }

    const created = StorageManager.addCampaign({
      name,
      type,
      objective,
      dailyBudget,
      biddingStrategy,
      targetCpa: targetCpa ? parseFloat(targetCpa) : null,
      locations: locations.length > 0 ? locations : ["United States"]
    });

    this.closeWizard();
    document.getElementById("new-campaign-form").reset();
    this.renderCampaignsTable();
    App.updateOverviewMetrics();
    AnalyticsEngine.renderAllCharts();
    App.showToast(`Campaign "${created.name}" created and synced with Google Ads API!`);
  }
};
