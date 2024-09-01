export class PostApi {
    async getJokesFromApiNinjas(limit: number = 1): Promise<string[]> {
      const response = await fetch(`https://api.api-ninjas.com/v1/jokes?limit=${limit}`, {
        headers: {
          'X-Api-Key': process.env.API_NINJAS_KEY ?? '',
        } as const,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const jokes = await response.json();
      return jokes.map((joke: { joke: string }) => joke.joke);
    }
    
}

