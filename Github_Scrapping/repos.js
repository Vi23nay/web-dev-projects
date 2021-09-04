let cheerio = require("cheerio");
let request = require("request");

let getIssuesObj = require("./issues");


function insideTopicPage(url, topicFolderName){
    request(url, topicsDetailsExtractorCb);

    function topicsDetailsExtractorCb(error, response, html){
        if(error){
            console.log(error);
        }else if(response.statusCode == "404"){
            console.log("page Not Found");
        }else{
            reposExtractor(html);
        }
    }

    function reposExtractor(html){
        let $ = cheerio.load(html);
        let headingsArray = $(".f3.color-text-secondary.text-normal.lh-condensed");
        for(let  i = 0 ; i < 8; i++){
          let anchors = $(headingsArray[i]).find("a");
          let repoFileLink =$(anchors[1]).attr("href");
          let repoName = repoFileLink.split("/").pop();
        //   console.log(repoName); 
          let fullLink = `http://github.com${repoFileLink}`;
          console.log(fullLink);
          getIssuesObj.getIssuesFxn(fullLink, topicFolderName, repoName);

        }
        
    }


}



// function(detailsExtractor)

module.exports={
    insideTopicPagefxn : insideTopicPage,
}