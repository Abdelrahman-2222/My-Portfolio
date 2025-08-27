export default function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || 'INTERNATIONAL';
  
  // Determine if user is from Egypt or international
  const region = country === 'EG' ? 'EG' : 'INTERNATIONAL';
  
  // Set cookies
  res.setHeader('Set-Cookie', [
    `user-country=${country}; Path=/; Max-Age=86400; SameSite=Lax`,
    `user-region=${region}; Path=/; Max-Age=86400; SameSite=Lax`
  ]);
  
  res.status(200).json({ country, region });
}
