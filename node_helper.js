const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-SnowDay helper started");

    this.latestUrl = null;

    // hourly refresh
    setInterval(() => {
      if (this.latestUrl) {
        this.fetchSnowPercent(this.latestUrl).then(result => {
          this.sendSocketNotification("SNOW_PERCENT", result);
        });
      }
    }, 60 * 60 * 1000);
  },

  fetchSnowPercent(apiUrl) {
    console.log(`MMM-SnowDay fetching: ${apiUrl}`);
    return new Promise((resolve) => {
      https.get(apiUrl, { headers: { "Accept": "application/json" } }, (res) => {
        console.log(`MMM-SnowDay response status: ${res.statusCode}`);
        let data = "";
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          console.log(`MMM-SnowDay raw response (first 500 chars): ${data.slice(0, 500)}`);
          try {
            const json = JSON.parse(data);
            console.log(`MMM-SnowDay parsed prediction:`, JSON.stringify(json.prediction ?? null));
            console.log(`MMM-SnowDay parsed city: "${json.city ?? ""}"`);
            const probability = json.prediction?.probability ?? null;
            const city = json.city || "";
            const percent = probability !== null
              ? Math.round(probability * 100) + "%"
              : "N/A";
            console.log(`MMM-SnowDay result: percent=${percent}, city=${city}`);
            resolve({ percent, city });
          } catch (err) {
            console.error("MMM-SnowDay parse error:", err.message);
            console.error("MMM-SnowDay raw data was:", data);
            resolve({ percent: "N/A", city: "" });
          }
        });
      }).on("error", (err) => {
        console.error("MMM-SnowDay fetch error:", err.message);
        resolve({ percent: "N/A", city: "" });
      });
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_SNOW_PERCENT") {
      console.log(`MMM-SnowDay received GET_SNOW_PERCENT, apiUrl=${payload.apiUrl}`);
      this.latestUrl = payload.apiUrl;
      this.fetchSnowPercent(payload.apiUrl).then(result => {
        console.log(`MMM-SnowDay sending SNOW_PERCENT:`, JSON.stringify(result));
        this.sendSocketNotification("SNOW_PERCENT", result);
      });
    }
  }
});
