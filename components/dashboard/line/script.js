/* =========================================================
   GLOBAL CHART.JS CONFIG
========================================================= */

Chart.defaults.font.family =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

Chart.defaults.color = "#8d8d8d";

Chart.defaults.animation.duration = 900;

Chart.defaults.animation.easing = "easeOutQuart";



/* =========================================================
   UTILITY
========================================================= */

function createVerticalGradient(
  context,
  chartArea,
  topColor,
  bottomColor
) {

  if (!chartArea) return topColor;

  const gradient = context.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom
  );

  gradient.addColorStop(0, topColor);

  gradient.addColorStop(1, bottomColor);

  return gradient;
}



/* =========================================================
   STRIPED PATTERN
   Used in chart 01
========================================================= */

function createStripePattern() {

  const patternCanvas =
    document.createElement("canvas");

  patternCanvas.width = 12;

  patternCanvas.height = 12;


  const ctx =
    patternCanvas.getContext("2d");


  ctx.strokeStyle =
    "rgba(190, 190, 190, 0.24)";

  ctx.lineWidth = 1;


  ctx.beginPath();

  ctx.moveTo(-2, 12);

  ctx.lineTo(12, -2);

  ctx.stroke();


  ctx.beginPath();

  ctx.moveTo(4, 14);

  ctx.lineTo(14, 4);

  ctx.stroke();


  return ctx.createPattern(
    patternCanvas,
    "repeat"
  );
}



/* =========================================================
   CHART 01
   SIGNED OVER TIME
========================================================= */

const signedCanvas =
  document.getElementById("signedChart");


const signedChart =
  new Chart(
    signedCanvas,
    {

      type: "line",

      data: {

        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun"
        ],

        datasets: [

          {

            label: "Signed",

            data: [
              200,
              145,
              220,
              280,
              180,
              230
            ],

            borderColor:
              "#b9b9b9",

            borderWidth: 2,

            backgroundColor:
              createStripePattern(),

            fill: true,

            tension: 0.38,

            cubicInterpolationMode:
              "monotone",

            pointRadius: 0,

            pointHoverRadius: 5,

            pointBackgroundColor:
              "#ffffff",

            pointBorderColor:
              "#a9a9a9",

            pointBorderWidth: 2

          },


          {

            label: "Previous period",

            data: [
              105,
              180,
              105,
              330,
              255,
              205
            ],

            borderColor:
              "#171717",

            borderWidth: 3,

            borderDash: [
              7,
              8
            ],

            fill: false,

            tension: 0.4,

            cubicInterpolationMode:
              "monotone",

            pointRadius: 0,

            pointHoverRadius: 5,

            pointBackgroundColor:
              "#171717",

            pointBorderColor:
              "#ffffff",

            pointBorderWidth: 2

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
            display: false
          },


          tooltip: {

            enabled: true,

            backgroundColor:
              "#181818",

            titleColor:
              "#ffffff",

            bodyColor:
              "#d7d7d7",

            padding: 12,

            cornerRadius: 8,

            displayColors: true,

            usePointStyle: true

          }

        },


        scales: {

          x: {

            border: {
              display: false
            },

            grid: {
              display: false
            },

            ticks: {

              color:
                "#9c9c9c",

              padding: 15,

              font: {
                size: 12
              }

            }

          },


          y: {

            min: 0,

            max: 400,

            ticks: {

              stepSize: 100,

              color:
                "#9e9e9e",

              padding: 12

            },

            border: {
              display: false
            },

            grid: {

              color:
                "#f1f1f1",

              lineWidth: 1

            }

          }

        }

      }

    }
  );



/* =========================================================
   CHART 02
   PERFORMANCE
========================================================= */

const performanceCanvas =
  document.getElementById(
    "performanceChart"
  );


const performanceValues = [

  6.1,
  6.2,
  6.6,
  6.1,
  6.4,
  5.1,
  5.6,
  5.3,
  6.1,
  5.8,
  7.9,
  7.2,
  5.5,
  4.8,
  4.5,
  4.9,
  4.7,
  5.2,
  4.6,
  4.8,
  4.4,
  3.9,
  4.3,
  5.3,
  5.7,
  6.7,
  7.0,
  6.9,
  6.6,
  6.3,
  5.4,
  6.5,
  6.9,
  7.2,
  7.7,
  8.0,
  7.4,
  6.1,
  4.9,
  4.2,
  5.0,
  6.0,
  7.6,
  6.3,
  5.1,
  6.4,
  6.5,
  6.9,
  6.6,
  7.0,
  7.4,
  7.3,
  7.9,
  7.9,
  7.2,
  7.8,
  8.4,
  7.8,
  8.2,
  8.6,
  9.7,
  8.8,
  8.1,
  7.6,
  8.1,
  8.9,
  8.4,
  8.4,
  7.8,
  8.0

];


const performanceLabels =
  Array.from(
    {
      length:
        performanceValues.length
    },
    (_, index) => index
  );


