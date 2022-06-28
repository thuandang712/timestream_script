# timestream_script
Script to generate random data set and ingest into Amazon TimeStream

## How to use

 1. Install Node.js if not already installed.
    ```
    https://nodejs.org/en/
    ```
 1. Install necessary node dependencies. 
    ```shell
    npm install
    ```
 1. Run the data generator. This will create the file 'out.csv'
    ```shell
    node generateData.mjs
    ```
 1. Delete the first line in out.csv file

 1. Ingest sample data into Amazon TimeStream by adding --csvFilePath flag
    ```shell
    node main.js --csvFilePath=./out.csv
    ``` 
