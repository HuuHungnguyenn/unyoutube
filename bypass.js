chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "POST" && details.url.includes("/youtubei/v1/player")) {
      let body = new TextDecoder("utf-8").decode(details.requestBody.raw[0].bytes);
      try {
        let json = JSON.parse(body);
        if (json.context && json.context.client) {
          json.context.client.clientName = "TVHTML5_SIMPLY_EMBEDDED_PLAYER";
          json.context.client.clientVersion = "2.0";
        }
        return { requestBody: { raw: [ new TextEncoder().encode(JSON.stringify(json)) ] }};
      } catch (e) {}
    }
  },
  { urls: ["*://www.youtube.com/*"] },
  ["requestBody", "blocking"]
);
