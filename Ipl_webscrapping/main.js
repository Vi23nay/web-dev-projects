let request = require("request");
let cheerio = require("cheerio");
let link = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let scoreBoardobj = require("./scorecard");

request(link, cb);
function cb(error, response, html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        Homepage(html);
    }
}

function Homepage(html){
    let sourceTool = cheerio.load(html);
    let anchorRep = sourceTool(" a[data-hover='View All Results'] ");
    let link = anchorRep.attr("href");
    let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
    // console.log(fullAllMatchPageLink); 
    ////request to get all match page
    request(fullAllMatchPageLink, allMatchPageCb);

}

function allMatchPageCb(error, response, html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        AllMatchPageLink(html);
    }
    
}

function AllMatchPageLink(html){
    let sourceTool = cheerio.load(html);
    let anchoreRep = sourceTool("a[data-hover = 'Scorecard']");
    for(let i = 0 ; i < anchoreRep.length ; i++){
        let scoreCardLink = sourceTool(anchoreRep[i]).attr("href");
        let fullScoreCardLink = `https://www.espncricinfo.com${scoreCardLink}`;
        // console.log(fullScoreCardLink);
        // request(fullScoreCardLink, scoreBoardobj.scoreBoardFxn());
        scoreBoardobj.scoreBoardFxn(fullScoreCardLink);
        

    }
}

