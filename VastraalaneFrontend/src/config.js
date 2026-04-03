const isBrowser = typeof window !== "undefined";
const configuredApiUrl = process.env.REACT_APP_API_URL;
const isLocalConfigured =
  configuredApiUrl &&
  configuredApiUrl.includes("localhost") &&
  isBrowser &&
  window.location.hostname !== "localhost";

const fallbackApiUrl = "https://vastraaalane-backend.onrender.com";

const config = {
  API_URL: !configuredApiUrl || isLocalConfigured ? fallbackApiUrl : configuredApiUrl,
  API_KEY: "123456"
};

export default config;
