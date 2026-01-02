// src/utils/getOS.js
export function getOS() {
    const { userAgent, platform } = window.navigator;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.includes(platform)) return 'macOS';
    if (iosPlatforms.includes(platform)) return 'iOS';
    if (windowsPlatforms.includes(platform)) return 'Windows';
    if (/Android/.test(userAgent)) return 'Linux';
    if (/Linux/.test(platform)) return 'Linux';

    return 'Unknown';
}
