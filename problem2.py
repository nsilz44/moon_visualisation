import pygmt
import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    print('link at http://localhost:8000/problem2.html')
    httpd.serve_forever()

def convertData(input,output):
    fig = pygmt.Figure()
    grid = input
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    xyz_df.to_csv(output)
#convertData('ldem_4_uint.tif','low.csv')
df = pd.read_csv('low.csv')
df['newx'] = pd.cut(df['x'], bins=list(np.arange(-0.5,361)), right=True, labels=False)
df['newy'] = pd.cut(df['y'], bins=list(np.arange(-70.5,71)), right=True, labels=False)-70
xlist = []
ylist = []
zlist = []

def convertnewdata():
    for a in range(0,361):
        print(a)
        for b in range(-70,71):       
            cz = df.loc[(df['newx'] ==a) & (df['newy'] == b)]
            z = cz.loc[:, 'z'].mean()
            xlist.append(a)
            ylist.append(b)
            zlist.append(z)
    #print(len(xlist))
    createFrame = list(zip(xlist, ylist, zlist))
    adf = pd.DataFrame(createFrame, columns=['x', 'y', 'z'])
    print(adf.head(10))
    adf.to_csv('lower.csv')
#convertnewdata()
#heatmapdf = df.pivot("y", "x", "z")
#print(df.head(5))
#sns.heatmap(df)
#plt.show()