// sample: 1, 2, 6, 3, 4, 7, 8, 10

class building {
    constructor(props) {
        this.type = props.type;
        this.height = props.height;
        this.color = props.color;
        this.sunsetVisible = props.sunsetVisible != null ? props.sunsetVisible : false;
    }
}

let partHeight = 200;

// Scene Props & Values:
this.buildings = ko.observableArray();
buildings.subscribe(() => {
    updateSceneUI(this.buildings());
}, this, "arrayChange");


var buildingSpace = 50;
var buildingWidth = 250;
var tallestBuilding = 0;
var visibleBuildings = 0;

// Building Editor Props:
const MAX_PREVIEW_HEIGHT = 3;
const DEFAULT_BUILDING_INDEX = 0;
const DEFAULT_BUILDING_COLOR = 0;
const DEFAULT_BUILDING_HEIGHT = 2;

var buildingEditor = {
    availableBuildings: [
        {
            "title": "Standard",
            "colors": [
                {
                    "code": "#E26A6A",
                    "prefix": "red"
                },
                {
                    "code": "#FABE58",
                    "prefix": "orange"
                }
            ]
        },
        {
            "title": "Office",
            "colors": [
                {
                    "code": "#E26A6A",
                    "prefix": "red"
                },
                {
                    "code": "#FABE58",
                    "prefix": "orange"
                }
            ]
        }
    ],
    selectedBuildingIndex: DEFAULT_BUILDING_INDEX,
    selectedColorIndex: DEFAULT_BUILDING_COLOR,
    buildingHeight: DEFAULT_BUILDING_HEIGHT
};

findVisibleBuildings = (buildings) => {
    var sunset_visible = [];
    tallestBuilding = 0;

    if (buildings.length > 0){
        sunset_visible = [buildings[0].height];
        tallest = buildings[0].height;
        buildings[0].sunsetVisible = true;
    }

    for (var b=0; b < buildings.length; b++){
        let bldgHeight = buildings[b].height;
        for (var v = 0; v < sunset_visible.length; v++){
            let visible = sunset_visible[v];
            if ((bldgHeight > visible) && (bldgHeight > tallest)){
                sunset_visible.push(bldgHeight);
                tallest = bldgHeight;
                buildings[b].sunsetVisible = true;
            }
        }
    }

    // console.log(`The following buildings can see the sunset: ${sunset_visible}`);
    // console.log(`${sunset_visible.length} building(s) can see the sunset over the hills.`);
    visibleBuildings = sunset_visible.length;

    return buildings;
}



startProcess = () => {
    let buildingsFieldVal = document.getElementById("buildingsListField").value;
    if (buildingsFieldVal.length > 0){
        var tempBuildings = buildingsFieldVal.replace(/\s/g, "");
        tempBuildings = tempBuildings.split(",");
        for(var s=0; s < tempBuildings.length; s++){
            let parsedVal = parseInt(tempBuildings[s], 10);
            if(isNaN(parsedVal)){
                alert("You've entered a value that's not a number. Please ensure that your values are all numbers.");
                break;
            } else {
                tempBuildings[s] = parsedVal;
            }
        }

        // findVisibleBuildings(tempBuildings);
        
    } else {
        alert("buildings field empty");
    }
}