const performanceChart =
  new Chart(
    performanceCanvas,
    {

      type: "line",

      data: {

        labels:
          performanceLabels,

        datasets: [

          {

            label:
              "Total calls/day",

            data:
              performanceValues,

            borderColor:
              "#262626",

            borderWidth:
              2.2,

            tension:
              0.18,

            pointRadius:
              0,

            pointHoverRadius:
              5,

            pointHoverBackgroundColor:
              "#111111",

            pointHoverBorderColor:
              "#ffffff",

            pointHoverBorderWidth:
              2,

            fill:
              true,

            backgroundColor:
              function (context) {

                const chart =
                  context.chart;

                const {
                  ctx,
                  chartArea
                } = chart;

                if (!chartArea) {

                  return "rgba(0,0,0,.06)";

                }

                return createVerticalGradient(
                  ctx,
                  chartArea,
                  "rgba(0,0,0,.14)",
                  "rgba(0,0,0,.015)"
                );

              }

          }

        ]

      },


      options: {

        responsive:
          true,

        maintainAspectRatio:
          false,


        interaction: {

          mode:
            "index",

          intersect:
            false

        },


        plugins: {

          legend: {
            display:
              false
          },


          tooltip: {

            backgroundColor:
              "#ffffff",

            titleColor:
              "#171717",

            bodyColor:
              "#757575",

            borderColor:
              "#e8e8e8",

            borderWidth:
              1,

            padding:
              13,

            cornerRadius:
              9,

            displayColors:
              false,

            titleFont: {

              weight:
                "600"

            },

            callbacks: {

              title:
                function (
                  tooltipItems
                ) {

                  const index =
                    tooltipItems[0]
                      .dataIndex;

                  const day =
                    Math.min(
                      30,
                      5 +
                      Math.floor(
                        index /
                        2.7
                      )
                    );

                  return `Jan ${day}`;

                },


              label:
                function (context) {

                  return (
                    "Total calls/day   " +
                    context
                      .parsed
                      .y
                      .toFixed(1)
                  );

                }

            }

          }

        },


        scales: {

          x: {

            grid: {
              display:
                false
            },

            border: {
              display:
                false
            },

            ticks: {

              autoSkip:
                false,

              maxRotation:
                0,

              color:
                "#979797",

              callback:
                function (
                  value,
                  index
                ) {

                  const labels = {
                    0: "Jan 6",
                    5: "Jan 8",
                    10: "Jan 10",
                    15: "Jan 12",
                    20: "Jan 14",
                    25: "Jan 16",
                    30: "Jan 18",
                    35: "Jan 20",
                    40: "Jan 22",
                    45: "Jan 24",
                    50: "Jan 26",
                    55: "Jan 28",
                    65: "Jan 30"
                  };

                  return (
                    labels[index] ||
                    ""
                  );

                }

            }

          },


          y: {

            min:
              0,

            max:
              10,

            ticks: {

              stepSize:
                2,

              color:
                "#929292",

              padding:
                14

            },

            border: {
              display:
                false
            },

            grid: {

              color:
                "#f1f1f1"

            }

          }

        }

      }

    }
  );



/* =========================================================
   CHART 03
   REVENUE
========================================================= */

const revenueCanvas =
  document.getElementById(
    "revenueChart"
  );


const revenueLabels = [

  "12 Feb",
  "27 Feb",
  "12 Mar",
  "26 Mar",
  "9 Apr",
  "23 Apr",
  "7 May",
  "25 May",
  "11 Jun",
  "24 Jun",
  "9 Jul",
  "29 Jul",
  "13 Aug",
  "27 Aug",
  "10 Sept",
  "24 Sept",
  "8 Oct",
  "22 Oct",
  "12 Nov",
  "26 Nov",
  "10 Dec",
  "24 Dec",
  "7 Jan",
  "21 Jan"

];


const grossRevenue = [

  60000,
  61000,
  68000,
  60000,
  76000,
  79000,
  78000,
  56000,
  50000,
  57000,
  58000,
  62000,
  69000,
  77000,
  73000,
  72000,
  81000,
  88000,
  91000,
  89000,
  93000,
  92000,
  95000,
  82000

];


const netRevenue = [

  35000,
  33000,
  36000,
  38000,
  30000,
  34000,
  37000,
  33000,
  35000,
  38000,
  35000,
  37000,
  42000,
  45000,
  44000,
  47000,
  57000,
  49000,
  51000,
  45000,
  41000,
  46000,
  52000,
  61000

];


