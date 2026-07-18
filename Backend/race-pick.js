const ticketId = process.argv[2] || "1";
const totalResolvers = Number(process.argv[3] || "100");

async function claimTicket(resolverId) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/tickets/${ticketId}/pick`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resolver_id: resolverId }),
    }
  );

  return {
    resolverId,
    statusCode: response.status,
    body: await response.text(),
  };
}

async function main() {
  const requests = [];

  for (let resolverId = 1; resolverId <= totalResolvers; resolverId += 1) {
    requests.push(claimTicket(resolverId));
  }

  const results = await Promise.all(requests);
  const successCount = results.filter((result) => result.statusCode === 200).length;

  console.log(`successful_responses=${successCount}`);
  console.log(results.slice(0, 5));
}

main();
