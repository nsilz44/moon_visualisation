
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
    document.getElementById('regionXL').value = Math.max((parseInt(coordX - 10,10)),0);
    document.getElementById('regionXR').value = Math.min((parseInt(coordX + 10,10)),360);
    document.getElementById('regionYB').value = Math.max((parseInt(coordY - 10,10)),-70);
    document.getElementById('regionYT').value = Math.min((parseInt(coordY + 10,10)),70);
    createImages();
})

function displayImages(){
    
    document.getElementById('contourimg').src = 'countourlines.png?' + Math.random();
    document.getElementById('threeD').src = 'threeDperspective.png?' + Math.random();
}
var a = 1;
function createImages(){
    document.getElementById('contourimg').src = '';
    document.getElementById('threeD').src = '';
    var regionXL = Math.max(document.getElementById('regionXL').value,0);
    var regionXR = Math.min(document.getElementById('regionXR').value,360);
    var regionYB = Math.max(document.getElementById('regionYB').value,-70);
    var regionYT = Math.min(document.getElementById('regionYT').value,70);
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