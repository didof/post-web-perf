## Pic source

[pixabay](https://pixabay.com/photos/chicken-farm-yard-face-comb-8225658/)

## Setup

Generate the `.html` and `.html.gz` files.

```bash
node src/scripts/genMem.mjs 100
du -cb src/views/*
```

## Run

```bash
node index.mjs
```

And access:

- `http://127.0.0.1/normal`
- `http://127.0.0.1/gzip`

                        1400
identity               6400
content-length          1400