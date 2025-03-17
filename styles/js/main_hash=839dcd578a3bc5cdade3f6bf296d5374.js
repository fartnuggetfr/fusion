var baseURL = window.location.protocol + "//" + window.location.host;
var targetObj = {};
var targetProxy = new Proxy(targetObj, {
  set: function (target, key, value) {
	  //Изменение баланса
      if(key == 'money'){
		$('.balance').text(value);
	  }
	  if(key == 'username'){
		$('.username').text(value);
		$('.username').val(value);
	  }
      target[key] = value;
      return true;
  }
});

/*CUSTOM CODE*/
var text_ip = $('.main-content-lider-content-left-button-text').text();
function copy_ip(el) {
	
	if($("*").is(".header-top-border-right-play-text")){
		$('.header-top-border-right-play-text').css('color', '#ffb200');
		$('.header-top-border-right-play-ico').addClass('active');
		setTimeout( function(){
			$('.header-top-border-right-play-ico').removeClass('active');
			$('.header-top-border-right-play-text').css('color', '');
		}, 3000);
	}
	
	var $tmp = $("<textarea>");
	$("body").append($tmp);
	$tmp.val($("."+el).text()).select();
	document.execCommand("copy");
	$tmp.remove();
	$(".copy-ip").css("background-image", "url(img/copy-ok.png)");
	Lobibox.notify('info', {
	   delay: 5000,
	   title: 'Успешно скопировано',
	   msg: $("."+el).text()+' - скопировано'
	});
}  

$(".linka").click(function (e) {
	e.preventDefault();
	if($(this).hasClass('mobile')){
		$('.mobile-menu').fadeOut();
		$('.menu').removeClass('opened');
		$('body').css('overflow', '');
	}
	if($("."+$(this).attr("scroll_to")).length < 1) {
		window.location.href = $("#domen").text()+"/"+$(this).attr("page");
		return false;
	}
		// существует
	
	$('html, body').animate({
        scrollTop: $("."+$(this).attr("scroll_to")).offset().top - 150
    }, 1000);
    return false;
});


function str_rand(count) {
	var result = '';
	var words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_';
	var max_position = words.length - 1;
		for( i = 0; i < count; ++i ) {
			position = Math.floor ( Math.random() * max_position );
			result = result + words.substring(position, position + 1);
		}
	return result;
}


/*Открытие языкового меню*/
$('.language-object').on('click', function(){
    $(this).find('.language-list-ul').toggleClass('hide');
});
//Proxy прослушивание переменных

//Выход из аккаунта
$('.exit_account').click(function () {
	$.post(baseURL + "/modules/auth/logout.php", { 
		action: 'logout',
 	})
	.done(function(data) {

		var RQData = JSON.parse(data);
		var data_content = RQData.lobibox.type;
		if(data_content.length > 1){
			Toast.fire({ icon: 'error', title: RQData.lobibox.title});
		}
		
		if(RQData.action == "successful"){
			Toast.fire({ icon: 'success', title: RQData.swal_fire.msg});
			setTimeout(function(){location.reload();}, 2000);
		}
		
	});
});

//Получение статистики
function getStats(username){
	$.post(baseURL + "/modules/stats/stats.php", { 
		username: username,
 	})
	.done(function(data) {

		var RQData = JSON.parse(data);
		var data_content = RQData.lobibox.type;
		if(data_content.length > 1){
			Toast.fire({ icon: 'error', title: RQData.lobibox.title});
		}
		
		if(RQData.action == "successful"){
			//console.log(RQData);
			
			const DataRet = RQData.data.data.ProfileStats;


			$('.season-player').text(DataRet.Username);
			$('.season_lvl').text('LEVEL '+DataRet.Level);
			$('.season-name').text('SEASON '+DataRet.Season);

			if($('#language').text() != 'en'){
				$('.season_lvl').text('NIVEAU '+DataRet.Level);
				$('.season-name').text('SAISON '+DataRet.Season);
			}
			

			$('.stats_wins').find('.top-season-info').text(DataRet.Wins);
			$('.win_rate').find('.top-season-info').text(DataRet.WinsRate+"%");
			$('.matches').find('.top-season-info').text(DataRet.Matches);

			$('.kd_object').find('.top-season-info').text(DataRet.KD);
			$('.kills').find('.top-season-info').text(DataRet.Kills);

			$('.time_played').find('.top-season-info').text(DataRet.Timeplayed);
			$('.avg').find('.top-season-info').text(DataRet.AvgMatchtime);

			$('.absolute-right-user-stats').attr('src', DataRet.FullImage);

			$('.absolute-custom-form.stats').fadeIn();
		}
		
	});
}

var search_user = null;
/*SearchUser */
$('.search_user').bind('input', function(){
	search_user = $(this).val();
	//Если email некорректный
	if($(this).val().length > 24){
		$('.list-search-objects').html('<div class="not-found-user">User not found!</div>');
		if($('#language').text() != 'en'){
			$('.list-search-objects').html('<div class="not-found-user">Utilisateur non trouvé!</div>');
		}
		return;
	}	

	$(this).addClass('disable');

	$.post(baseURL + "/modules/gifts/api.php", { 
		user: search_user, //login
	})
	.done(function(data) {

		$('.search_user').removeClass('disable');

		var RQData = JSON.parse(data);
		var data_content = RQData.lobibox.type;
		
		if(RQData.action != "successful"){
			if(data_content.length > 1){
				$('.list-search-objects').html('<div class="not-found-user">User not found!</div>');
				if($('#language').text() != 'en'){
					$('.list-search-objects').html('<div class="not-found-user">Utilisateur non trouvé!</div>');
				}
				$('.button-send-gift').addClass('disabled'); 
				return;
			}
		}

		if(data_content.length > 1){
			$('.list-search-objects').html('<div class="not-found-user">User not found!</div>');
			if($('#language').text() != 'en'){
				$('.list-search-objects').html('<div class="not-found-user">Utilisateur non trouvé!</div>');
			}
			$('.button-send-gift').addClass('disabled'); 
		}

		if(RQData.action == "successful"){
			$('.list-search-objects').html("");
			
			var users = RQData.data.data.AllProfiles;
			$.each(users, function (index, this_user) {
				var tpl = '<div bAlreadyOwn="'+this_user['bAlreadyOwn']+'" data="'+this_user['Playerid']+'" class="object-user-select">'+
								'<div class="left-object-user">'+
									'<img src="'+this_user['ImageIcon']+'" alt="" class="avatar-user-object">'+
								'</div>'+
								'<div class="right-object-user">'+
									'<p class="user-name">'+this_user['Username']+'</p>'+
									'<p class="message-text-info"></p>'+
								'</div>'+
							'</div>';
				$('.list-search-objects').append(tpl);
			});
		}
		
	});
});

$('.profile-right-content').click(function () {
	$('.profile-absolute-menu').toggleClass('active');
	$('.image-right-content-profile').toggleClass('active');
});


console.log("Модуль сайта загружен!");