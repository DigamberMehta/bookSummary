// routes/translationRoutes.js
import express from 'express';
import pkg from '@google-cloud/translate';
const { v2 } = pkg; // ✅ This line defines v2 correctly

const router = express.Router();



// Define service account credentials directly
const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "industrial-pad-456007-h6",
  private_key_id: "7acf538b2444bc376ff72610a79b114ddc4f0c88",
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD0sarFAv2VZfUE\ny8Jl+CJqPfpgUTcnp+aMc8hbyTRaUgVpLR7NVKcJ3YaMZueFXjRNo2HNwMmTHaNi\nSETxKza28SwIGZOqWkbeuHVo4re6NJ5hzEBJRmJVzBen5l27YQhmNiCvQBvVXh9B\n+5OwCAI0IEsQApSkGvWFFnRtjMWmbn8s4xkhxeLAzVTDOL52KZSr7o0i6kXA314o\nASUfxd74lC12mzPmrY72B70xC7hqP+3ce2yHiwJOUqQEq0mSvyQxTlZIC1chJAfp\nwlzGO2Fv49wK10MfM9Oqe39mrjtRvPaKUcjv56KMI0/GJA8a0JUBUCkyclEeDcyL\niidKD5DXAgMBAAECggEAW9bRHueL8MZXK4kkeewjUpfXgM4KsvYYGHAea6C9Zwbw\n4/Rc4rkahp/f75Nx4wMkA13GiBiLL43ItEsmoRPUkd475gBfhWkjv1UhMBAj4B3+\nsfscx8PEhao32LskQ/9bzS0UoGIh8DfG6Jd5a3DeDt1t/uDRFDTQILb4VOOojVmg\nuERBs2/UYwwUVBaozuSmxRahdfN+JNcVpd6y0a39uBr6uBAMfWNFCSOEdRqS58Vf\nV2fkemmcqFbk6+gOf64g1Uo9lGqaeVYVXZ04PGkC48+U/LOAWazYwgfoGDhThWAU\nwYtid23X2TK5vcE7zHjueQGYn3ibRvLRTZpVxMZeCQKBgQD+VmdkJDPeY3BlIkkV\ng/tSe4YQsl+jIG5djn+l6iUDkM1o2I5+1bJ0S6It6+/ZJaeZiPt7hNoaOMHDw4Y6\naWckY1JAnPFuRkfIDHIF0vPvXBim9sVTU+Rv+6py3Z5PoNcPWx3jeAAe9RxRq7mz\nCjT8C/ql8L5vhkPPMIiaDTCfvwKBgQD2SyBQNkqQ1jtKKYvDmBKL9enaALPOfGXM\neU0eb6BfyInmt6JDbplyExCksqdBXF+Yu3AKNuZOmrw/LcAgr3RKxBTF0eYQwhWl\nI3BoKxOfjMAxas01ty4J/zqZ5RDcK9YZCl5v6WVFWjBrp0Q3IanUlXrL5UFOlzsx\n/22xXHzU6QKBgETkcq0VgVdD6DX8y38gePsmqnHrXyx4pGyDJOB0RAJrPrifsDl6\n+RO3SP7XYeiX4oYcLMKQgeOIbDPyynEYC/A3VxhZaqxMLTVq6ZfaRGkZsTPItDqW\nBtKugMUMcs1u69IlBDuRTbcU/c7BjVOJ+EAtnn9EbtEWtVdx9g6EdB9RAoGATzWI\nFePwBTaw6MAF0AjXZiXXaKIzMaQ2RRV55OD3jfZ7yzShvdgTB2n0P1OpkM65e/BE\nLzTKytre0d7P3HMxDl6TY6+GszsIJQ0JuKap7/UfVoVHrA/WgaaQ3S+bRYPfnjwE\ndS91v2ErE2Q+/xAXg2PzkyGO6Eyg4AqK57CcAQkCgYEAqBeid5mQjCY9F53iJkLc\nWvdkVY1QzgIx4XUqDUmZVVPtxe725innjGb4h4OE+yLWWAlLE8kJYxOfXO1L3tfY\noGXJma5EV9dL+D7x3UYrRWPxuUSgE2oRRB70Ecs94uF2Ao+vxAjzkhFnUlKD7E3i\nTq0AsiAv8W6AbWArL3sp+Mw=\n-----END PRIVATE KEY-----\n`,
  client_email: "book-summary@industrial-pad-456007-h6.iam.gserviceaccount.com",
  client_id: "102957416005222537299",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/book-summary%40industrial-pad-456007-h6.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const translate = new v2.Translate({
    credentials: GOOGLE_CREDENTIALS,
    projectId: GOOGLE_CREDENTIALS.project_id,
  });
  
  router.post('/translate', async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
  
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Missing text or target language' });
      }
  
      const [translation] = await translate.translate(text, targetLanguage);
      res.json({ translation });
    } catch (error) {
      console.error('Error translating text:', error);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  });

export default router;
