import pandas
from sdv.tabular import GaussianCopula

data = pandas.read_csv('medical_orig.csv')
model = GaussianCopula()
model.fit(data)

model.save('medical.pkl')

syn = model.sample(num_rows=160000)
syn.to_csv('medical_syn.csv')