/**
 * AdPulse 360 - Keywords & Search Targeting Management
 * Manages keywords, match types (Exact, Phrase, Broad, Negative), Quality Score diagnostics, and bids
 */

const KeywordManager = {
  activeMatchTypeFilter: "all",
  searchQuery: "",

  init() {
    this.renderKeywordsTable();
    this.bindEvents();
    this.populateCampaignSelectors();
  },

  bindEvents() {
    const searchInput = document.getElementById("keyword-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderKeywordsTable();
      });
    }

    const matchTypeSelect = document.getElementById("keyword-match-filter");
    if (matchTypeSelect) {
      matchTypeSelect.addEventListener("change", (e) => {
        this.activeMatchTypeFilter = e.target.value;
        this.renderKeywordsTable();
      });
    }

    const addForm = document.getElementById("add-keyword-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => this.handleAddKeyword(e));
    }
  },

  populateCampaignSelectors() {
    const selectors = document.querySelectorAll(".campaign-dropdown-selector");
    const campaigns = StorageManager.getCampaigns();
    selectors.forEach(sel => {
      sel.innerHTML = campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    });
  },

  renderKeywordsTable() {
    const tbody = document.getElementById("keywords-table-body");
    if (!tbody) return;

    let keywords = StorageManager.getKeywords();

    // Match type filter
    if (this.activeMatchTypeFilter !== "all") {
      keywords = keywords.filter(k => k.matchType.toLowerCase() === this.activeMatchTypeFilter.toLowerCase());
    }

    // Search query
    if (this.searchQuery.trim() !== "") {
      keywords = keywords.filter(k => k.text.toLowerCase().includes(this.searchQuery));
    }

    if (keywords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 2.5rem; color: #94a3b8;">
            <i class="fa-solid fa-key" style="font-size: 1.8rem; margin-bottom: 0.8rem; display: block; opacity: 0.5;"></i>
            No keywords found matching current criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = keywords.map(kw => {
      const matchBadgeClass = `badge-match-${kw.matchType.toLowerCase()}`;
      
      // Quality score indicator
      let qsColor = "#10b981"; // green (8-10)
      if (kw.qualityScore && kw.qualityScore < 7) qsColor = "#f59e0b"; // orange (5-7)
      if (kw.qualityScore && kw.qualityScore < 5) qsColor = "#ef4444"; // red (<5)

      return `
        <tr>
          <td class="font-mono" style="font-weight: 600; color: #f8fafc;">
            <span class="kw-text">${kw.text}</span>
          </td>
          <td>
            <span class="match-pill ${matchBadgeClass}">${kw.matchType}</span>
          </td>
          <td class="cell-status">
            <span class="status-dot dot-active"></span>
            <span style="font-size: 0.82rem; color: #cbd5e1;">${kw.status}</span>
          </td>
          <td>
            ${kw.qualityScore ? `
              <div class="qs-badge-wrap" title="Expected CTR: ${kw.qualityScoreDetails?.expectedCtr || 'Above Avg'} | Ad Relevance: ${kw.qualityScoreDetails?.adRelevance || 'Above Avg'}">
                <span class="qs-number font-mono" style="color: ${qsColor}; font-weight: 800;">${kw.qualityScore}/10</span>
                <div class="qs-mini-bar">
                  <div class="qs-fill" style="width: ${kw.qualityScore * 10}%; background: ${qsColor};"></div>
                </div>
              </div>
            ` : '<span style="color: #64748b; font-size: 0.8rem;">— (Negative)</span>'}
          </td>
          <td class="font-mono">${kw.maxCpc ? '$' + Number(kw.maxCpc).toFixed(2) : '—'}</td>
          <td class="font-mono">${Number(kw.impressions).toLocaleString()}</td>
          <td class="font-mono font-bold" style="color: #00d2ff;">${Number(kw.clicks).toLocaleString()}</td>
          <td class="font-mono">${kw.ctr ? kw.ctr + '%' : '0%'}</td>
          <td class="font-mono">$${Number(kw.spend).toFixed(2)}</td>
          <td class="font-mono font-bold" style="color: #a855f7;">${kw.conversions}</td>
          <td>
            <button class="btn-icon btn-delete" onclick="KeywordManager.deleteKeyword('${kw.id}')" title="Delete Keyword">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  deleteKeyword(id) {
    if (confirm("Remove this keyword from the ad group?")) {
      StorageManager.deleteKeyword(id);
      this.renderKeywordsTable();
      App.showToast("Keyword removed.");
    }
  },

  openAddModal() {
    const modal = document.getElementById("add-keyword-modal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeAddModal() {
    const modal = document.getElementById("add-keyword-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  handleAddKeyword(e) {
    e.preventDefault();
    const textInput = document.getElementById("new-kw-text").value.trim();
    const matchType = document.getElementById("new-kw-match-type").value;
    const maxCpc = document.getElementById("new-kw-cpc").value;
    const campaignId = document.getElementById("new-kw-campaign").value;

    if (!textInput) {
      App.showToast("Please enter a keyword.");
      return;
    }

    // Format syntax according to match type
    let formattedText = textInput;
    if (matchType === "Exact" && !formattedText.startsWith("[")) {
      formattedText = `[${formattedText}]`;
    } else if (matchType === "Phrase" && !formattedText.startsWith('"')) {
      formattedText = `"${formattedText}"`;
    } else if (matchType === "Negative" && !formattedText.startsWith("-")) {
      formattedText = `-${formattedText}`;
    }

    StorageManager.addKeyword({
      text: formattedText,
      matchType,
      maxCpc: maxCpc ? parseFloat(maxCpc) : 2.00,
      campaignId
    });

    this.closeAddModal();
    document.getElementById("add-keyword-form").reset();
    this.renderKeywordsTable();
    App.showToast(`Keyword "${formattedText}" added with match type ${matchType}!`);
  }
};
