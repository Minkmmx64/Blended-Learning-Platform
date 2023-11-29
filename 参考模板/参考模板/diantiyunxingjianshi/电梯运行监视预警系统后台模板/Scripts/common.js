$(function(){
	//左右部分区域宽高
	var mainH=$(window).height()-97;
	var rightW=$(window).width()-207;
	$(".left").height(mainH);
	$(".right").height(mainH);
	$(".right").width(Math.max(rightW,817));
	//顶部公告切换效果
	var n=0,nmax=$(".notice_ctn li").length-1;
	$(".notice_arrowl").click(function(){
		if(n==0)n=1;
		n-=1;
		noticeauto(n);
	})
	$(".notice_arrowr").click(function(){
		if(n==nmax)n=nmax-1;
		n+=1;
		noticeauto(n);
	})
	$(".notice_close").click(function(){
		$(".notice").hide();
	})
	$(".msg_a").click(function(){
		$(".notice").show();
	})
	//表格隔行换色
	$(".table_gray tr:even").css("background","url(./images/table_gray_tr_even_bg.gif) repeat-x");
	$(".intable_gray tr:even").css("background","url(./images/table_gray_tr_even_bg.gif) repeat-x");
	//详细页tab切换
	$(".detail_top li").click(function(){
		$(this).addClass("currentd").siblings().removeClass("currentd");
		$(".detail_ctn .detail_ctne").eq($(".detail_top li").index(this)).show().siblings().hide();
	})
	//点击表格选中行
	$(".floor_table tr").click(function(){
		$(this).addClass("hover").siblings().removeClass("hover");
	})
    //表格单条信息操作效果
	$(".table_gray tr").mouseover(function(){
		$(this).addClass("cur");
		$(this).find(".list_btn").show();
	})
	$(".table_gray tr").mouseout(function(){
		$(this).removeClass("cur");
		$(this).find(".list_btn").hide();
	})
	$(".list_btn").click(function(){
		$(this).parent(".relative").prepend($(".table_btn"));
		$(this).parent(".relative").find(".table_btn").show();
		$(".table_btn").mouseleave(function(){
			$(this).hide();
		})
	})
})
function noticeauto(i){
	var nt_mt=-(i*26);
	$(".notice_ctn").animate({"marginTop":nt_mt},"slow");
}
$(window).resize(function(){
	//左右部分区域宽高
	var mainH=$(window).height()-97;
	var rightW=$(window).width()-207;
	$(".left").height(mainH);
	$(".right").height(mainH);
	$(".right").width(Math.max(rightW,817));
})
