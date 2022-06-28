import { faker } from '@faker-js/faker';
import { createObjectCsvWriter } from 'csv-writer'

const apiName = ['AcceptOffer', 'RejectOffer', 'GetOffersForProvider']

const csvWriter = createObjectCsvWriter({
    path: 'out.csv',
    header: [
        { id: 'TransporterID', title: 'TransporterID' },
        { id: 'ServiceArea', title: 'ServiceArea' },
        { id: 'Email', title: 'Email' },
        { id: 'APIName', title: 'APIName' },
        { id: 'Time', title: 'Time' }
    ]
});

let datum = []
for (let i = 0; i < 1000; i++) {

    let data = {
        TransporterID: faker.database.mongodbObjectId(),
        ServiceArea: Math.floor(Math.random() * 100) + 1,
        Email: faker.internet.email(),
        APIName: apiName[Math.floor(Math.random() * apiName.length)],
        Time: faker.date.between('2021-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    }
    datum.push(data)
}

csvWriter
    .writeRecords(datum)
    .then(() => console.log('The CSV file was written successfully'));