generateBuilding = (params) => {
    /*

        params: id, height, type, color, sunsetVisible, xPos (optional), maxheight (optional)

        asset file-naming: type-color-part.png

        returns: a building html element
    */

    let buildingHeight = params.height;
    let buildingType = params.type.toLowerCase();
    let buildingColor = params.color;
    let buildingVisible = params.sunsetVisible != null ? params.sunsetVisible : false;

    let containerHeight = buildingHeight * (partHeight);
    if (params.maxHeight && ( buildingHeight > params.maxHeight)){
        containerHeight = params.maxHeight * partHeight
        buildingHeight = params.maxHeight;
    }

    // create a building with template and insert into sceneView before end
    let template = document.querySelector("#buildingTemplate").content.cloneNode(true);
    let building = template.querySelector("#buildingContainer");
    
    building.setAttribute("data-buildingID", params.id);
    building.setAttribute("data-buildingHeight", params.height);
    building.setAttribute("data-sunsetVisible", buildingVisible);
    if (params.xPos){
        building.style.left = `${params.xPos}px`;
    }
    building.style.height = `${containerHeight}px`;

    var buildingPart = document.createElement("div");
    buildingPart.setAttribute("class", "building-part");
    let buildingRoof = document.createElement("img");
    buildingRoof.setAttribute("id", "building-roof");
    buildingRoof.setAttribute("src", `assets/building_parts/${buildingType}-${buildingColor}-roof.png`);
    buildingPart.insertAdjacentElement("beforeend", buildingRoof);
    building.insertAdjacentElement("beforeend", buildingPart);

    for (c=1; c < buildingHeight; c++){
        buildingPart = document.createElement("div");
        buildingPart.setAttribute("class", "building-part");
        let buildingMid = document.createElement("img");
        buildingMid.setAttribute("id", "building-middle");
        buildingMid.setAttribute("src", `assets/building_parts/${buildingType}-${buildingColor}-middle.png`);
        buildingPart.insertAdjacentElement("beforeend", buildingMid);
        building.insertAdjacentElement("beforeend", buildingPart);
    }

    buildingPart = document.createElement("div");
    buildingPart.setAttribute("class", "building-part");
    let buildingBottom = document.createElement("img");
    buildingBottom.setAttribute("id", "building-bottom");
    buildingBottom.setAttribute("src", `assets/building_parts/${buildingType}-${buildingColor}-bottom.png`);
    buildingPart.insertAdjacentElement("beforeend", buildingBottom)
    building.insertAdjacentElement("beforeend", buildingPart);

    return building;
}

clearSceneView = () => {
    document.querySelector("#sceneView").innerHTML = "";
    let baseItems = document.querySelector("#blankSceneTemplate").content.cloneNode(true);
    document.querySelector("#sceneView").appendChild(baseItems.querySelector("#heightDefiner"));
    document.querySelector("#sceneView").appendChild(baseItems.querySelector("#groundPart"));
}

updateSceneUI = (sceneBuildings) => {
    var xPos = 0;
    clearSceneView();

    if (sceneBuildings == null || sceneBuildings.length < 1){
        document.querySelector("#sceneView").hidden = true;
        document.querySelector("#emptyStateMessage").hidden = false;
    } else {
        document.querySelector("#sceneView").hidden = false;
        document.querySelector("#emptyStateMessage").hidden = true;

        let processedBuildings = findVisibleBuildings(sceneBuildings);

        for (b=0; b < processedBuildings.length; b++){
            xPos += buildingSpace;
    
            let generatedBuilding = generateBuilding({
                id: b,
                type: processedBuildings[b].type,
                height: processedBuildings[b].height,
                color: processedBuildings[b].color,
                xPos: xPos,
                sunsetVisible: processedBuildings[b].sunsetVisible
            });
    
            xPos += buildingWidth;
    
            let sceneContainer = document.querySelector("#sceneView");
            sceneContainer.insertAdjacentElement("afterbegin", generatedBuilding);
        }
        document.querySelector("#heightDefiner").style.height = `${tallestBuilding * partHeight}px`;
        let sceneWidth = document.querySelector("#sceneView").scrollWidth;
        let sceneHeight = document.querySelector("#sceneView").scrollHeight;
        document.querySelector("#groundPart").style.top = `${sceneHeight + 40}px`;
        document.querySelector("#groundPart").style.width = `${sceneWidth + buildingSpace}px`;
    
        let foundBuildings = document.querySelectorAll(".buildingContainer");
        let groundTopPosition = document.querySelector("#groundPart").getBoundingClientRect().top;
    
        foundBuildings.forEach(bldg => {
            let bldgBtm = bldg.getBoundingClientRect().bottom;
            bldg.style.top = `${(groundTopPosition - bldgBtm - (partHeight))}px`;
        });
    
        document.querySelector("#sceneView").scrollTo({top: sceneHeight});
    }
}

let initialize = () => {
    updateSceneUI();
    setEditorUI();
}

