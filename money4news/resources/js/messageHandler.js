; ((window, document, $, undefined) => {

    "use strict";

    var NotificationManager = ((NotificationManager) => {
        NotificationManager.MessageHandler = (() => {

            /**** PRIVATE ****/

            var MsgHandler = {};
            var eventSource;

            /**** PUBLIC ****/
            MsgHandler.init = () => {
                /**** EventSource ****/
                if (window.EventSource !== undefined) {
                    this.eventSource = new EventSource('/api/notifications/subscribe_notif');

                    this.eventSource.onmessage = (evt) => {
                        var messageEvent = new ServerMessageEvent(evt);
                        messageEvent.notify();
                    }

                    this.eventSource.onerror = (e) => {
                        console.log(e);
                        e.target.close();
                    };
                }
            };

            /**** ServerMessageEvent CONSTRUCTOR ****/
            function ServerMessageEvent(event) {

                this.notify = () => {
                    var notificationEvent = new CustomEvent('BidUpdateNotifications', {
                        'detail': event.data
                    });
                    document.dispatchEvent(notificationEvent);
                };

                return this;
            }

            return MsgHandler;
        })();
        return NotificationManager;
    })(window.NotificationManager ||  {});

    window.NotificationManager = NotificationManager;

})(window, document, jQuery);
