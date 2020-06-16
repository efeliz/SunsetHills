// var buildings = [];
// var sunset_visible = [];
// var tallest = 0;


// sample: 1, 2, 6, 3, 4, 7, 8, 10

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

generateScene = (buildingProps) => {
    var generatedBuildings = [];
    let buildingSpace = 50;
    let buildingWidth = 250;
    let buildingPartHeight = 200;
    
    var xPos = 0;

    for (b=0; b < buildingProps.length; b++){
        let buildingHeight = buildingProps[b];
        xPos += buildingSpace;

        // create a building with template and insert into sceneView before end
        let template = document.querySelector("#buildingTemplate").content.cloneNode(true);
        let building = template.querySelector("#buildingContainer");
        
        building.setAttribute("data-buildingID", b);
        building.setAttribute("data-buildingHeight", buildingHeight);
        building.style.left = `${xPos}px`;

        var buildingPart = document.createElement("div");
        buildingPart.setAttribute("class", "building-part");
        let buildingRoof = document.createElement("img");
        buildingRoof.setAttribute("id", "building-roof");
        buildingRoof.setAttribute("src", "assets/building_parts/red-roof.png");
        buildingPart.insertAdjacentElement("beforeend", buildingRoof);
        building.insertAdjacentElement("beforeend", buildingPart);

        for (c=0; c < buildingHeight; c++){
            buildingPart = document.createElement("div");
            buildingPart.setAttribute("class", "building-part");
            let buildingMid = document.createElement("img");
            buildingMid.setAttribute("id", "building-middle");
            buildingMid.setAttribute("src", "assets/building_parts/red-middle.png");
            buildingPart.insertAdjacentElement("beforeend", buildingMid);
            building.insertAdjacentElement("beforeend", buildingPart);
        }

        buildingPart = document.createElement("div");
        buildingPart.setAttribute("class", "building-part");
        let buildingBottom = document.createElement("img");
        buildingBottom.setAttribute("id", "building-bottom");
        buildingBottom.setAttribute("src", "assets/building_parts/red-bottom.png");
        buildingPart.insertAdjacentElement("beforeend", buildingBottom)
        building.insertAdjacentElement("beforeend", buildingPart);

        xPos += buildingWidth;
        let sceneContainer = document.querySelector("#sceneView");
        sceneContainer.insertAdjacentElement("beforeend", building);
    }
}

let heights = [5, 2, 3, 6, 1];
generateScene(heights);