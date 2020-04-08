import parse from "csv-parse/lib/sync";

import population from "./world_populations.csv";

const worldPopulationStats = parse(population, {
  from_line: 2
});

function getCountryStats(name) {
  return worldPopulationStats.find(r => r[0] === name);
}

const datasets = [];
const labels = [];
const config = {
  maxLength: 0,
  maxValue: 0,
  selectedCountry: "Switzerland"
};

const colors = [
  "#296CB3",
  "#2D71B5",
  "#3177B8",
  "#367DBB",
  "#3A82BE",
  "#3E88C0",
  "#438EC3",
  "#4793C6",
  "#4B99C9",
  "#509FCB",
  "#54A5CE",
  "#58AAD1",
  "#5DB0D4",
  "#61B6D6",
  "#65BBD9",
  "#6AC1DC",
  "#6EC7DF",
  "#72CCE1",
  "#77D2E4",
  "#7BD8E7",
  "#80DEEA"
];

fetch(
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
)
  .then(r => r.text())
  .then(async covid => {
    const covidConfirmed = parse(covid, { from_line: 1 });
    await fetch(
      "https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/covid19_cases_switzerland_openzh.csv"
    )
      .then(r => r.text())
      .then(covid => {
        const data = parse(covid, { from_line: 2 });
        const chCantons = [
          "",
          "Switzerland Cantons",
          1,
          1,
          8,
          8,
          18,
          27,
          42,
          56,
          90,
          114
        ].concat(data.map(r => parseInt(r[27], 10)));
        covidConfirmed.push(chCantons);
      });

    covidConfirmed.push([
      "",
      "Switzerland BAG",
      1,
      1,
      8,
      8,
      18,
      27,
      42,
      56,
      90,
      114,
      214,
      268,
      337,
      374,
      491,
      652,
      858,
      1125,
      1359,
      2200,
      2650,
      3028,
      3888,
      4840,
      6113,
      7014,
      8060,
      8836,
      9765,
      10714,
      12161,
      13213,
      14336,
      15475,
      16176,
      17139,
      18267,
      19303,
      20278,
      21100,
      21652,
      22242,
      22789
    ]);
    covidConfirmed.forEach(r => {
      if (r[0] === "Hubei") {
        r[0] = "";
        r[1] = "China, Hubei";
      }
    });

    // aggregate us data
    const emptyUS = covidConfirmed[0].map(() => 0);
    emptyUS[0] = "";
    emptyUS[1] = "United States";
    covidConfirmed.push(
      covidConfirmed.reduce((us, r) => {
        if (r[1] === "US" && !r[0].includes(",")) {
          r.forEach((v, i) => {
            if (i > 4) {
              us[i] += parseInt(v, 10);
            }
          });
        }
        return us;
      }, emptyUS)
    );

    covidConfirmed.forEach(r => {
      const countryStats = getCountryStats(r[1]);
      if (countryStats && (!r[0] || r[0] === r[1])) {
        const filteredCountBydays = r
          .slice(4)
          .map(v => parseInt(v, 10))
          .filter(v => v >= 100);
        if (filteredCountBydays.length > 0) {
          const [country, population, density, medAge, urbanPop] = countryStats;
          config.maxLength = Math.max(
            config.maxLength,
            filteredCountBydays.length
          );
          config.maxValue = Math.max(
            ...filteredCountBydays.slice(4),
            config.maxValue
          );
          datasets.push({
            label: country,
            fill: false,
            borderColor(context) {
              return context.dataset.label === config.selectedCountry
                ? `rgb(240, 10, 10)`
                : colors[context.datasetIndex % colors.length];
            },
            pointRadius(context) {
              return context.dataIndex === context.dataset.data.length - 1
                ? 3
                : 0;
            },
            lineTension: 0,
            confirmed: filteredCountBydays,
            population: filteredCountBydays.map(
              v => (v / population) * 1000000
            ),
            density: filteredCountBydays.map(v => v / density),
            medAge: filteredCountBydays.map(v => v / medAge),
            urbanPop: filteredCountBydays.map(v => v / urbanPop / 100)
          });
        }
      }
    });
    labels.length = 0;
    for (let i = 0; i < config.maxLength; i++) {
      labels.push(i);
    }
  });

export { labels, datasets, config };