setEditorUI = () => {
    let selectedBuilding = buildingEditor.selectedBuildingIndex
    let selectedColor = buildingEditor.selectedColorIndex;

    let prevBtn = document.querySelector("#prevBldgBtn");
    let nextBtn = document.querySelector("#nextBldgBtn");

    let availableTypesCount = buildingEditor.availableBuildings.length;

    let currentBuilding = buildingEditor.availableBuildings[selectedBuilding];
    let currentBuildingType = currentBuilding.title;
    let currentColor = currentBuilding.colors[selectedColor];

    let buildingPreviewBox = document.querySelector("#buildingPreview");
    buildingPreviewBox.innerHTML = "";
    // set initial building UI in preview
    let generatedPreview = generateBuilding({
        id: 0,
        height: buildingEditor.buildingHeight,
        type: currentBuildingType,
        color: currentColor.prefix,
        maxHeight: MAX_PREVIEW_HEIGHT
    })
    buildingPreviewBox.insertAdjacentElement("beforeend", generatedPreview);

    document.querySelector("#buildingTypeLabel").innerText = currentBuildingType;

    // set arrow button states
    if (availableTypesCount > 1){
        if (selectedBuilding === (availableTypesCount - 1)) {
            prevBtn.disabled = false;
            nextBtn.disabled = true;
        } else if (selectedBuilding === 0){
            prevBtn.disabled = true;
            nextBtn.disabled = false;
        } else {
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }
    } else {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }

    // generate color options
    let colorsContainer = document.querySelector("#buildingColorsContainer");
    colorsContainer.innerHTML = "";

    let colorBtnTemplate = document.querySelector("#colorSelectBtnTemplate"); 
    for (c=0; c < currentBuilding.colors.length; c++){
        let colorBtn = colorBtnTemplate.content.cloneNode(true).querySelector("button");
        colorBtn.style.backgroundColor = `${currentBuilding.colors[c].code}`;
        colorBtn.setAttribute("data-colorID", c);
        if (buildingEditor.selectedColorIndex === c){
            colorBtn.classList.toggle("is-selected", true);
        }
        colorBtn.setAttribute("data-colorName", currentBuilding.colors[c].prefix);
        colorsContainer.insertAdjacentElement("beforeend", colorBtn);
    }

    // update height values
    document.querySelector("#buildingHeightTextField").value = buildingEditor.buildingHeight;
    document.querySelector("#buildingHeightSlider").value = buildingEditor.buildingHeight;
    if (buildingEditor.buildingHeight == 1){
        document.querySelector("#storyLabel").innerText = "Story";
    } else {
        document.querySelector("#storyLabel").innerText = "Stories";
    }
    
}

let buildingTypeChanged = (change) => {
    if (change === "increment"){
        buildingEditor.selectedBuildingIndex += 1;
    } else if (change === "decrement"){
        buildingEditor.selectedBuildingIndex -= 1;
    }

    buildingEditor.selectedColorIndex = 0;

    setEditorUI();
}

let buildingColorChanged = (element) => {
    let colorID = element.getAttribute("data-colorID");
    buildingEditor.selectedColorIndex = parseInt(colorID);

    setEditorUI();
}

let updateBuildingHeight = (newVal) => {
    buildingEditor.buildingHeight = parseInt(newVal);
    setEditorUI();
}

let addBuildingToScene = () => {
    let newBuilding = new building({
        type: buildingEditor.availableBuildings[buildingEditor.selectedBuildingIndex].title.toLowerCase(),
        height: buildingEditor.buildingHeight,
        color: buildingEditor.availableBuildings[buildingEditor.selectedBuildingIndex].colors[buildingEditor.selectedColorIndex].prefix
    });
    buildings.push(newBuilding);
    
    // reset values
    buildingEditor.selectedBuildingIndex = DEFAULT_BUILDING_INDEX;
    buildingEditor.selectedColorIndex = DEFAULT_BUILDING_COLOR;
    buildingEditor.buildingHeight = DEFAULT_BUILDING_HEIGHT;

    setEditorUI();
}

window.onload = initialize();