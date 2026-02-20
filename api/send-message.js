import Pusher from "pusher";

const pusher = new Pusher({
  appId: "2117916",
  key: "8ac472c4fd3463c85dbd",
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  await pusher.trigger("radiopb-chat", "nuevo-mensaje", {
    name,
    message,
  });

  res.status(200).json({ success: true });
}