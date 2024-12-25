/* script.js */
const URL = "https://teachablemachine.withgoogle.com/models/wzRzKbDfY/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true; // flip the webcam image
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup(); // request webcam access
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append webcam and create prediction bars
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        const predictionElement = document.createElement("div");
        predictionElement.className = "prediction";

        const labelElement = document.createElement("span");
        labelElement.className = "label";
        predictionElement.appendChild(labelElement);

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        const progressBarInner = document.createElement("div");
        progressBarInner.className = "progress-bar-inner";
        progressBar.appendChild(progressBarInner);
        predictionElement.appendChild(progressBar);

        labelContainer.appendChild(predictionElement);
    }
}

async function loop() {
    webcam.update(); // update webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;

        // Update label
        const labelElement = labelContainer.children[i].querySelector(".label");
        labelElement.textContent = classPrediction;

        // Update progress bar
        const progressBarInner = labelContainer.children[i].querySelector(".progress-bar-inner");
        progressBarInner.style.width = `${prediction[i].probability * 100}%`;

        // Change color based on probability
        progressBarInner.style.backgroundColor =
            prediction[i].probability > 0.5 ? "#27ae60" : "#e74c3c";
    }
}
