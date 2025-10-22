export async function handler(event) {
  const page = parseInt(event.queryStringParameters.page || '1')
  const search = event.queryStringParameters.search?.toLowerCase() || ''

  // Sample guestbook data — replace this with your own logic or database
  const allEntries = [
    { id: 1, playerName: 'Alice', formattedTime: '10/22 5:30 PM' },
    { id: 2, playerName: 'Bob', formattedTime: '10/22 5:40 PM' },
    { id: 3, playerName: 'Charlie', formattedTime: '10/22 6:00 PM' },
    // ...
  ]

  let filtered = allEntries
  if (search) {
    filtered = allEntries.filter((e) =>
      e.playerName.toLowerCase().includes(search)
    )
  }

  const PAGE_SIZE = 10
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE
  const pageEntries = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  return {
    statusCode: 200,
    body: JSON.stringify({
      entries: pageEntries,
      currentPage: page,
      totalPages,
    }),
  }
}
