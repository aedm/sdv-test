import sys
import time
import pandas
from sdv.tabular import CopulaGAN, GaussianCopula, CTGAN, TVAE
from sdv.lite import TabularPreset

def make_model(model_type):
    if model_type=='gaussian':
        return GaussianCopula()
    if model_type=='ctgan':
        return CTGAN()
    if model_type=='copula_gan':
        return CopulaGAN()
    if model_type=='copula_gan_1k':
        return CopulaGAN(epochs=1000)
    if model_type=='copula_gan_10k':
        return CopulaGAN(epochs=10000)
    if model_type=='tabular':
        return TabularPreset(name='FAST_ML')
    if model_type=='tvae':
        return TVAE()
    print('Unknown model', model_type)
    sys.exit()

if len(sys.argv) <= 1:
    print("Usage: main.py <input.csv> <gaussian|ctgan|copula_gan|tabular|tvae>")
    sys.exit()

input_file_name = sys.argv[1]
if not input_file_name.endswith('.csv'):
    print('Need a .csv file, got:', input_file_name)
    sys.exit()

input_base = input_file_name[:-len('.csv')]

model_type = sys.argv[2]
model = make_model(model_type)

output_file_name = input_base + '-' + model_type + '.csv'
model_file_name = input_base + '-' + model_type + '.pkl'

print("Loading file", input_file_name)
data = pandas.read_csv(input_file_name)
row_count = len(data)
print("Loaded", row_count, "rows of synthetic data")

print("Training a '" + model_type + "' model...")
start = time.time()
model.fit(data)
print("Model trained in", time.time() - start, "seconds")

model.save(model_file_name)
print("Model saved to ", model_file_name)

print("Sampling", row_count, "rows of synthetic data")
syn = model.sample(num_rows=row_count)
syn.to_csv(output_file_name)

print("Done.")

