let cheerio = require("cheerio");
let request = require("request");
let path = require("path");
let fs = require("fs");
let pdfkit = require("pdfkit");



function getIssuesLink(url, topicFolderName, repoFileName){
    request(url, issuesPagecb);

    function issuesPagecb(error, response, html){
        if(error){
            console.log(error);
        }else if(response.statusCode == "404"){
            console.log("page Not Found");
        }else{
            issuesLinkExtractor(html);
        }
    }

    function issuesLinkExtractor(html){
        let $ = cheerio.load(html);
        let issuesSelector = $("a[id='issues-tab']");
        let issueslink = $(issuesSelector).attr("href");
        let issuesFulllink = `http://github.com${issueslink}`;
        // console.log(topicFolderName);
        // console.log(repoFileName);
        // console.log(issuesFulllink);
        request(issuesFulllink, issuesFullLinkCb);

    }

    function issuesFullLinkCb(error, response, html){
        if(error){
            console.log(error);
        }else if(response.statusCode == "404"){
            console.log("page Not Found");
        }else{
            allIssues(html);
        }
    }

    function allIssues(html){
        let $ = cheerio.load(html);
        let issuesLinkArr = $("a[data-hovercard-type='issue']");
        let data = [];
        for(let i = 0 ;  i< issuesLinkArr.length; i++){
            let allissuesLink = $(issuesLinkArr[i]).attr("href");
            let issuesFullLink = `http://github.com${allissuesLink}`
            data.push(issuesFullLink);
            // console.log(issuesFullLink);
            }
            // process(topicFolderName,repoFileName,data);
            processPdfSave(topicFolderName, repoFileName, data);

        
    }
    
}

function process(topicFolderName, repoFileName, data){
    let jsonWriteable = JSON.stringify(data);
    let topicFolderPath = path.join(__dirname, topicFolderName);
    if(fs.existsSync(topicFolderPath) == false){
        fs.mkdirSync(topicFolderPath);
    }

    let repoFilePath = path.join(topicFolderPath, repoFileName+".json");
        if(fs.existsSync(repoFilePath) == false){
            fs.writeFileSync(repoFilePath, jsonWriteable);
        }else{
            fs.appendFileSync(repoFilePath, jsonWriteable);
        }
}

function processPdfSave(topicFolderName, repoFileName, data){
    let jsonWriteable = JSON.stringify(data);
    let topicFolderPath = path.join(__dirname, topicFolderName);
    if(fs.existsSync(topicFolderPath) == false){
        fs.mkdirSync(topicFolderPath);
    }

    let repoFilePath = path.join(topicFolderName, repoFileName+".pdf");
    let doc = new pdfkit();
    doc.pipe(fs.createWriteStream(repoFilePath));
    doc.text(jsonWriteable);
    doc.end();

}
module.exports = {
    getIssuesFxn : getIssuesLink
}