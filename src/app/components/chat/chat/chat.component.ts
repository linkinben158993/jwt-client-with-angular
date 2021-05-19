import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/data/data.service';
import { v4 as UUID } from 'uuid';
import { WebSocketAPI } from '../../../services/messageService/web-socket.service';
import { Tile } from '../dialog/dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('message') message: ElementRef;

  protected webSocketAPI: WebSocketAPI;
  dialogs: Array<Tile[]>;

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Online Users', cols: 1, rows: 1, classname: 'online-users' },
          { title: 'Chat Content', cols: 2, rows: 1, classname: 'chat-content' },
        ];
      }

      return [
        { title: 'Online Users', cols: 1, rows: 2, classname: 'online-users' },
        { title: 'Chat Content', cols: 2, rows: 1, classname: 'chat-content' },
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthServiceService,
    private router: Router,
    private dataService: DataService) {
    this.dialogs = new Array<Tile[]>();
    // Subscribe to capture navigating event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Capture redirect event:', event.url);
      }
    });
  }
  ngOnDestroy(): void {
    console.log('On destroy close socket:', this.webSocketAPI);
    const currentUser = JSON.parse(this.authService.getCurrentUser()) as User;
    this.webSocketAPI.checkClearMessage(currentUser);
    this.disconnect();
  }

  ngOnInit(): void {
    this.webSocketAPI = new WebSocketAPI(
      new ChatComponent(
        this.breakpointObserver,
        this.authService,
        this.router,
        this.dataService));
    this.connect();
  }

  isChatView(card: any): boolean {
    if (card.title === 'Chat Content') {
      return true;
    }
    return false;
  }

  isOnlineUsers(card: any): boolean {
    if (card.title === 'Online Users') {
      return true;
    }
    return false;
  }

  ngAfterViewInit(): void {

  }

  // On closing window
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(): void {
    console.log('Unload handler disconnect!');
    this.disconnect();
  }

  private connect(): void {
    const currentUser = JSON.parse(this.authService.getCurrentUser()) as User;
    const uniqueRoomId = UUID();
    const payload = {
      username: currentUser.username,
      uniqueRoomId
    };
    this.webSocketAPI.connect(payload);
  }

  private disconnect(): void {
    this.webSocketAPI.disconnect();
  }

  sendMessage(event): void {
    event.preventDefault();
    // Append mine tile
    const message = this.message.nativeElement.value;
    if (message) {
      const currentUser = JSON.parse(this.authService.getCurrentUser()) as User;

      // My message
      const mine: Tile[] = [
        { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
        { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
        { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
        { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
      ];
      mine[0].text = message;
      // Emit appending mine tile to child
      this.dataService.onGetCommand.emit({
        message: {
          msgCommand: 'APPEND_CHAT',
        },
        data: mine,
      });

      this.webSocketAPI.sendMessage({
        sender: currentUser.username, content: message, messageType: 'CHAT'
      });
      this.message.nativeElement.value = '';
    }
  }

  handleMessage(message): void {
    const command = JSON.parse(message);
    const currentUser = JSON.parse(this.authService.getCurrentUser()) as User;
    const onlineUsers = command.trackingVariables.online_users;
    console.log('Command:', command);
    console.log('Online users:', onlineUsers);
    if (onlineUsers) {
      const currentParticipants = onlineUsers.map((item, index) => ({
        position: index,
        name: item,
      }));
      this.dataService.onGetCommand.emit({
        message: {
          msgCommand: 'UPDATE_PARTICIPANTS',
        },
        data: currentParticipants,
      });
    }
    // People message
    const people: Tile[] = [
      { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
      { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
      { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
      { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
    ];
    people[1].text = command.content;
    if (command.messageType === 'JOIN' || command.messageType === 'LEAVE') {
      // Emit appending people tile to child
      this.dataService.onGetCommand.emit({
        message: {
          msgCommand: 'APPEND_CHAT',
        },
        data: people,
      });
    }
    else if (command.sender !== currentUser.username && command.messageType === 'CHAT') {
      // Emit appending people tile to child
      this.dataService.onGetCommand.emit({
        message: {
          msgCommand: 'APPEND_CHAT',
        },
        data: people,
      });
    }
    else if (command.messageType === 'REQUEST_DATA' && command.sender === currentUser.username) {
      const publicSessionId = command.publicSessionId;
      const reloadDialogs = command.trackingMessages[publicSessionId].map((item) => {
        if (item.sender === currentUser.username) {
          const mineReload: Tile[] = [
            { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
            { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
            { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
            { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
          ];
          mineReload[0].text = item.content;
          return mineReload;
        }
        const peopleReload: Tile[] = [
          { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
          { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
          { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
          { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
        ];
        peopleReload[1].text = item.content;
        return peopleReload;
      });

      if (reloadDialogs.length !== 0) {
        this.dataService.onGetCommand.emit({
          message: {
            msgCommand: 'APPEND_LIST_CHAT',
          },
          data: reloadDialogs,
        });
      }
    }
  }
}
