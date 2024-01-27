import cv2

img = cv2.imread(r'./images/detecto.png')

image = cv2.resize(img,(580,310),fx=0,fy=0, interpolation = cv2.INTER_CUBIC)

cv2.imwrite('./images/rns.png',image)
