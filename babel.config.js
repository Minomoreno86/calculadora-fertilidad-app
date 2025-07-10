module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin de Reanimated debe quedarse
      'react-native-reanimated/plugin',
    ],
  };
};