1- In scorecard.js

////FOR PLAYERNAMES ONLY////
        // let playername = sourceTool(batsmanTables[team]).find(".batsman-cell.text-truncate.out");
        // // let playername = sourceTool(batsmanTables[team]).find("td");
        // for(let name = 0 ; name < playername.length ; name++){
        //     let names = sourceTool(playername[name]).text();
        //     console.log("\t"+"├──"+names+"\n");
            
        // }



----------------------------------------------------------------------------------------------------

let currentPath = process.cwd();
    for(let team = 0 ; team < bothTeams.length ; team++){
        let teamName = sourceTool(bothTeams[team]).text();
        console.log(bothTeams.length);
        console.log(teamName);
        // let teamFolderPath = path.join(currentPath, teamName);
        // if(fs.existsSync(teamFolderPath) == false){
        //     fs.mkdirSync(teamFolderPath);
        // }



        let batsmanTables = sourceTool(".table.batsman tbody");
    ////COMPLETE INFO///
        let playerDetailsRow = sourceTool(batsmanTables[team]).find("tr");
        let playerName = sourceTool(playerDetailsRow[0]).text();
        // console.log(playerName);
        // let playerDetailsFilePath = path.join(teamFolderPath, playerName);
        // let dataArr = [playerName];
        for(let row = 0 ; row < playerDetailsRow.length ; row++){
            let cols = sourceTool(playerDetailsRow).find("td");
            // if(cols.length == 8){/
                console.log(cols.length);
                let details = sourceTool(cols).text();
                console.log(details);
            // }
                // let details = sourceTool(playerDetailsRow[row]).text();
                // console.log(details);
                    // dataArr.push(details);
                    // let jsonWriteAble = JSON.stringify(dataArr)
                    
                    // fs.writeFileSync(playerDetailsFilePath+".json" ,jsonWriteAble)
    
                
                
            }   