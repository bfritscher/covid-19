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
        <b-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="(href, i) in models"
          :key="i"
        >
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
        <li>
          <a href="https://pages.semanticscholar.org/coronavirus-research">
          COVID-19 Open Research Dataset (CORD-19)</a>
        </li>
        <li>
          <a href="https://db.schoolofdata.ch/">Open ZH projects (schoolofdata)</a>
        </li>
      </ul>

      <h2 class="mt-5">Research</h2>
      <ul>
        <li>
          <a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30566-3/fulltext">Clinical course and risk factors for mortality of adult inpatients with COVID-19 in Wuhan, China: a retrospective cohort study</a>
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
        "https://www.corona-data.ch/",
        "https://www.ft.com/coronavirus-latest",
        "https://jenfly.github.io/covid-19/covid-19-timeseries.html",
        "http://corona-ch.surge.sh/",
        "https://kickstart.ch/interaktive-coronavirus-karte/",
        "https://rsalzer.github.io/COVID_19_CH/",
        "https://www.bing.com/covid",
        "https://ourworldindata.org/coronavirus",
        "https://chschoenenberger.shinyapps.io/covid19_dashboard/",
        "https://www.nzz.ch/panorama/die-wichtigsten-grafiken-zum-coronavirus-ld.1542774",
        "https://medium.com/@tomaspueyo/coronavirus-act-today-or-people-will-die-f4d3d9cd99ca",
        "https://projects.propublica.org/graphics/covid-hospitals"
      ],
      models: [
        "https://www.washingtonpost.com/graphics/2020/world/corona-simulator/",
        "https://www.mathworks.com/matlabcentral/fileexchange/74411-fitvirus",
        "https://ch.mathworks.com/matlabcentral/fileexchange/74658-fitviruscovid19",
        "https://neherlab.org/covid19/",
        "https://gabgoh.github.io/COVID/index.html"
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
