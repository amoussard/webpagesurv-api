class SocketManager {
    constructor() {
        this.sockets = [];
    }

    add(socket) {
        console.log('add socket');
        this.sockets.push(socket);
    }

    broadcast(event, data) {
        this.sockets.forEach(socket => {
            socket.emit(event, data);
        });
    }
}

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
SocketManager.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
SocketManager.getInstance = function(){
    if(this.instance === null){
        this.instance = new SocketManager();
    }
    return this.instance;
};

module.exports = SocketManager.getInstance();