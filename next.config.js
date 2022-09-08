const WebpackConfig = require('./webpack.config.js');

// eslint-disable-next-line no-undef
module.exports = {
    publicRuntimeConfig: {
        name: 'matrix leave tool',
        authProviders: {
            matrix: {
                baseUrl: 'https://dev.medienhaus.udk-berlin.de',
                allowCustomHomeserver: true,
            },
        },
        contextRootSpaceRoomId: '!pwCcubmjqBIdIMqLRd:dev.medienhaus.udk-berlin.de',
        account: {
            allowAddingNewEmails: true,
        },
    },
    webpack: WebpackConfig,
};
