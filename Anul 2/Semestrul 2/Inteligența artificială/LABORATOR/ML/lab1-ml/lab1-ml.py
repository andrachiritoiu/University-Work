import numpy as np
from skimage import io
import matplotlib.pyplot as plt

# a
images=[]

for idx in range(9):
    path=f"images/car_{idx}.npy"
    image=np.load(path)
    images.append(image)

images=np.array(images)

# print(images.shape)
print(images)

# b
# V1

# sum=0
#
# for i in range(9):
#     for j in range(400):
#         for k in range(600):
#             sum+=images[i][j][k]
#
# # print(sum)

# V2
# print(np.sum(images))



# c
# V1

# sum=0
#
# for i in range(9):
#     sum=0
#     for j in range(400):
#         for k in range(600):
#             sum+=images[i][j][k]
#
#     print(sum)


# V2
for i in range(9):
    print(np.sum(images[i]))


# d
sumPix=[]

for i in range(9):
    sumPix.append(np.sum(images[i]))

# print(sumPix.index(max(sumPix)))

# e
mean_image=np.mean(images, axis=0)
# print(mean_image.shape)

# V1 - cu matplotlib
plt.figimage(mean_image.astype(np.uint8))
plt.show()

# V2
# io.imshow(mean_image.astype(np.uint8))
# io.show()


# f - deviatia standrad = cum difera imaginile fata de medie
# dev=np.std(images, axis=0)
# print(dev)


# g - normalizare
# V1
norm_images=[]

# for i in range(9):
#     norm_images.append((images[i]-mean_image)/dev)


# norm_images=np.array(norm_images)
#
# print(norm_images)


# V2 - fara for
# print(images - mean_image/dev)

# h
# cut_images=images[:, 200:300, 280:400]
# for i in range(9):
#     plt.figimage(cut_images[i].astype(np.uint8))
#     plt.show()