module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Filter out source-map-loader to silence warnings
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) =>
          !(
            rule.use &&
            rule.use.some((u) => typeof u === "string" && u.includes("source-map-loader"))
          )
      );
      return webpackConfig;
    },
  },
};
