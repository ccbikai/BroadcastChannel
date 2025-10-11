export async function GET() {
  return Response.json({
    prerender: [
      {
        urls: ['/'],
        eagerness: 'eager',
      },
    ],
    prefetch: [
      {
        where: { href_matches: ['/posts/*'] },
        eagerness: 'moderate',
      },
    ],
  }, {
    headers: {
      'Content-Type': 'application/speculationrules+json',
    },
  })
}
