from typing import List
import io
import gzip
import sys

def get_number() -> int:
    if len(sys.argv) != 2:
        print("Usage: python generate.py <number>")
        sys.exit(1)
    try:
        return int(sys.argv[1])
    except ValueError:
        print("Error: Please provide a valid integer.")
        sys.exit(1)

def magnitudo(n: int, safe=True) -> list[int]:
    if safe and n > 9:
        confirmation = input(
            f"With a value of {n} it could take a long time.\nAre you sure you want to generate a list with {n} elements? (y/n): "
        )
        if confirmation.lower() != "y":
            print("Operation canceled.")
            return []

    return [10**i for i in range(n)]

def generate(sizes: List[int]):
    for size in sizes:
        filename_html = f"public/index-{size}.html"
        filename_gzip = f"public/index-{size}.html.gz"

        content = (
            f"<!DOCTYPE html>\n<html>\n<head>\n<title>{size}</title>\n</head>\n<body>\n"
        )

        with io.open(filename_html, "w", encoding="utf-8") as h, gzip.open(
            filename_gzip, mode="wb"
        ) as g:
            h.write(content)
            g.write(content.encode("utf-8"))

            for i in range(1, size + 1):
                p = f"<h2>{i}</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n"
                h.write(p)
                g.write(p.encode("utf-8"))

            cap = "</body>\n</html>"
            h.write(cap)
            g.write(cap.encode("utf-8"))


if __name__ == "__main__":
    n = get_number()
    generate(magnitudo(n))
