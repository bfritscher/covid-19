module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/covid-19/" : "/",
  chainWebpack: config => {
    config.module
      .rule("csv")
      .test(/\.csv$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  }
};
