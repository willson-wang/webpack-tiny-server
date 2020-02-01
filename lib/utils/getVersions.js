function getVersions () {
    return (
        `webpack-tiny-server ${require('../../package.json').version}\n` +
      `webpack ${require('webpack/package.json').version}`
    );
}

module.exports = getVersions;
