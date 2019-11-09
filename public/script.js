const video = document.getElementById('video')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

async function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  const labeledFaceDescriptors = await loadLabeledFaces()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const labeledFaceDescriptors = await loadLabeledFaces()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      console.log(result);
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  }, 100)
})

async function loadLabeledFaces() {
  const url = 'http://localhost:8000/loadfaces';
  const labels = await fetch(url)
    .then(data => {
      return data.json()
    })
    .then(data => {
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      const img = await faceapi.fetchImage(`http://localhost:8000/faces/${label}`)
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections.descriptor)

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}