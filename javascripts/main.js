/**
 * Created by alexandr on 31.03.2016.
 */

google.load("visualization", "1", {packages:["corechart"]});

// https://blockchain.info/ru/stats?format=json
var btc_stats = {}; //{"trade_volume_btc":20558.38042413,"electricity_consumption":4.247113588840637E8,"miners_revenue_usd":2449088.42178,"n_btc_mined":437500000000,"trade_volume_usd":1.1471700038114693E7,"difficulty":3.1295731745222874E9,"minutes_between_blocks":8.228571428571428,"days_destroyed":0.0,"n_tx":70705,"hash_rate":2.7225087107952803E7,"timestamp":1392914289855,"n_blocks_mined":175,"blocks_size":40505389,"total_fees_btc":1457429764,"miners_operating_margin":-2501.0,"total_btc_sent":48200321939415,"estimated_btc_sent":9418058124214,"totalbc":1237927500000000,"electricity_cost_usd":6.370670383260956E7,"n_blocks_total":286903,"nextretarget":288287,"estimated_transaction_volume_usd":5.25533313002132E7,"miners_revenue_btc":4389,"market_price_usd":558.00602};

// http://www.coinchoose.com/api.php?base=BTC
var coins_stats = []; //[{"0":"LTC","symbol":"LTC","1":"Litecoin","name":"Litecoin","2":"scrypt","algo":"scrypt","3":"517821","currentBlocks":"517821","4":"3206.90479195","difficulty":"3206.90479195","5":"50","reward":"50","6":"2.5","minBlockTime":"2.5","7":"101606082519","networkhashrate":"101606082519","price":"0.02532","exchange":"BTC-e","exchange_url":"https:\/\/btc-e.com","ratio":4941.8862061521,"adjustedratio":4817.3008396105,"avgProfit":"5034.156551355906","avgHash":"85536263767.5526"}];
