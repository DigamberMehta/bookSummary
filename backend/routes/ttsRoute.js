import express from "express";
import fs from "fs";
import path from "path";
import util from "util";
import textToSpeech from "@google-cloud/text-to-speech";

// Load Google credentials directly from JSON (replace with your actual JSON)
const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "solid-shelter-435509-f9",
  private_key_id: "69ecf5dd9ae4745f93a3079295b3f92eb96a6dd8",
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBa4jMn3POsPHk\nuz4yJHVARIWUSDLCqlAAohYLm4RBTs0xvJGkecVMHR+AZ0uNe4bAgFU+wuquCyIW\naF+CU+ZlDR6uDTsjD1NtwnpKCmAbceY5FYiZymPss6C1C0+ABxbQLfg3IV69Kxdl\npyLbscLLTO6TITFCfAMrbglg2uzljUwXcdIR+64sPvPUwA+kEkA7T/09mJOl8Fjc\n9HUcpdh1ZtQZLOr2q02GJ+Sz2GMgLiBafUtmTAf1IRSjFCoDhiNVbglcKi7BWdnW\nVElsH6/5wqUiBwYyYWJcrkAIj4D4U8MoaO2giKKNpPuEEyd3abaBoV4GGWH8B8EI\nE6ZXpwBlAgMBAAECggEAH81GA1ruSBw40YJl4gmzi5sYmX5bdj1ZhRkhZcwurSw/\nOb/G9JOe+HpLXSnetscKK2mOWpDi1DX5Z1TG619PIOtM0ZJUWFnjPkc9IyJclfae\nw2ECgkLQNjF8qXfQHP1NZ3I/fxUKBjFpGeompZevLw0ZpvBMsKFCRihD+3xTehR9\nJ3OWGGQz9ndQQiiFjeq199tEmti+Y7lg4Rrsf+ouABn5uT8efFY7HUsO4eLT6yPV\nQwcDhyUWEmngM4rh2E/LS9g051yDWJjKFlM9TjCUbjqFJQjdCDAMXWr2b6ZL09oD\nwVo9VEfdW3/ak2054GgkxRusFJpgBAvmAA7RYKzzmwKBgQD7ao5TjVIbESggEJSa\nWERI26qkYWUKCp3blUPHrt8w0Oyo8jRU0glE4HVF+sucgz+PQqWw3tI29h0XiHKa\n1yBdzfgVO1n38+nJMF2EKpFjpLKCDgm2pVqKoioIFaX3ixZVnQnwLaukhrFvFeEk\nz/vyd/uM1WqAbYmPqtP2zsUhiwKBgQDE8kpvTU/ekVwcZNj9kjc9K/3DDcyE2yD2\n1g/uWaw9CRRP4E7MHAoX3Ql2NKHGuH8iU58kcz5YkaMH/KitZn5SkBWuk4FPZp+f\nlUpMlL7tV5IVDEShJSgXF0UuZUmmEyqxR834JndRgLExGX4KEzp4CwPhgU47eyHt\n2KBVR5zDzwKBgGyvTKWr4wGWch0ibcsnOyWv6F21SMOFgWZKaYmp/AwTVStXwO2l\n+qHO0oOU/m5DgreAnTYPrRpbXIouzzRGqVRD1OoAxUzeIYN6qAKZkE5eBVkZjnNp\nmfFyVu81xJB1jQsnnwM4CwpNu+iEsdaDHqxb19+y5p5sO9pig80e57MvAoGAWND3\ndnhEI5gkFP35yWjOFn0nRHaNnACCPi7NIm04OpJEob0DbBLdDmP1J2SW7Fo5o05Y\nv4RlQmXzQt/TZdeJ8kveK0uEDj22kK4vwpd1/uz2CR3uOUnbaYZqAYFWFFoib651\nGYqnVo8V2ZGogHypaod1KZY5pKNj6rI9pBfWf4sCgYAzrUpycT6P8yJunllRAzgz\ncEMxmKSbkbyk82AP7f16pLz7bSQom2Y1DTN3W5UPrkuskzliIlWgBbUDJNtHVWsF\nEyygt9LbPJC7lVjYcK8v52yqMQynDyX8kZT0+ltpPnSn8FyDplixxjyT81xEAr6V\nF7Xy6qfJplhwMAMDXxWrKA==\n-----END PRIVATE KEY-----\n`,
  client_email: "book-summary@solid-shelter-435509-f9.iam.gserviceaccount.com",
  client_id: "102998580579079063230"
};

// Initialize Google TTS Client
const client = new textToSpeech.TextToSpeechClient({ credentials: GOOGLE_CREDENTIALS });

const router = express.Router();

// Generate Speech Route
router.post("/tts", async (req, res) => {
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required for speech synthesis." });
    }
  
    try {
      const [response] = await client.synthesizeSpeech({
        input: { text: text },
        voice: {
          languageCode: "en-US",
          name: "en-US-Wavenet-J",
          ssmlGender: "MALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      });
  
      // Convert the Buffer to Base64 string
      const audioBase64 = response.audioContent.toString("base64");
  
      res.json({ success: true, audioContent: audioBase64 });
    } catch (error) {
      console.error("❌ Error generating speech:", error);
      res.status(500).json({ success: false, message: "Failed to generate speech." });
    }
  });
  

export default router;
