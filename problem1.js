
url = 'http://localhost:8080/'
var moon = d3.select('#basemoon');
moon.on('click', function (e) {
    var image = e.target;
    rect = image.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    minX = 78.31666564941406;
    minY = 12;
    maxX = 1281.316665649414;
    maxY = 675;
    coordX = (offsetX - minX) * (360/(maxX-minX));
    coordY = ((offsetY - minY) * (140/(maxY-minY)) - 70) * -1;
    console.log([coordX, coordY]);
    document.getElementById('regionXL').value = coordX - 5;
    document.getElementById('regionXR').value = coordX + 5;
    document.getElementById('regionYB').value = coordY - 5
    document.getElementById('regionYT').value = coordY + 5
    displayImages();
    createImages();
    
})

function displayImages(){
    document.getElementById('contourimg').src = '';
    document.getElementById('threeD').src = '';
    document.getElementById('contourimg').src = 'countourlines.png';
    document.getElementById('threeD').src = 'threeDperspective.png';
}
var a = 1;
function createImages(){
    var regionXL = document.getElementById('regionXL').value;
    var regionXR = document.getElementById('regionXR').value;
    var regionYB = document.getElementById('regionYB').value;
    var regionYT = document.getElementById('regionYT').value;
    var colourmap = document.getElementById('colourmap').value;
    var quality = document.getElementById('quality').value;
    var contourinterval = document.getElementById('contourinterval').value;
    var contourannotation = document.getElementById('contourannotation').value;
    var viewAzimuth = document.getElementById('viewAzimuth').value;
    var viewElevation = document.getElementById('viewElevation').value;
    console.log([regionXL,regionXR,regionYB,regionYT],colourmap,quality,contourinterval,contourannotation,viewAzimuth,viewElevation)
    async function getImages() {
        a = a  +1
        let x = await fetch(url + new URLSearchParams({
            regionXL: regionXL,
            regionXR: regionXR,
            regionYB: regionYB,
            regionYT: regionYT,
            cmap: colourmap,
            quality:quality,
            cInterval:contourinterval,
            cAnnotation:contourannotation,
            viewAzimuth:viewAzimuth,
            viewElevation:viewElevation,
            a:a
            })).catch(error => {
                displayImages();
            });
    }
    getImages();
}