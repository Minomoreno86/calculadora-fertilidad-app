module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
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
      'expo-router/babel', // 🔥 Esto es obligatorio
    ],
  };
};