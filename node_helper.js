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
    return new Promise((resolve) => {
      https.get(apiUrl, { headers: { "Accept": "application/json" } }, (res) => {
        let data = "";
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            const probability = json.prediction?.probability ?? null;
            const city = json.city || "";
            const percent = probability !== null
              ? Math.round(probability * 100) + "%"
              : "N/A";
            resolve({ percent, city });
          } catch (err) {
            console.error("MMM-SnowDay parse error:", err.message);
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
      this.latestUrl = payload.apiUrl;
      this.fetchSnowPercent(payload.apiUrl).then(result => {
        this.sendSocketNotification("SNOW_PERCENT", result);
      });
    }
  }
});
