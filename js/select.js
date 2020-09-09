$(function(){
	var optionstring="";
	var data=[{'id':1,'name':'小强'},{'id':2,'name':'小花'},{'id':3,'name':'小明'},{'id':4,'name':'小红'},{'id':5,'name':'萝卜条'}];
	$.each(data,function(i,val){  //循环遍历后台传过来的json数据
	                        optionstring += "<li value=\"" + val.id + "\" >" + ''+val.name + "</li>";
	                    });
	                    $("#chooseroom").html(optionstring);
	

	 
	$('body').on('click', function() {
	    $('.select.is-open').removeClass('is-open');
	});
	
	
	
	
	
});