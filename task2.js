const cheerio = require("cheerio");
const axios = require("axios");
const json2csv = require("json2csv").Parser;
const fs = require("fs");


const config = {
    header: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
        "authority": "scrapethissite.com",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
    }, br: true
};

const TeamName_list = ["Boston Bruins","Buffalo Sabres","Edmonton Oilers"];
const Domain_Url = "https://scrapethissite.com/pages/forms/?q=";


(async () => {
    
    let list = [];
    const keys = [
    "Team-Name",
    "Year",
    "Wins",
    "Losses",
    "OT Losses",
    "Win",
    "Goals For",
    "Goals Against (GA)",
    "+/-",
     ];
     
     let i = 0;
     while(i < TeamName_list.length)
     {
        Url = Domain_Url+TeamName_list[i]
        const { data } = await axios.get(Url, config);
        let $ = cheerio.load(data);
        const row  = "#hockey > div > table > tbody > tr.team"

        $(row).each((parentIdx, parentElem) => {
            let keyIdx = 0;
            const details = {};

            $(parentElem).children().each((childIdx, childElem) => {

                team = $(childElem).text().trim();
                
                details[keys[keyIdx]] = team;
                keyIdx++;
                
            })

            list.push(details);

        })
        i++;
     }

    console.log(list);

    const j2cp = new json2csv();
    const csv = j2cp.parse(list);

    fs.writeFileSync("./Team Info.csv", csv, "utf-8");
   

})();
