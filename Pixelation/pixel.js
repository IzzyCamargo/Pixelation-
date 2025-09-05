//consts 
const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resize");
const main = document.querySelector("main");

const MIN_CANVAS_SIZE = 4;

let isPainting = false;
let isResizing = false;

const createElement = (tag, className = "") =>{
    const element = document.createElement(tag);
    element.className = className;
    return element; 
}

//pintar os pixels 
const setPixelColor = (pixel) =>{
    pixel.style.backgroundColor = inputColor.value;
}

//criar Pixels 
const createPixel = () => {
    const pixel = createElement("div", "pixel");

    pixel.addEventListener("mousedown",() => setPixelColor(pixel))
    pixel.addEventListener("mouseover", () =>{
        if(isPainting) setPixelColor(pixel);
    })

    return pixel;
}
//carregar o canvas 
const loadCanvas = () =>{
    const length = inputSize.value;
    canvas.innerHTML = "";
    for(i = 0; i < length; i += 1){
        const row = createElement("div", "pixel-row");
        for(let j = 0; j < length; j += 1){
            row.append(createPixel())
        }

        canvas.append(row);
    }
}
const updateCanvasSize = () =>{
    if(inputSize.value >= MIN_CANVAS_SIZE){
    loadCanvas();
    } else{
        alert("Não é possível gerar uma tela menor que 4 pixels");
    }
}
const changeColor = () =>{
    const button = createElement("button", "button-color");
    const currentColor = inputColor.value
    
    button.style.backgroundColor = currentColor;
    button.setAttribute("data-color", currentColor)
    button.addEventListener("click", () => inputColor.value = currentColor )
   
    const savedColors = Array.from(usedColors.children);

    const check = (btn) => btn.getAttribute("data-color") != currentColor;

    if(savedColors.every(check)){
        usedColors.append(button);
    }
}
const resizeCanvas = (cursorPositionX) => {
    if(!isResizing) return;

    const canvasOffset = canvas.getBoundingClientRect().left;
    const width = `${cursorPositionX - canvasOffset - 20}px`;

    canvas.style.maxWidth = width;
   

}
const saveCanvas = () =>{
    html2canvas(canvas, {
        onrendered: (image) =>{
            const img = image.toDataURL("image/png");
            const link = createElement("a");

            link.href = img;
            link.download = "pixelart.png"

            link.click();
        }
    })
}



canvas.addEventListener("mousedown", () => (isPainting = true));
canvas.addEventListener("mouseup", () => (isPainting = false));

inputSize.addEventListener("change", updateCanvasSize);
inputColor.addEventListener("change", changeColor);

colResize.addEventListener("mousedown", () => (isResizing = true));

main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ({clientX}) => resizeCanvas(clientX));

buttonSave.addEventListener("click", saveCanvas);


loadCanvas();