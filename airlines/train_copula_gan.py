import time
import pandas
from sdv.tabular import CopulaGAN
import defs

file_name = defs.file_name + '.csv'

print("Loading file", file_name)
data = pandas.read_csv(file_name)

print("Training model...")
start = time.time()
model = CopulaGAN()
model.fit(data)
print("Model trained:", time.time() - start)

syn = model.sample(num_rows=160000)
syn.to_csv(defs.file_name + '_copula_gan.csv')