const revenueChart =
  new Chart(
    revenueCanvas,
    {

      type: "line",

      data: {

        labels:
          revenueLabels,

        datasets: [

          {

            label:
              "Gross Volume",

            data:
              grossRevenue,

            borderColor:
              "#5b59e8",

            borderWidth:
              2.5,

            pointRadius:
              0,

            pointHoverRadius:
              5,

            pointBackgroundColor:
              "#5b59e8",

            tension:
              0.38,

            fill:
              true,

            backgroundColor:
              function (context) {

                const chart =
                  context.chart;

                const {
                  ctx,
                  chartArea
                } = chart;

                if (!chartArea) {

                  return "rgba(91,89,232,.08)";

                }

                return createVerticalGradient(
                  ctx,
                  chartArea,
                  "rgba(91,89,232,.10)",
                  "rgba(91,89,232,0)"
                );

              }

          },


          {

            label:
              "Net Volume",

            data:
              netRevenue,

            borderColor:
              "#c9c9c9",

            borderWidth:
              2,

            pointRadius:
              0,

            pointHoverRadius:
              4,

            pointBackgroundColor:
              "#bababa",

            tension:
              0.35,

            fill:
              false

          }

        ]

      },


      options: {

        responsive:
          true,

        maintainAspectRatio:
          false,

        interaction: {

          mode:
            "index",

          intersect:
            false

        },


        plugins: {

          legend: {
            display:
              false
          },


          tooltip: {

            backgroundColor:
              "#171717",

            titleColor:
              "#ffffff",

            bodyColor:
              "#dddddd",

            padding:
              12,

            cornerRadius:
              8,

            usePointStyle:
              true,

            callbacks: {

              label:
                function (context) {

                  const value =
                    context.parsed.y;

                  return (
                    context.dataset.label +
                    ": $" +
                    value.toLocaleString()
                  );

                }

            }

          }

        },


        scales: {

          x: {

            border: {
              display:
                false
            },

            grid: {
              display:
                false
            },

            ticks: {

              maxRotation:
                0,

              color:
                "#929292",

              maxTicksLimit:
                12

            }

          },


          y: {

            min:
              0,

            max:
              100000,

            ticks: {

              stepSize:
                25000,

              color:
                "#929292",

              padding:
                14,

              callback:
                function (
                  value
                ) {

                  if (
                    value ===
                    0
                  ) {

                    return "0";

                  }

                  return (
                    value /
                    1000
                  ) + ",000";

                }

            },

            border: {
              display:
                false
            },

            grid: {

              color:
                "#eeeeee"

            }

          }

        }

      }

    }
  );



/* =========================================================
   CHART 04
   PROJECT OVERVIEW
========================================================= */

const overviewCanvas =
  document.getElementById(
    "overviewChart"
  );


const overviewChart =
  new Chart(
    overviewCanvas,
    {

      type: "line",

      data: {

        labels: [

          "Jan",
          "Feb",
          "Mar",
          "Wed",
          "Thu",
          "Jul",
          "Sep"

        ],

        datasets: [

          {

            label:
              "Revenue",

            data: [
              35,
              175,
              90,
              285,
              190,
              275,
              360
            ],

            borderColor:
              "#398aca",

            borderWidth:
              3,

            tension:
              0.42,

            pointRadius:
              function (context) {

                return (
                  context.dataIndex ===
                  3
                )
                  ? 5
                  : 0;

              },

            pointBackgroundColor:
              "#398aca",

            pointBorderColor:
              "#ffffff",

            pointBorderWidth:
              2,

            fill:
              true,

            backgroundColor:
              function (context) {

                const chart =
                  context.chart;

                const {
                  ctx,
                  chartArea
                } = chart;

                if (!chartArea) {

                  return "rgba(57,138,202,.10)";

                }

                return createVerticalGradient(
                  ctx,
                  chartArea,
                  "rgba(57,138,202,.16)",
                  "rgba(57,138,202,.015)"
                );

              }

          },


          {

            label:
              "Velocity",

            data: [
              25,
              90,
              200,
              135,
              255,
              165,
              280
            ],

            borderColor:
              "#7542ad",

            borderWidth:
              3,

            tension:
              0.42,

            pointRadius:
              function (context) {

                return (
                  context.dataIndex ===
                  3 ||
                  context.dataIndex ===
                  4
                )
                  ? 5
                  : 0;

              },

            pointBackgroundColor:
              "#7542ad",

            pointBorderColor:
              "#ffffff",

            pointBorderWidth:
              2,

            fill:
              true,

            backgroundColor:
              function (context) {

                const chart =
                  context.chart;

                const {
                  ctx,
                  chartArea
                } = chart;

                if (!chartArea) {

                  return "rgba(117,66,173,.08)";

                }

                return createVerticalGradient(
                  ctx,
                  chartArea,
                  "rgba(117,66,173,.12)",
                  "rgba(117,66,173,.01)"
                );

              }

          }

        ]

      },


      options: {

        responsive:
          true,

        maintainAspectRatio:
          false,

        interaction: {

          mode:
            "nearest",

          intersect:
            false

        },


        plugins: {

          legend: {
            display:
              false
          },


          tooltip: {

            backgroundColor:
              "rgba(255,255,255,.96)",

            titleColor:
              "#161616",

            bodyColor:
              "#666666",

            borderColor:
              "rgba(0,0,0,.07)",

            borderWidth:
              1,

            padding:
              11,

            cornerRadius:
              8,

            displayColors:
              false

          }

        },


        scales: {

          x: {

            border: {
              display:
                false
            },

            grid: {
              display:
                false
            },

            ticks: {

              color:
                "#677382",

              padding:
                12

            }

          },


          y: {

            min:
              0,

            max:
              400,

            ticks: {

              stepSize:
                100,

              color:
                "#677382",

              padding:
                12

            },

            border: {
              display:
                false
            },

            grid: {

              color:
                "rgba(80,100,120,.12)"

            }

          }

        }

      }

    }
  );