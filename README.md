# familiar-image-proxy

Cloudflare Worker that generates images with Workers AI using the
`@cf/black-forest-labs/flux-1-schnell` model.

## Setup

Set the proxy authorization key as a Worker secret:

```sh
npx wrangler secret put PROXY_KEY
```

Deploy the Worker:

```sh
npx wrangler deploy
```

Send a `POST` request to `/v1/images/generations` with an
`Authorization: Bearer <PROXY_KEY>` header and a JSON body containing a
`prompt` string. The response includes the generated image in `data[0].b64_json`.
