export default async function handler(req, res) {
  try {
    const response = await fetch("https://radiolatina.info:8076/stream");

    if (!response.ok) {
      return res.status(response.status).send("Stream no disponible");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send("Error conectando al stream");
  }
}