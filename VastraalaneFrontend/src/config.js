const isBrowser = typeof window !== "undefined";
const configuredApiUrl = process.env.REACT_APP_API_URL;
const localApiUrl = "http://localhost:5000";
const fallbackApiUrl = "https://vastraaalane-backend.onrender.com";
const runningLocally =
  isBrowser &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const config = {
  API_URL: configuredApiUrl || (runningLocally ? localApiUrl : fallbackApiUrl),
  API_KEY: "123456"
};

export default config;
