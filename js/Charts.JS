/**
 * EduSkill Marketplace System - Charts JS
 * File: Charts.JS
 * Description: Chart.js configurations for analytics pages.
 */

/* ============================================================
   MONTHLY ENROLLMENT CHART
   ============================================================ */
function initMonthlyEnrollmentChart(canvasId, labels, data) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Enrollments',
        data: data,
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        borderColor: '#2563EB',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#F9FAFB',
          bodyColor: '#D1D5DB',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (ctx) { return ' ' + ctx.parsed.y + ' enrollments'; }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6B7280', font: { size: 12 } }
        },
        y: {
          grid: { color: '#F3F4F6', drawBorder: false },
          border: { display: false, dash: [4, 4] },
          ticks: { color: '#6B7280', font: { size: 12 }, precision: 0 }
        }
      }
    }
  });
}

/* ============================================================
   YEARLY ENROLLMENT TREND CHART
   ============================================================ */
function initYearlyTrendChart(canvasId, labels, data) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Yearly Enrollments',
        data: data,
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#A855F7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#F9FAFB',
          bodyColor: '#D1D5DB',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6B7280', font: { size: 12 } }
        },
        y: {
          grid: { color: '#F3F4F6' },
          border: { display: false },
          ticks: { color: '#6B7280', font: { size: 12 }, precision: 0 }
        }
      }
    }
  });
}

/* ============================================================
   RATING DISTRIBUTION CHART
   ============================================================ */
function initRatingChart(canvasId, data) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
      datasets: [{
        data: data,
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#374151',
            font: { size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#F9FAFB',
          bodyColor: '#D1D5DB',
          padding: 12,
          callbacks: {
            label: function (ctx) {
              var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
              var pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
              return ' ' + ctx.parsed + ' reviews (' + pct + '%)';
            }
          }
        }
      }
    }
  });
}

/* ============================================================
   COURSE VIEWS CHART (Analytics per course)
   ============================================================ */
function initCourseViewsChart(canvasId, labels, views, enrollments) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Views',
          data: views,
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563EB',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Enrollments',
          data: enrollments,
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          borderColor: '#A855F7',
          borderWidth: 2,
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#374151',
            font: { size: 12 },
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#F9FAFB',
          bodyColor: '#D1D5DB',
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6B7280', font: { size: 11 } }
        },
        y: {
          grid: { color: '#F3F4F6' },
          ticks: { color: '#6B7280', font: { size: 11 }, precision: 0 }
        }
      }
    }
  });
}

/* ============================================================
   PROVIDER COMPARISON CHART (Officer dashboard)
   ============================================================ */
function initProviderComparisonChart(canvasId, labels, data) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Enrollments',
        data: data,
        backgroundColor: labels.map(function (_, i) {
          var palette = ['#2563EB', '#A855F7', '#10B981', '#F59E0B', '#EF4444'];
          return palette[i % palette.length] + '33';
        }),
        borderColor: labels.map(function (_, i) {
          var palette = ['#2563EB', '#A855F7', '#10B981', '#F59E0B', '#EF4444'];
          return palette[i % palette.length];
        }),
        borderWidth: 2,
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { color: '#F3F4F6' },
          ticks: { color: '#6B7280', font: { size: 12 }, precision: 0 }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#374151', font: { size: 12 } }
        }
      }
    }
  });
}
