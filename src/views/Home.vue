<template>
  <div class="home">
    <multiselect
      v-model="config.selectedCountry"
      :options="optionsCountries"
    ></multiselect>

    <div v-if="datacollectionModel.model">
      <h2>Prediction</h2>
      <p>
        Logistic model: y = K / (1 + A * Math.exp(-r * x))<br />
        Found values: {{ datacollectionModel.model.model }}<br />
        source of model:
        <a
          href="https://www.mathworks.com/matlabcentral/fileexchange/74411-fitvirus"
          >milan batista (2020). fitVirus</a
        >
      </p>
      <b-row>
        <b-col>
          <chart-wrapper
            v-if="datacollectionModel.model.data.x"
            :chart-data="datacollectionModel"
            :options="optionModel"
            style="max-width: 600px"
          ></chart-wrapper>
        </b-col>
        <b-col>
          <div style="height: 600px;overflow:auto">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">day</th>
                  <th scope="col">confirmed</th>
                  <th scope="col">prediction</th>
                  <th scope="col">error %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, i) in datacollectionModel.model.data.x" :key="i">
                  <td>{{ datacollectionModel.model.data.x[i] }}</td>
                  <td>{{ datacollectionModel.model.data.y[i] }}</td>
                  <td>{{ datacollectionModel.model.data.yd[i] }}</td>
                  <td>{{ datacollectionModel.model.data.err[i] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      unable to create regression model with available data
    </div>

    <b-row>
      <b-col>
        <h2>Current Data</h2>
        <b-form-group label="Data">
          <b-form-radio-group v-model="dataKey" name="radio-sub-component">
            <b-form-radio value="confirmed">Confirmed</b-form-radio>
            <b-form-radio value="population"
              >Confirmed / Population 1M</b-form-radio
            >
            <b-form-radio value="density">Confirmed / density</b-form-radio>
            <b-form-radio value="medAge">Confirmed / median age</b-form-radio>
            <b-form-radio value="urbanPop"
              >Confirmed / %urban pop.</b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>
        source:
        <a href="https://github.com/CSSEGISandData/COVID-19"
          >Coronavirus COVID-19 Global Cases by the Center for Systems Science
          and Engineering (CSSE) at Johns Hopkins University (JHU)</a
        >

        <chart-wrapper
          :chart-data="datacollection"
          :options="options"
          style="width: 100%"
        ></chart-wrapper>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import ChartWrapper from "@/components/ChartWrapper.vue";
import { labels, datasets, config } from "@/data/parseData.js";
import { makeModel } from "@/data/regression.js";
export default {
  name: "Home",
  data() {
    return {
      config,
      dataKey: "population",
      model: {
        data: {}
      },
      options: {
        type: "logarithmic"
      },
      optionModel: {
        type: "linear",
        tooltips: {
          mode: "index",
          intersect: true
        }
      }
    };
  },
  computed: {
    datacollectionModel() {
      try {
        const model = makeModel(this.sortedDatasets[0].confirmed);
        return {
          model,
          labels: model.data.x,
          datasets: [
            {
              label: "confirmed",
              pointRadius: 5,
              showLine: false,
              fill: false,
              borderColor: "#0062cc",
              pointBackgroundColor: "#0062cc",
              data: model.data.y
            },
            {
              label: "prediction",
              pointRadius: 1,
              borderColor: "#aaa",
              fill: false,
              data: model.data.yd
            }
          ]
        };
      } catch (e) {
        // eslint-disable-next-line
        console.debug(e);
        return {};
      }
    },
    datacollection() {
      return {
        labels: labels,
        datasets: this.sortedDatasets
      };
    },
    sortedDatasets() {
      let ds = datasets.slice(0);
      ds.sort((a, b) => {
        if (a.label === this.config.selectedCountry) return -1; //Italy //Switzerland
        if (b.label === this.config.selectedCountry) return 1;
        return a.label.localeCompare(b.label);
      });
      ds.forEach(r => {
        r.data = r[this.dataKey];
      });

      if (this.dataKey === "confirmed") {
        const doubleTimes = [2, 3, 4];
        doubleTimes.forEach(n => {
          const factor = Math.pow(2, 1 / n);
          const c = 80 + n * 30;
          ds = ds.concat([
            {
              label: `${n}-day doubling`,
              fill: false,
              borderColor: `rgb(${c},${c},${c})`,
              borderWidth: 2,
              borderDash: [4, 8],
              pointRadius: 0,
              data: new Array(config.maxLength)
                .fill(0)
                .map((v, i) => 100 * Math.pow(factor, i))
                .filter(v => v <= config.maxValue * 1.1)
            }
          ]);
        });
      }
      return ds;
    },
    optionsCountries() {
      const countries = datasets.map(ds => ds.label);
      countries.sort();
      return countries;
    }
  },
  components: {
    ChartWrapper,
    Multiselect
  }
};
</script>
