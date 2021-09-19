//-------------------why pay more?????------------------//
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
let amazonLink = 'https://www.amazon.in/';
let fkartLink = 'https://www.flipkart.com/';
let snapdealLink = 'https://www.snapdeal.com/';

let searchProduct = "";
let inputArr = process.argv.slice(2);
for(let i = 0; i < inputArr.length; i++){
    searchProduct += inputArr[i] + " ";
}


let arr = [];
let browserInstance;
let productName, price, rating, totalReviews 

(async function(){
    try {
        browserInstance = await puppeteer.launch({
            headless : false,
            defaultViewport : null,
            args : ['--start-maximized','--disable-notifications'],
            slowMo : 50
        });
        let pages = await browserInstance.pages();
        let cPage = pages[0];
        //-----------Searching on amazon-----------//
        console.log("searching....");
        await cPage.goto(amazonLink);
        await waitAndClick(cPage, "input[type = 'text']");
        await cPage.type("input[type = 'text']", searchProduct), {delay : 300};
        await cPage.click("input[id = 'nav-search-submit-button']");
        await cPage.waitForSelector(".a-size-medium.a-color-base.a-text-normal", {visible : true});
        
        const allhref = await cPage.$$eval(".a-link-normal.a-text-normal", el => el.map(x => x.getAttribute("href")));
        let buyLink = amazonLink + allhref[0];
        // console.log(buyLink);

        let allProducts = await cPage.$$(".a-size-medium.a-color-base.a-text-normal");
        await allProducts[0].click({delay : 100});
        await cPage.waitForTimeout(2000);

        pages = await browserInstance.pages();
        // console.log(pages.length);
        cPage = pages[1];

        await cPage.waitForSelector('span[id="productTitle"]', {visible : true});
        let productNameElement = await cPage.$('span[id="productTitle"]');
        productName = await cPage.evaluate(function(elem){return elem.textContent}, productNameElement);
        productName = productName.trim();
        // console.log(productName);

        let priceElement = await cPage.$('span[id="priceblock_ourprice"]');
        price = await cPage.evaluate(function(elem){return elem.textContent}, priceElement);
        price = price.trim();
        // console.log(price);
        
        let ratingElement = await cPage.$$('.a-icon-alt');
        rating = await cPage.evaluate(function(elem){return elem.textContent}, ratingElement[0]);
        rating = rating.trim();
        // console.log(rating);
        
        let reviewElement = await cPage.$$('span[id="acrCustomerReviewText"]');
        totalReviews = await cPage.evaluate(function(elem){return elem.textContent}, reviewElement[0]);
        totalReviews = totalReviews.trim();
        // console.log(totalReviews);

        
        
        let obj = {
            'website' : 'Amazon',
            productName, 
            price, 
            rating, 
            totalReviews,
            buyLink
        }

        arr.push(obj);

        fkart();
    }

    catch (error) {
        console.log(error)
    }
    


})();

//-----------Searching on flipkart----------//
async function fkart(){
    try {
        let fPage = await browserInstance.newPage();
        await fPage.goto(fkartLink);
        await waitAndClick(fPage, '._2KpZ6l._2doB4z');
        await fPage.type('input[type = "text"]', searchProduct, {delay : 50});
        await waitAndClick(fPage, 'button[type = "submit"]');
        await fPage.waitForTimeout(2000);
        
        const allhref = await fPage.$$eval(".s1Q9rs", el => el.map(x => x.getAttribute("href")));
        let buyLink = fkartLink + allhref[0];
        // console.log(buyLink);

        let allProducts = await fPage.$$('.CXW8mj');
        await allProducts[0].click({delay : 50});
        await fPage.waitForTimeout(3000);
        let allTabs = await browserInstance.pages();
        fPage = allTabs[allTabs.length - 1];
        // console.log(allTabs.length);
        await fPage.waitForTimeout(3000);
        await fPage.waitForSelector('span[class = "B_NuCI"]', {visible : true});
        let productNameElement = await fPage.$('span[class = "B_NuCI"]');
        let productName = await fPage.evaluate(function(elem){return elem.textContent}, productNameElement);
        productName = productName.trim();
        // console.log(productName);

        let priceElement = await fPage.$('._30jeq3._16Jk6d');
        price = await fPage.evaluate(function(elem){return elem.textContent}, priceElement);
        price = price.trim();
        // console.log(price);
        
        let ratingElement = await fPage.$$('._3LWZlK');
        rating = await fPage.evaluate(function(elem){return elem.textContent}, ratingElement[0]);
        rating = rating.trim() + " out of 5 stars";
        // console.log(rating);
        
        let reviewElement = await fPage.$$('._2_R_DZ');
        totalReviews = await fPage.evaluate(function(elem){return elem.textContent}, reviewElement[0]);
        totalReviews = totalReviews.trim();
        // console.log(totalReviews);
        
        let obj = {
            'website' : 'FlipKart',
            productName, 
            price, 
            rating, 
            totalReviews,
            buyLink
        }

        arr.push(obj);
        // console.table(arr);
        snapdeal();

    } catch (error) {
        console.log(error);
    }
    
}

//-----------Searching on snapdeal----------//
async function snapdeal(){
    try{
        let sPage = await browserInstance.newPage();
        await sPage.goto(snapdealLink);
        await sPage.type('.col-xs-20.searchformInput.keyword', searchProduct, {delay : 50});
        await waitAndClick(sPage, '.searchTextSpan');
        await sPage.waitForTimeout(2000);

        let allhref = await sPage.$$eval("a[pogid='669098706372']", el => el.map(x => x.getAttribute("href")));
        let buyLink = allhref[0];
        // console.log(buyLink);

        let allProducts = await sPage.$$('.picture-elem');
        await allProducts[0].click({delay : 50});
        await sPage.waitForTimeout(3000);
        let allTabs = await browserInstance.pages();
        sPage = allTabs[allTabs.length - 1];
        // console.log(allTabs.length);
        await sPage.waitForTimeout(3000);
        
        
        await sPage.waitForSelector('h1[itemprop="name"]', {visible : true});
        let productNameElement = await sPage.$('h1[itemprop="name"]');
        let productName = await sPage.evaluate(function(elem){return elem.textContent}, productNameElement);
        productName = productName.trim();
        // console.log(productName);
        
        let priceElement = await sPage.$('span[itemprop="price"]');
        price = await sPage.evaluate(function(elem){return elem.textContent}, priceElement);
        price = '₹' + price.trim();
        // console.log(price);
        
        let ratingElement = await sPage.$$('.avrg-rating');
        rating = await sPage.evaluate(function(elem){return elem.textContent}, ratingElement[0]);
        rating = rating.trim() + " out of 5 stars";
        // console.log(rating);
        
        let reviewElement = await sPage.$$('.numbr-review');
        totalReviews = await sPage.evaluate(function(elem){return elem.textContent}, reviewElement[0]);
        totalReviews = totalReviews.trim();
        // console.log(totalReviews);
        
        let obj = {
            'website' : 'snapdeal',
            productName, 
            price, 
            rating, 
            totalReviews,
            buyLink
        }

        arr.push(obj);
        console.table(arr);
        createFile();

        await browserInstance.close();

    } catch (error) {
        console.log(error);
    }
}

async function waitAndClick(page, selector){
    await page.waitForSelector(selector, {visible : true});
    await page.click(selector, {delay : 50});
}

function createFile(){
    const ws = xlsx.utils.json_to_sheet(arr);
    const wb = xlsx.utils.book_new(searchProduct);
    xlsx.utils.book_append_sheet(wb, ws, searchProduct);
    xlsx.writeFile(wb, searchProduct+".xlsx");
}