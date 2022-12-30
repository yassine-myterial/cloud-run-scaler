// Copyright 2020 Google LLC. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.

// [START cloudrun_pubsub_server_setup]
// [START run_pubsub_server_setup]
const express = require('express');
const app = express();
const {execSync} = require('child_process');

let {KEY_FILE_PATH} = process.env;

// This middleware is available in Express v4.16.0 onwards
app.use(express.json());
// [END run_pubsub_server_setup]
// [END cloudrun_pubsub_server_setup]

try{
  app.post('/', (req, res) => {
    if (!req.body) {
      const msg = 'no config received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }

    if (!Array.isArray(req.body) {
      const msg = 'invalid config format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }

    const configsArray = req.body;
    
    for(const config of configsArray){
      const cpuThrotting= config.cpuThrotting? '--cpu-throttling': '--no-cpu-throttling';
      let gcloudCmd =
      `gcloud auth activate-service-account myterial-pipeline-user@myterial-dev.iam.gserviceaccount.com ` +
      `--key-file="${KEY_FILE_PATH}" `;

      console.log('Starting scaling');
      execSync(gcloudCmd).toString(); 
      gcloudCmd =
          `gcloud run services update ${config.service} ` +
          `--concurrency=${config.scaling.concurrency} ` +
          `--min-instances=${config.scaling.from} ` +
          `--max-instances=${config.scaling.to} ` +
          `${cpuThrotting} ` +
          `--region=europe-west3  ` +
          `--project "${config.projectId}" `;
      execSync(gcloudCmd).toString(); 
      console.log('Scaling completed.');
      
    }
    res.status(204).send();    
  });
}catch(error){
  res.status(500).send();
  console.log(error);
}
module.exports = app;
