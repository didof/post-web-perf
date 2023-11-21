## Setup

Generate the `.html` and `.html.gz` files.

```bash
node gzip/src/scripts/make.mjs 100
```

## Run

```bash
node index.mjs
```

And access:

- `http://127.0.0.1/normal`
- `http://127.0.0.1/gzip`
