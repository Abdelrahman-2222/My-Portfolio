export default function handler(request) {
  const country = request.geo?.country || 'INTERNATIONAL';
  
  // Determine if user is from Egypt or international
  const region = country === 'EG' ? 'EG' : 'INTERNATIONAL';
  
  return new Response(JSON.stringify({ country, region }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        `user-country=${country}; Path=/; Max-Age=86400; SameSite=Lax`,
        `user-region=${region}; Path=/; Max-Age=86400; SameSite=Lax`
      ]
    }
  });
}
