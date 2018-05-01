'use strict';

// api keys
const config = require('../config');
const geoToken = config.geoToken;
const timeToken = config.timeToken;

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

module.exports = (config) => {
    const log = config.log();

    service.get('/service/:location', (req, res) => {

        if(req.get('X-ESCOBOT-SERVICE-TOKEN') !== config.serviceAccessToken) {
            return res.sendStatus(403);
        }

        request.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ req.params.location +'&key=' + geoToken, (err, response) => {
            if(err) {
                log.error(err);
                return res.sendStatus(500);
            }

            const location = response.body.results[0].geometry.location;
            const timeStamp = +moment().format('X');

            request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' +location.lat + ',' + location.lng + '&timestamp='+ timeStamp +'&key=' + timeToken, (err, response) => {
                if(err) {
                    log.error(err);
                    return res.sendStatus(500);
                }

                const result = response.body;
                const timeString = moment.unix(timeStamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMM Do YYYY, h:mm:ss a');

                res.json({result: timeString});
            });
        });
    });
    return service;
};
