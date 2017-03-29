// Подключаем библиотеку твиттера и голоса
var Twitter = require('twitter'),golos=require('golos');

// Настройки environment переменных для ключей твиттера. Вы должны задать ключи отдельно. 
// google = "set environment variable"
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Сокращение для числа 1000, просто для удобства
var k=1000,

// Настройки аккаунта и интервалов работы
// Логин голосующего
u='vik',          

// Так же учесть голоса за последние N минут. 60*24=1440 это сутки.
offset   = 1440,  

// Интервал слежения в миллисекундах равен (180) секунд       
interval = 180*k,    

// Интервал публикации постов в твиттер в миллисекундах
// Не ставьте слишком короткий интервал - это поможет избежать ошибок и придаст естественный вид твитам. 
// Больше 'естественности' можно придать указав рэндомный интервал
twitinterval = 1400,	 

// Глобальные переменные
blocktime,first=true,d=[],t,c=0,past; 

// Получаем время последнего блока из блокчейн голоса
golos.api.getDynamicGlobalProperties(function(err, result) {
blocktime = result.time;

// Переводим время в unix формат
var starttime = Date.parse(blocktime)/k; 

function checkVotes(){
// Запрос истории голосов для аккаунта из переменной u
golos.api.getAccountVotes(u, function(err, res) {


// Если первый запуск
if(first){
  console.log('Приложение запущено. Время последнего блока: '+blocktime+', так же собираем голоса сделанные за '+offset+' минут ранее. Частота публикации полученных голосов в твиттер = '+twitinterval+'ms, интервал проверки новых голосов = '+interval+'ms');
  
// Настраиваем временной отступ так, что бы в переменной t было время старта за вычетом указанного отступа
  t = starttime - offset * 60; 
  
// Больше не запускаем условие выше в интервале
  first=false;
 
// А в последущие запуски в рамках интервала выполним 
  }else {
  //offset = 0; // Сброс временного отступа, нет необходимости исследовать уже обработанные голоса
  // Обновим переменную t так, что бы с каждым циклом в интервале ее значение было увеличено на временной отступ.
  past = interval / k * c, 
  t = starttime + past,d=[],c++;
  }
  
  
  
// Создадим цикл рамках которого в массив d мы запишем ссылки на полученные посты за которые проголосовал пользователь u
// Так же добавим время в unix формате для каждого голоса
for (var x = 0; x < res.length; x++){
  var time = Date.parse(res[x].time)/k;
  
  if (time > t && res[x].percent/100 > 24){
  d.push({
  link: res[x].authorperm,
  time: time
  })
  }
}
 
// Создадим интервал для размещения твитов, первыми условиями которого будет проверять не пустой ли массив d  
  var i = 0;
  if(d.length > i){
  
            var twitVote = setInterval(function() {
				
				// Если мы достигли последнее значение в списке голосов - останови интервал.
				if (i === d.length) {
					clearInterval(twitVote); 
                } 
				// Если время поста младше содержимого переменной t размещаем твит и сообщаем об этом в консоли
				else if (d[i].time > t){
				var tweet =u+' проголосовал за пост в #блокчейн #голос https://golos.io/x/@'+d[i].link;
				console.log('twitter: '+tweet);
				client.post('statuses/update', {status: tweet},  function(error, tweet, response) {
				
				// В случае ошибок так же сообщим в консоль
                      if(error) throw JSON.stringify(error);
                      });
				}
				i++;
				 
            }, twitinterval);
			}
});
}

checkVotes();setInterval(function() {checkVotes();},interval);

});
