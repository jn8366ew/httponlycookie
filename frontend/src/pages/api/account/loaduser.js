import cookie from 'cookie';
import { API_URL } from '../../../config';


export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access == false) {
            return res.status(401).json({
                error: 'Unauthorized request'
            });
        }

        try {
            const apiRes = await fetch(`${API_URL}/api/account/loaduser`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = await apiRes.json()

            if (apiRes.status === 200) {
                return res.status(200).json({
                    user: data.user
                });
            } else {
                return res.status(apiRes.status).json({
                    error: 'Error during retrieving user data'
                });
            }
        } catch(err){
            return res.status(500).json({
                error: 'Error during retrieving user data'
            });
        }

    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};