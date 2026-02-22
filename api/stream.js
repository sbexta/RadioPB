export default async function handler(req, res) {
  try {
    const streamResponse = await fetch("https://radiolatina.info:8076/stream");

    if (!streamResponse.ok) {
      return res.status(streamResponse.status).send("Stream no disponible");
    }

    const reader = streamResponse.body.getReader();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.writeHead(200);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }

    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).send("Error conectando al stream");
  }
}