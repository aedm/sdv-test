import pandas
import math
import numpy
import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.ticker import LinearLocator

input_file = 'medical_syn.csv'
x_axis_column = ' Average Covered Charges '
y_axis_column = 'Average Medicare Payments'

resolution = 200
x_axis_range = 100_000
y_axis_range = 50_000

def calc_bucket(value, min, max, res):
	a = math.trunc((value - min) * res / (max - min))
	if a < 0: return 0
	if a >= res: return res-1
	return a

def read_data():
	print("Reading data")
	data = pandas.read_csv(input_file)
	m = [[0 for x in range(resolution)] for y in range(resolution)]

	print("Analyzing")
	for index, row in data.iterrows():
		x = calc_bucket(row[x_axis_column], 0, x_axis_range, resolution)
		y = calc_bucket(row[y_axis_column], 0, y_axis_range, resolution)
		m[x][y] += 1

	return m

def show_plot(m):
	print("Showing plot")
	#q = m[resolution - 1][resolution - 1]
	#m[resolution - 1][resolution - 1] = 0
	#mx = max([max(col) for col in m])
	#m[resolution - 1][resolution - 1] = q
	mx = 1000
	m = numpy.array(m)

	fig, ax = plt.subplots(subplot_kw={"projection": "3d"})
	fig.canvas.manager.set_window_title(input_file)

	X = numpy.array([a * x_axis_range / resolution for a in range(resolution)])
	Y = numpy.array([a * y_axis_range / resolution for a in range(resolution)])

	#X = numpy.arange(0, x_axis_range, x_axis_range / resolution)
	#Y = numpy.arange(0, y_axis_range, y_axis_range / resolution)
	X, Y = numpy.meshgrid(X, Y)

	# Plot the surface.
	surf = ax.plot_surface(X, Y, m, rcount=resolution, ccount=resolution, cmap=cm.coolwarm, linewidth=0, antialiased=False)

	# Customize the z axis.
	print("Max height", mx)

	ax.set_zlim(0, mx)
	# ax.xaxis.set_major_locator(LinearLocator(resolution))
	# A StrMethodFormatter is used automatically
	# ax.zaxis.set_major_formatter('{x:.0f}')

	# Add a color bar which maps values to colors.
	# fig.colorbar(surf, shrink=0.5, aspect=5)

	plt.show()

m = read_data()
show_plot(m)
