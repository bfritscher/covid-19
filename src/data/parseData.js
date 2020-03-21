import parse from "csv-parse/lib/sync";

import population from "./world_populations.csv";

const worldPopulationStats = parse(population, {
  from_line: 2
});
// country, population, density, med_age, urban_pop
import covid from "./time_series_19-covid-Confirmed.csv";
let covidConfirmed = parse(covid, { from_line: 1 });

// fix numbers
const idxFix = covidConfirmed[0].indexOf("3/12/20");

function fix(row, country, nb, idxFix) {
  if (row[1] === country) {
    if (idxFix === -1) {
      row.push(nb)
    } else {
      row[idxFix] = nb;
    }
  }
}

covidConfirmed.forEach(r => {
  fix(r, "Switzerland", 858, idxFix);
  fix(r, "Italy", 15113, idxFix);
  fix(r, "Spain", 2965, idxFix);
  fix(r, "France", 2860, idxFix);
  fix(r, "Japan", 675, idxFix);
  fix(r, "Netherlands", 614, idxFix);
  if (r[0] === "Hubei") {
    r[0] = "";
    r[1] = "China, Hubei";
  }
  fix(r, "Switzerland", 2650, covidConfirmed[0].indexOf("3/17/20"));
  fix(r, "Switzerland", 3028, covidConfirmed[0].indexOf("3/18/20"));
  fix(r, "Switzerland", 3888, covidConfirmed[0].indexOf("3/19/20"));
  fix(r, "Switzerland", 4840, covidConfirmed[0].indexOf("3/20/20"));
  fix(r, "Switzerland", 6113, covidConfirmed[0].indexOf("3/21/20"));
  /*

    cov.loc[(cov['Country/Region'] == 'Italy') & idx_date, 'Deaths'] = 1016
    cov.loc[(cov['Country/Region'] == 'Spain') & idx_date, 'Deaths'] = 84
    cov.loc[(cov['Country/Region'] == 'France') & idx_date, 'Deaths'] = 61
    cov.loc[(cov['Country/Region'] == 'Switzerland') & idx_date, 'Deaths'] = 6
    cov.loc[(cov['Country/Region'] == 'Japan') & idx_date, 'Deaths'] = 19
    cov.loc[(cov['Country/Region'] == 'Netherlands') & idx_date, 'Deaths'] = 5
    */
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

// Province/State,Country/Region,Lat,Long
function getCountryStats(name) {
  return worldPopulationStats.find(r => r[0] === name);
}

let datasets = [];
let config = {
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

covidConfirmed.forEach(r => {
  const countryStats = getCountryStats(r[1]);
  if (countryStats && (!r[0] || r[0] === r[1])) {
    const filteredCountBydays = r
      .slice(4)
      .map(v => parseInt(v, 10))
      .filter(v => v >= 100);
    if (filteredCountBydays.length > 0) {
      const [country, population, density, medAge, urbanPop] = countryStats;
      config.maxLength = Math.max(config.maxLength, filteredCountBydays.length);
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
          return context.dataIndex === context.dataset.data.length - 1 ? 3 : 0;
        },
        lineTension: 0,
        confirmed: filteredCountBydays,
        population: filteredCountBydays.map(v => (v / population) * 1000000),
        density: filteredCountBydays.map(v => v / density),
        medAge: filteredCountBydays.map(v => v / medAge),
        urbanPop: filteredCountBydays.map(v => v / urbanPop / 100)
      });
    }
  }
});

const labels = [];
for (let i = 0; i < config.maxLength; i++) {
  labels.push(i);
}
export { labels, datasets, config };
