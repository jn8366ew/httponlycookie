import cookie from 'cookie'
import {API_URL} from "../../../config";

export default async (req, res) => {
  if (req.method === 'GET') {
      const cookies = cookie.parse(req.headers.cookie ?? '')
      const access = cookies.access ?? false;

      if (access === false){
          return res.status(403).json({
              error: 'User forbidden from making the request'
          });
      }
      const body = JSON.stringify({
          token: access
      });

      try {
          const apiRes = await fetch(`${API_URL}/api/token/verify/`, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: body
          });

          if (apiRes.status === 200) {
              return res.status(200).json({ success: 'Verification Success'});
          } else {
                return res.status(apiRes.status).json({
                    error: 'Failed to verification'
                });
          }
      } catch(err) {
            return res.status(500).json({
                error: 'Error during verification'
            });
      }
  }  else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} not allowed`});

  }
};