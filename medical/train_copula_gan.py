import time
import pandas
from sdv.tabular import CopulaGAN

file_name = 'medical_orig.csv'

print("Loading file", file_name)
data = pandas.read_csv(file_name)

print("Training model...")
start = time.time()
model = CopulaGAN()
model.fit(data)
print("Model trained:", time.time() - start)

syn = model.sample(num_rows=160000)
syn.to_csv('medical_copula_gan.csv')