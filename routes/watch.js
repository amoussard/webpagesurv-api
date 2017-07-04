var express = require('express');
var router = express.Router();

var Watch = require('../models/watch');

var cronManager = require('./../CronManager');

router.get('/', function(req, res, next) {
  Watch.find({}, (err, watchs) => {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      res.status(200).json({
          message: 'Success',
          obj: watchs
      });
  });
});

router.post('/', function(req, res, next) {
    const watch = new Watch({
        url: req.body.url,
        cron: req.body.cron,
        text: req.body.text,
        changed: false
    });
    watch.save((err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'Saved watch',
            obj: result
        });
        cronManager.add(result);
    });
});

router.delete('/:id', function (req, res, next) {
    Watch.findById(req.params.id, function (err, watch) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!watch) {
            return res.status(500).json({
                title: 'No watch found',
                error: {
                    message: 'watch not found'
                }
            });
        }
        
        cronManager.delete(watch);
        
        watch.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted watch',
                obj: result
            });
        });
    })
});

module.exports = router;
