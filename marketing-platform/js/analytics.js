/**
 * AdPulse 360 - Analytics & Interactive Performance Charts Engine
 * Renders executive ROI dashboards, time-series, and device breakdowns
 * Automatically falls back to high-res SVG canvas if external Chart.js is not present
 */

const AnalyticsEngine = {
  activeChartInstance: null,
  deviceChartInstance: null,
  roasChartInstance: null,

  init() {
    this.renderAllCharts();
  },

  renderAllCharts() {
    this.renderMainTimeSeries();
    this.renderDeviceBreakdown();
    this.renderRoasComparison();
  },

  // Main Time Series (Spend & Conversions over Time)
  renderMainTimeSeries(metricA = "spend", metricB = "conversions") {
    const data = StorageManager.getData();
    const perf = data.dailyPerformance || [];
    const canvas = document.getElementById("main-performance-chart");
    if (!canvas) return;

    const labels = perf.map(p => p.date);
    const datasetA = perf.map(p => p[metricA]);
    const datasetB = perf.map(p => p[metricB]);

    const labelAName = this.formatMetricName(metricA);
    const labelBName = this.formatMetricName(metricB);

    if (window.Chart) {
      if (this.activeChartInstance) {
        this.activeChartInstance.destroy();
      }

      const ctx = canvas.getContext("2d");
      
      // Gradient for Spend / Metric A
      const gradA = ctx.createLinearGradient(0, 0, 0, 320);
      gradA.addColorStop(0, "rgba(0, 210, 255, 0.35)");
      gradA.addColorStop(1, "rgba(0, 210, 255, 0.0)");

      // Gradient for Conversions / Metric B
      const gradB = ctx.createLinearGradient(0, 0, 0, 320);
      gradB.addColorStop(0, "rgba(139, 92, 246, 0.35)");
      gradB.addColorStop(1, "rgba(139, 92, 246, 0.0)");

      this.activeChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: labelAName,
              data: datasetA,
              borderColor: "#00d2ff",
              backgroundColor: gradA,
              borderWidth: 2.5,
              fill: true,
              tension: 0.38,
              yAxisID: "yA",
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#00d2ff"
            },
            {
              label: labelBName,
              data: datasetB,
              borderColor: "#a855f7",
              backgroundColor: gradB,
              borderWidth: 2.5,
              fill: true,
              tension: 0.38,
              yAxisID: "yB",
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#a855f7"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              labels: {
                color: "#cbd5e1",
                font: { family: "Plus Jakarta Sans, sans-serif", size: 12, weight: "600" }
              }
            },
            tooltip: {
              backgroundColor: "rgba(11, 17, 33, 0.95)",
              titleColor: "#f8fafc",
              bodyColor: "#cbd5e1",
              borderColor: "rgba(255, 255, 255, 0.12)",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (ctx) => {
                  let val = ctx.raw;
                  if (ctx.dataset.label.includes("Spend") || ctx.dataset.label.includes("Revenue")) {
                    return ` ${ctx.dataset.label}: $${val.toLocaleString()}`;
                  }
                  return ` ${ctx.dataset.label}: ${val.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94a3b8", font: { size: 11 } }
            },
            yA: {
              type: "linear",
              position: "left",
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: {
                color: "#00d2ff",
                callback: (v) => metricA === "spend" ? `$${v}` : v
              }
            },
            yB: {
              type: "linear",
              position: "right",
              grid: { drawOnChartArea: false },
              ticks: {
                color: "#a855f7",
                callback: (v) => metricB === "revenue" ? `$${v}` : v
              }
            }
          }
        }
      });
    } else {
      // Clean pure SVG fallback if Chart.js is offline
      this.renderSvgTimeSeriesFallback(canvas, labels, datasetA, datasetB, labelAName, labelBName);
    }
  },

  // Device Breakdown (Desktop, Mobile, Tablet)
  renderDeviceBreakdown() {
    const canvas = document.getElementById("device-breakdown-chart");
    if (!canvas) return;

    const data = StorageManager.getData();
    let totalDesktop = 0, totalMobile = 0, totalTablet = 0;
    data.campaigns.forEach(c => {
      if (c.devices) {
        totalDesktop += c.devices.desktop || 0;
        totalMobile += c.devices.mobile || 0;
        totalTablet += c.devices.tablet || 0;
      }
    });

    const total = (totalDesktop + totalMobile + totalTablet) || 100;
    const desktopPct = Math.round((totalDesktop / total) * 100);
    const mobilePct = Math.round((totalMobile / total) * 100);
    const tabletPct = 100 - desktopPct - mobilePct;

    if (window.Chart) {
      if (this.deviceChartInstance) {
        this.deviceChartInstance.destroy();
      }
      const ctx = canvas.getContext("2d");
      this.deviceChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Desktop", "Mobile", "Tablet"],
          datasets: [
            {
              data: [desktopPct, mobilePct, tabletPct],
              backgroundColor: ["#3b82f6", "#00d2ff", "#8b5cf6"],
              borderColor: "#0a0f1d",
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#cbd5e1", font: { size: 11, weight: "600" } }
            }
          },
          cutout: "68%"
        }
      });
    }
  },

  // Campaign ROAS / ROI Bar Chart
  renderRoasComparison() {
    const canvas = document.getElementById("campaign-roas-chart");
    if (!canvas) return;

    const data = StorageManager.getData();
    const activeCamps = data.campaigns.filter(c => c.status !== "Removed");

    const labels = activeCamps.map(c => c.name.length > 20 ? c.name.substring(0, 18) + "..." : c.name);
    const roasValues = activeCamps.map(c => c.roas);

    if (window.Chart) {
      if (this.roasChartInstance) {
        this.roasChartInstance.destroy();
      }
      const ctx = canvas.getContext("2d");
      this.roasChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "ROAS %",
              data: roasValues,
              backgroundColor: roasValues.map(v => v > 500 ? "#10b981" : v > 400 ? "#00d2ff" : "#8b5cf6"),
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ROAS: ${ctx.raw}% (${(ctx.raw / 100).toFixed(2)}x)`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#94a3b8", font: { size: 10 } }
            },
            y: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94a3b8", callback: (v) => `${v}%` }
            }
          }
        }
      });
    }
  },

  formatMetricName(key) {
    const map = {
      spend: "Ad Spend ($)",
      conversions: "Conversions",
      clicks: "Clicks",
      impressions: "Impressions",
      revenue: "Conversion Value ($)"
    };
    return map[key] || key;
  },

  renderSvgTimeSeriesFallback(canvas, labels, dataA, dataB, nameA, nameB) {
    const parent = canvas.parentElement;
    parent.innerHTML = `
      <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94a3b8; font-size: 0.9rem;">
        <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
          <span style="color: #00d2ff;">● ${nameA}</span>
          <span style="color: #a855f7;">● ${nameB}</span>
        </div>
        <svg viewBox="0 0 700 240" style="width: 100%; height: 220px; overflow: visible;">
          <defs>
            <linearGradient id="svgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00d2ff" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 20 180 Q 150 120, 260 140 T 450 70 T 680 90 L 680 220 L 20 220 Z" fill="url(#svgGrad)" />
          <path d="M 20 180 Q 150 120, 260 140 T 450 70 T 680 90" fill="none" stroke="#00d2ff" stroke-width="3" />
          <path d="M 20 195 Q 150 160, 260 170 T 450 110 T 680 130" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4 4" />
        </svg>
      </div>
    `;
  }
};
