import sys, os, glob
from PIL import Image, ImageDraw, ImageFont
tag = sys.argv[1]; start = int(sys.argv[2]) if len(sys.argv)>2 else 1
src = f"shots/{tag}"; out = f"sheets/{tag}"; os.makedirs(out, exist_ok=True)
files = sorted(f for f in glob.glob(f"{src}/[0-9]*.png"))
per = 6; cols = 2
try: font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
except: font = None
for i in range(0, len(files), per):
    group = files[i:i+per]
    ims = [Image.open(f) for f in group]
    w, h = ims[0].size
    scale = 900 / w
    tw, th = int(w*scale), int(h*scale)
    sheet = Image.new("RGB", (cols*tw, ((len(ims)+cols-1)//cols)*(th+30)), "white")
    d = ImageDraw.Draw(sheet)
    for j, (f, im) in enumerate(zip(group, ims)):
        x, y = (j % cols)*tw, (j//cols)*(th+30)
        sheet.paste(im.convert("RGB").resize((tw, th)), (x, y+30))
        d.text((x+6, y+4), os.path.basename(f), fill="black", font=font)
    sheet.save(f"{out}/sheet-{i//per+1:02d}.png")
print(len(files), "files")
