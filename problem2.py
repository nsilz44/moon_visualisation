import pygmt
import pandas as pd




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
#convertData('ldem_16_uint.tif','high.csv')