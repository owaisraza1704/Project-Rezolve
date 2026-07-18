module.exports = {
  requests: [
    {
      method: "PUT",
      path: "/api/v1/tickets/2/pick",
      headers: {
        "content-type": "application/json",
      },
      setupRequest: (req, context) => {
        const resolverId = (context.requests + 1) % 100 || 100;
        req.body = JSON.stringify({ resolver_id: resolverId });
        return req;
      },
    },
  ],
};
