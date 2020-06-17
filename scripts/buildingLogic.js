// var buildings = [];
// var sunset_visible = [];
// var tallest = 0;


// sample: 1, 2, 6, 3, 4, 7, 8, 10

let partHeight = 200;

// Building Editor Props:
const MAX_PREVIEW_HEIGHT = 2;

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
    selectedBuildingIndex: 0,
    selectedColorIndex: 0
};

findVisibleBuildings = (buildings) => {
    var sunset_visible = [];
    var tallest = 0;

    if (buildings.length > 0){
        sunset_visible = [buildings[0]];
        tallest = buildings[0];
    }

    for (var b=0; b < buildings.length; b++){
        let building = buildings[b];
        for (var v = 0; v < sunset_visible.length; v++){
            let visible = sunset_visible[v];
            if ((building > visible) && (building > tallest)){
                sunset_visible.push(building);
                tallest = building;
            }
        }
    }

    console.log(`The following buildings can see the sunset: ${sunset_visible}`);
    console.log(`${sunset_visible.length} building(s) can see the sunset over the hills.`);
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

        params: id, height, type, color, xPos (optional), maxheight (optional)

        asset file-naming: type-color-part.png

        returns: a building html element
    */

    let buildingHeight = params.height;
    let buildingType = params.type.toLowerCase();
    let buildingColor = params.color;

    let containerHeight = buildingHeight * (partHeight);
    if (params.maxHeight && ( buildingHeight > params.maxHeight)){
        containerHeight = maxHeight * partHeight
    }

    // create a building with template and insert into sceneView before end
    let template = document.querySelector("#buildingTemplate").content.cloneNode(true);
    let building = template.querySelector("#buildingContainer");
    
    building.setAttribute("data-buildingID", params.id);
    building.setAttribute("data-buildingHeight", buildingHeight);
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

    for (c=0; c < buildingHeight; c++){
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

generateScene = (buildingProps) => {
    let buildingSpace = 50;
    let buildingWidth = 250;
    
    var xPos = 0;

    for (b=0; b < buildingProps.length; b++){
        xPos += buildingSpace;

        let generatedBuilding = generateBuilding({
            id: b,
            height: buildingProps[b],
            xPos: xPos
        });

        xPos += buildingWidth;

        let sceneContainer = document.querySelector("#sceneView");
        sceneContainer.insertAdjacentElement("afterbegin", generatedBuilding);
    }
    document.querySelector("#heightDefiner").style.height = `1500px`;
    let sceneWidth = document.querySelector("#sceneView").scrollWidth;
    let sceneHeight = document.querySelector("#sceneView").scrollHeight;
    document.querySelector("#groundPart").style.top = `${sceneHeight + 40}px`;
    document.querySelector("#groundPart").style.width = `${sceneWidth + buildingSpace}px`;

    let foundBuildings = document.querySelectorAll(".buildingContainer");
    let groundTopPosition = document.querySelector("#groundPart").getBoundingClientRect().top;

    foundBuildings.forEach(bldg => {
        let bldgBtm = bldg.getBoundingClientRect().bottom;
        bldg.style.top = `${(groundTopPosition - bldgBtm - (partHeight*2))}px`;
    });

    document.querySelector("#sceneView").scrollTo({top: sceneHeight});
}

// let heights = [5, 2, 3, 6, 1];
// generateScene(heights);

let initialize = () => {
    setEditorUI(buildingEditor.selectedBuildingIndex, buildingEditor.selectedColorIndex);
}

setEditorUI = (selectedBuilding, selectedColor) => {
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
        height: 1,
        type: currentBuildingType,
        color: currentColor.prefix,
        maxHeight: MAX_PREVIEW_HEIGHT
    })
    buildingPreviewBox.insertAdjacentElement("beforeend", generatedPreview);

    document.querySelector("#buildingTypeLabel").innerText = currentBuildingType;

    // set arrow button states
    if (availableTypesCount > 1){
        if (selectedBuilding === (availableTypesCount - 1)) {
            prevBtn.hidden = false;
            nextBtn.hidden = true;
        } else if (selectedBuilding === 0){
            prevBtn.hidden = true;
            nextBtn.hidden = false;
        } else {
            prevBtn.hidden = false;
            nextBtn.hidden = false;
        }
    } else {
        prevBtn.hidden = true;
        nextBtn.hidden = true;
    }

    // generate color options
    let colorsContainer = document.querySelector("#buildingColorsContainer");
    colorsContainer.innerHTML = "";

    let colorBtnTemplate = document.querySelector("#colorSelectBtnTemplate"); 
    for (c=0; c < currentBuilding.colors.length; c++){
        let colorBtn = colorBtnTemplate.content.cloneNode(true).querySelector("button");
        colorBtn.style.backgroundColor = `${currentBuilding.colors[c].code}`;
        colorBtn.setAttribute("data-colorID", c);
        colorBtn.setAttribute("data-colorName", currentBuilding.colors[c].prefix);
        colorsContainer.insertAdjacentElement("beforeend", colorBtn);
    }
}

let buildingTypeChanged = (change) => {
    if (change === "increment"){
        buildingEditor.selectedBuildingIndex += 1;
    } else if (change === "decrement"){
        buildingEditor.selectedBuildingIndex -= 1;
    }

    setEditorUI(buildingEditor.selectedBuildingIndex, buildingEditor.selectedColorIndex);
}

window.onload = initialize();