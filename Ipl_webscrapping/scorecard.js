// myTeamName	name	venue	date opponentTeamName	result	runs	balls	fours	sixes	sr
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");


function scoreBoardExtractor(url) {
    request(url, scoreboardPageCb);
}

function scoreboardPageCb(error, response, html) {
    if (error) {
        console.log(error);
    }
    else if (response.statusCode == 404) {
        console.log("Page Not Found");
    }
    else {
        detailsExtractor(html);
    }
}

function detailsExtractor(html) {
    let sourceTool = cheerio.load(html);
    // let Teamname = sourceTool(".header-title.label");
    let resultLine = sourceTool(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text");
    let resultArr = sourceTool(resultLine).text().split(" ");
    let result = resultArr[0];


    let venueSelector = sourceTool(".font-weight-bold.match-venue");
    let venue = venueSelector.text();
    // console.log(venue);
    // console.log(result);


    let dateSelector = sourceTool(".match-header-info.match-info-MATCH .description");
    let dateArr = sourceTool(dateSelector).text().split(",");
    let date = dateArr[2];
    console.log(date);



    let bothTeams = sourceTool(".event .name");
    //this work is done to fill both teams name in array and then use it for to find out opponent team name;
    let teamNamesArr = []
    for (let team = 0; team < bothTeams.length; team++) {
        teamName = sourceTool(bothTeams[team]).text();
        teamNamesArr.push(teamName);

    }

    // let bothTeams = sourceTool(".event .name");

    for (let team = 0; team < bothTeams.length; team++) {
        teamName = sourceTool(bothTeams[team]).text();
        console.log(teamName);

        let opponentTeamName;
        if (team == 0) {
            opponentTeamName = teamNamesArr[1];
        } else {
            opponentTeamName = teamNamesArr[0];
        }
        console.log(opponentTeamName);


        let BatsmanTable = sourceTool(".table.batsman");
        let row = sourceTool(BatsmanTable[team]).find("tbody tr");
        // let playerName = sourceTool(row[0]).text();
        for (let i = 0; i < row.length; i++) {
            // let details = sourceTool(row[i]).text();
            let cols = sourceTool(row[i]).find("td");

            // console.log(cols.length);
            if (cols.length == 8) {
                let playerName = sourceTool(cols[0]).text();
                let runs = sourceTool(cols[2]).text();
                let balls = sourceTool(cols[3]).text();
                let fours = sourceTool(cols[5]).text();
                let six = sourceTool(cols[6]).text();
                let sr = sourceTool(cols[7]).text();
                // jsonFileWriteProcess(teamName, playerName.trim(), venue, date, opponentTeamName, result, runs, balls, fours, six, sr);
                excelfileWriterProcess(teamName, playerName.trim(), venue, date, opponentTeamName, result, runs, balls, fours, six, sr);


            }

        }


    }
    function jsonFileWriteProcess(teamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, six, sr) {
        let detailsArr = [];
        let obj = {
            teamName,
            playerName,
            venue,
            date,
            opponentTeamName,
            result,
            runs,
            balls,
            fours,
            six
        }
        console.log(teamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, six, sr);

        detailsArr.push(obj);
        let iplFolderPath = path.join(__dirname, "ipl_2021");
        if (fs.existsSync(iplFolderPath) == false) {
            fs.mkdirSync(iplFolderPath);
        }

        let teamFoldersPath = path.join(iplFolderPath, teamName);
        if (fs.existsSync(teamFoldersPath) == false) {
            fs.mkdirSync(teamFoldersPath);
        }

        let playerFilePath = path.join(teamFoldersPath, playerName + ".json");
        let jsonWriteAble = JSON.stringify(detailsArr);
        // detailsArr.push(obj);
        if (fs.existsSync(playerFilePath) == true) {
            fs.appendFileSync(playerFilePath, jsonWriteAble);
        } else {
            fs.writeFileSync(playerFilePath, jsonWriteAble);
        }




    }

function excelfileWriterProcess(teamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, six, sr) {
        let obj = {
            teamName,//key value pair same
            playerName,
            venue,
            date,
            opponentTeamName,
            result,
            runs,
            balls,
            fours,
            six
        }
        let iplFolderPath = path.join(__dirname, "ipl_2021");
        if (fs.existsSync(iplFolderPath) == false) {
            fs.mkdirSync(iplFolderPath);
        }

        let teamFoldersPath = path.join(iplFolderPath, teamName);
        if (fs.existsSync(teamFoldersPath) == false) {
            fs.mkdirSync(teamFoldersPath);
        }

        let filePath = path.join(teamFoldersPath, playerName+".xlsx");
        let content = excelReader(filePath, playerName);
        content.push(obj);
        excelWriter(filePath, content, playerName);




}
//excel writer
function excelWriter(filepath, jsonData, sheetName) {// we crate this function
    let newWb = xlsx.utils.book_new();//create new worksheet

    let newWs = xlsx.utils.json_to_sheet(jsonData);//json data -> excel format

    xlsx.utils.book_append_sheet(newWb, newWs, sheetName);//newwb, worksheet, sheet name

    xlsx.writeFile(newWb, filepath);//write in xl file
}




//read xlsx file

function excelReader(filepath, sheetName) {
    if(fs.existsSync(filepath) == false){
        return [];
    }
    let wb = xlsx.readFile(filepath);//file path
    let excelData = wb.Sheets[sheetName];//sheet name
    let ans = xlsx.utils.sheet_to_json(excelData);//sheet data to json
    return ans;
}





    console.log("````````````````````````````````````````````````````````````````");
}





module.exports = {
    scoreBoardFxn: scoreBoardExtractor,
}

// let teamFolderPAth = path.join(process.cwd() , teamName);
//         if(fs.existsSync(teamFolderPAth) == false){
//             fs.mkdirSync(teamFolderPAth);
//             console.log(path.basename(teamFolderPAth),"Folder created",)
//         }