from PIL import Image

input_path = 'd:/Google_Geminy/project_buhgalt2/img/red_sports_car.png'
output_path = 'd:/Google_Geminy/project_buhgalt2/img/red_sports_car_transparent.png'

img = Image.open(input_path).convert("RGBA")
datas = img.getdata()

new_data = []
for item in datas:
    # Remove white and near-white background pixels
    if item[0] > 220 and item[1] > 220 and item[2] > 220:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save(output_path, "PNG")
print("Transparent car saved successfully!")
