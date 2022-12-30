// Copyright 2020 Google LLC. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.

// [START cloudrun_pubsub_server_setup]
// [START run_pubsub_server_setup]
const express = require('express');
const app = express();
const {execSync} = require('child_process');

// This middleware is available in Express v4.16.0 onwards
app.use(express.json());
// [END run_pubsub_server_setup]
// [END cloudrun_pubsub_server_setup]

// [START cloudrun_pubsub_handler]
// [START run_pubsub_handler]
app.post('/', (req, res) => {
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  
  if (!req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  
  const pubSubMessage = req.body.message;
  const name = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
    : 'World';
  
  let gcloudCmd =
      `gcloud auth activate-service-account myterial-pipeline-user@myterial-dev.iam.gserviceaccount.com ` +
      `--key-file="${KEY_FILE_PATH}" `;
      
  console.log('Starting scaling');
  execSync(gcloudCmd).toString(); 
  gcloudCmd =
      `gcloud run services update myterial-middleware --no-cpu-throttling --region=europe-west3 --project "${PROJECT_ID} `;
  execSync(gcloudCmd).toString(); 
  console.log('Scaling completed.');
  console.log(`Hello ${name}!`);
  res.status(204).send();
});
// [END run_pubsub_handler]
// [END cloudrun_pubsub_handler]

module.exports = app;
