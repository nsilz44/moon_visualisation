import pygmt
import pandas as pd

img = 'lroc_color_poles_2k.tif'
def contourLines(displacement,region,interval,annotation):
    fig = pygmt.Figure()
    grid = displacement
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    fig.grdimage(grid=data,cmap="haxby",frame=True,projection='M15c',region=region)
    fig.grdcontour(grid=data,interval=interval,annotation=annotation)
    fig.colorbar(frame=["x+lelevation", "y+lm"])
    fig.show()

contourLines('ldem_4_uint.tif',[0,10,0,10],1000,3000)

def baseimage(image):
    fig = pygmt.Figure()
    grid = image
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    print(pygmt.info(xyz_df))
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    fig.grdimage(grid=data,projection='M15c',cmap='gray',frame=True)   
    fig.show()

#baseimage(img)