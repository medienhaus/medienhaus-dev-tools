const StylelintPlugin = require('stylelint-webpack-plugin');

/* eslint-disable-next-line */
module.exports = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev || isServer) return config;

    config.plugins.push(new StylelintPlugin({
        files: ['assets/*.css', 'components/**/*.js', 'pages/**/*.js'],
        failOnError: false,
    }));

    return config;
};
