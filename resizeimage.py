import cv2

img = cv2.imread('/home/prajwal/Documents/projects/prajwal_athreya/images/')

image = cv2.resize(img,(4000,4000),fx=0,fy=0, interpolation = cv2.INTER_CUBIC)

cv2.imwrite('./images/',image)
