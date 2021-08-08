const axios = require('axios');
// get the Notion token from Notion App or https://www.notion.so/my-integrations
const NOTION_TOKEN_FOR_TELEGRAM = `${process.env.NOTION_TOKEN_FOR_TELEGRAM}`;
// get Notion db id by checking the Notion App
const YT_Vid_From_Telegram_DB_ID = `${process.env.FOR_TELEGRAM_DB_ID}`;


// 1. get the url from telegram
let url = steps.trigger.event.message.text
console.log('url: ', url)

// 2. use the url to get the page responce
const response = await axios.get(url)


// 3. extract title 
const html = response.data
let begin = html.indexOf('<title>') + '<title>'.length
let end = html.indexOf('</title>')
let title = html.substring(begin, end)
console.log('title: ', title)


// 4. begin to call Notion API
//// 4.1. prep the data
var data = JSON.stringify({
  "parent": {
    "type": "database_id",
    "database_id": YT_Vid_From_Telegram_DB_ID
  },
  "properties": {
    "Name": {
      "type": "title",
      "title": [
        {
          "type": "text",
          "text": {
            "content": title
          }
        }
      ]
    },
    "Url": {
      "type": "url",
      "url": url
    },
    "Date": {
      "type": "date",
      "date": {
        "start": "2021-05-22"
      }
    }
  }
});

//// 4.2. prep the config object
var config = {
  method: 'post',
  url: 'https://api.notion.com/v1/pages',
  headers: { 
    'Notion-Version': '2021-05-13', 
    'Authorization': `Bearer ${NOTION_TOKEN_FOR_TELEGRAM}`, 
    'Content-Type': 'application/json'
  },
  data : data
};

//// 4.3. send POST request
await axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log('ERROR HAPPEN')
  console.log(error);
});
