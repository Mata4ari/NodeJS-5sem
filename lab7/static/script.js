document.getElementById('loadJson').addEventListener('click', () => {
    fetch('http://localhost:3000/data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('jsonContent').textContent = JSON.stringify(data, null, 2);
        });
});

document.getElementById('loadXml').addEventListener('click', () => {
    fetch('http://localhost:3000/data.xml')
        .then(response => response.text())
        .then(data => {
            document.getElementById('xmlContent').textContent = data;
        });
});
