const { NODE_ENV } = process.env;

const regexEqual = (x, y) =>
  x instanceof RegExp &&
  y instanceof RegExp &&
  x.source === y.source &&
  x.global === y.global &&
  x.ignoreCase === y.ignoreCase &&
  x.multiline === y.multiline;

module.exports = {
  webpack(config) {
    /* find all scss/sass rules */
    const sassRules = config.module.rules
      .find((rule) => typeof rule.oneOf === "object")
      .oneOf.find(
        (rule) =>
          rule.sideEffects === false &&
          regexEqual(rule.test, /\.module\.(scss|sass)$/)
      );

    /* map over style rules and add "additionalData" to the "sass-loader" rule*/
    sassRules.use = sassRules.use.map((rule) =>
      rule.loader.includes("sass-loader")
        ? {
            ...rule,
            options: {
              ...rule.options,
              additionalData: `@import "vars.${NODE_ENV}.scss";`,
            },
          }
        : rule
    );

    /* return new config to next */
    return config;
  },
};
