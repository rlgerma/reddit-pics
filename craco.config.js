// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#FE4600",
              "@link-color": "#7A9199",
              "@success-color": "#52c41a",
              "@warning-color": "#faad14",
              "@error-color": "#f5222d",
              "@font-size-base": "14px",
              "@heading-color": "rgba(0, 0, 0, 0.85)",
              "@text-color": "rgba(0, 0, 0, 0.65)",
              "@text-color-secondary": "rgba(0, 0, 0, 0.45)",
              "@disabled-color": "rgba(0, 0, 0, 0.25)",
              "@border-radius-base": "2px",
              "@border-color-base": "#0D3543",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
