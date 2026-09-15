from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/pasted_file_jaFv89_image.png')
target = Path('/home/ubuntu/stronghold/assets/img/pokemon-card-back.png')

with Image.open(source) as image:
    # The supplied image has a white surround; these bounds isolate the blue card.
    card = image.crop((236, 0, 599, 500))
    card.save(target, format='PNG', optimize=True)
    print(f'saved {target} ({card.width}x{card.height})')
