from collections import deque
from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/pasted_file_jaFv89_image.png')
target = Path('/home/ubuntu/stronghold/assets/img/pokemon-card-back.png')

with Image.open(source).convert('RGBA') as image:
    # Isolate the card first, then remove only white regions connected to its outer edge.
    card = image.crop((236, 0, 599, 500))
    pixels = card.load()
    width, height = card.size
    queue = deque()
    seen = set()

    def is_edge_white(x, y):
        r, g, b, _ = pixels[x, y]
        return r >= 235 and g >= 235 and b >= 235

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or not (0 <= x < width and 0 <= y < height):
            continue
        seen.add((x, y))
        if not is_edge_white(x, y):
            continue
        pixels[x, y] = (255, 255, 255, 0)
        queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

    card.save(target, format='PNG', optimize=True)
    print(f'saved {target} ({width}x{height}) with {sum(1 for x, y in seen if pixels[x, y][3] == 0)} transparent boundary pixels')
