import type { CapacitorConfig } from '@capacitor/cli';

const appUrl = process.env.CAPACITOR_APP_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.viv.slokasabha',
  appName: 'Sloka Sabha',
  webDir: 'mobile-web',
  ...(appUrl
    ? {
        server: {
          url: appUrl,
          cleartext: appUrl.startsWith('http://'),
        },
      }
    : {}),
};

export default config;
