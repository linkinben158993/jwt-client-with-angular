import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { User } from 'src/app/models/user';
import { ChatComponent } from '../../components/chat/chat/chat.component';

export class WebSocketAPI {
    private payload;
    webSocketEndPoint = 'http://localhost:4201/ws';
    topic = '/topic/public/';
    stompClient: any;
    chatComponent: ChatComponent;
    publicRoomId: string;
    constructor(chatComponent: ChatComponent) {
        this.chatComponent = chatComponent;
    }

    connect(payload): void {
        console.log('Initializing WebSocket Connection');
        this.payload = payload;
        const ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient.connect(
            payload
            , (frame) => {
                console.log('Frame:', frame);
                this.publicRoomId = frame.headers.uniqueRoomId;
                // On connection subscribe to /topic/public channel
                this.stompClient.subscribe(this.topic + this.publicRoomId, (sdkEvent) => {
                    this.onMessageReceived(sdkEvent);
                });
                // Send connecting signal to /topic/public channel
                const enterUser = {
                    sender: payload.username,
                    content: payload.username + ' has entered the chat!',
                    messageType: 'JOIN',
                };
                this.stompClient.send('/app/join/' + this.publicRoomId, {}, JSON.stringify(enterUser));
                this.requestAllMessages(new User('', payload.username, '', ''));
                this.stompClient.reconnect_delay = 2000;
            }, this.errorCallBack);
    }

    disconnect(): void {
        if (this.stompClient !== null) {
            this.stompClient.disconnect((): void => { }, { uniqueRoomId: this.publicRoomId });
        } else {
            console.log('Disconnected');
        }
    }

    errorCallBack(error): void {
        console.log('errorCallBack -> ' + error);
        setTimeout(() => {
            this.connect(this.payload);
        }, 2000);
    }

    sendGreetings(message): void {
        console.log('Sending greeting:', message);
        this.stompClient.send('/app/join', {}, JSON.stringify(message));
    }

    sendMessage(message): void {
        console.log('Sending message:', message);
        this.stompClient.send('/app/public/message/' + this.publicRoomId, {}, JSON.stringify(message));
    }

    requestAllMessages(user: User): void {
        const message = {
            sender: user.username,
            messageType: 'REQUEST_DATA'
        };
        this.stompClient.send('/app/public/messages/' + this.publicRoomId, {}, JSON.stringify(message));
    }

    checkClearMessage(user: User): void {
        const message = {
            sender: user.username,
            messageType: 'REQUEST_DATA'
        };
        this.stompClient.send(`/app/public/messages/${this.publicRoomId}/clean`, {}, JSON.stringify(message));
    }

    onMessageReceived(message): void {
        console.log('Received message:', message);
        this.chatComponent.handleMessage(message.body);
    }
}
