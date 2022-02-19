var lastNum = 1;
var sum = 0;
var regexp = /\B(?=(\d{3})+(?!\d))/g;
var cashList=[];
$.ajax({
            url: '/Cash/GetChargeList',
            type: 'GET',
            data: { Page: 1, StartDate: '1990.01.01', EndDate: '2100.12.31'},
            dataType: 'html',
            async: false,
            success: function (data) {
				var pageNum = $(data).find(".pagination__last")[0].getAttribute("onClick");
                if(pageNum != null){
                    lastNum = pageNum.replace(/[^0-9]/g,"");
                }
            },
            error: function (xhr, status, error) {
                ajaxErrorHandler(xhr, status, error);
                return;
            }
        });
for(var i=1;i<=lastNum;i++){
    $.ajax({
            url: '/Cash/GetChargeList',
            type: 'GET',
            data: { Page: i, StartDate: '1990.01.01', EndDate: '2100.12.31'},
            dataType: 'html',
            async: false,
            success: function (data) {
				$(data).find("td.list__price").each(function(){ 
					var $cash = $(this)
					cashList.push($cash.text().replace(/[^0-9]/g,""))
				});
            },
            error: function (xhr, status, error) {
                ajaxErrorHandler(xhr, status, error);
                return;
            }
        });
}

cashList.forEach(function(cash){
    sum += Number(cash);
});

sum = sum.toString().replace(regexp, ',');

alert("현재까지 "+sum+"원 사용하셨습니다");