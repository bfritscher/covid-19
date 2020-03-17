<template>
  <div>
    <b-button-group size="sm">
      <b-button
        :pressed="chartOptions.scales.yAxes[0].type === scaleType.logarithmic"
        :variant="
          chartOptions.scales.yAxes[0].type === scaleType.logarithmic
            ? 'primary'
            : ''
        "
        @click="toggleYScale"
        >{{ scaleType.logarithmic }}</b-button
      >
      <b-button
        :pressed="chartOptions.scales.yAxes[0].type === scaleType.linear"
        :variant="
          chartOptions.scales.yAxes[0].type === scaleType.linear
            ? 'primary'
            : ''
        "
        @click="toggleYScale"
      >
        {{ scaleType.linear }}</b-button
      >
    </b-button-group>
    <line-chart
      :chart-data="chartData"
      :options="chartOptions"
      style="width:100%"
    ></line-chart>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart.js";

export default {
  name: "ChartWrapper",
  props: ["chartData", "options"],
  data() {
    return {
      scaleType: {
        logarithmic: "logarithmic",
        linear: "linear"
      },
      defaultOptions: {
        elements: {
          point: {
            radius: 0
          }
        },
        legend: {
          display: true,
          position: "right"
        },
        responsive: true,
        title: {
          display: false,
          text: "Chart.js Line Chart"
        },
        tooltips: {
          mode: "point",
          intersect: true
        },
        plugins: {
          datalabels: {
            align: "left",
            anchor: "end",
            font: {
              weight: "bold"
            },
            display(context) {
              return context.dataIndex === context.dataset.data.length - 1;
            },
            formatter(value, context) {
              return context.dataset.label;
            }
          },
          zoom: {
            pan: {
              enabled: true,
              rangeMin: {
                // Format of min pan range depends on scale type
                x: 0,
                y: 0
              }
            },
            zoom: {
              enabled: true,
              mode: "y"
            }
          }
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "NB Days"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: "linear", //'logarithmic' : 'linear'
              scaleLabel: {
                display: true,
                labelString: "Value"
              },
              ticks: {
                maxTicksLimit: 20, //20
                callback: function(value) {
                  //needed to change the scientific notation results from using logarithmic scale
                  return Number(value.toString()).toLocaleString(); //pass tick values as a string into Number function
                }
                //beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    chartOptions() {
      const cOptions = Object.assign({}, this.defaultOptions);
      cOptions.scales.yAxes[0].type =
        this.options.type || this.scaleType.logarithmic;
      if (this.options.tooltips) {
        cOptions.tooltips = this.options.tooltips;
      }
      return cOptions;
    }
  },
  methods: {
    toggleYScale() {
      this.chartOptions.scales.yAxes[0].type =
        this.chartOptions.scales.yAxes[0].type === this.scaleType.logarithmic
          ? this.scaleType.linear
          : this.scaleType.logarithmic;
    }
  },
  components: {
    LineChart
  }
};
</script>

<style></style>
