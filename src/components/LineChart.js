import { Line, mixins } from "vue-chartjs";
import "chartjs-plugin-datalabels";
import "chartjs-plugin-zoom";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: {
      handler() {
        this.$data._chart.options = this.options;
        this.$data._chart.update();
      },
      deep: true
    }
  }
};
