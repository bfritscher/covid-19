<template>
  <div class="links">
    <b-container>
      <h2 class="mt-5">Visualisations</h2>
      <b-row>
        <b-col
          cols="12"
          sm="6"
          md="3"
          v-for="(href, i) in visualisations"
          :key="i"
        >
          <a :href="href"> <b-img thumbnail fluid :src="href | pic"></b-img></a>
        </b-col>
      </b-row>

      <h2 class="mt-5">Simulations / Models</h2>
      <b-row>
        <b-col cols="12" sm="6" md="3" v-for="(href, i) in models" :key="i">
          <a :href="href"> <b-img thumbnail fluid :src="href | pic"></b-img></a>
        </b-col>
      </b-row>

      <h2 class="mt-5">Datasets</h2>
      <ul>
        <li>
          <a href="https://github.com/CSSEGISandData/COVID-19"
            >Coronavirus COVID-19 Global Cases by the Center for Systems Science
            and Engineering (CSSE) at Johns Hopkins University (JHU)</a
          >
        </li>
        <li>
          <a href="https://github.com/daenuprobst/covid19-cases-switzerland"
            >github.com/daenuprobst/covid19-cases-switzerland</a
          >
        </li>
        <li>
          <a href="https://www.worldometers.info/coronavirus/"
            >worldometers.info/coronavirus/</a
          >
        </li>
      </ul>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "Links",
  data() {
    return {
      visualisations: [
        "https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6",
        "https://jenfly.github.io/covid-19/covid-19-timeseries.html",
        "http://corona-ch.surge.sh/",
        "https://www.bing.com/covid",
        "https://ourworldindata.org/coronavirus",
        "https://www.nzz.ch/panorama/die-wichtigsten-grafiken-zum-coronavirus-ld.1542774"
      ],
      models: [
        "https://www.washingtonpost.com/graphics/2020/world/corona-simulator/",
        "https://www.mathworks.com/matlabcentral/fileexchange/74411-fitvirus",
        "https://neherlab.org/covid19/"
      ]
    };
  },
  filters: {
    pic(href) {
      return `./thumbnails/${href
        .replace(/https?:\/\//, "")
        .replace(/#.*/, "")
        .replace(/\//g, "_")}.png`;
    }
  }
};
</script>
