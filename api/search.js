export default async function handler(req, res) {
    const { q } = req.query;
    if (!q || q.length < 2) {
        return res.status(200).json([]);
    }

    try {
        // Magic Eden public search endpoint fetched securely from server-side
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=500`);
        const allCollections = await response.json();

        // Filter collections matching user's typed letters
        const matches = allCollections
            .filter(c => c.name && c.name.toLowerCase().includes(q.toLowerCase()) || 
                         (c.symbol && c.symbol.toLowerCase().includes(q.toLowerCase())))
            .slice(0, 8)
            .map(c => ({
                name: c.name,
                symbol: c.symbol,
                image: c.image || ''
            }));

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Search fetch failed' });
    }
}
