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
        for (var v = 0; v < sunset_visible.length; v++){
            if (buildings[b] > sunset_visible[v]){
                if (buildings[b] > tallest){
                    sunset_visible.push(buildings[b]);
                    tallest = buildings[b];
                }
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

        findVisibleBuildings(tempBuildings);
    } else {
        alert("buildings field empty");
    }
}
