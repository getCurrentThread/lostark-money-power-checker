fetch('/Cash/GetChargeList?Page=1&StartDate=1990.01.01&EndDate=2100.12.31')
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const pageNum = doc.getElementsByClassName("pagination__last")[0].getAttribute("onClick");
        let lastNum = 1;
        if(pageNum != null){
            lastNum = pageNum.replace(/[^0-9]/g,"");
        }
        return lastNum;
    })
    .then(lastNum => {
        const promises = [];
        for(var i = 1; i <= lastNum; i++){
            promises.push(fetch(`/Cash/GetChargeList?Page=${i}&StartDate=1990.01.01&EndDate=2100.12.31`)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, "text/html");
                    const list = doc.getElementsByClassName("list__price");
                    const prices = [];
                    for(var j = 0; j < list.length; j++){
                        var price = list[j].innerText;
                        if(price != null){
                            prices.push(Number(price.replace(/[^0-9]/g,"")));
                        }
                    }
                    return prices.reduce((a,b) => a + b, 0);
                })
            );
        }
        return Promise.all(promises)
            .then(prices => prices.reduce((a,b) => a + b, 0))
            .then(total => {
                console.log(total);
                alert(`현재까지 ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 사용하셨습니다`);
                return total;
            });
    })
    .catch(err => {
        console.log(err);
    });