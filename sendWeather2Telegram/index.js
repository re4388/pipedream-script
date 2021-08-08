  const getJSON = require("async-get-json")
  const moment = require('moment')
  const APIKEY = process.env.OPEN_WEATHER_API;
  const lat = `25.033`;
  const lon = `121.517`;
  const Url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely&units=metric&&appid=${APIKEY}&lang=zh_tw`
  const toDayToNextSevenDay = await getJSON(Url)

  console.log(toDayToNextSevenDay)

  const todayDesc = toDayToNextSevenDay.daily[0].weather[0].description
  const TodayDayTmp = toDayToNextSevenDay.daily[0].temp.day

  const tmrDesc = toDayToNextSevenDay.daily[1].weather[0].description
  const tmrDayTmp = toDayToNextSevenDay.daily[1].temp.day

  const afterTmrDesc = toDayToNextSevenDay.daily[2].weather[0].description
  const afterTmrDayTmp = toDayToNextSevenDay.daily[2].temp.day
  
  // diff b/n today and yesterday temp will be set to 7:00

  const todayObject = toDayToNextSevenDay.daily[0]
  const dayTemp = todayObject.temp.day

  const todayDtAt12PM = toDayToNextSevenDay.daily[0].dt
  const offsetto7PM = (12-7)*60*60
  const todayDtAt7Pm = todayDtAt12PM - offsetto7PM
  // const YesterdayDt = todayDt - offsetForYesterdayInSec

  const UrlForTodayAt7PM = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${todayDtAt7Pm}&appid=${APIKEY}&lang=zh_tw&units=metric
  `
  const TodayAt7PM = await getJSON(UrlForTodayAt7PM)
  const TodayAt7PMTemp = TodayAt7PM.current.temp
  // console.log(TodayAt7PM)
  const TodayAt7PMDesc = TodayAt7PM.current.weather[0].description

  const oneDayOffset = 24 * 60 * 60
  const yesterdayDtAt7Pm = todayDtAt7Pm - oneDayOffset
  const UrlForYesterdayAt7PM = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${yesterdayDtAt7Pm}&appid=${APIKEY}&lang=zh_tw&units=metric
  `


  const yesterdayAt7PM = await getJSON(UrlForYesterdayAt7PM)
  // console.log(yesterdayAt7PM)
  const yesterdayAt7PMTemp = yesterdayAt7PM.current.temp

  let reportHotterOrCooler = ''


  if(TodayAt7PMTemp > yesterdayAt7PMTemp){
  reportHotterOrCooler+= `今天比昨天熱${(TodayAt7PMTemp - yesterdayAt7PMTemp).toPrecision(1)}度`
  } else {
  reportHotterOrCooler+= `今天比昨天冷${(yesterdayAt7PMTemp - TodayAt7PMTemp).toPrecision(1)}度`
  }

  let telegramOutput = '';
  telegramOutput += 
    `天氣變化：早上七點時，${reportHotterOrCooler}
預測：今天天氣均溫${TodayDayTmp}，${todayDesc};
             明天天氣均溫${tmrDayTmp}，${tmrDesc}; 
             後天天氣均溫為${afterTmrDayTmp}, ，${afterTmrDesc}`

  return telegramOutput
