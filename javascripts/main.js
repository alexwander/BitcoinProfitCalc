/**
 * Created by alexandr on 31.03.2016.
 */

google.load("visualization", "1", {packages:["corechart"]});

// https://blockchain.info/ru/stats?format=json
var btc_stats = {}; //{"trade_volume_btc":20558.38042413,"electricity_consumption":4.247113588840637E8,"miners_revenue_usd":2449088.42178,"n_btc_mined":437500000000,"trade_volume_usd":1.1471700038114693E7,"difficulty":3.1295731745222874E9,"minutes_between_blocks":8.228571428571428,"days_destroyed":0.0,"n_tx":70705,"hash_rate":2.7225087107952803E7,"timestamp":1392914289855,"n_blocks_mined":175,"blocks_size":40505389,"total_fees_btc":1457429764,"miners_operating_margin":-2501.0,"total_btc_sent":48200321939415,"estimated_btc_sent":9418058124214,"totalbc":1237927500000000,"electricity_cost_usd":6.370670383260956E7,"n_blocks_total":286903,"nextretarget":288287,"estimated_transaction_volume_usd":5.25533313002132E7,"miners_revenue_btc":4389,"market_price_usd":558.00602};

// http://www.coinchoose.com/api.php?base=BTC
var coins_stats = []; //[{"0":"LTC","symbol":"LTC","1":"Litecoin","name":"Litecoin","2":"scrypt","algo":"scrypt","3":"517821","currentBlocks":"517821","4":"3206.90479195","difficulty":"3206.90479195","5":"50","reward":"50","6":"2.5","minBlockTime":"2.5","7":"101606082519","networkhashrate":"101606082519","price":"0.02532","exchange":"BTC-e","exchange_url":"https:\/\/btc-e.com","ratio":4941.8862061521,"adjustedratio":4817.3008396105,"avgProfit":"5034.156551355906","avgHash":"85536263767.5526"}];


var getDiffIncrice = function(diff_history)
{
    var diffInc_history	= [];
    for (var i=1;i<diff_history.length;i++)
    {
        var diffInc = (diff_history[i] - diff_history[i-1]) / diff_history[i-1];
        diffInc_history.push(diffInc);
    }
    return diffInc_history
};

var base_crypto = "BTC";

var stats = {};
var btc_market_price_usd = 550;
var timestamp = (new Date().getTime());


var get_crypto_stats = function(crypto){
    var st_res = {};
    $.each(coins_stats, function(index, entry) {
        // console.log(entry.symbol);
        if (entry.symbol == crypto)
        {
            st_res = {
                "difficulty": Number(entry.difficulty),
                "timestamp": timestamp,
                //"n_blocks_mined":175,
                "n_blocks_total": Number(entry.currentBlocks),
                "btc_price": entry.price,
                "market_price_usd": entry.price * btc_market_price_usd,
                "minutes_between_blocks_normal": Number(entry.minBlockTime),
                "block_reward": entry.reward,
                "diff_history": [1, 1, 1, 1],
                "blocks_between_recalc": 2016,
            };
            if (entry.networkhashrate > 0)
            {
                st_res.minutes_between_blocks = entry.difficulty / entry.networkhashrate * Math.pow(2, 32) / 60;
            }
            else
            {
                st_res.minutes_between_blocks = st_res.minutes_between_blocks_normal;
            }
            if (entry.symbol == 'LTC')
            {
                st_res.reward_halved_blocks = 840000;
                st_res.diff_history = [3300, 2820, 3508, 2674, 2690, 3207, 2871, 3322, 3145];
            }
            else if (entry.symbol == 'DOGE')
            {
                st_res.blocks_between_recalc = 4 * 60;
                st_res.reward_func = function(val)
                {
                    var block_n = val.stats.n_blocks_total;
                    if (block_n > 600000)
                        this.block_reward = 10000;
                    else{
                        var max_reward = 1000000 * Math.pow(0.5, Math.floor(block_n / 100000));
                        this.block_reward = 0.5 * max_reward;
                    }
                    return this.block_reward;
                };
            }
            // break;
        }
    });
    console.log(st_res);
    return st_res;
};



var params = {};
function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
};

var getDateStr = function(date){
    return padStr(date.getMonth() + 1) + '/' + padStr(date.getDate()) + '/' + date.getFullYear();
};
var update_saved_url = function(){
    if (params.input && !(Object.keys(params.input).length === 0))
    {
        var url = document.location.protocol +"//"+ document.location.hostname + document.location.pathname + '?' + $.param(params.input) + location.hash;
        console.log(url);
        $("#savedUrl input").val(url);
        $("#savedUrl a").attr('href', url);
    }
};


var calc = function()
{
    //update_curr_rate();

    var inputs = $('#calculator-form form :input');
    params = {input: {}};
    inputs.each(function() {
        var id = $(this).attr('id');
        var val = $(this).val();
        // console.log(id);
        if (id && id.indexOf("input") == 0) {
            id = id.replace("input", "");
            if (id == 'DifficultyIncrement' || id == 'PoolFee')
            {
                val /= 100;
            }
            else if (id == 'StartDate' || id == 'EndDate')
            {
                val = Date.parse(val);
                if (!isNaN(val)) {
                    val /= 1000;
                }
            }
            else if (id == 'Difficulty')
            {
                val = Number(val);
            }
            else if (id == 'Currency')
            {
                params.currency = val;
                if (val == "BASE_CURR"){
                    params.currency = base_crypto;
                }
            }
            params.input[id] = val;
        }
    });


