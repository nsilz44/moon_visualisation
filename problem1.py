import pygmt
import pandas as pd
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib.parse


def contourLines(displacement,region,interval,annotation,cmap,output_file):
    fig = pygmt.Figure()
    grid = displacement
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    if cmap != 'none':
        fig.grdimage(grid=data,cmap=cmap,frame=True,projection='M15c',region=region)
    if annotation != 0:
        fig.grdcontour(grid=data,interval=interval,projection='M15c',annotation=annotation,region=region)
    else:
        fig.grdcontour(grid=data,interval=interval,projection='M15c',region=region)
    if cmap != 'none':
        fig.colorbar(frame=["x+lelevation", "y+lm"])
    fig.savefig(output_file)

#contourLines('ldem_4_uint.tif',[0,20,0,20],2000,0,'haxby','countourLines.png')
img = 'lroc_color_poles_8k.tif'
def baseImage(image,region,output):
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
    fig.savefig(output)

#baseImage(img,[0, 360, -70, 70],'BaseMoon.png')
def threeDPerspective(displacement,region,viewAzimuth,viewElevation,cmap,output):
    fig = pygmt.Figure()
    grid = displacement
    data = grid
    xyz_df = pygmt.grd2xyz(grid=grid, output_type="pandas")
    longAdd = xyz_df['x'].min() + xyz_df['x'].max()
    xyz_df['x'] = xyz_df['x'].apply(lambda x: x*360/longAdd)
    latAdd = xyz_df['y'].min() + xyz_df['y'].max()
    xyz_df['y'] = xyz_df['y'].apply(lambda x: (x-(latAdd/2))*140/latAdd)
    data = pygmt.xyz2grd(xyz_df,spacing=(720/longAdd,280/latAdd), region=[0, 360, -70, 70])
    if cmap != 'none':
        fig.grdview(grid=data,perspective=[viewAzimuth,viewElevation], region=region,frame=["xa", "ya", "WSnE"],plane="1000+ggray",surftype="s",cmap=cmap,projection="M15c",zsize="1.5c")
        fig.colorbar(perspective=True, frame=["x+lElevation", "y+lm"])
    else:
        fig.grdview(grid=data,perspective=[viewAzimuth,viewElevation], region=region,frame=["xa", "ya", "WSnE"],plane="1000+ggray",surftype="m",projection="M15c",zsize="1.5c")
    fig.savefig(output)

#threeDPerspective('ldem_4_uint.tif',[0,10,0,10],135, 30,'geo','threeDperspective.png')


hostName = "localhost"
serverPort = 8080
timestamps = []
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        params = self.path.split('&')
        if params not in timestamps:
            region = [float(params[0][10:]),float(params[1][9:]),float(params[2][9:]),float(params[3][9:])]
            cmap = params[4][5:]
            if params[5][8:] == 'low':
                displacement = 'ldem_4_uint.tif'
            else:
                displacement = 'ldem_16_uint.tif'
            interval = int(params[6][10:])
            annotation = int(params[7][12:])
            viewAzimuth = int(params[8][12:])
            viewElevation = int(params[9][14:])
            contourLines(displacement,region,interval,annotation,cmap,'countourLines.png')
            threeDPerspective(displacement,region,viewAzimuth,viewElevation,cmap,'threeDperspective.png')
            timestamps.append(params)
            self.send_response(200)
        else:
            o = 1
        return

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")





