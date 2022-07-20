import time
import pandas
from sdv.tabular import CTGAN

file_name = 'medical_orig.csv'

print("Loading file", file_name)
data = pandas.read_csv(file_name)

print("Training model...")
start = time.time()
model = CTGAN(verbose=True)
model.fit(data)
print("Model trained:", time.time() - start)

syn = model.sample(num_rows=160000)
syn.to_csv('medical_ctgan.csv')