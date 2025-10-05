import { useState } from "react";
import API from "../api";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!file) return alert("Choose a video first");
    setLoading(true);

    const formData = new FormData();
    formData.append("video", file);

    try {
      // Step 1: Upload video & get transcript ID
      const res = await API.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const transcriptId = res.data.transcriptId;

      // Step 2: Poll until transcription completes
      let done = false;
      let transcriptData = null;
      while (!done) {
        const t = await API.get(`/videos/${transcriptId}/transcript`);
        transcriptData = t.data;
        if (transcriptData.status === "completed") done = true;
        else if (transcriptData.status === "failed")
          throw new Error("Transcription failed");
        else await new Promise((r) => setTimeout(r, 3000));
      }

      setTranscript(transcriptData.text);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Upload Video for Transcription</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={uploadVideo}
        disabled={loading}
        style={{ marginLeft: 10 }}
      >
        {loading ? "Processing..." : "Upload & Transcribe"}
      </button>

      {transcript && (
        <div style={{ marginTop: 20 }}>
          <h3>Transcript:</h3>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
}
