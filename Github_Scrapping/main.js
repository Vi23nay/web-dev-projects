let cheerio = require("cheerio");
let request = require("request");
let githubLink = "http://github.com/topics";

let insideTopicPageObj = require("./repos");

request(githubLink, cb);

function cb(error, response, html){
    if(error){
        console.log("error");
    }else if(response.statusCode == "404"){
        console.log("page not found");
    }else{
        threeTopicsExtractor(html);
    }
}

function threeTopicsExtractor(html){
    let $ = cheerio.load(html);
    let threeTopicsArray = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for(let i = 0 ; i < threeTopicsArray.length; i++){
        let topicLink = $(threeTopicsArray[i]).attr("href");// no need to converting in text
        let topicFolderName = $(threeTopicsArray[i]).text().split("\n")[3];
        // console.log(folderName);
        let fullLink = `http://github.com${topicLink}`;
        // console.log(fullLink);
        insideTopicPageObj.insideTopicPagefxn(fullLink, topicFolderName);
        
        
    }
}

