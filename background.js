chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      if (details.method === "POST" && details.requestBody) {
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const body = decoder.decode(details.requestBody.raw[0].bytes);
        const json = JSON.parse(body);

        if (json.context && json.context.client) {
          json.context.client.clientName = "TVHTML5_SIMPLY_EMBEDDED_PLAYER";
          json.context.client.clientVersion = "2.0";
        }

        return { requestBody: { raw: [ { bytes: encoder.encode(JSON.stringify(json)) } ] }};
      }
    } catch (e) {
      console.warn("Bypass error", e);
    }
  },
  { urls: ["*://youtubei.googleapis.com/youtubei/v1/player*"] },
  ["blocking", "requestBody"]
);
