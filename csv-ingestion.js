
const fs = require('fs');
const readline = require('readline');

const constants = require('./constants');

async function processCSV(filePath) {
    try {
        await ingestCsvRecords(filePath);
    } catch (e) {
        console.log('e', e);
    }
}

async function ingestCsvRecords(filePath) {
    const currentTime = Date.now().toString(); // Unix time in milliseconds

    var records = [];
    var counter = 0;

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });

    const promises = [];

    for await (const dataRow of rl) {
        var row = dataRow.toString().split(',');
        // console.log(row)
        const dimensions = [
            { 'Name': 'TransporterID', 'Value': row[0].toString() },
            { 'Name': 'ServiceArea', 'Value': row[1].toString() },
            { 'Name': 'Email', 'Value': row[2].toString() },
            { 'Name': 'APIName', 'Value': row[3].toString() }
        ];
        const recordTime = currentTime - counter * 50;

        if (row[3].toString() === 'GetOffersForProvider') {
            var record = {
                'Dimensions': dimensions,
                'MeasureName': 'number_offers_returned',
                'MeasureValue': (Math.floor(Math.random() * 21).toString()),
                'MeasureValueType': 'BIGINT',
                'Time': recordTime.toString()
            };
        } else if (row[3].toString() === 'AcceptOffer') {
            var record = {
                'Dimensions': dimensions,
                'MeasureName': 'demand_id',
                'MeasureValue': makeid(20),
                'MeasureValueType': 'VARCHAR',
                'Time': recordTime.toString()
            };
        } else if (row[3].toString() === 'RejectOffer') {
            var record = {
                'Dimensions': dimensions,
                'MeasureName': 'demand_id',
                'MeasureValue': makeid(20),
                'MeasureValueType': 'VARCHAR',
                'Time': recordTime.toString()
            };
        }


        records.push(record);
        counter++;

        if (records.length === 100) {
            promises.push(submitBatch(records, counter));
            records = [];
        }
    }

    if (records.length !== 0) {
        promises.push(submitBatch(records, counter));
    }

    await Promise.all(promises);

    console.log(`Ingested ${counter} records`);
}

function submitBatch(records, counter) {
    const params = {
        DatabaseName: constants.DATABASE_NAME,
        TableName: constants.TABLE_NAME,
        Records: records
    };

    var promise = writeClient.writeRecords(params).promise();

    return promise.then(
        (data) => {
            console.log(`Processed ${counter} records.`);
        },
        (err) => {
            console.log("Error writing records:", err);
        }
    );
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// console.log(makeid(10));


module.exports = { processCSV };