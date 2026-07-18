CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE resolvers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    resolver_id BIGINT REFERENCES resolvers(id),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned'))
);
