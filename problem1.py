import pygmt
import pandas as pd


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

#contourLines('ldem_4_uint.tif',[0,20,0,20],2000,12000)
img = 'lroc_color_poles_2k.tif'
def baseImage(image,region):
    fig = pygmt.Figure()
    grid = image
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    #print(pygmt.info(xyz_df))
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    fig.grdimage(grid=data,projection='M15c',cmap='gray',frame=True,region=region)   
    fig.show()

#baseImage(img,[0,20,0,20])
def threeDPerspective(displacement,region):
    fig = pygmt.Figure()
    grid = displacement
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    fig.grdview(grid=data,perspective=[130, 30], region=region,frame=["xa", "ya", "WSnE"],plane="1000+ggray",surftype="s",cmap="haxby",projection="M15c",zsize="1.5c")
    fig.colorbar(perspective=True, frame=["x+lElevation", "y+lm"])
    fig.show()

threeDPerspective('ldem_4_uint.tif',[0,20,0,20])

