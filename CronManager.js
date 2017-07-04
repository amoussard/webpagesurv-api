var cron = require('node-cron');
var rp = require('request-promise');
var stringManipulation = require('string');

var Watch = require('./models/watch');
var socketManager = require('./SocketManager');

class cronManager {
    constructor() {
        this.cronJobsList = {};

        this.init();
    }

    init() {
        Watch.find({}, (err, results) => {
            if (err) {
                console.log('erreur fetching');
            }
            results.forEach(this.addCronJob.bind(this));
        });
    }

    add(cronJob) {
        this.addCronJob(cronJob);
    }
    
    delete(cronJob) {
        this.cronJobsList[cronJob._id].destroy();
    }

    addCronJob(cronJob) {
        this.cronJobsList[cronJob._id] = cron.schedule(cronJob.cron, function() {
            console.log('search "' + cronJob.text + '" on "' + cronJob.url + '"');

            var changed = cronJob.changed;

            rp(cronJob.url)
                .then(function (htmlString) {
                    if (stringManipulation(htmlString).stripTags().collapseWhitespace().contains(cronJob.text)) {
                        cronJob.changed = false;
                        if (cronJob.changed !== changed) {
                            cronJob.save();
                            socketManager.broadcast('watch_unchanged', cronJob._id.toString());
                        }
                    } else {
                        cronJob.changed = true;
                        if (cronJob.changed !== changed) {
                            cronJob.save();
                            socketManager.broadcast('watch_changed', cronJob._id.toString());
                        }
                    }
                })
                .catch(function (err) {
                    console.log('crawl error', err);
                });
        });
    }
}

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
cronManager.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
cronManager.getInstance = function(){
    if(this.instance === null){
        this.instance = new cronManager();
    }
    return this.instance;
};

module.exports = cronManager.getInstance();