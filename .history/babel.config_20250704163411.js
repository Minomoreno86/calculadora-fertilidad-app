// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            '@': './',
            '@/components': './src/presentation/components',
            '@/core': './src/core',
            '@/data': './src/data',
            '@/navigation': './src/navigation',
            '@/utils': './src/utils',
            '@/config': './src/config',
          },
        },
      ],
      // Asegúrese de que 'expo-router/babel' sea el último plugin
      'expo-router/babel',
    ],
  };
};