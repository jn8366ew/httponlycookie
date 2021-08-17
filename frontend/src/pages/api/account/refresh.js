import cookie from 'cookie';
import {API_URL} from "../../../config";


export default async (req, res) => {
    if (req.method === 'GET'){
        const cookies = cookie.parse(req.headers.cookie ?? '')
        const refresh = cookies.refresh ?? false;

        if (refresh === false) {
            return res.status(401).json({
                error: 'An unauthorized user.'
            });
        }

        const body = JSON.stringify({
            refresh: refresh
        });

        try {
            const apiRes = await fetch(`${API_URL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                // 쿠키 갱신
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', data.access, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    )

                ]);

                return res.status(200).json({
                    success: 'Refresh request success'
                });
            } else {
                return res.status(apiRes.status).json({
                    error: 'Failed to fulfill refresh request'
                });
            }

        } catch(err){
            return res.status(500).json({
                error: 'Error during refresh request'
            });

        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json(
            {error: `Method ${req.method} not allowed`})
    }

};